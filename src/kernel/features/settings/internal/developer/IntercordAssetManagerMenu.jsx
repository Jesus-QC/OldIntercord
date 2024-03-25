import CommonComponents from "../../../react/components/CommonComponents";
import AssetManager from "../../../assets/AssetManager";

export default function IntercordAssetManagerMenu() {
    return (
        <ReactNative.ScrollView>
            <AssetManagerMenu/>
        </ReactNative.ScrollView>
    )
}

function AssetManagerMenu(){
    const TableRow = CommonComponents.getComponentByName("TableRow");
    const TableRowIcon = CommonComponents.getComponentByName("TableRowIcon");
    const TextInput = CommonComponents.getComponentByName("TextInput");
    const TableSwitchRow = CommonComponents.getComponentByName("TableSwitchRow");

    const [search, setSearch] = React.useState("");
    const [assets, setAssets] = React.useState([]);
    const [useIcons, setUseIcons] = React.useState(true);

    React.useEffect(() => {
        const tempAssets = [];
        for (const assetName of AssetManager.getAllAssetNames()){
            const id = AssetManager.getAssetIdByName(assetName);
            tempAssets.push(<TableRow key={id} label={assetName} subLabel={id} icon={useIcons ? <TableRowIcon source={id} /> : <ReactNative.Image source={id} style={{height: 26, width: 26, padding: 8, margin: 3}} />}/>);
        }
        setAssets(tempAssets)
    }, [useIcons]);

    function getAssets(){
        const tempAssets = [];

        for (const asset of assets){
            if (asset.props.label.toLowerCase().includes(search)){
                tempAssets.push(asset);
            }
        }

        return tempAssets;
    }

    return (
        <>
            <TableRow style={{margin: 16, padding: 0}} icon={<TableRowIcon source={AssetManager.getAssetIdByName("ic_info_24px")} />} start={true} end={true} label={"Information"} subLabel={"Asset IDs change every time the app is reloaded. Assets are lazy, which means they are only loaded when they are needed, therefore not all assets are shown here."} />
            <ReactNative.View style={{marginRight: 16, marginLeft: 16}}>
                <TextInput value={search} onChange={(val) => setSearch(val.toLowerCase())}  placeholder={"Search"} trailingIcon={ModuleSearcher.findByProps("MagnifyingGlassIcon").MagnifyingGlassIcon} />
            </ReactNative.View>
            <TableSwitchRow style={{padding: 2, margin: 16}} value={useIcons} onValueChange={setUseIcons} end={true} start={true} label={"Use Icons"} subLabel={"Whether or not it should display non colored icons instead of the images."} />
            {getAssets()}
        </>
    )
}