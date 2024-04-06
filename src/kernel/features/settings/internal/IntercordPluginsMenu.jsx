import AssetManager from "../../assets/AssetManager";
import {useSetting} from "../../react/components/componentUtils";
import IntercordPluginManager from "../../plugins/IntercordPluginManager";
import ActionSheetManager from "../../react/ActionSheetManager";

export default function IntercordPluginsMenu(){
    return (
        <ReactNative.View>
            <PluginsMenu/>
        </ReactNative.View>
    )
}

function RestartRequiredAlert(){
    const TableRow = CommonComponents.getComponent("TableRow");
    const TableRowIcon = CommonComponents.getComponent("TableRowIcon");

    return (
        <ReactNative.View style={{margin: 16, marginBottom: 0, backgroundColor: "#ED4245", padding: 3, borderRadius: 19}}>
            <TableRow end={true} start={true} arrow={true} label={"Restart Required"} subLabel={"Press here to restart and apply the changes"} onPress={() => ReactNative.NativeModules.BundleUpdaterManager.reload()} icon={<TableRowIcon source={AssetManager.getAssetIdByName("ic_information_filled_24px")}/>} />
        </ReactNative.View>
    )
}

let savedModifiedPlugins = [];

function PluginsMenu(){
    const TextInput = CommonComponents.getComponent("SearchField");

    const [modifiedPlugins, setModifiedPlugins] = React.useState(savedModifiedPlugins);
    const [plugins, setPlugins] = React.useState([]);
    const [search, setSearch] = React.useState("");

    React.useEffect(() => {
        setPlugins(IntercordPluginManager.getPlugins().map((plugin) =>
            <PluginCard plugin={plugin} onToggledPlugin={onToggledPlugin}/>
        ))
    }, []);

    function getPlugins(){
        const tempPlugins = [];
        const searchLower = search.toLowerCase();

        for (const plugin of plugins){
            const data = plugin.props.plugin ? plugin.props.plugin : plugin.props.data;
            if (JSON.stringify(data).toLowerCase().includes(searchLower)) tempPlugins.push(plugin);
        }

        return tempPlugins;
    }

    function onToggledPlugin(prefix){
        if (savedModifiedPlugins.includes(prefix)) savedModifiedPlugins = savedModifiedPlugins.filter((p) => p !== prefix);
        else savedModifiedPlugins = [...savedModifiedPlugins, prefix];
        setModifiedPlugins(savedModifiedPlugins);
    }

    return (
        <>
            {modifiedPlugins.length > 0 && <RestartRequiredAlert/>}
            <ReactNative.ScrollView style={{padding: 16}}>
                <TextInput value={search} onChange={setSearch} />
                <ReactNative.View style={{marginBottom: 32, marginTop: 16, display: "flex", gap: 12}}>
                    {getPlugins()}
                </ReactNative.View>
            </ReactNative.ScrollView>
        </>
    )
}

function PluginCard({plugin, onToggledPlugin}){
    const TableRow = CommonComponents.getComponent("TableRow");
    const TableRowIcon = CommonComponents.getComponent("TableRowIcon");
    const Card = CommonComponents.getComponent("Card");
    const Text = CommonComponents.getComponent("Text");
    const TableSwitchRow = CommonComponents.getComponent("ActionSheetSwitchRow");

    const [enabled, setEnabled] = useSetting(plugin.prefix, "enabled", false);

    function onToggled(val){
        if (!plugin.requiresRestart){
            if (val) IntercordPluginManager.loadPlugin(plugin.prefix);
            else IntercordPluginManager.unloadPlugin(plugin.prefix);
        } else{
            onToggledPlugin(plugin.prefix);
        }

        setEnabled(val);
    }

    return (
        <Card onPress={() => onToggled(!enabled)} style={{padding: 0}}>
            <TableSwitchRow label={plugin.name} subLabel={`by ${plugin.author}`} start={true} end={true} value={enabled} onValueChange={onToggled} />
            <Text style={{marginRight: 12, marginLeft: 12, marginBottom: enabled ? 0 : 12}} variant={"text-xs/medium"} color={"text-primary"}>{plugin.description}</Text>
            {enabled && <TableRow onPress={() => ActionSheetManager.openActionSheet("plugin-config", <PluginConfigSheet plugin={plugin}/>)} arrow={true} icon={<TableRowIcon source={AssetManager.getAssetIdByName("SettingsIcon")} />} label={"Settings"} start={true} end={true} />}
        </Card>
    );
}

function PluginConfigSheet({plugin}){
    const ActionSheet = CommonComponents.getComponent("ActionSheet");
    const ActionSheetTitleHeader = CommonComponents.getComponent("ActionSheetTitleHeader");
    const ActionSheetContentContainer = CommonComponents.getComponent("ActionSheetContentContainer");
    const ActionSheetRow = CommonComponents.getComponent("ActionSheetRow");
    const TableRowIcon = CommonComponents.getComponent("TableRowIcon");

    const avoidCustomSettings = !plugin.settings;

    return (
        <ActionSheet>
            <ActionSheetTitleHeader title={plugin.name} subtitle={`by ${plugin.author}`} />
            <ActionSheetContentContainer style={{padding: 16, marginBottom: 16}}>
                {!avoidCustomSettings && plugin.settings()}
                <ActionSheetRow style={{marginTop: avoidCustomSettings ? 0 : 16, padding: 0}} label={"Source code"} subLabel={"Check the source code on GitHub."} onPress={() => ReactNative.Linking.openURL(plugin.repo)} arrow={true} start={true} end={true} icon={<TableRowIcon source={AssetManager.getAssetIdByName("img_account_sync_github_white")} />} />
            </ActionSheetContentContainer>
        </ActionSheet>
    );
}