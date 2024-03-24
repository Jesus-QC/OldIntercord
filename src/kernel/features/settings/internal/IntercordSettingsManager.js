import SettingsMenuManager from "../SettingsMenuManager";
import SettingListBuilder from "../builders/SettingListBuilder";
import SettingRowBuilder from "../builders/SettingRowBuilder";
import IntercordGeneralMenu from "./IntercordGeneralMenu";
import SettingListSectionsBuilder from "../builders/SettingListSectionsBuilder";
import IntercordAdvancedMenu, {RegisterAdvancedMenuRoutes} from "./IntercordAdvancedMenu";
import RowBuilder from "../builders/SettingRowBuilder";
import IntercordAssetManagerMenu from "./developer/IntercordAssetManagerMenu";

export default function LoadIntercordSettingsMenu(){
    SettingsMenuManager.addSettingPanel(new SettingListBuilder("Intercord").withPanels("INTERCORD_GENERAL", "INTERCORD_PLUGINS", "INTERCORD_PLUGINS_CUSTOM", "INTERCORD_THEMES", "INTERCORD_ADVANCED"));

    SettingsMenuManager.addSettingRow("INTERCORD_GENERAL", new SettingRowBuilder("General").withIconName("HomeIcon").withRoute("Intercord General", IntercordGeneralMenu));
    SettingsMenuManager.addSettingRow("INTERCORD_PLUGINS", new SettingRowBuilder("Official Plugins").withIconName("PaperIcon").withRoute("Intercord Plugins", IntercordGeneralMenu));
    SettingsMenuManager.addSettingRow("INTERCORD_PLUGINS_CUSTOM", new SettingRowBuilder("Custom Plugins").withIconName("DownloadIcon").withRoute("Intercord Plugins Custom", IntercordGeneralMenu));
    SettingsMenuManager.addSettingRow("INTERCORD_THEMES", new SettingRowBuilder("Themes").withIconName("ic_theme_24px").withRoute("Intercord Themes", IntercordGeneralMenu));
    SettingsMenuManager.addSettingRow("INTERCORD_ADVANCED", new SettingRowBuilder("Advanced").withIconName("ic_badge_staff").withRoute("Intercord Advanced", IntercordAdvancedMenu));

    RegisterAdvancedMenuRoutes();
}