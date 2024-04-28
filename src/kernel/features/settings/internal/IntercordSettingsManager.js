import SettingsMenuManager from "../SettingsMenuManager";
import SettingListBuilder from "../builders/SettingListBuilder";
import SettingRowBuilder from "../builders/SettingRowBuilder";
import IntercordGeneralMenu from "./IntercordGeneralMenu";
import IntercordAdvancedMenu, {RegisterAdvancedMenuRoutes} from "./IntercordAdvancedMenu";
import IntercordPluginsMenu from "./IntercordPluginsMenu";

export default function LoadIntercordSettingsMenu(){

    SettingsMenuManager.addSettingPanel(new SettingListBuilder("Intercord").withPanels("INTERCORD_GENERAL", "INTERCORD_PLUGINS", "INTERCORD_THEMES", "INTERCORD_ADVANCED"));
    SettingsMenuManager.addSettingPanel(new SettingListBuilder().withPanels("INTERCORD_UPDATER"));

    SettingsMenuManager.addSettingRow("INTERCORD_GENERAL", new SettingRowBuilder("General").withIconName("HomeIcon").withRoute("Intercord General", IntercordGeneralMenu));
    SettingsMenuManager.addSettingRow("INTERCORD_PLUGINS", new SettingRowBuilder("Plugins").withIconName("AppsIcon").withRoute("Intercord Plugins", IntercordPluginsMenu));
    SettingsMenuManager.addSettingRow("INTERCORD_THEMES", new SettingRowBuilder("Themes").withIconName("ic_theme_24px").withRoute("Intercord Themes", IntercordGeneralMenu));
    SettingsMenuManager.addSettingRow("INTERCORD_ADVANCED", new SettingRowBuilder("Advanced").withIconName("ic_badge_staff").withRoute("Intercord Advanced", IntercordAdvancedMenu));
    SettingsMenuManager.addSettingRow("INTERCORD_UPDATER", new SettingRowBuilder("Updater").withIconName("DownloadIcon").withRoute("Intercord Updater", IntercordAdvancedMenu));
    
    RegisterAdvancedMenuRoutes();
}