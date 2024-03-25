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
        .withSection("Information", "INTERCORD_ADVANCED_VERSION")
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
    SettingsMenuManager.addSettingRow("INTERCORD_ADVANCED_VERSION", new RowBuilder("Version")
        .withIconName("SettingsIcon")
        .withTrailing(() => IntercordConstants.version)
    )

    SettingsMenuManager.addSettingRow("INTERCORD_ADVANCED_COPY_INFO", new RowBuilder("Copy Information")
        .withIconName("ic_info_24px")
        .withPressable(() => {
            ReactNative.Clipboard.setString("Todo");
            ToastManager.info("Information copied to clipboard")
        })
        .useArrow()
    )
}