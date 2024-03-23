import SettingListSectionsBuilder from "../builders/SettingListSectionsBuilder";
import CommonComponents from "../../react/components/CommonComponents";
import SettingsMenuManager from "../SettingsMenuManager";
import RowBuilder from "../builders/SettingRowBuilder";
import AssetManager from "../../assets/AssetManager";

export default function IntercordGeneralMenu() {
    return (
        <ReactNative.ScrollView>
            <GeneralMenu/>
        </ReactNative.ScrollView>
    );
}

function GeneralMenu() {
    const SettingsList = CommonComponents.getComponentByName("SettingsList");

    const sections = new SettingListSectionsBuilder()
        .withSection("General", "INTERCORD_GENERAL_GITHUB", "INTERCORD_GENERAL_DISCORD")
        .withSection("Stats", "INTERCORD_GENERAL_STATS_PLUGINS", "INTERCORD_GENERAL_STATS_THEMES")
        .build();

    return (
        <>
            <GeneralMenuRowsUtils/>
            <SettingsList sections={sections} />
        </>
    );
}

function GeneralMenuRowsUtils({}){
    // General

    SettingsMenuManager.addSettingRow("INTERCORD_GENERAL_GITHUB", new RowBuilder("GitHub Repo")
        .withPressable(() => ReactNative.Linking.openURL("https://github.com/Jesus-QC/Intercord"))
        .withDescription(() => "Star us on GitHub!")
        .withIconName("img_account_sync_github_white")
        .useArrow()
    )

    SettingsMenuManager.addSettingRow("INTERCORD_GENERAL_DISCORD", new RowBuilder("Discord Server")
        .withPressable(() => ReactNative.Linking.openURL("https://discord.gg/8CeUM3dq9w"))
        .withDescription(() => "Join our Discord server!")
        .withIconName("ic_custom_app_icons_24px")
        .useArrow()
    )

    // Stats

    SettingsMenuManager.addSettingRow("INTERCORD_GENERAL_STATS_PLUGINS", new RowBuilder("Installed Plugins")
        .withIconName("PuzzlePieceIcon")
        .withPressable(() => {})
        .withTrailing(() => "0")
    )

    SettingsMenuManager.addSettingRow("INTERCORD_GENERAL_STATS_THEMES", new RowBuilder("Installed Themes")
        .withIconName("PaintPaletteIcon")
        .withPressable(() => {})
        .withTrailing(() => "0")
    )
}