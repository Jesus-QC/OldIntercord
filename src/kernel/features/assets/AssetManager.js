import LazyModuleLoader from "../modules/LazyModuleLoader";
import InterPatcher from "../patcher/InterPatcher";

export default class AssetManager{
    static initialize(){
        window.AssetManager = AssetManager;
        LazyModuleLoader.waitForModuleByProps((assetsModule) => {
            AssetManager.assetManager = assetsModule;
            InterPatcher.addPostfix(assetsModule, "registerAsset",
                (data) => AssetManager.assetsByName.set(data.args[0].name, data.returnValue)
            );
        }, "getAssetByID", "registerAsset");
    }

    static getAssetIdByName(name) {
        return AssetManager.assetsByName.get(name);
    }

    static getAssetById(id){
        return AssetManager.assetManager.getAssetByID(id);
    }

    static getAllAssetNames() {
        return AssetManager.assetsByName.keys();
    }

    static getAssetCount(){
        return AssetManager.assetsByName.size;
    }
}

AssetManager.assetsByName = new Map();
AssetManager.assetManager = undefined;