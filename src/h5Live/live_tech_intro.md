### 三种主流流媒体协议(RTMP，RTSP，HTTP)比较

> 摘要：当前，流媒体直播和点播中常用到的协议有 rtmp，rtsp 和 http 等，rtmp 比较简单，应用性更广，客户端需要用到 Aodbe 的 flash 插件来观看，rtsp 协议一般对实时性要求高，支持 h.264 和 H.265 以及其他形式的编解码，实用性更强，客户端一般需要自己做或者用 vlc，ffplayer 等。http 一般用到 flv_over_http，mp4_over_http，或者 ts_over_http，或者 hls 等。

一、介绍
当前，流媒体直播和点播中常用到的协议有 rtmp，rtsp 和 http 等，rtmp 比较简单，应用性更广，客户端需要用到 Aodbe 的 flash 插件来观看，rtsp 协议一般对实时性要求高，支持 h.264 和 H.265 以及其他形式的编解码，实用性更强，客户端一般需要自己做或者用 vlc，ffplayer 等。http 一般用到 flv_over_http，mp4_over_http，或者 ts_over_http，或者 hls 等。

二、协议介绍
1、HTTP 协议:
HTTP 的视频协议，主要是在互联网普及之后。在互联网上看视频的需求下形成的。
最初的 HTTP 视频协议，没有任何特别之处，就是通用的 HTTP 文件渐进式下载。本质就是下载视频文件，而利用视频文件本身的特点，就是存在头部信息，和部分视频帧数据，就完全可以解码播放了。显然这种方式需要将视频文件的头部信息放在文件的前面。有些例如 faststart 工具，就是专门做这个功能的。
但是最为原始的状态下，视频无法进行快进或者跳转播放到文件尚未被下载到的部分。这个时候对 HTTP 协议提出了 range-request 的要求。这个目前几乎所有 HTTP 的服务器都支持了。range-request，是请求文件的部分数据，指定偏移字节数。在视频客户端解析出视频文件的头部后，就可以判断后续视频相应的帧的位置了。或者根据码率等信息，计算相应的为位置。

优点：
HTTP Live Streaming 还有一个巨大优势：自适应码率流播（adaptive streaming）。效果就是客户端会根据网络状况自动选择不同码率的视频流，条件允许的情况下使用高码率，网络繁忙的时候使用低码率，并且自动在二者间随意切换。这对移动设备网络状况不稳定的情况下保障流畅播放非常有帮助。实现方法是服务器端提供多码率视频流，并且在列表文件中注明，播放器根据播放进度和下载速度自动调整。使用起来也非常简单。
缺点：
实时性相对较差，直播的时候延迟比较高。当然，现在进化出来的 flv_over_http 或者 ts_over_http 也可以做到直播延时很低，基本和 rtmp 协议差不多。

2、RTSP 协议：
用于 Internet 上针对多媒体数据流的一种传输协议，是 TCP/IP 协议体系中的一个应用层协议，RTSP 在体系结构上位于 RTP 和 RTCP 之上，它使用 TCP 或 UDP 完成数据传输，该协议定义了一对多应用程序如何有效地通过 IP 网络传送多媒体数据。
本协议是最早的视频传输协议。其中 RTSP 协议用于视频点播的会话控制，例如发起点播请求的 SETUP 请求，进行具体播放操作的 PLAY、PAUSE 请求，视频的跳转也是通过 PLAY 请求的参数支持的。

优点：
RTSP 协议族的优势，在于可以控制到视频帧，因此可以承载实时性很高的应用。这个优点是相对于 HTTP 方式的最大优点。H.323 视频会议协议，底层一般采用 RTSP 协议。RTSP 协议族的复杂度主要集中在服务器端，因为服务器端需要 parse 视频文件，seek 到具体的视频帧，而且可能还需要进行倍速播放（就是老旧的 DVD 带的那种 2 倍速，4 倍速播放的功能），倍速播放功能是 RTSP 协议独有的，其他视频协议都无法支持。
缺点：
就是服务器端的复杂度也比较高，实现起来也比较复杂。Ios 端不支持该协议。

3、RTMP 协议：
RTMP 是 Real Time Messaging Protocol（实时消息传输协议）的首字母缩写。RTMP(Real Time Messaging Protocol)实时消息传送协议是 Adobe Systems 公司为 Flash 播放器和服务器之间音频、视频和数据传输 开发的开放协议。该协议基于 TCP，是一个协议族，包括 RTMP 基本协议及 RTMPT/RTMPS/RTMPE 等多种变种。RTMP 是一种设计用来进行实时数据通信的网络协议，主要用来在 Flash/AIR 平台和支持 RTMP 协议的流媒体/交互服务器之间进行音视频和数据通信。支持该协议的软件包括 Adobe Media Server/Aoku Media Server/red5/Wowza 等。

优点：
支持直播、点播

缺点:

需要专用的服务器。

三、协议对比
关于三个 RTMP，RTSP，HTTP 的对比：
1.RTMP 是 adobe 的，RTSP 是 android native 支持，http 协议。
2.RTMP 和 HTTP 有 adaptive streaming 的技术，RTSP 没有
3.RTSP 实时性是最好的，HTTP 实时性比较差。
4.ios 不支持 rtsp，安卓支持。

四、总结
三种协议各有优缺点，rtmp 协议应用范围比较窄，一般客户端需要用 flash 接收，rtsp 一般常用于监控领域和对实时性要求比较高的场合，http 的延伸 hls 用的比较多，一般用在移动终端观看，一般一个成熟的流媒体服务系统都需要支持这三种协议，甚至更多的协议，比如 udp 组播，单播，或者 p2p 协议等。
Aoku Media Server 是可以同时支持这三种流媒体协议的。是国内为数不多的专业流媒体服务系统，提供的免费版可以供用户进行三种协议的测试对比