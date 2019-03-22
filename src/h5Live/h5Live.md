## H5 live test

> 介绍一下 HTML5 直播的东西

    <video controls autoplay>
        <source src="http://devimages.apple.com/iphone/samples/bipbop/masterplaylist.m3u8" type="application/vnd.apple.mpegurl" />
        <p class="warning">Your browser does not support HTML5 video.</p>
    </video>

### 直播协议

常用的直播协议有很多种，比如 RTMP，HLS，HTTP-FLV。不过，最常用的还是 HLS 协议，因为支持度高，技术简单，但是延迟非常严重。这对一些对实时性比较高的场景，比如运动赛事直播来说非常蛋疼。

#### 1. HLS：支持性广；延时巨高；10s 以上

全称是 HTTP Live Streaming。这是 Apple 提出的直播流协议。HLS 由两部分构成，一个是 .m3u8 文件，一个是 .ts 视频文件（TS 是视频文件格式的一种）。整个过程是，浏览器会首先去请求 .m3u8 的索引文件，然后解析 m3u8，找出对应的 .ts 文件链接，并开始下载。
使用方式为：

    <video controls autoplay>
        <source src="http://devimages.apple.com/iphone/samples/bipbop/masterplaylist.m3u8" type="application/vnd.apple.mpegurl" />
        <p class="warning">Your browser does not support HTML5 video.</p>
    </video>

直接可以将 m3u8 写进 src 中，然后交由浏览器自己去解析。当然，我们也可以采取 fetch 来手动解析并获取相关文件。HLS 详细版的内容比上面的简版多了一个 playlist，也可以叫做 master。在 master 中，会根据网络段实现设置好不同的 m3u8 文件，比如，3G/4G/wifi 网速等。一个 master 文件中大家只要关注 BANDWIDTH（带宽）字段，其他的看一下字段内容大致就清楚了。假如这里选择 high.m3u8 文件，那么，里面内容为：

    #EXTM3U#EXT-X-VERSION:6#EXT-X-TARGETDURATION:10#EXT-X-MEDIA-SEQUENCE:26#EXTINF:9.901,http://media.example.com/wifi/segment26.ts#EXTINF:9.901,http://media.example.com/wifi/segment27.ts#EXTINF:9.501,http://media.example.com/wifi/segment28.ts

注意，其中以 ts 结尾的链接就是我们在直播中真正需要播放的视频文件。该第二级的 m3u8 文件也可以叫做 media 文件。该文件，其实有三种类型：

    1. live playlist: 动态列表。该列表是动态变化的，里面的 ts 文件会实时更新，并且过期的 ts 索引会被删除。默认，情况下都是使用动态列表。
    2. event playlist: 静态列表。它和动态列表主要区别就是，原来的 ts 文件索引不会被删除，该列表是不断更新，而且文件大小会逐渐增大。它会在文件中，直接添加 #EXT-X-PLAYLIST-TYPE:EVENT 作为标识。
    3. VOD playlist: 全量列表。它就是将所有的 ts 文件都列在 list 当中。如果，使用该列表，就和播放一整个视频没有啥区别了。它是使用 #EXT-X-ENDLIST 表示文件结尾。

#### HLS 中的延时包括：

-   TCP 握手
-   m3u8 文件下载
-   m3u8 文件下所有 ts 文件下载

HLS 总的延时是非常令人绝望的。那解决办法有吗？ 有，很简单，要么减少每个 ts 文件播放时长，要么减少 m3u8 的中包含 ts 的数量。如果超过平衡点，那么每次请求新的 m3u8 文件时，都会加上一定的延时，所以，这里需要根据业务指定合适的策略。当然，现在由于 mediaSource 的普及，自定义一个播放器也没有多大的难度，这样就可以保证直播延迟性的同时，完成直播的顺利进行。

### 对比

RTMP：延时性好，灵活；量大的话，负载较高；1s 以上。
全称为：Real-Time Messaging Protocol。它是基于 FLV 格式进行开发的。RTMP 内部是借由 TCP 长连接协议传输相关数据，所以，它的延时性非常低。并且，该协议灵活性非常好（所以，也很复杂），它可以根据 message stream ID 传输数据，也可以根据 chunk stream ID 传递数据。两者都可以起到流的划分作用。流的内容也主要分为：视频，音频，相关协议包等。

HTTP-FLV：延时性好，游戏直播常用；只能在手机 APP 播放；2s 以上。
该协议和 RTMP 比起来其实差别不大，只是落地部分有些不同：RTMP 是直接将流的传输架在 RTMP 协议之上，而 HTTP-FLV 是在 RTMP 和客户端之间套了一层转码的过程，由于每个 FLV 文件是通过 HTTP 的方式获取的，所以它通过抓包得出的协议头需要使用 chunked 编码。

