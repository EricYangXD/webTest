export const ERR_OK = 0;

// 解析hash模式地址中的参数
// 使用方式：getHashParameters().aa
export function getHashParameters() {
  var arr = (location.hash || '').replace(/^\#\/\?/, '').split('&')
  var params = {}
  for (var i = 0; i < arr.length; i++) {
    var data = arr[i].split('=')
    if (data.length == 2) {
      params[data[0]] = data[1]
    }
  }
  return params
}

// 解析history模式地址中的单个参数
export function getUrlParam(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); // 构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); // 匹配目标参数
  if (r != null) { return unescape(r[2]) }
  return null; // 返回参数值
}

/* 生成excel表格 */
export function madeExcel(res, excelName) {
  // 这里res是返回的blob对象     
  var blob = new Blob([res], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
  }); // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
  var downloadElement = document.createElement('a')
  var href = window.URL.createObjectURL(blob); // 创建下载的链接
  downloadElement.href = href
  downloadElement.download = excelName + '.xls'; // 下载后文件名
  document.body.appendChild(downloadElement)
  downloadElement.click(); // 点击下载
  document.body.removeChild(downloadElement); // 下载完成移除元素
  window.URL.revokeObjectURL(href); // 释放掉blob对象 
}

// 时间戳转化，使用moment.js/dayjs
/* 时间戳转化 yyyy-MM-dd HH:mm:ss*/
export function formatDateTime(inputTime) {
  if (!inputTime)
    return ''
  var date = new Date(inputTime)
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  var d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  var h = date.getHours()
  h = h < 10 ? ('0' + h) : h
  var minute = date.getMinutes()
  var second = date.getSeconds()
  minute = minute < 10 ? ('0' + minute) : minute
  second = second < 10 ? ('0' + second) : second
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
}

/* 时间戳转化 yyyy-MM-dd HH:mm  */
export function formatDateTimeShort(inputTime) {
  var date = new Date(inputTime)
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  var d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  var h = date.getHours()
  h = h < 10 ? ('0' + h) : h
  var minute = date.getMinutes()
  var second = date.getSeconds()
  minute = minute < 10 ? ('0' + minute) : minute
  second = second < 10 ? ('0' + second) : second
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute
}

/* 时间戳转化 0'00''*/
export function formatDateTimeShort2(inputTime) {
  var h = parseInt(inputTime / (60 * 60 * 1000))
  var minute = parseInt(inputTime / (60 * 1000) - h * 60)
  var second = parseInt(inputTime / 1000 - h * 60 * 60 - minute * 60)
  return h + "'" + minute + "'" + second + "''"
}

// 获取高德天气
export function getWeatherByCity(city, callback) {
  fetchJsonp('https://restapi.amap.com/v3/weather/weatherInfo?city=' + city + '&key=' + GLOBAL.amapKey)
    .then(function (response) {
      return response.json()
    }).then(function (json) {
      callback(json)
    }).catch(function (ex) {
      console.log('parsing failed', ex)
    })
}

export function calDuration(seconds) {
  var hour = seconds / 1000 / 60 / 60;
  var minute = Math.floor(seconds / 1000 / 60 % 60)
  var second = Math.floor(seconds / 1000 % 60)
  var ms = seconds % 1000;
  var timestr = '';
  if (hour > 24) {
    let day = Math.floor(hour / 24);
    timestr += day + '天'
  }
  hour = Math.floor(hour % 24);
  if (hour > 0) {
    timestr += hour + '小时';
  }
  if (hour > 0 || minute > 0) {
    timestr += minute + '分';
  }
  if (hour > 0 || minute > 0 || second > 0) {
    timestr += second + '秒';
  }
  if (ms > 0) {
    timestr += ms + '毫秒';
  }
  if (seconds <= 0) {
    return 0;
  } else {
    return timestr;
  }
}

