import IntercordConstants from './IntercordConstants';
import CommonModules from '../modules/CommonModules';
import ModuleLoader from '../modules/ModuleLoader';
import LazyModuleLoader from '../modules/LazyModuleLoader';
import CommonComponents from '../react/components/CommonComponents';
import SettingsMenuManager from '../settings/SettingsMenuManager';
import AssetManager from "../assets/AssetManager";
import SettingsManager from "../files/SettingsManager";
import AlertModalManager from "../react/AlertModalManager";

export default class IntercordLoader {
    static initialize(){
        IntercordConstants.initialize()
        ModuleLoader.initialize();
        CommonModules.initialize();
        CommonComponents.initialize();
        AssetManager.initialize();
        SettingsMenuManager.initialize();
    }
}

// As we are minimizing the code, we need to expose the classes to the window object
// so that our smart developers are able to do magic with them
window.IntercordLoader = IntercordLoader;