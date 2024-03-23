import LazyModuleLoader from "../modules/LazyModuleLoader";
import ModuleSearcher from "../modules/ModuleSearcher";
import InterPatcher from "../patcher/InterPatcher";
import LoadIntercordSettingsMenu from "./internal/IntercordSettingsManager";

// All the available setting rows
const settingRows = {};
// The array of settings lists that will appear in the main settings panel
const settingList = [];

// The setting list renderer
let settingListRenderer = undefined;

export default class SettingsMenuManager {
    static addSettingRow(setting, rowBuilder){
        settingRows[setting] = rowBuilder;
        // If the renderer is already loaded, we refresh it
        if (settingListRenderer) SettingsMenuManager.refreshRenderer();
    }

    static addSettingPanel(settingListBuilder){
        settingList.push(settingListBuilder.build());
    }

    static removeSettingRow(setting){
        delete settingRows[setting];
        // If the renderer is already loaded, we refresh it
        if (settingListRenderer) SettingsMenuManager.refreshRenderer();
    }

    static initialize(){
        LazyModuleLoader.waitForModuleByProps((settingsList) =>{
            settingListRenderer = ModuleSearcher.findByProps("SETTING_RENDERER_CONFIG");

            LoadIntercordSettingsMenu();
            SettingsMenuManager.refreshRenderer()

            InterPatcher.addPostfix(settingsList, "getSettingListItems", (data) => {
                // We only want to modify the main settings list
                // This is sadly the cleanest solution I could come up with
                // If you have a better idea, please let me know
                if (data.args[0][0].settings[0] !== "ACCOUNT")
                    return;

                data.returnValue = [
                    ...data.returnValue,
                    ...SettingsMenuManager.getFormattedSettingsList(),
                ];
            });
        }, "getInitialScrollIndex", "getSettingListItems");
    }

    static refreshRenderer(){
        const builtSettings = {};

        // We rebuild the settings
        for (const setting in settingRows){
            builtSettings[setting] = settingRows[setting].build();
        }

        settingListRenderer.SETTING_RENDERER_CONFIG = {
            ...settingListRenderer.SETTING_RENDERER_CONFIG,
            ...builtSettings,
        }
    }

    static getFormattedSettingsList(){
        let formattedSettingsList = [];

        // We iterate over the settings list and format them
        for (const section of settingList){

            // First we push the section label
            formattedSettingsList.push({
                "type": "section_label",
                "label": section.label,
                "settings": section.panels,
            });

            // Then we can push each panel / setting
            for (let i = 0; i < section.panels.length; i++) {
                const panel = section.panels[i];
                const renderingConfig = settingListRenderer.SETTING_RENDERER_CONFIG[panel];

                formattedSettingsList.push({
                    "type": "setting",
                    "setting": panel,
                    "settingData": renderingConfig,
                    "start": i === 0,
                    "end": i === section.panels.length - 1,
                });
            }
        }

        return formattedSettingsList;
    }
}