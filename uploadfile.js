/**
 * 原生js图片上传-iframe异步
 * html：
 * <div id="uploadFormBox" action="{:U('Car/qasend')}" upload_format="image"><input type="file" name="uploadFile" value="" id="uploadImgFile" /></div>
 * upload_format可以单独限制上传：image
 * js调用：
 * uploadFile.init([{ box : 'uploadFormBox', fileBtn : 'uploadImgFile', calback : onUploadCalback },,,,,]);
 * //图片上传
 * @type {Object}
 */
var uploadFile = {
    iframeName: 'uploadImgIframe',
    formName: 'uploadImgForm',
    uploadFileName: '',
    uploadFileBoxId: '',
    //2M  图片限制
    maxsize_img: 2 * 1024 * 1024,
    //图片限制提示
    errMsg_img: "上传的文件不能超过2M！",
    errMsg_img2: "请选择正确的图片资源进行上传！",
    //10M 其他上传限制
    maxsize_other: 10 * 1024 * 1024,
    //其他限制提示
    errMsg_other: "上传的文件不能超过10M！",
    //浏览器提示
    tipMsg: "您的浏览器暂不支持计算上传文件的大小，建议使用IE10+、FireFox、Chrome浏览器。",

    init: function (params) {
        if (typeof (params) == 'underfind') {
            console.log('uploadFile未找到参数');
            return;
        }
        if (params.length < 1) {
            console.log('uploadFile参数长度小于1');
            return;
        }
        this.params = params;
        for (var i = 0 ; i < params.length; i++) {
            if (!params[i].box) {
                alert('uploadFile未找到参数params[' + i + '].box');
                break;
            }
            if (!params[i].fileBtn) {
                alert('uploadFile未找到参数params[' + i + '].file');
                break;
            }
            if (!$('#'+params[i].box).attr('action')) {
                alert('params[' + i + '].box未设置action');
                break;
            }
            var fileBtn = $('#'+params[i].fileBtn);
            if (!fileBtn.attr('uploadfile_isload')) {
                fileBtn.attr('uploadfile_isload', '1');

                var box = $('#'+params[i].box);
                var form = $('<form>');

                form.attr('action', box.attr('action'));
                form.attr('enctype', 'multipart/form-data');
                form.attr('method', 'post');
                form.attr('target', uploadFile.iframeName + i);
                form.attr('id', uploadFile.formName + i);
                form.html(box.html());
                box.html('');
                box.append(form);

                fileBtn = $('#' + params[i].fileBtn);
                //检测上传格式
                if(box.attr('upload_format')){
                    fileBtn.attr('upload_format', box.attr('upload_format'));
                    box.removeAttr('upload_format');
                }
                fileBtn.bind('change', uploadFile._onFileBtnChange);
            }
        }

    },
    _onFileBtnChange: function () {
        if (!uploadFile._checkUpload(this)) {
            return;
        }
        uploadFileName = this.value;
        uploadFileBoxId = $(this).closest('form').parent().attr('id');
        var form = this.parentNode;
        var formTarget = form.getAttribute('target');
        var res = uploadFile._appendIframe(formTarget);
        if (res) {
            dialog_loading.set({ content: '正在努力上传中..' }).show();
            form.submit();
        }
    },
    _checkUpload: function (obj_file) {
        //获取对应索引号
        var i = $(obj_file).closest('form').attr('id').split(uploadFile.formName)[1];
        //文件格式
        var fileSuffix = obj_file.value.substring(obj_file.value.lastIndexOf('.') + 1).toLocaleLowerCase();
        //如果有上传限制
        var upload_format = $(obj_file).attr('upload_format');
        if (upload_format && upload_format != '') {
            //其他格式+限制判断
            switch (upload_format) {
                case 'image':
                    //图片格式
                    if (/jpg|jpeg|png|gif|bmp/.test(fileSuffix)) {
                        return uploadFile._checkUpload_IMG(obj_file);
                    } else {
                        dialog.set({
                            content: uploadFile.errMsg_img2,
                            onHideCalBack: function () {
                                uploadFile._clear(i);
                            }
                        }).show();
                        return false;
                    }
                    break;
                default:
                    //限制不匹配
                    if (/jpg|jpeg|png|gif|bmp/.test(fileSuffix)) {
                        return uploadFile._checkUpload_IMG(obj_file);
                    } else {
                        return uploadFile._checkUpload_OTHER(obj_file);
                    }
                    break;

            }
        } else {
            //如果没有上传限制
            if (/jpg|jpeg|png|gif|bmp/.test(fileSuffix)) {
                return uploadFile._checkUpload_IMG(obj_file);
            } else {
                return uploadFile._checkUpload_OTHER(obj_file);
            }
        }
        
    },
    _checkUpload_IMG: function (obj_file) {
        //获取对应索引号
        var i = $(obj_file).closest('form').attr('id').split(uploadFile.formName)[1];
        //验证上传-不支持ie10以下
        if (myfunc.getUA().userAgent_part == 'msie 8.0' || myfunc.getUA().userAgent_part == 'msie 9.0') {
            return true;
        }
        try {
            var filesize = obj_file.files[0].size;
            if (!filesize || filesize == -1) {
                dialog.set({
                    content: uploadFile.tipMsg,
                    onHideCalBack: function () {
                        uploadFile._clear(i);
                    }
                }).show();
                return false;
            } else if (filesize > uploadFile.maxsize_img) {
                dialog.set({
                    content: uploadFile.errMsg_img,
                    onHideCalBack: function () {
                        uploadFile._clear(i);
                    }
                }).show();
                return false;
            }
        } catch (e) {
            dialog.set({
                content: uploadFile.tipMsg,
                onHideCalBack: function () {
                    uploadFile._clear(i);
                }
            }).show();
            return false;
        }
        return true;
    },
    _checkUpload_OTHER: function (obj_file) {
        //获取对应索引号
        var i = $(obj_file).closest('form').attr('id').split(uploadFile.formName)[1];
        //验证上传-不支持ie10以下
        if (myfunc.getUA().userAgent_part == 'msie 8.0' || myfunc.getUA().userAgent_part == 'msie 9.0') {
            return true;
        }
        try {
            var filesize = obj_file.files[0].size;
            if (!filesize || filesize == -1) {
                dialog.set({
                    content: uploadFile.tipMsg,
                    onHideCalBack: function () {
                        uploadFile._clear(i);
                    }
                }).show();
                return false;
            } else if (filesize > uploadFile.maxsize_other) {
                dialog.set({
                    content: uploadFile.errMsg_other,
                    onHideCalBack: function () {
                        uploadFile._clear(i);
                    }
                }).show();
                return false;
            }
        } catch (e) {
            dialog.set({
                content: uploadFile.tipMsg,
                onHideCalBack: function () {
                    uploadFile._clear(i);
                }
            }).show();
            return false;
        }
        return true;
    },
    _getUploadImgIframe: function (iframeId) {
        var i = iframeId.split(uploadFile.iframeName)[1];
        var iframeDoc = '';
        //如果是ie
        if (document.all) {
            try{
                iframeDoc = document.frames[iframeId].document;
            } catch (e) {
                //这里报错可能是上传的文件大小超过了服务器限制导致404或者500错误；
                dialog_loading.hide();
                uploadFile._clear(i);
                dialog.set({ content: '请检查上传文件的大小和格式！' }).show();
                return;
            }
        } else {
            iframeDoc = document.getElementById(iframeId).contentDocument;
        }
        //ie10
        if (!iframeDoc) {
            iframeDoc = document.getElementById(iframeId).contentDocument;
        }
        
        uploadFile._getIframeHtml(iframeDoc, i);
    },
    _getIframeHtml: function (iframeDoc, i) {
        var html = iframeDoc.body.innerHTML;
        //多一次判断兼容ie+firefox
        if (html == '') {
            setTimeout(function () {
                uploadFile._getIframeHtml(iframeDoc, i);
            }, 500);
            return;
        }
        var responseJson = null;
        try {
            //上传成功
            var div = document.createElement('div');
            div.innerHTML = html;
            if (div.children.length > 0) {
                html = div.children[0].innerHTML;
            }
            responseJson = eval('(' + html + ')');
            responseJson.uploadFileName = uploadFileName;
            responseJson.uploadFileBoxId = uploadFileBoxId;
            //获取响应数据
            if (typeof (uploadFile.params[i].calback) == 'function') {
                //回调响应json
                dialog_loading.hide();
                uploadFile.params[i].calback(responseJson);
            }

        } catch (e) {
            alert(e.message);
        }
        uploadFile._clear(i);
    },
    _appendIframe: function (formTarget) {
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.name = formTarget;
        iframe.id = formTarget;
        document.body.appendChild(iframe);
        //兼容ie8
        if (iframe.attachEvent) {
            iframe.attachEvent("onload", function () { uploadFile._getUploadImgIframe(iframe.id); });
        } else {
            //需在此调用iframe的onload方法 兼容ie+firefox
            iframe.onload = function () { uploadFile._getUploadImgIframe(iframe.id); };
        }
        return true;
    },
    //根据索引号清除iframe、更新input-file
    _clear: function (i) {
        var iframe = $('#' + uploadFile.iframeName + i);
        iframe.remove();
        var oldFileBtn = $('#' + uploadFile.params[i].fileBtn);
        var box = oldFileBtn.parent();
        var fileBtn = $('<input>')
            .attr('type', 'file')
            .attr('name', oldFileBtn.attr('name'))
            .attr('id', oldFileBtn.attr('id'));
        
        if (oldFileBtn.attr('uploadfile_isload')) {
            fileBtn.attr('uploadfile_isload', oldFileBtn.attr('uploadfile_isload'));
        }
        if (oldFileBtn.attr('upload_format')) {
            fileBtn.attr('upload_format', oldFileBtn.attr('upload_format'));
        }
        fileBtn.bind('change', uploadFile._onFileBtnChange);
        oldFileBtn.after(fileBtn);
        oldFileBtn.remove();
        return true;
    }

};