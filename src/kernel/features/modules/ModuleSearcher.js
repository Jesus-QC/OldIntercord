// Here we have a set of functions that allow us to search for modules
// Will return null if the module is not initialized yet, so be careful
// We recommend using the ModuleLazyLoader to ensure that the module is loaded and use callbacks instead
// Only use this if you are sure that the module will be loaded by the time you access it

import ModuleLoader from "./ModuleLoader";

// Utility class to search for modules
export default class ModuleSearcher{
    // Single module searchers

    // Finds the first module that has the specified display name
    // Usually used for React components
    static findByDisplayName(displayName, useDefault = false) {
        return ModuleSearcher.getModuleWhere(ModuleSearcher.filterByDisplayName(displayName, useDefault));
    }

    static findAllByDisplayName(displayName, useDefault = false) {
        return ModuleSearcher.getAllModulesWhere(ModuleSearcher.filterByDisplayName(displayName, useDefault));
    }

    static findIdByDisplayName(displayName) {
        return ModuleSearcher.getModuleIdWhere(ModuleSearcher.filterByDisplayName(displayName));
    }

    // Finds the first module that has the specified name
    static findByName(name, useDefault = false) {
        return ModuleSearcher.getModuleWhere(ModuleSearcher.filterByName(name, useDefault));
    }
    static findAllByName(name, useDefault = false) {
        return ModuleSearcher.getAllModulesWhere(ModuleSearcher.filterByName(name, useDefault));
    }
    static findIdByName(name) {
        return ModuleSearcher.getModuleIdWhere(ModuleSearcher.filterByName(name));
    }

    // Finds the first module that has the specified type
    static findByType(type, useDefault = false) {
        return ModuleSearcher.getModuleWhere(ModuleSearcher.filterByType(type, useDefault));
    }
    static findAllByType(type, useDefault = false) {
        return ModuleSearcher.getAllModulesWhere(ModuleSearcher.filterByType(type, useDefault));
    }
    static findIdByType(type) {
        return ModuleSearcher.getModuleIdWhere(ModuleSearcher.filterByType(type));
    }

    // Finds the first module that has the specified properties
    // Just checks if the properties with the specified names are defined
    static findByProps(...props) {
        return ModuleSearcher.getModuleWhere(ModuleSearcher.filterByProps(...props));
    }
    static findAllByProps(...props) {
        return ModuleSearcher.getAllModulesWhere(ModuleSearcher.filterByProps(...props));
    }
    static findIdByProps(...props) {
        return ModuleSearcher.getModuleIdWhere(ModuleSearcher.filterByProps(...props));
    }

    static findByPropsAdvanced(...props){
        return ModuleSearcher.getModuleWhere(ModuleSearcher.filterByPropsAdvanced(...props));
    }

    // Finds the first module that has the specified store name
    // For more info about flux stores, check out the following links:
    // https://facebookarchive.github.io/flux/docs/flux-utils#store
    static findByStore(storeName) {
        return ModuleSearcher.getModuleWhere(ModuleSearcher.filterByStore(storeName));
    }
    static findAllByStore(storeName) {
        return ModuleSearcher.getAllModulesWhere(ModuleSearcher.filterByStore(storeName));
    }
    static findIdByStore(storeName) {
        return ModuleSearcher.getModuleIdWhere(ModuleSearcher.filterByStore(storeName));
    }

    // Finds the first module that has the specified path
    // This is so so so cool, like bro, you can find a module by its path, how cool is that
    static findByPath(path){
        return ModulePathManager.getModuleByPath(path) ?? null;
    }
    static findIdByPath(path){
        return ModulePathManager.getModuleIdByPath(path);
    }

    // Searchers
    // We grab the first module from the native modules that passes the filter
    static getModuleWhere(filter){
        for (const rawModule in window.__nativeModules) {
            const module = ModuleLoader.getModuleById(Number(rawModule));

            if (!module) {
                ModuleLoader.forbidIterations(rawModule);
                continue;
            }

            if (ModuleSearcher.isDefaultExportCompatible(module)){
                // So we treat it as a normal module
                if (filter(module.default)){
                    return module.default;
                }
            }

            // We check if the module passes the filter
            if (filter(module)){
                return module;
            }
        }

        return null;
    }

    // Basically the same but we return all the modules that pass the filter
    static getAllModulesWhere(filter){
        const result = [];

        function checkModule(module){
            if (ModuleSearcher.isDefaultExportCompatible(module)){
                // So we treat it as a normal module
                if (filter(module.default)){
                    result.push(module.default);
                }
            }

            // We check if the module passes the filter
            if (filter(module)){
                result.push(module)
            }
        }

        for (const rawModule in window.__nativeModules) {
            const module = ModuleLoader.getModuleById(Number(rawModule));

            if (!module) {
                ModuleLoader.forbidIterations(rawModule);
                continue;
            }

            checkModule(module);
        }

        return result;
    }

    // Gets the module by its id
    static getModuleIdWhere(filter){
        for (const rawModule in window.__nativeModules) {
            const moduleId = Number(rawModule);
            const module = ModuleLoader.getModuleById(moduleId);

            if (!module) {
                ModuleLoader.forbidIterations(rawModule);
                continue;
            }

            if (filter(module)){
                return moduleId;
            }
        }

        return null;
    }

    // We check if the module has a default export and is an ES module
    // If it is, we can use it directly, more info here:
    // https://stackoverflow.com/questions/50943704/whats-the-purpose-of-object-definepropertyexports-esmodule-value-0
    // Allowing developers to use directly the style of ES modules
    static isDefaultExportCompatible(module){
        return module.default && module.__esModule;
    }

    // Filters
    static filterByDisplayName(displayName, useDefault = false){
        if (useDefault) return module => module?.default?.displayName === displayName;
        // We check if the module display name is the same as the name we are looking for
        return module => module?.displayName === displayName;
    }

    static filterByName(name, useDefault = false){
        if (useDefault) return module => module?.default?.name === name;
        // We check if the module name is the same as the name we are looking for
        return module => module?.name === name;
    }

    static filterByType(type, useDefault = false){
        if (useDefault) return module => module?.default?.type?.name === type;
        // We check if the module type name is the same as the name we are looking for
        return module => module?.type?.name === type;
    }

    static filterByProps(...props){
        /// We check if all the props are defined in the module
        return module => props.every(prop => module[prop]);
    }

    static filterByPropsAdvanced(...props){
        /// We check if all the props are defined in the module
        return module => props.every(prop =>
            {
                const separatedProps = prop.split(".");
                let temp = module;

                for (let i = 0; i < separatedProps.length; i++){
                    temp = temp[separatedProps[i]];
                    if (temp === undefined || temp === null) return false;
                }

                return true;
            }
        );
    }

    static filterByStore(name){
        // We check if the store name is the same as the name we are looking for
        return module => module?.getName !== undefined && typeof module?.getName === "function" && module?.getName() === name;
    }
}

window.ModuleSearcher = ModuleSearcher;