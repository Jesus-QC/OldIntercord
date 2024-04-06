import CommonComponents from "../../../react/components/CommonComponents";
import IntercordDebugger from "./IntercordDebugger";
import AlertModalManager from "../../../react/AlertModalManager";
import RestartNeededAlertModal from "../../../react/components/RestartNeededAlertModal";
import InformationRow from "../../../react/components/InformationRow";
import {useSetting} from "../../../react/components/componentUtils";

export default function IntercordDevToolsMenu() {
    return (
        <ReactNative.ScrollView style={{padding: 16, paddingBottom: 32}}>
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
    const Card = CommonComponents.getComponent("Card");
    const TextInput = CommonComponents.getComponent("TextField");
    const Button = CommonComponents.getComponent("Button");
    const TableSwitchRow = CommonComponents.getComponent("ActionSheetSwitchRow");
    const Text = CommonComponents.getComponent("Text");

    const [address, setAddress] = useSetting("intercord", "debuggerAddress", "10.0.2.2:8080");
    const [connected, setConnected] = React.useState(IntercordDebugger.connected);
    const [enabled, setEnabled] = useSetting("intercord", "debuggerEnabled", false);

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
            <InformationRow style={{margin: 0}} label={"Debugger"} subLabel={"Connects to a debugger given its IP address and port. Consists of a very simple websocket connection, you can use any websocket client to connect to it."} />
            <TableSwitchRow style={{marginTop: 16, padding: 2}} value={enabled} onValueChange={setEnabled} end={true} start={true} label={"Enable on startup"} subLabel={"Whether or not to enable the debugger when the app starts."} />
            <Card style={{padding: 16, marginTop: 16, marginBottom: 16}}>
                <Text style={{marginBottom: 8}} variant={"heading-md/bold"} color={"text-primary"}>Debugger Address</Text>
                <TextInput isDisabled={connected} value={address} onChange={setAddress} />
                <Text style={{marginTop: 8}} variant={"text-xs/medium"} color={"text-primary"}>Remember to append the debugger port at the end of the address</Text>
                <Button style={{paddingTop: 16}} onPress={buttonPressed} text={connected ? "Disconnect" : "Connect"} variant={connected ? "destructive" : "primary"} />
            </Card>
        </>
    )
}

function ReactDevTools(){
    const Card = CommonComponents.getComponent("Card");
    const TextInput = CommonComponents.getComponent("TextField");
    const Button = CommonComponents.getComponent("Button");
    const TableSwitchRow = CommonComponents.getComponent("ActionSheetSwitchRow");
    const Text = CommonComponents.getComponent("Text");

    const [enabled, setEnabled] = useSetting("intercord", "reactDevToolsEnabled", false);
    const [address, setAddress] = React.useState("10.0.2.2:8097");
    const [connected, setConnected] = React.useState(reactDevToolsEnabled);

    function onSwitched(val){
        if (!val){
            if (connected){
                AlertModalManager.openAlert("react-dev-tools", <RestartNeededAlertModal onRestarting={() => setEnabled(false)} />)
            } else {
                setEnabled(val);
            }
        } else {
            AlertModalManager.openAlert("react-dev-tools", <RestartNeededAlertModal onRestarting={() => setEnabled(true)} />)
        }
    }

    function buttonPressed(){
        if (!connected) {
            setConnected(true);
            reactDevToolsEnabled = true;
            window.ReactDevToolsBackend.connectToDevTools({port: 8097, host: '10.0.2.2', useHttps: false});
        } else {
            AlertModalManager.openAlert("react-dev-tools", <RestartNeededAlertModal />)
        }
    }

    return (
        <>
            <InformationRow style={{margin: 0}} label={"Enable React Dev Tools"} subLabel={"Whether or not React Dev Tools should be loaded when the app starts."} />
            <TableSwitchRow style={{marginTop: 16, padding: 2}} value={enabled} onValueChange={onSwitched} end={true} start={true} label={"Enable React Dev Tools"} subLabel={"Whether or not React Dev Tools should be loaded when the app starts."} />
            <Card style={{padding: 16, marginTop: 16, marginBottom: 32}}>
                <Text style={{marginBottom: 8}} variant={"heading-md/bold"} color={"text-primary"}>Dev Tools Address</Text>
                <TextInput isDisabled={!enabled || connected} value={address} onChange={setAddress} />
                <Text style={{marginTop: 8}} variant={"text-xs/medium"} color={"text-primary"}>Remember to append the debugger port at the end of the address</Text>
                <Button disabled={!enabled} style={{paddingTop: 16}} onPress={buttonPressed} text={connected ? "Disconnect" : "Connect"} variant={connected ? "destructive" : "primary"} />
            </Card>
        </>
    )
}

let reactDevToolsEnabled = false;