### 前端音视频流

前端音视频流: MSE 全称就是 Media Source Extensions。它是一套处理视频流技术的简称，里面包括了一系列 API：Media Source，Source Buffer 等。在没有 MSE 出现之前，前端对 video 的操作，仅仅局限在对视频文件的操作，而并不能对视频流做任何相关的操作。现在 MSE 提供了一系列的接口，使开发者可以直接提供 media stream。

视频格式应该不用多说，就是我们通常所说的 .mp4,.flv,.ogv,.webm 等。

视频压缩格式和视频格式具体的区别就是，它是将原始的视频码流变为可用的数字编码。

常用的编码方式分为三种：

-   变换编码：消除图像的帧内冗余。
-   运动估计和运动补偿：消除帧间冗余。
-   熵编码：提高压缩效率。

视频帧编解码中最终要的两个属性：

-   pts(presentation time stamps): 显示时间戳，显示器从接受到解码到显示的时间。
-   dts(decoder timestamps): 解码时间戳。也表示该 sample 在整个流中的顺序。

MS 整个只挂载了 4 个属性，3 个方法和 1 个静态测试方法。

4 个属性：

-   sourceBuffers: 获得当前创建出来的 SourceBuffer.
-   activeSourceBuffers: 获得当前正处于激活状态的 SourceBuffer.
-   readyState: 返回当前 MS 的状态，比如: closed,open,ended.
-   duration: 设置当前 MS 的播放时长。

3 个方法：

-   addSourceBuffer(): 根据给定的 MIME 创建指定类型的 SourceBuffer.
-   removeSourceBuffer(): 将 MS 上指定的 SourceBuffer 移除。
-   endOfStream(): 直接终止该流。

1 个静态测试方法：

-   isTypeSupported(): 主要用来判断指定的音频的 MIME 是否支持。

最基本的就是使用 addSourceBuffer 该方法来获得指定的 SourceBuffer。

    var sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');

一旦利用 MS 创建好 SourceBuffer 之后，后续的工作就是将额外获得的流放进 Buffer 里面进行播放即可。所以，SourceBuffer 提供两个最基本的操作 appendBuffer，remove。之后，我们就可以通过 appendBuffer 直接将 ArrayBuffer 放进去即可。音视频的 ArrayBuffer 通过 MediaSource 和 SourceBuffer 的处理直接将\<audio> && \<video> 接入。然后，就可以实现正常播放的效果。

如何了解到某台电脑使用的是大字节还是小字节呢？（其实大部分都是小字节）。可以使用

```

const LE = (function() {
let buf = new ArrayBuffer(2);
(new DataView(buf)).setInt16(0, 256, true); // little-endian write
return (new Int16Array(buf))[0] === 256; // platform-spec read, if equal then LE
})();

```

AB(ArrayBuffer) 不是像 NodeJS 的 Buffer 对象一样是一个纯粹的集合流处理的工具。它只是一个流的容器，这也是底层 V8 实现的内容。基本用法就是给实例化一个固定的内存区：

    new ArrayBuffer(length)

AB 提供了一个非常重要的方法：slice()

slice() 和 Array 对象上的 slice 方法一样也是将数组中的一部分新创建一个副本返回。

## 代码示例

    var vidElement = document.querySelector('video');

    if (window.MediaSource) {
        // 创建一个 MS
        // MS(MediaSource) 可以理解为多个视频流的管理工具。以前，我们只能下载一个清晰度的流，并且不能平滑切换低画质或者高画质的流，而现在我们可以利用 MS 实现这里特性。
        var mediaSource = new MediaSource();
        // URL.createObjectURL() 只是将底层的流（MS）和 video.src 连接中间者，一旦两者连接到一起之后，该对象就没用了。
        vidElement.src = URL.createObjectURL(mediaSource);
        // 创建实例都是同步的，但是底层流和 video.src 的连接时异步的。MS 提供了一个 sourceopen 事件给我们进行这项异步处理。
        mediaSource.addEventListener('sourceopen', sourceOpen);
    } else {
        console.log("The Media Source Extensions API is not supported.")
    }

    function sourceOpen(e) {
        // 一旦连接到一起之后，该 URL object 就没用了，处于内存节省的目的，可以使用 URL.revokeObjectURL(vidElement.src) 销毁指定的 URL object。
        URL.revokeObjectURL(vidElement.src);
        // 使用 addSourceBuffer(mime) 来设置相关的编码器
        var mime = 'video/webm; codecs="opus, vp9"';
        var mediaSource = e.target;
        // addSourceBuffer()用来返回一个具体的视频流，接受一个 mimeType 表示该流的编码格式
        var sourceBuffer = mediaSource.addSourceBuffer(mime);
        var videoUrl = 'droid.webm';
        // 然后通过，异步拉取相关的音视频流
        // 如果视频已经传完了，而相关的 Buffer 还在占用内存，这时候，就需要我们显示的中断当前的 Buffer 内容。那么最终我们的异步处理结果变为：
        fetch(videoUrl)
            .then(function(response) {
                return response.arrayBuffer();
            })
            .then(function(arrayBuffer) {
                sourceBuffer.addEventListener('updateend', function(e) {
                    if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
                        mediaSource.endOfStream();
                    }
                });
                sourceBuffer.appendBuffer(arrayBuffer);
            });
    }

