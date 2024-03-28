import LazyModuleLoader from "../../modules/LazyModuleLoader";

// This class is used to get common components from the Discord component library
// This is useful for creating custom components that look like Discord's
export default class CommonComponents {
    static initialize() {
        LazyModuleLoader.waitForModuleByProps((newComponentLib) => {
            CommonComponents.newComponentLib = newComponentLib;
        }, "TableRow", "Card");

        LazyModuleLoader.waitForModuleByProps((oldLib) => {
            CommonComponents.oldComponentLib = oldLib;
        }, "Text", "TextStyleSheet")

        LazyModuleLoader.waitForModuleByProps((settingsList) => {
            CommonComponents.SettingsList = settingsList.SettingsList;
            CommonComponents.SearchableSettingsList = settingsList.SearchableSettingsList;
        }, "SettingsList");
    }

    // Gets a component by its name
    static getComponentByName(name) {
        // Some components are not in the library, so we have to check if we have cached them
        if (CommonComponents[name]) return CommonComponents[name];
        // Then we try to search in the new component library
        if (CommonComponents.newComponentLib?.[name]) return CommonComponents.newComponentLib[name];
        // And if we don't find it, we search in the old component library
        if (CommonComponents.oldComponentLib?.[name]) return CommonComponents.oldComponentLib[name]?.render ? CommonComponents.oldComponentLib[name].render : CommonComponents.oldComponentLib[name];
        // If we don't find it, we try to return the component from ReactNative
        return ReactNative[name];
    }
}

window.CommonComponents = CommonComponents;