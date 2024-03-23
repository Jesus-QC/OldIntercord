import LazyModuleLoader from "../../modules/LazyModuleLoader";

let componentLibrary = undefined;

// This class is used to get common components from the Discord component library
// This is useful for creating custom components that look like Discord's
export default class CommonComponents {
    static initialize() {
        LazyModuleLoader.waitForModuleByProps((lib) => {
            componentLibrary = lib;
        }, "TableRow", "Card");

        LazyModuleLoader.waitForModuleByProps((settingsList) => {
            CommonComponents.SettingsList = settingsList.SettingsList;
            CommonComponents.SearchableSettingsList = settingsList.SearchableSettingsList;
        }, "SettingsList")
    }

    // Gets a component by its name
    static getComponentByName(name) {
        // Some components are not in the library, so we have to check if we have cached them
        if (CommonComponents[name]) return CommonComponents[name];
        // For the rest, we just return the component from the library
        return componentLibrary[name];
    }
}