sourceBuffer 是直接和视频流有交集的 API。例如：

    function sourceOpen (_) {
        var mediaSource = this;
        var sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
        fetchAB(assetURL, function (buf) {
        sourceBuffer.addEventListener('updateend', function (_) {
            mediaSource.endOfStream();
            video.play();
        });
        // 通过 fetch 添加视频 Buffer
        sourceBuffer.appendBuffer(buf);
        });
    };

它通过 appendBuffer 直接添加视频流，实现播放。不过，在使用 addSourceBuffer 创建之前，还需要保证当前浏览器是否支持该编码格式。

#### removeSourceBuffer()

用来移除某个 sourceBuffer。移除也主要是考虑性能原因，将不需要的流移除以节省相应的空间，格式为：

    mediaSource.removeSourceBuffer(sourceBuffer);

#### endOfStream()

用来表示接受的视频流的停止，注意，这里并不是断开，相当于只是下好了一部分视频，然后你可以进行播放。此时，MS 的状态变为：ended。例如：

    var mediaSource = this;
    var sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
    fetchAB(assetURL, function (buf) {
    sourceBuffer.addEventListener('updateend', function (_) {
        mediaSource.endOfStream(); // 结束当前的接受
        video.play(); // 可以播放当前获得的流
    });
    sourceBuffer.appendBuffer(buf);
    });

#### sTypeSupported()

该是用来检测当前浏览器是否支持指定视频格式的解码。格式为：
var isItSupported = mediaSource.isTypeSupported(mimeType); // 返回值为 Boolean
mimeType 可以为 type 或者 type + codec。例如：
不同的浏览器支持不一样，不过基本的类型都支持。
MediaSource.isTypeSupported('audio/mp3'); // false，这里应该为 audio/mpeg
MediaSource.isTypeSupported('video/mp4'); // true
MediaSource.isTypeSupported('video/mp4; codecs="avc1.4D4028, mp4a.40.2"'); // true

    MS 的状态，当 MS 从创建开始，都会自带一个 readyState 属性，用来表示其当前打开的状态。MS 有三个状态：
    closed: 当前 MS 没有和 media element(比如：video.src) 相关联。创建时，MS 就是该状态。
    open: source 打开，并且准备接受通过 sourceBuffer.appendBuffer 添加的数据。
    ended: 当 endOfStream() 执行完成，会变为该状态，此时，source 依然和 media element 连接。
    var mediaSource = new MediaSource;
    mediaSource.readyState; // 默认为 closed
    当由 closed 变为 open 状态时，需要监听 sourceopen 事件。
    video.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener('sourceopen', sourceOpen);
    MS 针对这几个状态变化，提供了相关的事件：sourceopen，sourceended，sourceclose。

#### MS 属性

比较常用的属性有: duration，readyState。

1. duration: 获得当前媒体播放的时间，既可以设置(get)，也可以获取(set)。单位为 s(秒)

```
mediaSource.duration = 5.5; // 设置媒体流播放的时间
var myDuration = mediaSource.duration; // 获得媒体流开始播放的时间
```

在实际应用中为：

    sourceBuffer.addEventListener('updateend', function (_) {
        mediaSource.endOfStream();
        mediaSource.duration = 120; // 设置当前流播放的时间
        video.play();
    });

2. readyState: 获得当前 MS 的状态。取值上面已经讲过了: closed，open，ended。

```
var mediaSource = new MediaSource;
//此时的 mediaSource.readyState 状态为 closed
```

以及：

    sourceBuffer.addEventListener('updateend', function (_) {
        mediaSource.endOfStream(); // 调用该方法后结果为：ended
        video.play();
    });

除了上面两个属性外，还有 sourceBuffers，activeSourceBuffers 这两个属性。用来返回通过 addSourceBuffer() 创建的 SourceBuffer 数组。

#### SourceBuffer

SourceBuffer 是由 mediaSource 创建，并直接和 HTMLMediaElement 接触。简单来说，它就是一个流的容器，里面提供的 append()，remove() 来进行流的操作，它可以包含一个或者多个 media segments。
