import LazyModuleLoader, {onFluxConnected} from "./LazyModuleLoader";
import ModuleSearcher from "./ModuleSearcher";
import InterPatcher from "../patcher/InterPatcher";

export default class CommonModules{
    static initialize() {
        LazyModuleLoader.waitForModuleByProps((flux) => {
            window.Flux = flux;
            addFluxPostfix(flux);
        }, "Flux", "Dispatcher");

        LazyModuleLoader.waitForModuleByProps((react) => {
            window.React = react;
        }, "Component");

        LazyModuleLoader.waitForModuleByProps((reactNative) => {
            window.ReactNative = reactNative;
        }, "Text","TextInput");
    }
}

function addFluxPostfix(flux){
    InterPatcher.addPostfix(flux.default, "initialize", (_data) => {
        window.FluxDispatcher = ModuleSearcher.findByProps("_subscriptions");
        // We subscribe to the CONNECTION_OPEN event to know when the all the stores are loaded
        window.FluxDispatcher.subscribe("CONNECTION_OPEN", onFluxConnected);
    });
}
