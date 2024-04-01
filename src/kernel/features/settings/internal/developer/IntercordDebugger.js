// Simple class to handle the debugger

import SettingsManager from "../../../files/SettingsManager";

export default class IntercordDebugger{
    static initialize(){
        SettingsManager.get("intercord", "debuggerEnabled", (value) => {
            if (!value) return;
            SettingsManager.get("intercord", "debuggerAddress", (address) => {
                if (!address) return;
                IntercordDebugger.connect(address);
            })
        });
    }

    static subscribe(onStatusUpdate){
        IntercordDebugger.onStatusUpdate = onStatusUpdate;
    }

    static connect(address){
        IntercordDebugger.connected = false;
        IntercordDebugger.address = address;
        IntercordDebugger.socket = new WebSocket("ws://" + address);
        IntercordDebugger.socket.onopen = () => { IntercordDebugger.onStatusUpdate(true); IntercordDebugger.connected = true;  }
        IntercordDebugger.socket.onmessage = (msg) => IntercordDebugger.onMessage(msg);
        IntercordDebugger.socket.onerror = (err) => { console.log("An error occurred while using the debugger: ", err) }
        IntercordDebugger.socket.onclose = () => { IntercordDebugger.onStatusUpdate(false); IntercordDebugger.connected = false; }
    }

    static disconnect(){
        IntercordDebugger.socket.close();
    }

    static onMessage(msg){
        try{
            IntercordDebugger.socket.send(JSON.stringify(IntercordLoader.executeCode(msg.data))); // We execute the code and send the response
        } catch (e){
            IntercordDebugger.socket.send(e.toString()); // We send the error
        }
    }
}