export function calRotation(pt1, pt2, marker, map) {
  var deg = 0,
    curPos = map.pointToPixel(pt1),
    targetPos = map.pointToPixel(pt2)
  if (targetPos.x != curPos.x) {
    var tan = (targetPos.y - curPos.y) / (targetPos.x - curPos.x),
      atan = Math.atan(tan)
    deg = atan * 360 / (2 * Math.PI)
    if (targetPos.x < curPos.x) {
      deg = -deg + 90 + 90
    } else {
      deg = -deg
    }
    marker.setRotation(-deg)
  } else {
    var disy = targetPos.y - curPos.y
    var bias = 0
    if (disy > 0)
      bias = -1
    else if (disy < 0)
      bias = 1
    marker.setRotation(-bias * 90)
  }
}

export function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

export function formatSpeed(strSpeed) {
  let speed = strSpeed;
  let formatspeed = Number(strSpeed);
  if (typeof formatspeed === 'number' && !isNaN(formatspeed)) {
    speed = formatspeed.toFixed(1);
  }
  return speed;
}

// Date formatter
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}

// 判断是否为null,undefined,""
export function isNull(value) {
  return (
    typeof value == "undefined" ||
    value == "" ||
    value == null ||
    value == undefined
  );
}

// 百度逆地理编码   配合百度开发者APK_KEY
export function getAddressByCoords(lng, lat, callback) {
  fetchJsonp('https://api.map.baidu.com/geocoder/v2/?location=' + lat + ',' + lng + '&output=json&pois=1&ak=' + APK_KEY.baiduKey)
    .then(function (response) {
      return response.json();
    }).then(function (json) {
      callback(json);
    }).catch(function (ex) {
      console.log('parsing failed', ex);
    });
}

// 设置浏览器窗口全屏时，获取当前视口的宽高
export function getViewPort() {
  // 浏览器嗅探，document.compatMode="BackCompat"，为混杂模式
  // 如果文档处于“标准模式”或者“准标准模式(almost standards mode)”，则该属性为"CSS1Compat"
  if (document.compatMode == "BackCompat") {
    return {
      width: document.body.clientWidth,
      height: document.body.clientHeight
    };
  } else {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    };
  }
}
// 百度高德地图经纬度互转
//百度坐标转高德（传入经度、纬度）
export function bd_decrypt(bd_lng, bd_lat) {
  var X_PI = Math.PI * 3000.0 / 180.0;
  var x = bd_lng - 0.0065;
  var y = bd_lat - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
  var gg_lng = z * Math.cos(theta);
  var gg_lat = z * Math.sin(theta);
  return { lng: gg_lng, lat: gg_lat }
}
//高德坐标转百度（传入经度、纬度）
export function bd_encrypt(gg_lng, gg_lat) {
  var X_PI = Math.PI * 3000.0 / 180.0;
  var x = gg_lng, y = gg_lat;
  var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
  var bd_lng = z * Math.cos(theta) + 0.0065;
  var bd_lat = z * Math.sin(theta) + 0.006;
  return {
    bd_lat: bd_lat,
    bd_lng: bd_lng
  };
}


// 日期转换为UTC格式
export function date2UTC(date_str) {
  // var date = new Date(date_str);
  // var y = date.getUTCFullYear(); // 获取年：
  // var m = date.getUTCMonth(); // 获取月：
  // var d = date.getUTCDate(); // 获取日：
  // var h = date.getUTCHours(); // 获取小时：
  // var M = date.getUTCMinutes(); // 获取分钟：
  // var s = date.getUTCSeconds(); // 获取秒钟：
  // 将上面获取的日期数据转换为UTC时间（实际上为自1700年以来的毫秒数）
  // var utc = Date.UTC(y, m, d, h, M, s);
  // console.log(utc);
  //IE等浏览器中时间格式2018/12/09,chrome中2018-12-31和2018/02/01都可以。
  var utc = new Date(Date.parse(date_str.replace(/-/g, "/"))).getTime();
  return utc;
}

// UTC格式的日期转换为本地时间--小时:分钟:秒
export function UTC2hm(date_str) {
  var date = new Date(date_str).format("hh:mm:ss");
  return date;
}

// 解析url传参，全部参数键值对以对象的形式返回
export function parseUrlData() {
  var url = window.location.search; //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    var strs = str.split("&");
    // console.log(strs);
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}