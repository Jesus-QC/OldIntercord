import IntercordConstants from './IntercordConstants';
import CommonModules from '../modules/CommonModules';
import ModuleLoader from '../modules/ModuleLoader';
import LazyModuleLoader from '../modules/LazyModuleLoader';
import ModuleSearcher from '../modules/ModuleSearcher';
import InterPatcher from '../patcher/InterPatcher';
import CommonComponents from '../react/components/CommonComponents';
import SettingsMenuManager from '../settings/SettingsMenuManager';
import AssetManager from "../assets/AssetManager";
import ToastManager from "../react/ToastManager";
import FileManager from "../files/FileManager";
import SettingsManager from "../files/SettingsManager";

export default class IntercordLoader {
    static initialize(){
        // As we are minimizing the code, we need to expose the classes to the window object
        // so that our smart developers are able to do magic with them
        window.IntercordLoader = IntercordLoader;
        window.IntercordConstants = IntercordConstants;
        window.CommonModules = CommonModules;
        window.ModuleLoader = ModuleLoader;
        window.LazyModuleLoader = LazyModuleLoader;
        window.ModuleSearcher = ModuleSearcher;
        window.InterPatcher = InterPatcher;
        window.CommonComponents = CommonComponents;
        window.SettingsMenuManager = SettingsMenuManager;
        window.ToastManager = ToastManager;
        window.FileManager = FileManager;
        window.SettingsManager = SettingsManager;

        IntercordConstants.initialize()
        ModuleLoader.initialize();
        CommonModules.initialize();
        CommonComponents.initialize();
        AssetManager.initialize();
        SettingsMenuManager.initialize();
    }
}