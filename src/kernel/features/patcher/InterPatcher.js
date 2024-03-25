// The functions that have been patched
// Map<Object, Map<FunctionName, InterFunctionPatch>>
import InterPatchedFunction from "./InterPatchedFunction";

const patchedObjects = new Map();

// An easy-to-use patcher for functions
// Made with love by jesusqc
export default class InterPatcher {
    // Adds a prefix to a function
    static addPrefix(targetObject, targetName, prefix){
        if (!isFunctionOfObject(targetObject, targetName)) return;
        let patches = InterPatcher.getPatchesOfFunction(targetObject, targetName);
        return patches.createPrefix(prefix);
    }

    // Adds a postfix to a function
    static addPostfix(targetObject, targetName, postfix){
        if (!isFunctionOfObject(targetObject, targetName)) return;
        let patches = InterPatcher.getPatchesOfFunction(targetObject, targetName);
        return patches.createPostfix(postfix);
    }

    // Whether a function has been patched or not
    static isPatched(targetObj, targetName){
        return patchedObjects.has(targetObj) && patchedObjects.get(targetObj).has(targetName);
    }

    // Overrides the default implementation with a custom hook
    // The hook will check for registered prefixes and postfixes
    static patchFunction(targetObj, targetName, defaultImplementation){
        let functionPatch = new InterPatchedFunction(defaultImplementation);
        patchedObjects.set(targetObj, new Map());
        patchedObjects.get(targetObj).set(targetName, functionPatch);

        let proxy = new Proxy(defaultImplementation, {
            apply: (_target, property, args) => functionPatch.applyPatched(property, args),
            construct: (_target, args) => functionPatch.applyPatched(defaultImplementation, args, true)
        });

        // We try to safely define the property
        if (!Reflect.defineProperty(targetObj, targetName, {value: proxy, configurable: true, writable: true})){
            // If it fails, we just assign it
            targetObj[targetName] = proxy;
        }

        return functionPatch;
    }

    // Gets the patches for a function
    // In the case that the function has not been patched, it will be patched here
    static getPatchesOfFunction(targetObj, targetName){
        const defaultImplementation = targetObj[targetName];

        if (InterPatcher.isPatched(targetObj, targetName)){
            return patchedObjects.get(targetObj).get(targetName);
        }

        return InterPatcher.patchFunction(targetObj, targetName, defaultImplementation);
    }

    // Unpatches all patches from a given function
    static unpatchFunction(targetObj, targetName){
        if (!InterPatcher.isPatched(targetObj, targetName))
            return;

        // Yeah, we never unpatch, we just clear the patches ;)
        // We could unpatch, but it's not really necessary as far as I know
        // And also allows us to avoid patching again if we need to
        let patches = patchedObjects.get(targetObj).get(targetName);
        patches.prefixes.clear();
        patches.postfixes.clear();
    }

    // Unpatches a prefix patch from a given function
    static unpatchPrefix(targetObj, targetName, interPatch){
        if (!InterPatcher.isPatched(targetObj, targetName)) return;
        let patches = patchedObjects.get(targetObj).get(targetName);
        patches.prefixes.delete(interPatch);
    }

    // Unpatches a postfix patch from a given function
    static unpatchPostfix(targetObj, targetName, interPatch){
        if (!InterPatcher.isPatched(targetObj, targetName)) return;
        let patches = patchedObjects.get(targetObj).get(targetName);
        patches.postfixes.delete(interPatch);
    }
}

// Whether a function exists on an object or not
function isFunctionOfObject(obj, name) {
    return typeof obj[name] === 'function';
}

window.InterPatcher = InterPatcher;