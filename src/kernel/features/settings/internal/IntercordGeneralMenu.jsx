import CustomSettingListBuilder from "../builders/CustomSettingListBuilder";
import SettingsMenuManager from "../SettingsMenuManager";
import RowBuilder from "../builders/SettingRowBuilder";
import {useSetting} from "../../react/components/componentUtils";

export default function IntercordGeneralMenu() {
    return (
        <ReactNative.ScrollView>
            <GeneralMenu/>
        </ReactNative.ScrollView>
    );
}

function GeneralMenu() {
    const [automaticUpdates, setAutomaticUpdates] = useSetting("intercord", "automaticUpdates", true)
    const [automaticPluginUpdates, setAutomaticPluginUpdates] = useSetting("intercord", "automaticPluginUpdates", true)
    const [debugPluginsCrash, setDebugPluginsCrash] = useSetting("intercord", "debugPluginsCrash", true)

    const settings = new CustomSettingListBuilder()
        .withSection("General", "INTERCORD_GENERAL_GITHUB", "INTERCORD_GENERAL_DISCORD", "INTERCORD_GENERAL_SUPPORT")
        .withSection("Updates", "INTERCORD_GENERAL_AUTOMATIC_UPDATES", "INTERCORD_GENERAL_AUTOMATIC_UPDATES_PLUGINS")
        .withSection("Debug", "INTERCORD_GENERAL_PLUGINS_CRASH", "INTERCORD_GENERAL_EXIT", "INTERCORD_GENERAL_RESTART")
        .withSection("Stats", "INTERCORD_GENERAL_STATS_PLUGINS", "INTERCORD_GENERAL_STATS_THEMES")
        .build();

    return (
        <>
            <GeneralMenuRowUtils automaticUpdates={automaticUpdates} setAutomaticUpdates={setAutomaticUpdates} setAutomaticPluginUpdates={setAutomaticPluginUpdates} automaticPluginUpdates={automaticPluginUpdates} debugPluginsCrash={debugPluginsCrash} setDebugPluginsCrash={setDebugPluginsCrash}/>
            {settings}
        </>
    );
}

function GeneralMenuRowUtils({automaticUpdates, setAutomaticUpdates, setAutomaticPluginUpdates, automaticPluginUpdates, debugPluginsCrash, setDebugPluginsCrash}){
    // General

    SettingsMenuManager.addSettingRow("INTERCORD_GENERAL_GITHUB", new RowBuilder("GitHub Repo")
        .withIconName("img_account_sync_github_white")
        .withDescription(() => "Star us on GitHub!")
        .withPressable(() => ReactNative.Linking.openURL("https://github.com/Jesus-QC/Intercord"))
        .useArrow()
    )

    SettingsMenuManager.addSettingRow("INTERCORD_GENERAL_DISCORD", new RowBuilder("Discord Server")
        .withIconName("ic_custom_app_icons_24px")
        .withDescription(() => "Join our Discord server!")
        .withPressable(() => ReactNative.Linking.openURL("https://discord.gg/8CeUM3dq9w"))
        .useArrow()
    )

    SettingsMenuManager.addSettingRow("INTERCORD_GENERAL_SUPPORT", new RowBuilder("Support the project!")
        .withIconName("SuperReactionIcon")
        .withDescription(() => "Support the project by donating!")
        .withPressable(() => ReactNative.Linking.openURL("https://github.com/sponsors/Jesus-QC"))
        .useArrow()
    )

    // Updates Settings

    SettingsMenuManager.addSettingRow("INTERCORD_GENERAL_AUTOMATIC_UPDATES", new RowBuilder("Update Automatically")
        .withIconName("DownloadIcon")
        .withDescription(() => "Whether or not Intercord should be updated automatically.")
        .withToggle(setAutomaticUpdates, () => automaticUpdates)
    )

    SettingsMenuManager.addSettingRow("INTERCORD_GENERAL_AUTOMATIC_UPDATES_PLUGINS", new RowBuilder("Update Plugins Automatically")
        .withIconName("ic_upload")
        .withDescription(() => "Whether or not plugins should be updated automatically.")
        .withToggle(setAutomaticPluginUpdates, () => automaticPluginUpdates)
    )

    // Debug Settings

    SettingsMenuManager.addSettingRow("INTERCORD_GENERAL_PLUGINS_CRASH", new RowBuilder("Disable Plugins on Crash")
        .withIconName("ShieldIcon")
        .withDescription(() => "Whether or not Intercord should automatically disable all plugins when the app crashes.")
        .withToggle(setDebugPluginsCrash, () => debugPluginsCrash)
    )

    SettingsMenuManager.addSettingRow("INTERCORD_GENERAL_EXIT", new RowBuilder("Close Discord")
        .withIconName("HandRequestSpeakIcon")
        .withDescription(() => "Closes the application.")
        .withPressable(() => ReactNative.BackHandler.exitApp())
    )

    SettingsMenuManager.addSettingRow("INTERCORD_GENERAL_RESTART", new RowBuilder("Restart Discord")
        .withIconName("WarningIcon")
        .withDescription(() => "Restarts the application.")
        .withPressable(() => ReactNative.NativeModules.BundleUpdaterManager.reload())
    )

    // Stats

    // TODO
    SettingsMenuManager.addSettingRow("INTERCORD_GENERAL_STATS_PLUGINS", new RowBuilder("Installed Plugins")
        .withIconName("PuzzlePieceIcon")
        .withTrailing(() => "0")
    )

    SettingsMenuManager.addSettingRow("INTERCORD_GENERAL_STATS_THEMES", new RowBuilder("Installed Themes")
        .withIconName("PaintPaletteIcon")
        .withTrailing(() => "0")
    )
}