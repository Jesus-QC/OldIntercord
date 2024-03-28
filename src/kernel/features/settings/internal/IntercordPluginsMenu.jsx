import AssetManager from "../../assets/AssetManager";
import {useSetting} from "../../react/components/componentUtils";
import IntercordPluginManager from "../../plugins/IntercordPluginManager";

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
    const [modifiedPlugins, setModifiedPlugins] = React.useState(savedModifiedPlugins);
    const Stack = CommonComponents.getComponentByName("Stack");

    function onToggledPlugin(prefix){
        if (modifiedPlugins.includes(prefix)){
            savedModifiedPlugins = modifiedPlugins.filter((p) => p !== prefix);
        } else {
            savedModifiedPlugins = [...modifiedPlugins, prefix];
        }

        setModifiedPlugins(savedModifiedPlugins);
    }

    return (
        <>
            {modifiedPlugins.length > 0 && <RestartRequiredAlert/>}
            <ReactNative.ScrollView style={{padding: 16}}>
                <Stack spacing={12} style={{marginBottom: 32}}>
                    {
                        IntercordPluginManager.getPlugins().map((plugin) => {
                            return <PluginCard plugin={plugin} onToggledPlugin={onToggledPlugin}/>
                        })
                    }
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
        setEnabled(val);
        onToggledPlugin(plugin.prefix);
    }

    return (
        <Card style={{padding: 0}}>
            <TableSwitchRow value={enabled} onValueChange={onToggled} label={plugin.name} subLabel={`by ${plugin.author}`} start={true} end={true} />
            <Text style={{marginRight: 12, marginLeft: 12, marginBottom: enabled ? 0 : 12}} variant={"text-xs/medium"} color={"text-primary"}>{plugin.description}</Text>
            {enabled && <TableRow onPress={() => {console.log("t")}} arrow={true} icon={<TableRowIcon source={AssetManager.getAssetIdByName("SettingsIcon")} />} label={"Settings"} start={true} end={true} />}
        </Card>
    );
}