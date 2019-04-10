/*client*/
//基本与服务端类似
const dgram = require("dgram");
const client = dgram.createSocket("udp4");
// const multicastAddr = "192.168.8.106";
// const multicastAddr = "127.0.0.1";
const multicastAddr = "224.100.100.100";

client.on("close", () => {
    console.log("socket已关闭");
});

client.on("error", err => {
    console.log(err);
});
client.on("listening", () => {
    console.log("socket正在监听中...");
    client.addMembership(multicastAddr);
});
client.on("message", (msg, rinfo) => {
    console.log(`receive message from ${rinfo.address}:${rinfo.port}：${msg}`);
});
client.bind(8061);
