// Simple class to handle the debugger

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
            let response = (69, eval)(data); // We evaluate the data in the global context
            if (response === undefined) response = "undefined"; // If the response is undefined we just send the type
            if (response === null) response = "null"; // If the response is null we just send the type
            IntercordDebugger.socket.send(JSON.stringify(response)); // We send the response
        } catch (e){
            IntercordDebugger.socket.send(e.toString()); // We send the error
        }
    }
}