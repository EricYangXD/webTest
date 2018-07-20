/* 
    收集日常开发中常用的函数，github上有underscore、lodash、Licia、Sugar、30-seconds-of-code等众多库。

*/

/* 
    1、字符串长度截取 
 */
function cutstr(str, len) {
    var temp, icount = 0,
        patrn = /[^\x00-\xff]/,
        strre = "";
    for (var i = 0; i < str.length; i++) {
        if (icount < len - 1) {
            temp = str.substr(i, 1);
            if (patrn.exec(temp) == null) {
                icount = icount + 1;
            } else {
                icount = icount + 2;
            }
            strre += temp;
        } else {
            break;
        }
    }
    return strre + "...";
}
// cutstr("qwe12312asd", 5);//qwe1...

/* 
    2、替换全部
*/
String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}
// "asdasda2223sdf".replaceAll("s","9");//"a9da9da22239df"

/* 
    3、 清除空格
 */
String.prototype.trim = function () {
    var reExtraSpace = /^\s*(.*?)\s+$/;
    return this.replace(reExtraSpace, "$1");
}
// "asdadad     adas     ".trim();// "asdadad     adas"

/* 
    4、 清除左空格 / 右空格
 */
function ltrim(s) {
    return s.replace(/^(\s*|　*)/, "");
}

function rtrim(s) {
    return s.replace(/(\s*|　*)$/, "");
}
// ltrim("    999    ");//"999   "
// rtrim("    999    ");//"   999"

/* 
    5、 判断是否以某个字符串开头
 */
String.prototype.startWith = function (s) {
    return this.indexOf(s) == 0;
}


/* 
    6、 判断是否以某个字符串结束
 */
String.prototype.endWith = function (s) {
    var d = this.length - s.length;
    return (d >= 0 && this.lastIndexOf(s) == d);
}


/* 
    7、 转义html标签
 */
function HtmlEncode(text) {
    return text.replace(/&/g, '&').replace(/\"/g, '"').replace(/</g, '<').replace(/>/g, '>');
}


/* 
    8、 时间日期格式转换
 */
Date.prototype.Format = function (formatStr) {
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];
    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));
    str = str.replace(/MM/, (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
    str = str.replace(/M/g, (this.getMonth() + 1));
    str = str.replace(/w|W/g, Week[this.getDay()]);
    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/d|D/g, this.getDate());
    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/h|H/g, this.getHours());
    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
    str = str.replace(/m/g, this.getMinutes());
    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
    str = str.replace(/s|S/g, this.getSeconds());
    return str;
}


/* 
    9、 判断是否为数字类型
 */
function isDigit(value) {
    var patrn = /^[0-9]*$/;
    if (patrn.exec(value) == null || value == "") {
        return false;
    } else {
        return true;
    }
}


/* 
    10、 设置cookie值
 */
function setCookie(name, value, Hours) {
    var d = new Date();
    var offset = 8;
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var nd = utc + (3600000 * offset);
    var exp = new Date(nd);
    exp.setTime(exp.getTime() + Hours * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString() + ";domain=baidu.com;";
}
// 获取cookie值
function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    return null;
}


/* 
    11、 加入收藏夹
 */
function AddFavorite(sURL, sTitle) {
    try {
        window.external.addFavorite(sURL, sTitle);
    } catch (e) {
        try {
            window.sidebar.addPanel(sTitle, sURL, "");
        } catch (e) {
            alert("加入收藏失败，请使用Ctrl+D进行添加");
        }
    }
}


/* 
    12、 设为首页
 */
function setHomepage() {
    if (document.all) {
        document.body.style.behavior = 'url(#default#homepage)';
        document.body.setHomePage('http://www.baidu.com');
    } else if (window.sidebar) {
        if (window.netscape) {
            try {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            } catch (e) {
                alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true");
            }
        }
        var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
        prefs.setCharPref('browser.startup.homepage', 'http://www.baidu.com');
    }
}


/* 
    13、 加载样式文件
 */
function LoadStyle(url) {
    try {
        document.createStyleSheet(url);
    } catch (e) {
        var cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.type = 'text/css';
        cssLink.href = url;
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(cssLink);
    }
}


/* 14、 返回脚本内容
 */
function evalScript(s) {
    if (s.indexOf('<script') == -1) return s;
    var p = /<script[^\>]*?>([^\x00]*?)<\/script>/ig;
    var arr = [];
    while (arr = p.exec(s)) {
        var p1 = /<script[^\>]*?src=\"([^\>]*?)\"[^\>]*?(reload=\"1\")?(?:charset=\"([\w\-]+?)\")?><\/script>/i;
        var arr1 = [];
        arr1 = p1.exec(arr[0]);
        if (arr1) {
            appendscript(arr1[1], '', arr1[2], arr1[3]);
        } else {
            p1 = /<script(.*?)>([^\x00]+?)<\/script>/i;
            arr1 = p1.exec(arr[0]);
            appendscript('', arr1[2], arr1[1].indexOf('reload=') != -1);
        }
    }
    return s;
}


