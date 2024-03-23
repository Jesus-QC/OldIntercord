import LazyModuleLoader from "./features/modules/LazyModuleLoader";
import IntercordLoader from "./features/loader/IntercordLoader";

IntercordLoader.initialize();

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