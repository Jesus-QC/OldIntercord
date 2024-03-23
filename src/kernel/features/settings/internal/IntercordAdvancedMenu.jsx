import CommonComponents from "../../react/components/CommonComponents";
import SettingListSectionsBuilder from "../builders/SettingListSectionsBuilder";
import SettingsMenuManager from "../SettingsMenuManager";
import RowBuilder from "../builders/SettingRowBuilder";
import AssetManager from "../../assets/AssetManager";
import IntercordConstants from "../../loader/IntercordConstants";

export default function IntercordAdvancedMenu() {
    return (
        <ReactNative.ScrollView>
            <AdvancedMenu/>
        </ReactNative.ScrollView>
    )
}

function AdvancedMenu(){
    const SettingsList = CommonComponents.getComponentByName("SettingsList");

    const icons = [];
    for (const icon of AssetManager.getAllAssetNames()){
        SettingsMenuManager.addSettingRow(icon, new RowBuilder(icon)
            .withIconName(icon)
            .withPressable(() => {})
            .useArrow()
        )
        icons.push(icon);
    }

    const sections = new SettingListSectionsBuilder()
        .withSection("Information", "INTERCORD_ADVANCED_VERSION")
        .withSection("Informatione", ...icons)
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
        .withTrailing(() => "0.0.0.0")
    )
}