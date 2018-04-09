addEventListener("message", messageHandler, true);

var onmessage = function(e) {
    var d = e.data; //获取发送来的数据
    postMessage(d); //将获取到的数据发送回主线程
    console.log("23333333");
};


worker.addEventListener("error", errorHandler, true);

function errorHandler(e) {
    console.log(e.message, e);
}

function messageHandler(e) {
    postMessage("worker says:" + e.data + "too");
}