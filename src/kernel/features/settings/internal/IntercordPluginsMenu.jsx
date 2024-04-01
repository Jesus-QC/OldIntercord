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
    const Text = CommonComponents.getComponentByName("Text");

    return (
        <ReactNative.Pressable onPress={() => ReactNative.NativeModules.BundleUpdaterManager.reload()} style={{width: "100%", backgroundColor: ColorUtils.getColorByName("yellow-300"), padding: 8}}>
            <Text style={{textAlign: "center"}} variant={"heading-md/extrabold"} color={"black"}>Restart Required</Text>
            <Text style={{textAlign: "center"}} variant={"heading-sm/medium"} color={"black"}>Press here to restart and apply the changes</Text>
        </ReactNative.Pressable>
    )
}

let savedModifiedPlugins = [];

function PluginsMenu(){
    const Stack = CommonComponents.getComponentByName("Stack");
    const TextInput = CommonComponents.getComponentByName("TextInput");

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
                <TextInput value={search} onChange={setSearch} placeholder={"Search"} trailingIcon={ModuleSearcher.findByProps("MagnifyingGlassIcon").MagnifyingGlassIcon} />
                <Stack spacing={12} style={{marginBottom: 32, marginTop: 16}}>
                    {getPlugins()}
                </Stack>
            </ReactNative.ScrollView>
        </>
    )
}

function PluginCard({plugin, onToggledPlugin}){
    const TableSwitchRow = CommonComponents.getComponentByName("TableSwitchRow");
    const TableRow = CommonComponents.getComponentByName("TableRow");
    const TableRowIcon = CommonComponents.getComponentByName("TableRowIcon");
    const Card = CommonComponents.getComponentByName("Card");
    const Text = CommonComponents.getComponentByName("Text");

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
        <Card style={{padding: 0}}>
            <TableSwitchRow value={enabled} onValueChange={onToggled} label={plugin.name} subLabel={`by ${plugin.author}`} start={true} end={true} />
            <Text style={{marginRight: 12, marginLeft: 12, marginBottom: enabled ? 0 : 12}} variant={"text-xs/medium"} color={"text-primary"}>{plugin.description}</Text>
            {enabled && <TableRow onPress={() => ActionSheetManager.openActionSheet("plugin-config", <PluginConfigSheet plugin={plugin}/>)} arrow={true} icon={<TableRowIcon source={AssetManager.getAssetIdByName("SettingsIcon")} />} label={"Settings"} start={true} end={true} />}
        </Card>
    );
}

function PluginConfigSheet({plugin}){
    const ActionSheet = CommonComponents.getComponentByName("ActionSheet");
    const ActionSheetTitleHeader = CommonComponents.getComponentByName("ActionSheetTitleHeader");
    const ActionSheetContentContainer = CommonComponents.getComponentByName("ActionSheetContentContainer");
    const ActionSheetRow = CommonComponents.getComponentByName("ActionSheetRow");
    const TableRowIcon = CommonComponents.getComponentByName("TableRowIcon");

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