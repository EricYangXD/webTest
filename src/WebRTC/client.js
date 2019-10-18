// const mediaStreamContrains = {
//     video: true,
//     audio: false
// };

// const mediaStreamContrains = {
//     video: {
//         frameRate: {min: 20},
//   	    width: {min: 640, ideal: 1280},
//   	    height: {min: 360, ideal: 720},
//   		aspectRatio: 16/9
//     },
//     audio: {
//         echoCancellation: true,
//         noiseSuppression: true,
//         autoGainControl: true
//     }
// };

// const localVideo = document.querySelector("video");

// function gotLocalMediaStream(mediaStream) {
//     localVideo.srcObject = mediaStream;
// }

// function handleLocalMediaStreamError(error) {
//     console.log("navigator.getUserMedia error: ", error);
// }

// // 判断浏览器是否支持这些 API
// if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
//     console.log("enumerateDevices() not supported.");
//     // return false;
// }

// // 枚举 cameras and microphones.
// navigator.mediaDevices
//     .enumerateDevices()
//     .then(function(deviceInfos) {
//         // 打印出每一个设备的信息
//         deviceInfos.forEach(function(deviceInfo) {
//             console.log(
//                 deviceInfo.kind +
//                     ": " +
//                     deviceInfo.label +
//                     " id = " +
//                     deviceInfo.deviceId
//             );
//         });
//     })
//     .catch(function(err) {
//         console.log(err.name + ": " + err.message);
//     });

// // 在浏览器中访问音视频设备,返回一个Promise对象
// navigator.mediaDevices
//     .getUserMedia(mediaStreamContrains)
//     .then(gotLocalMediaStream)
//     .catch(handleLocalMediaStreamError);
"use strict";

// 获取 HTML 页面中的 video 标签
var videoplay = document.querySelector("video#player");

// 播放视频流
function gotMediaStream(stream) {
    videoplay.srcObject = stream;
}

function handleError(err) {
    console.log("getUserMedia error:", err);
}

// 对采集的数据做一些限制
var constraints = {
    video: {
        width: 1280,
        height: 720,
        frameRate: 15
    },
    audio: false
};

// 采集音视频数据流
navigator.mediaDevices
    .getUserMedia(constraints)
    .then(gotMediaStream)
    .catch(handleError);

var picture = document.querySelector("canvas#picture");
picture.width = 640;
picture.height = 480;

picture
    .getContext("2d")
    .drawImage(videoplay, 0, 0, picture.width, picture.height);

function downLoad(url) {
    var oA = document.createElement("a");
    oA.download = "photo"; // 设置下载的文件名，默认是'下载'
    oA.href = url;
    document.body.appendChild(oA);
    oA.click();
    oA.remove(); // 下载之后把创建的元素删除
}

document.querySelector("button#save").onclick = function() {
    downLoad(canvas.toDataURL("image/jpeg"));
};

var filtersSelect = document.querySelector("select#filter");

picture.className = filtersSelect.value;
// 录制音视频流

var buffer;

// 当该函数被触发后，将数据压入到 blob 中
function handleDataAvailable(e) {
    if (e && e.data && e.data.size > 0) {
        buffer.push(e.data);
    }
}

function startRecord() {
    buffer = [];

    // 设置录制下来的多媒体格式
    var options = {
        mimeType: "video/webm;codecs=vp8"
    };

    // 判断浏览器是否支持录制
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not supported!`);
        return;
    }

    try {
        // 创建录制对象
        mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e) {
        console.error("Failed to create MediaRecorder:", e);
        return;
    }

    // 当有音视频数据来了之后触发该事件
    mediaRecorder.ondataavailable = handleDataAvailable;
    // 开始录制
    mediaRecorder.start(10);
}
// 回放录制文件

var blob = new Blob(buffer, { type: "video/webm" });
recvideo.src = window.URL.createObjectURL(blob);
recvideo.srcObject = null;
recvideo.controls = true;
recvideo.play();
// 下载录制好的文件

btnDownload.onclick = () => {
    var blob = new Blob(buffer, { type: "video/webm" });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement("a");

    a.href = url;
    a.style.display = "none";
    a.download = "aaa.webm";
    a.click();
};
// 抓取桌面截图

var promise = navigator.mediaDevices.getDisplayMedia(constraints);
// 二者唯一的区别就是：一个是getDisaplayMedia，另一个是getUserMedia。
// 这两个API都需要一个constraints参数来对采集的桌面 / 视频做一些限制。
// 但需要注意的是，在采集视频时，参数constraints也是可以对音频做限制的，而在桌面采集的参数里却不能对音频进行限制了，
// 也就是说，不能在采集桌面的同时采集音频。这一点要特别注意。

// 得到桌面数据流
var localStream;
function getDeskStream(stream) {
    localStream = stream;
}

// 抓取桌面
function shareDesktop() {
    // 只有在 PC 下才能抓取桌面
    if (IsPC()) {
        // 开始捕获桌面数据
        navigator.mediaDevices
            .getDisplayMedia({ video: true })
            .then(getDeskStream)
            .catch(handleError);

        return true;
    }

    return false;
}

var deskVideo = document.querySelector("video/deskVideo");
function getDeskStream(stream) {
    localStream = stream;
    deskVideo.srcObject = stream;
}
