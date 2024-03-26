import CommonComponents from "../../react/components/CommonComponents";
import SettingListSectionsBuilder from "../builders/SettingListSectionsBuilder";
import SettingsMenuManager from "../SettingsMenuManager";
import RowBuilder from "../builders/SettingRowBuilder";
import IntercordConstants from "../../loader/IntercordConstants";
import IntercordAssetManagerMenu from "./developer/IntercordAssetManagerMenu";
import IntercordDevToolsMenu from "./developer/IntercordDevToolsMenu";
import ToastManager from "../../react/ToastManager";

export default function IntercordAdvancedMenu() {
    return (
        <ReactNative.ScrollView>
            <AdvancedMenu/>
        </ReactNative.ScrollView>
    )
}

export function RegisterAdvancedMenuRoutes(){
    SettingsMenuManager.addSettingRow("INTERCORD_ADVANCED_DEVTOOLS", new RowBuilder("Dev Tools").withIconName("ic_badge_staff").withRoute("Intercord Advanced DevTools", IntercordDevToolsMenu))
    SettingsMenuManager.addSettingRow("INTERCORD_ADVANCED_ASSET_MANAGER", new RowBuilder("Asset Manager").withIconName("PaintPaletteIcon").withRoute("Intercord Advanced Asset Manager", IntercordAssetManagerMenu))
}

function AdvancedMenu(){
    const SettingsList = CommonComponents.getComponentByName("SettingsList");

    const sections = new SettingListSectionsBuilder()
        .withSection("Information", "INTERCORD_ADVANCED_VERSION", "INTERCORD_ADVANCED_VERSION_INJECTOR", "INTERCORD_ADVANCED_VERSION_DISCORD", "INTERCORD_ADVANCED_VERSION_REACT", "INTERCORD_ADVANCED_VERSION_REACT_NATIVE", "INTERCORD_ADVANCED_VERSION_HERMES")
        .withSection("Developer", "INTERCORD_ADVANCED_INFORMATION")
        .withSection("Tools", "INTERCORD_ADVANCED_DEVTOOLS", "INTERCORD_ADVANCED_ASSET_MANAGER", "INTERCORD_ADVANCED_COPY_INFO")
        .build();

    return (
        <>
            <AdvancedMenuRowUtils/>
            <SettingsList sections={sections}/>
        </>
    )
}

function AdvancedMenuRowUtils(){
    // Information
    SettingsMenuManager.addSettingRow("INTERCORD_ADVANCED_VERSION", new RowBuilder("Intercord")
        .withIconName("ic_activity_24px")
        .withTrailing(() => IntercordConstants.version)
    )

    SettingsMenuManager.addSettingRow("INTERCORD_ADVANCED_VERSION_INJECTOR", new RowBuilder("Injector")
        .withIconName("ic_play")
        .withTrailing(() => IntercordConstants.injectorVersion)
    )

    SettingsMenuManager.addSettingRow("INTERCORD_ADVANCED_VERSION_DISCORD", new RowBuilder("Discord")
        .withIconName("ClydeIcon")
        .withTrailing(() => `${IntercordConstants.versionInfo.Version} (${IntercordConstants.versionInfo.Build})`)
    )

    SettingsMenuManager.addSettingRow("INTERCORD_ADVANCED_VERSION_REACT", new RowBuilder("React")
        .withIconName("LaptopPhoneIcon")
        .withTrailing(() => React.version)
    )

    SettingsMenuManager.addSettingRow("INTERCORD_ADVANCED_VERSION_REACT_NATIVE", new RowBuilder("React Native")
        .withIconName("ic_badge_staff")
        .withTrailing(() => {
            const reactNativeVersion = ReactNative.Platform.constants.reactNativeVersion;
            return `${reactNativeVersion.major}.${reactNativeVersion.minor}.${reactNativeVersion.patch}`
        })
    )

    SettingsMenuManager.addSettingRow("INTERCORD_ADVANCED_VERSION_HERMES", new RowBuilder("Hermes")
        .withIconName("WrenchIcon")
        .withTrailing(() => HermesInternal.getRuntimeProperties()["OSS Release Version"])
    )

    SettingsMenuManager.addSettingRow("INTERCORD_ADVANCED_COPY_INFO", new RowBuilder("Copy Information")
        .withIconName("ic_info_24px")
        .withPressable(() => {
            // TODO
            ReactNative.Clipboard.setString("Todo");
            ToastManager.info("Information copied to clipboard")
        })
        .useArrow()
    )

    SettingsMenuManager.addSettingRow("INTERCORD_ADVANCED_INFORMATION", new RowBuilder("Developer Tools")
        .withIconName("ic_info_24px")
        .withDescription(() => "Those are a set of tools that are meant for developers to debug and test with Intercord, please be cautious when using them.")
    )
}