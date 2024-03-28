import LazyModuleLoader from "../modules/LazyModuleLoader";

export default class IntercordConstants{
    static initialize(){
        IntercordConstants.version = "1.0.0.0";
        IntercordConstants.injectorVersion = window.intercordInjectorVersion;

        LazyModuleLoader.waitForModuleByProps((versionInfo) => {
            IntercordConstants.buildNumberLabel = versionInfo.getBuildNumberLabel();
            IntercordConstants.versionInfo = versionInfo.getConstants();
            // versionInfo contains: "DeviceVendorID","SentryStaffDsn","OTABuild","ReleaseChannel","Manifest","SentryDsn","Build","Version","SentryAlphaBetaDsn","Identifier"...
        }, "getConstants", "getBuildNumberLabel")
    }
}

window.IntercordConstants = IntercordConstants;