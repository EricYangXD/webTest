/*server*/
const dgram = require("dgram");
const server = dgram.createSocket("udp4"); //创建udp服务器
// const multicastAddr = "192.168.8.106";
// const multicastAddr = "127.0.0.1";
const multicastAddr = "224.100.100.100";

//以下server.on 都是在监听不同信号
server.on("close", () => {
    // ()=> 是 ES6的箭头函数，写成 function()也是可以的
    console.log("socket已关闭");
});

server.on("error", err => {
    console.log(err);
});

server.on("listening", () => {
    console.log("socket正在监听中...");
    server.addMembership(multicastAddr); //加入组播组
    server.setMulticastTTL(128);
});

server.on("message", (msg, rinfo) => {
    console.log(`receive message from ${rinfo.address}:${rinfo.port}`);
});

function sendMsg() {
    var message = "大家好啊，我是服务端.";
    server.send(message, 0, message.length, 8061, multicastAddr);
    //通过server.send发送组播
    //参数分别是，数据（buffer或者string），偏移量（即开始发送的位子），数据长度，接收的端口，组播组
}

server.bind(8060); //绑定端口，不绑定的话也可以send数据但是无法接受

//循环发送
setInterval(() => {
    sendMsg();
    console.log("send message");
}, 1500);
