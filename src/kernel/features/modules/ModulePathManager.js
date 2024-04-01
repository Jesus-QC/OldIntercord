// Very very very cool class I made at 3 am
// Haven't seen any other frameworks with this, enjoy ;)
import {onPathLoaded} from "./LazyModuleLoader";

export class ModulePathManager{
    static initialize(){
        ModulePathManager.modulePaths = new Map();
        LazyModuleLoader.waitForModuleByProps((importManager) => {
            InterPatcher.addPrefix(importManager, "fileFinishedImporting", (data) => {
                ModulePathManager.lastPath = data.args[0];
            });
        }, "fileFinishedImporting")
    }

    static onModuleLoaded(id){
        if (!ModulePathManager.lastPath) return;
        ModulePathManager.modulePaths.set(ModulePathManager.lastPath, id);
        onPathLoaded(ModulePathManager.lastPath, id);
        ModulePathManager.lastPath = undefined;

    }

    static getModuleIdByPath(path){
        return ModulePathManager.modulePaths.get(path);
    }

    static getModuleByPath(path){
        const id = ModulePathManager.getModuleIdByPath(path);
        if (!id) return undefined;
        return ModuleLoader.getModuleById(Number(id));
    }

    static getModulePathById(id){
        for (const [path, value] of ModulePathManager.modulePaths) {
            if (value === id) return path;
        }

        return undefined;
    }
}

window.ModulePathManager = ModulePathManager;