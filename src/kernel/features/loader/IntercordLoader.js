import IntercordConstants from './IntercordConstants';
import CommonModules from '../modules/CommonModules';
import ModuleLoader from '../modules/ModuleLoader';
import CommonComponents from '../react/components/CommonComponents';
import SettingsMenuManager from '../settings/SettingsMenuManager';
import AssetManager from "../assets/AssetManager";
import IntercordPluginManager from "../plugins/IntercordPluginManager";
import IntercordDebugger from "../settings/internal/developer/IntercordDebugger";

export default class IntercordLoader {
    static initialize(){
        IntercordConstants.initialize()
        ModuleLoader.initialize();
        CommonModules.initialize();
        CommonComponents.initialize();
        AssetManager.initialize();
        SettingsMenuManager.initialize();
        IntercordPluginManager.initialize();
        IntercordDebugger.initialize();
    }

    // Evals code in the global context
    static executeCode(code){
        // ;)
        return String((69, eval)(code));
    }
}

// As we are minimizing the code, we need to expose the classes to the window object
// so that our smart developers are able to do magic with them
window.IntercordLoader = IntercordLoader;