import AssetManager from "../../assets/AssetManager";
import CommonComponents from "./CommonComponents";

export default function InformationRow({label, subLabel, style}){
    const TableRow = CommonComponents.getComponentByName("TableRow");
    const TableRowIcon = CommonComponents.getComponentByName("TableRowIcon");

    return (
        <TableRow style={{padding:0, margin: 16, ...style}} icon={<TableRowIcon source={AssetManager.getAssetIdByName("ic_info_24px")} />} start={true} end={true} label={label} subLabel={subLabel} />
    )
}