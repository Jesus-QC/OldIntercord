import ModuleSearcher from "./ModuleSearcher";
import ModuleLoader from "./ModuleLoader";
import {ModulePathManager} from "./ModulePathManager";

const waitingCallbacks = new Set();
const waitingStoreCallbacks = new Set();
const waitingPathCallbacks = new Set();
let fluxConnected = false;

// To handle modules, we just wait for the module to load
export function onModuleLoaded(id){
    waitingCallbacks.forEach(callback => callback.onModuleLoaded(id));
}

// To handle stores, we just wait for flux to connect
export function onFluxConnected(){
    FluxDispatcher.unsubscribe("CONNECTION_OPEN", onFluxConnected);
    fluxConnected = true;
    waitingStoreCallbacks.forEach(callback => {
        callback.callback(...callback.stores.map(store => ModuleSearcher.findByStore(store)));
    });
    waitingStoreCallbacks.clear();
}

export function onPathLoaded(path, id){
    waitingPathCallbacks.forEach(callback => {
        if (callback.path === path){
            const module = ModuleLoader.getModuleById(id);
            if (module === undefined) return;
            callback.callback(module);
            waitingPathCallbacks.delete(callback);
        }
    });
}

// Handles utilities to wait for modules
export default class LazyModuleLoader {
    // Waits for a module to be loaded by its name
    static waitForModuleByName(callback, name){
        let module = ModuleSearcher.findByName(name);
        if (module) return callback(module);
        waitingCallbacks.add(new ModuleWaitingCallback(callback, name));
    }

    // Waits for a module to be loaded by its display name
    static waitForModuleByDisplayName(callback, displayName){
        let module = ModuleSearcher.findByDisplayName(displayName);
        if (module) return callback(module);
        waitingCallbacks.add(new ModuleWaitingCallback(callback, undefined, displayName));
    }

    // Waits for a module to be loaded by its type
    static waitForModuleByType(callback, type){
        let module = ModuleSearcher.findByType(type);
        if (module) return callback(module);
        waitingCallbacks.add(new ModuleWaitingCallback(callback, undefined, undefined, type));
    }

    // Waits for a module to be loaded by its properties
    static waitForModuleByProps(callback, ...props){
        let module = ModuleSearcher.findByProps(...props);
        if (module) return callback(module);
        waitingCallbacks.add(new ModuleWaitingCallback(callback, undefined, undefined, undefined, false, ...props));
    }

    static waitForModuleByPropsAdvanced(callback, ...props){
        let module = ModuleSearcher.findByPropsAdvanced(...props);
        if (module) return callback(module);
        waitingCallbacks.add(new ModuleWaitingCallback(callback, undefined, undefined, undefined, true, ...props));
    }

    // Waits for stores to be loaded, can load multiple stores
    static waitForStores(callback, ...stores){
        if (fluxConnected){
            return callback(...stores.map(store => ModuleSearcher.findByStore(store)));
        }

        waitingStoreCallbacks.add(new StoreWaitingCallback(callback, ...stores));
    }

    // Waits for a module to be loaded by its path
    static waitForModuleByPath(callback, path){
        let module = ModulePathManager.getModuleByPath(path);
        if (module) return callback(module);
        waitingPathCallbacks.add(new PathWaitingCallback(callback, path));
    }
}


class ModuleWaitingCallback{
    constructor(callback, name, displayName, type, advancedProps, ...props){
        this.name = name;
        this.displayName = displayName;
        this.type = type;
        this.advanced = advancedProps;
        this.props = props;
        this.callback = callback;
    }

    onModuleLoaded(id) {
        const module = ModuleLoader.getModuleById(id);

        if (module === undefined) return;

        if (this.props.length !== 0 && (this.advanced ? !ModuleSearcher.filterByPropsAdvanced(...this.props)(module) : !ModuleSearcher.filterByProps(...this.props)(module))) return;
        if (this.name !== undefined && !ModuleSearcher.filterByName(this.name)(module)) return;
        if (this.displayName !== undefined && !ModuleSearcher.filterByDisplayName(this.displayName)(module)) return;
        if (this.type !== undefined && !ModuleSearcher.filterByType(this.type)(module)) return;

        this.callback(module);
        waitingCallbacks.delete(this);
    }
}

class StoreWaitingCallback {
    constructor(callback, ...stores){
        this.stores = stores;
        this.callback = callback;
    }
}

class PathWaitingCallback {
    constructor(callback, path){
        this.path = path;
        this.callback = callback;
    }
}

window.LazyModuleLoader = LazyModuleLoader;