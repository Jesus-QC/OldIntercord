import InterPatch from "./InterPatch";
import PrefixData from "./PrefixData";
import PostfixData from "./PostfixData";

// Represents a patched function
// Contains the original function and the applied prefixes and postfixes
export default class InterPatchedFunction{
    constructor(original) {
        this.prefixes = new Set();
        this.postfixes = new Set();
        this.original = original;
    }

    // Adds a prefix to the function
    // Returns the patch so that it can be removed if necessary
    createPrefix(prefix){
        let patch = new InterPatch(prefix);
        this.prefixes.add(patch);
        return patch;
    }

    // Adds a postfix to the function
    // Returns the patch so that it can be removed if necessary
    createPostfix(postfix){
        let patch = new InterPatch(postfix);
        this.postfixes.add(patch);
        return patch;
    }

    runPrefixes(ctx, args){
        const data = new PrefixData(ctx, args, this.original);
        this.prefixes.forEach(prefix => prefix.method.apply(ctx, [data]));
        return data;
    }

    runPostfixes(ctx, args, value){
        const data = new PostfixData(ctx, args, this.original, value);
        this.postfixes.forEach(postfix => postfix.method.apply(ctx, [data]));
        return data;
    }

    runOriginal(ctx, args){
        return this.original.apply(ctx, args);
    }

    runOriginalConstructor(ctx, args){
        // As there is a constructor, we need to use Reflect.construct
        return Reflect.construct(ctx, args);
    }

    applyPatched(ctx, args, isConstructor = false){
        // We first run the prefixes
        const prefixData = this.runPrefixes(ctx, args);
        args = prefixData.args;

        // If any of the prefixes overrides the original method, we return the override value
        if (!prefixData.runOriginal){
            return prefixData.returnValue;
        }

        // Otherwise, we run the original method
        const originalValue = isConstructor ? this.runOriginalConstructor(ctx, args) : this.runOriginal(ctx, args);

        // After running the original method, we finally run the postfixes
        const postfixData = this.runPostfixes(ctx, args, originalValue);

        // And return the value of the postfixes if any of them overrides the original method or the original value if not
        return postfixData.returnValue;
    }
}