import LazyModuleLoader from "../../../modules/LazyModuleLoader";

export default class ExperimentsPlugin{
    constructor(){
        this.prefix = "experiments";
        this.name = "Experiments";
        this.description = "Enables discord staff tools. Including experiments and other utilities."
        this.author = "@jesusqc"
        this.repo = ""; // TODO
    }

    load(){
        LazyModuleLoader.waitForStores((experimentStore, userStore) => {
            const user = userStore.getCurrentUser();
            const serializedExperimentStore = experimentStore.getSerializedState();
            const event = {serializedExperimentStore, user}
            const nodes = FluxDispatcher._actionHandlers._dependencyGraph.nodes;

            // We add a bit to the user flags to enable developer mode
            // In case the user is already a developer, it won't affect the user flags
            user.flags |= 1;

            // We simulate the OVERLAY_INITIALIZE event to enable experiments
            for (const id in nodes) {
                const node = nodes[id];
                if (node.name.includes("ExperimentStore")) {
                    node.actionHandler["OVERLAY_INITIALIZE"](event);
                }
            }

            this.requiresRestart = true;
        }, "ExperimentStore", "UserStore")
    }
}