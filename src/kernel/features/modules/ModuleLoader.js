// A useful handler for metro modules
// Saved into window.__nativeModules by the bootstrap
// For more info about modules, check out the following links:
// https://github.com/facebook/metro/blob/main/packages/metro-runtime/src/polyfills/require.js

// Here you can find a quick sneak peek to the module declarations for anyone that may find them useful
//
// The raw metro modules:
// type ModuleDefinition = {
//   dependencyMap: ?DependencyMap,
//   error?: any,
//   factory: FactoryFn,
//   hasError: boolean,
//   hot?: HotModuleReloadingData,
//   importedAll: any,
//   importedDefault: any,
//   isInitialized: boolean,
//   path?: string,
//   publicModule: Module,
//   verboseName?: string,
// };
//
// The public module:
// type Module = {
//   id?: ModuleID,
//   exports: Exports,
//   hot?: HotModuleReloadingData,
//   ...
// };

import {onModuleLoaded} from "./LazyModuleLoader";
import CommonModules from "./CommonModules";
import InterPatcher from "../patcher/InterPatcher";

// A useful handler for metro modules
// Loads the modules and initializes them
export default class ModuleLoader{
    static initialize(){
        ModuleLoader.forbidIterations(window);

        for (const rawModule in window.__nativeModules) {
            const publicModule = ModuleLoader.getModuleById(Number(rawModule));

            // We check if the publicModule exists
            if (publicModule && publicModule["proxygone"] !== null) {
                addFactoryPostfix(rawModule);
                continue
            }

            // And if it doesn't we blacklist it from the search by making it non-enumerable
            ModuleLoader.forbidIterations(rawModule);
        }

        CommonModules.initialize()
    }

    // We make the module non-enumerable so that it doesn't show up in iterations
    static forbidIterations(rawModule){
        let id = Number(rawModule);
        // We set the module to non-enumerable so that it doesn't show up in the search
        Reflect.defineProperty(window.__nativeModules, id, {
            // We save the original values
            value: Reflect.get(window.__nativeModules, id),
            configurable: true,
            writable: true,

            // This is the important part
            enumerable: false
        });
    }

    // Gets the native module by its id
    static getNativeModuleById(id){
        return window.__nativeModules[id];
    }

    // Gets the module given a native module
    static getModuleByNativeModule(module) {
        return module?.publicModule?.exports;
    }

    // Gets the module by its id
    static getModuleById(id){
        return ModuleLoader.getModuleByNativeModule(ModuleLoader.getNativeModuleById(id));
    }

    // Loads a module given its id
    static loadModule(id){
        // window.__r is defined by metro as its require function
        // we can use ids to load modules directly
        return window.__r(id);
    }
}

// We patch the factory function of native modules to know when they are loaded
// And apply lazy loading to them easily
function addFactoryPostfix(id){
    const nativeModule = ModuleLoader.getNativeModuleById(id);

    if (!nativeModule || nativeModule?.isInitialized === true || !nativeModule.factory)
        return;

    InterPatcher.addPostfix(nativeModule, "factory", (_data) => {
        onModuleLoaded(id);
    });
}

window.ModuleLoader = ModuleLoader;