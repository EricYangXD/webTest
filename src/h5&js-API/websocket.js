// import "WebSocket";

if (ws) {
    ws.close();
}

var ws = new WebSocket("wss://127.0.0.1:1024");

ws.onopen = function(evt) {
    console.log("客户端：socket连接onopen");
    ws.send(
        JSON.stringify({
            id: "EricYangXD",
            message: "Hello World."
        })
    );
};

ws.onmessage = function(evt) {
    console.log("客户端：socket连接onmessage");
};

ws.onclose = function(evt) {
    console.log("客户端：socket连接onclose");
};

ws.onerror = function(evt) {
    console.log("客户端：socket连接onerror");
};

// var ws = new WebSocket("ws://127.0.0.1:1024");
// ws.onopen = function() {
//     ws.send("Test!");
// };
// ws.onmessage = function(evt) {
//     console.log(evt.data);
//     ws.close();
// };
// ws.onclose = function(evt) {
//     console.log("WebSocket Closed!");
// };
// ws.onerror = function(evt) {
//     console.log("WebSocket Error!");
// };
