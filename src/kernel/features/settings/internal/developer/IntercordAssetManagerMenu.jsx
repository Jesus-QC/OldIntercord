import CommonComponents from "../../../react/components/CommonComponents";
import AssetManager from "../../../assets/AssetManager";
import InformationRow from "../../../react/components/InformationRow";

export default function IntercordAssetManagerMenu() {
    return (
        <ReactNative.ScrollView>
            <AssetManagerMenu/>
        </ReactNative.ScrollView>
    )
}

function AssetManagerMenu(){
    const TableRow = CommonComponents.getComponent("TableRow");
    const TableRowIcon = CommonComponents.getComponent("TableRowIcon");
    const SearchField = CommonComponents.getComponent("SearchField");
    const TableSwitchRow = CommonComponents.getComponent("TableSwitchRow");

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
        const searchLower = search.toLowerCase();

        for (const asset of assets){
            if (asset.props.label.toLowerCase().includes(searchLower)){
                tempAssets.push(asset);
            }
        }

        return tempAssets;
    }

    return (
        <>
            <InformationRow label={"Information"} subLabel={"Asset IDs change every time the app is reloaded. Assets are lazy, which means they are only loaded when they are needed, therefore not all assets are shown here."} />
            <ReactNative.View style={{marginRight: 16, marginLeft: 16}}>
                <SearchField value={search} onChange={setSearch} />
            </ReactNative.View>
            <TableSwitchRow style={{padding: 2, margin: 16}} value={useIcons} onValueChange={setUseIcons} end={true} start={true} label={"Use Icons"} subLabel={"Whether or not it should display non colored icons instead of images."} />
            {getAssets()}
        </>
    )
}