/* 
    15、 清除脚本内容
 */
function stripScript(s) {
    return s.replace(/<script.*?>.*?<\/script>/ig, '');
}


/* 
    16、 动态加载脚本文件
 */
function appendScript(src, text, reload, charset) {
    var id = hash(src + text);
    if (!reload && in_array(id, evalscripts)) return;
    if (reload && $(id)) {
        $(id).parentNode.removeChild($(id));
    }
    evalscripts.push(id);
    var scriptNode = document.createElement("script");
    scriptNode.type = "text/javascript";
    scriptNode.id = id;
    scriptNode.charset = charset ? charset : (BROWSER.firefox ? document.characterSet : document.charset);
    try {
        if (src) {
            scriptNode.src = src;
            scriptNode.Done = false;
            scriptNode. = function () {
                scriptNode.Done = true;
                JSLOADED[src] = 1;
            };
            scriptNode.onreadystatechange = function () {
                if ((scriptNode.readyState == 'loaded' || scriptNode.readyState == 'complete') && !scriptNode.Done) {
                    scriptNode.Done = true;
                    JSLOADED[src] = 1;
                }
            };
        } else if (text) {
            scriptNode.text = text;
        }
        document.getElementsByTagName('head')[0].appendChild(scriptNode);
    } catch (e) {
        console.log("error: ", e);
    }
}


/* 
    17、返回按ID检索的元素对象 
*/
function $(id) {
    return !id ? null : document.getElementById(id);
}


/* 
    18、跨浏览器绑定事件 
*/
function addEventSamp(obj, evt, fn) {
    if (!oTarget) {
        return;
    }
    if (obj.addEventListener) {
        obj.addEventListener(evt, fn, false);
    } else if (obj.attachEvent) {
        obj.attachEvent('on' + evt, fn);
    } else {
        oTarget["on" + sEvtType] = fn;
    }
}


/* 
    19、跨浏览器删除事件
 */
function delEvt(obj, evt, fn) {
    if (!obj) {
        return;
    }
    if (obj.addEventListener) {
        obj.addEventListener(evt, fn, false);
    } else if (oTarget.attachEvent) {
        obj.attachEvent("on" + evt, fn);
    } else {
        obj["on" + evt] = fn;
    }
}


/* 
    20、元素添加on方法
 */
Element.prototype.on = Element.prototype.addEventListener;
NodeList.prototype.on = function (event, fn) {
    []['forEach'].call(this, function (el) {
        el.on(event, fn);
    });
    return this;
};


/* 
    Currying
    1.存取arguments对象通常要比存取命名参数要慢一点
    2.一些老版本的浏览器在arguments.length的实现上是相当慢的
    3.使用fn.apply( … ) 和 fn.call( … )通常比直接调用fn( … ) 稍微慢点
    4.创建大量嵌套作用域和闭包函数会带来花销，无论是在内存还是速度上
*/
function Currying(fn) {
    // 缓存队列
    var _args = [];
    return function cb() {
        // 不传参数时返回方法的执行
        if (arguments.length === 0) {
            return fn.apply(this, _args);
        }
        Array.prototype.push.apply(_args, arguments);
        return cb;
    }
}
// Curry add
function add() {
    var args = [].slice.call(arguments);
    var fn = function () {
        var arg_fn = [].slice.call(arguments);
        return add.apply(null, args.concat(arg_fn));
    }
    fn.valueOf = function () {
        return args.reduce((a, b) => a + b);
    }
    return fn;
}


/* 
    Chunk
*/
const chunk = (arr, size) =>
    Array.from({
            length: Math.ceil(arr.length / size)
        }, (v, i) =>
        arr.slice(i * size, i * size + size)
    );
// chunk([1, 2, 3, 4, 5], 2); // [[1,2],[3,4],[5]]


/* 
    数组打乱
*/
//A
function randomArr(arr) {
    return arr.sort(function () {
        return 0.5 - Math.random();
    });
}
// randomArr([0,1,2,3,4,5,6,7,8]);// (9) [6, 0, 1, 3, 2, 7, 4, 5, 8]
//B
function getArrRandomly(arr) {
    var len = arr.length;
    //首先从最小的数开始遍历，之后递增
    for (var i = 0; i < len; i++) {
        var randomIndex = Math.floor(Math.random() * (len - i)); //这里一定要注意，后面不管是（i+1）还是（len-i），它们是时变的。
        var itemAtIndex = arr[randomIndex];
        arr[randomIndex] = arr[i];
        arr[i] = itemAtIndex;
    }
    //每一次遍历，都相当于把从数组中随机抽取（不重复，因为）一个元素放到数组的最前面（索引顺序为0，1，2...len-1）
    return arr;
}
getArrRandomly([0, 1, 2, 3, 4, 5, 6, 7, 8]); //[8, 6, 2, 5, 4, 3, 7, 0, 1]