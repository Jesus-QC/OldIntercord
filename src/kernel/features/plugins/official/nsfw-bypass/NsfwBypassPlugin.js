import LazyModuleLoader from "../../../modules/LazyModuleLoader";

export default class NsfwBypassPlugin{
    constructor() {
        this.prefix = "nsfw-bypass";
        this.name = "NSFW Bypass";
        this.description = "Bypasses NSFW restrictions on Discord."
        this.author = "@jesusqc"
        this.version = '1.0.0.0';
        this.repo = "https://github.com/Jesus-QC/Intercord"; // TODO
        this.requiresRestart = false;
    }

    load(){
        LazyModuleLoader.waitForStores((userStore) => {
            const user = userStore.getCurrentUser();
            this.previousVal = user.nsfwAllowed;
            user.nsfwAllowed = true;
        }, "UserStore")
    }

    unload(){
        LazyModuleLoader.waitForStores((userStore) => {
            userStore.getCurrentUser().nsfwAllowed = this.previousVal;
        }, "UserStore")
    }
}