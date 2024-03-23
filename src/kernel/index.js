import ModuleLoader from "./features/modules/ModuleLoader";
import CommonModules from "./features/modules/CommonModules";
import AssetManager from "./features/assets/AssetManager";
import SettingsMenuManager from "./features/settings/SettingsMenuManager";
import CommonComponents from "./features/react/components/CommonComponents";
import LazyModuleLoader from "./features/modules/LazyModuleLoader";

ModuleLoader.initialize();
CommonModules.initialize();
CommonComponents.initialize();
AssetManager.initialize();
SettingsMenuManager.initialize();

LazyModuleLoader.waitForStores((userStore, experimentStore) => {
    enableExperiments(userStore.getCurrentUser(), experimentStore.getSerializedState(), window.FluxDispatcher);
}, "UserStore", "ExperimentStore");

function enableExperiments(user, serializedState, dispatcher) {
    try {
        // We add a flag to the user object to indicate that the user is staff
        user.flags += 1;

        // Then we simulate the OVERLAY_INITIALIZE event to enable experiments
        dispatcher._actionHandlers._computeOrderedActionHandlers("OVERLAY_INITIALIZE")
            .filter(e => e.name.includes("Experiment"))
            .forEach(({actionHandler}) => actionHandler({serializedExperimentStore: serializedState, user,}));
    } catch (e) {
        console.log("There was an issue while enabling experiments:", e);
    }
}