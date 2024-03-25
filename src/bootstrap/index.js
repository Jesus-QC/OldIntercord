// Modules are created using Object.create(null) to isolate them. More info:
// https://github.com/facebook/metro/blob/14911b7892fb8be83313130e1174afd0e26f3b7e/packages/metro-runtime/src/polyfills/require.js#L106
// We can take advantage of this and intercept the next Object.create(null) call
// Once then we have access to the modules directly

// We save the context for easy acccess
const window = this;

// We save the default implementation
const createObjectDefault = window.Object.create;

// And we override it with our own hook
window.Object.create = objectCreateOverride;

function objectCreateOverride(...params){
    // We apply the default implementation
    let defaultObjectCreate = createObjectDefault.apply(window.Object, params);

    // And now we can check if the object is null and hook our modules to it
    if (params[0] !== null){
        return defaultObjectCreate;
    }

    // We can save the native modules so that the framework can use them later
    window.__nativeModules = defaultObjectCreate;

    // We finally restore the default implementation
    window.Object.create = createObjectDefault;

    // We can now call some functions such as enabling react dev tools
    if (window.enableDevTools) window.enableDevTools();

    // And we just return the native modules as if nothing happened ;)
    return defaultObjectCreate;
}