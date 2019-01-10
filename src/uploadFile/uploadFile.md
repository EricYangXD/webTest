#### 在一个客户的webapp项目中需要用到 html5调用手机摄像头，找了很多资料，大都是 js调用api  然后怎样怎样，做了几个demo测试发现根本不行， 后来恍然大悟，用html5自带的 input file=""  ，纯html5，并且不涉及到js ，就可以实现。代码如下：

    <input type="file" accept="image/*" capture="camera">
    <input type="file" accept="video/*" capture="camcorder">
    <input type="file" accept="audio/*" capture="microphone">

    capture表示，可以捕获到系统默认的设备，比如：camera--照相机；camcorder--摄像机；microphone--录音。
    accept表示，直接打开系统文件目录。

其实html5的input:file标签还支持一个multiple属性，表示可以支持多选，如：

        <input type="file" accept="image/*" multiple>

加上这个multiple后，capture就没啥用了，因为multiple是专门yong用来支持多选的。

PC端上传文件多半用插件，引入flash都没关系，但是移动端要是还用各种冗余的插件估计得被喷死，项目里面需要做图片上传的功能，既然H5已经有相关的接口且兼容性良好，当然优先考虑用H5来实现。

用的技术主要是：

HTML结构：

    <div class="camera-area">
        <form enctype="multipart/form-data" method="post">
            <input type="file" name="fileToUpload" class="fileToUpload" accept="image/*" capture="camera"/>
            <div class="upload-progress"><span></span></div>
        </form>
        <div class="thumb"></div>
    </div>

已经封装好的upload.js，依赖zepto:

    (function($) {
    $.extend($.fn, {
        fileUpload: function(opts) {
        this.each(function() {
            var $self = $(this);
            var doms = {
            "fileToUpload": $self.find(".fileToUpload"),
            "thumb": $self.find(".thumb"),
            "progress": $self.find(".upload-progress")
            };
            var funs = {
            //选择文件，获取文件大小，也可以在这里获取文件格式，限制用户上传非要求格式的文件
            "fileSelected": function() {
                var files = (doms.fileToUpload)[0].files;
                var count = files.length;
                for (var index = 0; index < count; index++) {
                var file = files[index];
                var fileSize = 0;
                if (file.size > 1024 * 1024)
                    fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
                else
                    fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
                }
                funs.uploadFile();
            },
            //异步上传文件
            uploadFile: function() {
                var fd = new FormData();//创建表单数据对象
                var files = (doms.fileToUpload)[0].files;
                var count = files.length;
                for (var index = 0; index < count; index++) {
                var file = files[index];
                fd.append(opts.file, file);//将文件添加到表单数据中
                funs.previewImage(file);//上传前预览图片，也可以通过其他方法预览txt
                }
                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener("progress", funs.uploadProgress, false);//监听上传进度
                xhr.addEventListener("load", funs.uploadComplete, false);
                xhr.addEventListener("error", opts.uploadFailed, false);
                xhr.open("POST", opts.url);
                xhr.send(fd);
            },
            //文件预览
            previewImage: function(file) {
                var gallery = doms.thumb;
                var img = document.createElement("img");
                img.file = file;
                doms.thumb.html(img);
                // 使用FileReader方法显示图片内容
                var reader = new FileReader();
                reader.onload = (function(aImg) {
                return function(e) {
                    aImg.src = e.target.result;
                };
                })(img);
                reader.readAsDataURL(file);
            },
            uploadProgress: function(evt) {
                if (evt.lengthComputable) {
                var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                doms.progress.html(percentComplete.toString() + '%');
                }
            },
            "uploadComplete": function(evt) {
                alert(evt.target.responseText)
            }
            };
            doms.fileToUpload.on("change", function() {
            doms.progress.find("span").width("0");
            funs.fileSelected();
            });
        });
        }
    });
    })(Zepto);

调用方法：

    $(".camera-area").fileUpload({
        "url": "savetofile.php",
        "file": "myFile"
    });

PHP部分：

    <?php
        if (isset($_FILES['myFile'])) {
            // Example:
            writeLog($_FILES);
            move_uploaded_file($_FILES['myFile']['tmp_name'], "uploads/" . $_FILES['myFile']['name']);
            echo 'successful';
        }
        function writeLog($log){
            if(is_array($log) || is_object($log)){
                $log = json_encode($log);
            }
            $log = $log."\r\n";
            file_put_contents('log.log', $log,FILE_APPEND);
        }
    ?>