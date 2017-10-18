## html5 web notification ##

    类似微信网页版的消息提醒：
    原理：

    var notification = new Notification(title, options);//title: 必传, options: 可选
    options={body,tag,icon,data,vibrate,renotify,silent,sound,noscreen,sticky,dir,lang};//google it
    Notification.permission;//default -> "default"
    Notification.requestPermission();

    HTML代码：
    <button id="button">有人想加你为好友</button>
    <p id="text"></p>
    JS代码：
    if (window.Notification) {
        var button = document.getElementById('button'), text = document.getElementById('text');
        var popNotice = function() {
            if (Notification.permission == "granted") {
                var notification = new Notification("Hello, friend：", {
                    body: 'Nice to see U!',
                    icon: 'http://image.zhangxinxu.com/image/study/s/s128/mm1.jpg'
                });
                notification.onclick = function() {
                    text.innerHTML = 'Now ' + new Date().toTimeString().split(' ')[0] + ' , we are real friends.';
                    notification.close();
                };
                notification.onshow = function() {
                    console.log('notification shows up'); 
                    setTimeout(function() {
                        notification.close();
                    }, 5000);
                };
                notification.onerror = function() {
                    console.log('notification encounters an error');
                };
            }
        };
        button.onclick = function() {
            if (Notification.permission == "granted") {
                popNotice();
            } else if (Notification.permission != "denied") {
                Notification.requestPermission(function (permission) {
                popNotice();
                });
            }
        };
    } else {
        alert('浏览器不支持Notification');
    }

    传统的闪烁浏览器网页标签的方式：
    js 示例：
    var isShine=true;
    var titleInit="新标签页";
    setInterval(function() {
        var title = document.title;
        if (isShine == true) {
            if (/你有新消息/.test(title) == false) {
                document.title = '【你有新消息】';
            } else {
                document.title = '【　　　　　】';
            }
        } else {
            document.title = titleInit;
        }
    }, 500);
