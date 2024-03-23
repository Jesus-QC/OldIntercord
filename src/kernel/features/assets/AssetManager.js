import LazyModuleLoader from "../modules/LazyModuleLoader";
import InterPatcher from "../patcher/InterPatcher";

const assetsByName = new Map();
let assetManager = undefined;

export default class AssetManager{
    static initialize(){
        LazyModuleLoader.waitForModuleByProps((assetsModule) => {
            assetManager = assetsModule;
            InterPatcher.addPostfix(assetsModule, "registerAsset", (data) => {
                assetsByName.set(data.args[0].name, data.returnValue);
            });
        }, "getAssetByID", "registerAsset");
    }

    static getAssetIdByName(name) {
        return assetsByName.get(name);
    }

    static getAssetById(id){
        return assetManager.getAssetByID(id);
    }

    static getAllAssetNames(){
        return assetsByName.keys();
    }
}