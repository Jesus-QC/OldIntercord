import CommonComponents from "../../../react/components/CommonComponents";
import AssetManager from "../../../assets/AssetManager";
import IntercordDebugger from "./IntercordDebugger";
import {useSetting} from "../../../react/components/componentUtils";

export default function IntercordDevToolsMenu() {
    return (
        <ReactNative.ScrollView style={{padding: 16, marginBottom: 16}}>
            <DevToolsMenu/>
        </ReactNative.ScrollView>
    )
}

function DevToolsMenu(){

    return (
        <>
            <Debugger/>
            <ReactDevTools/>
        </>
    )
}

function Debugger(){
    const Card = CommonComponents.getComponentByName("Card");
    const TableRow = CommonComponents.getComponentByName("TableRow");
    const TableRowIcon = CommonComponents.getComponentByName("TableRowIcon");
    const TextInput = CommonComponents.getComponentByName("TextInput");
    const Button = CommonComponents.getComponentByName("Button");

    const [address, setAddress] = React.useState(!IntercordDebugger.address ? "10.0.2.2:8080" : IntercordDebugger.address);
    const [connected, setConnected] = React.useState(IntercordDebugger.connected);

    IntercordDebugger.subscribe((newStatus) => {
        setConnected(newStatus);
    });

    function buttonPressed(){
        if (!connected){
            // Don't even bother to show error messages if the user fucks up
            IntercordDebugger.connect(address);
        } else {
            IntercordDebugger.disconnect();
        }
    }

    return (
        <>
            <TableRow icon={<TableRowIcon source={AssetManager.getAssetIdByName("ic_info_24px")} />} start={true} end={true} label={"Debugger"} subLabel={"Connects to a debugger given its IP address and port. Consists of a very simple websocket connection, you can use any websocket client to connect to it."} />
            <Card style={{padding: 16, marginTop: 16, marginBottom: 16}}>
                <TextInput isDisabled={connected} value={address} onChange={setAddress} label={"Debugger Address"} description={"Remember to append the debugger port at the end of the address"} />
                <Button style={{paddingTop: 16}} onPress={buttonPressed} text={connected ? "Disconnect" : "Connect"} />
            </Card>
        </>
    )
}

function ReactDevTools(){
    const Card = CommonComponents.getComponentByName("Card");
    const TableRow = CommonComponents.getComponentByName("TableRow");
    const TableRowIcon = CommonComponents.getComponentByName("TableRowIcon");
    const TextInput = CommonComponents.getComponentByName("TextInput");
    const Button = CommonComponents.getComponentByName("Button");
    const TableSwitchRow = CommonComponents.getComponentByName("TableSwitchRow");

    // TODO: this should be saved in the settings
    const [enabled, setEnabled] = useSetting("intercord", "reactDevToolsEnabled", false);
    const [address, setAddress] = React.useState("10.0.2.2:8097");

    return (
        <>
            <TableRow icon={<TableRowIcon source={AssetManager.getAssetIdByName("ic_info_24px")} />} start={true} end={true} label={"React Dev Tools"} subLabel={"Enables react dev tools in the specified address. Requires the user to restart."} />
            <TableSwitchRow style={{marginTop: 16, padding: 2}} value={enabled} onValueChange={(val) => {
                setEnabled(val);}} end={true} start={true} label={"Enable React Dev Tools"} subLabel={"Whether or not React Dev Tools should be loaded when the app starts."} />
            <Card style={{padding: 16, marginTop: 16, marginBottom: 32}}>
                <TextInput isDisabled={!enabled} value={address} onChange={setAddress} label={"Dev Tools Address"} description={"Remember to append the debugger port at the end of the address"} />
                <Button disabled={!enabled} style={{paddingTop: 16}} onPress={() => {console.log("connect")}} text={"Connect"} />
            </Card>
        </>
    )
}