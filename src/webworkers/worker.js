addEventListener("message", messageHandler, true);

var onmessage = function (e) {
    var d = e.data; //获取发送来的数据
    postMessage(d); //将获取到的数据发送回主线程
    console.log("23333333");
};


worker.addEventListener("error", errorHandler, true);

// worker.onerror(function (event) {
//     console.log([
//       'ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message
//     ].join(''));
//   });

//   // 或者
//   worker.addEventListener('error', function (event) {
//     // ...
//   });

// Worker 内部也可以监听error事件。

function errorHandler(e) {
    console.log(e.message, e);
}

function messageHandler(e) {
    postMessage("worker says:" + e.data + "too");
}

// 7.1 主线程
// 浏览器原生提供Worker()构造函数，用来供主线程生成 Worker 线程。

// var myWorker = new Worker(jsUrl, options);
// Worker()构造函数，可以接受两个参数。第一个参数是脚本的网址（必须遵守同源政策），该参数是必需的，且只能加载 JS 脚本，否则会报错。第二个参数是配置对象，该对象可选。它的一个作用就是指定 Worker 的名称，用来区分多个 Worker 线程。

// // 主线程
// var myWorker = new Worker('worker.js', { name : 'myWorker' });

// // Worker 线程
// self.name // myWorker
// Worker()构造函数返回一个 Worker 线程对象，用来供主线程操作 Worker。Worker 线程对象的属性和方法如下。

// Worker.onerror：指定 error 事件的监听函数。
// Worker.onmessage：指定 message 事件的监听函数，发送过来的数据在Event.data属性中。
// Worker.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
// Worker.postMessage()：向 Worker 线程发送消息。
// Worker.terminate()：立即终止 Worker 线程。

// 7.2 Worker 线程
// Web Worker 有自己的全局对象，不是主线程的window，而是一个专门为 Worker 定制的全局对象。因此定义在window上面的对象和方法不是全部都可以使用。

// Worker 线程有一些自己的全局属性和方法。

// self.name： Worker 的名字。该属性只读，由构造函数指定。
// self.onmessage：指定message事件的监听函数。
// self.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
// self.close()：关闭 Worker 线程。
// self.postMessage()：向产生这个 Worker 线程发送消息。
// self.importScripts()：加载 JS 脚本。