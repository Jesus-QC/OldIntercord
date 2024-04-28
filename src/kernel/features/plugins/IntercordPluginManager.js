import SettingsManager from "../files/SettingsManager";
import ExperimentsPlugin from "./official/experiments/ExperimentsPlugin";
import NsfwBypassPlugin from "./official/nsfw-bypass/NsfwBypassPlugin";
import MessageLoggerPlugin from "./official/message-logger/MessageLoggerPlugin";
import UserTagsPlugin from "./official/user-tags/UserTagsPlugin";
import MessageLoggerPluginR from "./official/message-logger/MessageLoggerPluginR";

export default class IntercordPluginManager{
    static initialize(){
        IntercordPluginManager.loadPlugins();
    }

    static getPlugins(){
        return Array.from(IntercordPluginManager.officialPluginList);
    }

    static loadPlugins(){
        for (const plugin of IntercordPluginManager.officialPluginList){
            if (!plugin.prefix) continue;
            internalLoad(plugin)
        }

        // Small hack to make sure the plugin reference is correct
        function internalLoad(plugin){
            SettingsManager.get(plugin.prefix, "enabled",(value) => {
                if (value) IntercordPluginManager.loadNativePlugin(plugin);
            });
        }
    }

    static loadNativePlugin(plugin){
        try {
            plugin.load();
            IntercordPluginManager.enabledPlugins.set(plugin.prefix, plugin);
        } catch (error){
            console.error("Intercord", `Failed to load plugin ${plugin.prefix}: ${error}`);
        }
    }

    static loadPlugin(prefix){
        for (const plugin of IntercordPluginManager.officialPluginList){
            if (plugin.prefix !== prefix) continue;
            IntercordPluginManager.loadNativePlugin(plugin);
            return;
        }
    }

    static unloadPlugin(prefix){
        const plugin = IntercordPluginManager.enabledPlugins.get(prefix);
        if (!plugin) return;

        try {
            if (plugin.unload) plugin.unload();
            IntercordPluginManager.enabledPlugins.delete(prefix);
        } catch (error){
            console.error("Intercord", `Failed to unload plugin ${prefix}: ${error}`);
        }
    }
}

IntercordPluginManager.officialPluginList = new Set([
    new ExperimentsPlugin(),
    new MessageLoggerPlugin(),
    new NsfwBypassPlugin(),
    new UserTagsPlugin(),
]);

IntercordPluginManager.enabledPlugins = new Map();
