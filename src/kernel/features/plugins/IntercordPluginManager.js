import SettingsManager from "../files/SettingsManager";
import ExperimentsPlugin from "./official/experiments/ExperimentsPlugin";

export default class IntercordPluginManager{
    static initialize(){
        IntercordPluginManager.loadPlugins();
    }

    static loadPlugins(){
        for (const plugin of IntercordPluginManager.officialPluginList){
            if (!plugin.prefix) continue;

            SettingsManager.get(plugin.prefix, "enabled",(value) => {
                if (value === undefined) return;
                if (value) plugin.load();
            });
        }
    }

    static getPlugins(){
        return Array.from(IntercordPluginManager.officialPluginList);
    }
}

IntercordPluginManager.officialPluginList = new Set([
    new ExperimentsPlugin(),
]);