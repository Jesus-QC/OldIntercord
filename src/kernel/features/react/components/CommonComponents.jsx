import LazyModuleLoader from "../../modules/LazyModuleLoader";

// This class is used to get common components from the Discord component library
// This is useful for creating custom components that look like Discord's
export default class CommonComponents {
    static initialize() {
        LazyModuleLoader.waitForModuleByProps((oldLib) => {
            CommonComponents.oldComponentLib = oldLib;
        }, "Text", "TextStyleSheet")

        CommonComponents.Isolated = {};
    }

    // Gets a component by its name
    static getComponent(name, onlyDefaultSearch = true) {
        // Some components are not in the library, so we have to check if we have cached them
        if (CommonComponents[name]) return CommonComponents[name];

        // And if we don't find it, we search in the old component library
        if (CommonComponents.oldComponentLib?.[name]) return CommonComponents.oldComponentLib[name]?.render ? CommonComponents.oldComponentLib[name].render : CommonComponents.oldComponentLib[name];

        const module = onlyDefaultSearch ? ModuleSearcher.findByProps( "__esModule", name) : ModuleSearcher.findByProps(name);
        if (module) return CommonComponents[name] = module[name];

        // If we don't find it, we try to return the component from ReactNative
        const rnModule = ReactNative[name];
        if (rnModule) return CommonComponents[name] = rnModule;

        return CommonComponents.getFallback();
    }

    static getFallback(){
        // If we don't find it, we return a fallback component (a red view so developers know something is wrong).
        return () => <ReactNative.View style={{backgroundColor: "red"}} />;
    }
}

window.CommonComponents = CommonComponents;