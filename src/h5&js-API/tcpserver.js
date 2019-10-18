// var net = require("net");

// var server = net.createServer();

// //聚合所有客户端
// var sockets = [];

// //接受新的客户端连接
// server.on("connection", function(socket) {
//     console.log("got a new connection");
//     sockets.push(socket);
//     //从连接中读取数据
//     socket.on("data", function(data) {
//         console.log("got data:", data);

//         //广播数据
//         //每当一个已连接的用户输入数据，就将这些数据广播给其他所有已连接的用户
//         sockets.forEach(function(otherSocket) {
//             if (otherSocket !== socket) {
//                 otherSocket.write(data);
//             }
//         });

//         //删除被关闭的连接
//         socket.on("close", function() {
//             console.log("connection closed");
//             var index = sockets.indexOf(socket);
//             sockets.splice(index, 1);
//         });
//     });
// });

// server.on("error", function(err) {
//     console.log("Server error:", err.message);
// });

// server.on("close", function() {
//     console.log("Server closed");
// });

// server.listen(4000);

var net = require("net");
var server = net.createServer();
server.on("connection", function(socket) {
    console.log("client connected to server");
    socket.on("data", function(data) {
        console.log("received data from client is:" + data);
        console.log(socket.address());
        socket.write("confirmed data " + data.toString());
    });
});

server.on("error", function(err) {
    console.log("Server error:", err.message);
});

server.on("close", function() {
    console.log("Server closed");
});

server.listen(6666, "localhost");
