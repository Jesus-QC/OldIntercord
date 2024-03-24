// Simple class to handle the debugger
import ToastManager from "../../../react/ToastManager";

export default class IntercordDebugger{
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
            const data = msg.data; // We get the raw data
            const response = (69, eval)(data); // We evaluate the data in the global context
            if (response === undefined) return; // If the response is undefined we don't send it
            IntercordDebugger.socket.send(response.toString()); // We send the response
        } catch (e){
            IntercordDebugger.socket.send(e.toString()); // We send the error
        }
    }
}