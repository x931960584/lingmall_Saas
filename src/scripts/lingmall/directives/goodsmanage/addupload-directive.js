define(['../directives'], function(directives) {
    directives.directive('addupload', ['growl', function(growl) {
        return {
            restrict: 'A',
            scope: {
                uploadOptions: '=uploadOptions',
                pageStatus: '=pageStatus'
            },
            link: function(scope, element, attrs) {
                element[0].style.left = (document.body.clientWidth - element[0].clientWidth) / 2 + 'px';
                var Qiniu1 = new QiniuJsSDK();
                var uploadOptions = scope.uploadOptions;
                uploadOptions.uploader = {};
                scope.safeApply = function(fn) {
                    var phase = this.$root.$$phase;
                    if (phase == '$apply' || phase == '$digest') {
                        if (fn && (typeof(fn) === 'function')) {
                            fn();
                        }
                    } else {
                        this.$apply(fn);
                    }
                };
                uploadOptions.initUpload = function(sku, type, x_vars) {
                    var compareSequence = uploadOptions.compareSequence;
                    var getUploadToken = function(sku, type, bundle_number, x_vars) {
                        uploadOptions.getUploadToken(type, bundle_number).then(function(data) {
                            if (!sku.img_sku_id) {
                                sku.img_sku_id = data.bundle_number;
                            }
                            var options = uploadOptions.options;
                            options.domain = data.domain;
                            options.uptoken = data.token;
                            if (x_vars) {
                                options.x_vars = x_vars;
                            }
                            (function initLeft(sku) {
                                options.browse_button = 'leftPickfiles';
                                options.container = 'leftInputContainer';
                                options.drop_element = 'leftContainer';
                                uploadOptions.uploader.leftUploader = Qiniu.uploader(options);
                                uploadOptions.uploader.leftUploader.bind('FileUploaded', function(up, file, info) {
                                    var response = angular.fromJson(info.response);
                                    var img_url = response.domain + '/' + response.key + '-hq500';
                                    console.log(response);
                                    var item = {
                                        bundle_number: response.bundle_number,
                                        bundle_pics_id: response.bundle_pics_id,
                                        key: response.key,
                                        classify: response.classify,
                                        sequence: response.sequence,
                                        img_url: img_url
                                    };
                                    uploadOptions.uploader.leftImgList.push(item);
                                    /*缩略图*/
                                    uploadOptions.getImgUrl(response.bundle_number);
                                    scope.safeApply();
                                });
                                uploadOptions.uploader.leftUploader.bind('BeforeUpload', function(up, file) {
                                    var sequence = 0;
                                    var params = up.getOption('multipart_params');
                                    if (uploadOptions.uploader.leftImgList.length) {
                                        sequence = compareSequence(uploadOptions.uploader.leftImgList, 'max').sequence - 0 + 1;
                                    } else {
                                        sequence = 1
                                    }
                                    params['x:sequence'] = sequence;
                                    params['x:classify'] = 1;
                                    up.setOption({ 'multipart_params': params });
                                });
                                uploadOptions.uploader.leftUploader.bind('UploadProgress', function(up, file) {
                                    scope.safeApply();
                                });
                                uploadOptions.uploader.leftUploader.bind('Error', function(up, err, errTip) {
                                    console.log(errTip);
                                });
                                uploadOptions.uploader.leftUploaderFiles = [];
                                uploadOptions.uploader.leftImgList = [];
                            })(sku);
                            (function initRight(sku) {
                                options.browse_button = 'rightPickfiles';
                                options.container = 'rightInputContainer';
                                options.drop_element = 'rightContainer';
                                uploadOptions.uploader.rightUploader = Qiniu1.uploader(options);
                                uploadOptions.uploader.rightUploader.bind('FileUploaded', function(up, file, info) {
                                    var response = angular.fromJson(info.response);
                                    var img_url = response.domain + '/' + response.key + '-hq500';
                                    var item = {
                                        bundle_number: response.bundle_number,
                                        bundle_pics_id: response.bundle_pics_id,
                                        key: response.key,
                                        classify: response.classify,
                                        sequence: response.sequence,
                                        img_url: img_url
                                    };
                                    uploadOptions.uploader.rightImgList.push(item);
                                    scope.safeApply();
                                });
                                uploadOptions.uploader.rightUploader.bind('BeforeUpload', function(up, file) {
                                    var sequence = 0;
                                    var params = up.getOption('multipart_params');
                                    if (uploadOptions.uploader.rightImgList.length) {
                                        sequence = compareSequence(uploadOptions.uploader.rightImgList, 'max').sequence - 0 + 1;
                                    } else {
                                        sequence = 1;
                                    }
                                    params['x:sequence'] = sequence;
                                    params['x:classify'] = 6;
                                    up.setOption({ 'multipart_params': params });
                                });
                                uploadOptions.uploader.rightUploader.bind('UploadProgress', function(up, file) {
                                    // 每个文件上传时，处理相关的事情
                                    scope.safeApply();
                                });
                                uploadOptions.uploader.rightUploader.bind('Error', function(up, err, errTip) {
                                    console.log(errTip);
                                });
                                uploadOptions.uploader.rightUploaderFiles = [];
                                uploadOptions.uploader.rightImgList = [];
                            })(sku);
                            if (sku.img_sku_id) {
                                getPicsList(sku, type, sku.img_sku_id, x_vars);
                            }
                        });
                    };
                    var getPicsList = function(sku, type, img_sku_id, x_vars) {
                        var getImg = function(obj) {
                            return {
                                bundle_number: obj.bundle_number,
                                bundle_pics_id: obj.bundle_pics_id,
                                key: obj.key,
                                classify: obj.classify,
                                sequence: obj.sequence,
                                img_url: obj.domain + '/' + obj.key + '-thumbnail100'
                            };
                        };
                        uploadOptions.getPicsList(img_sku_id).then(function(data) {
                            if (data.length) {
                                var len = data.length;
                                for (var i = 0; i < len; i++) {
                                    if (data[i].classify == 1) {
                                        var item = getImg(data[i]);
                                        uploadOptions.uploader.leftImgList.push(item);
                                    }
                                    if (data[i].classify == 6) {
                                        var item = getImg(data[i]);
                                        uploadOptions.uploader.rightImgList.push(item);
                                    }
                                }
                            }
                        });
                    };
                    getUploadToken(sku, type, sku.img_sku_id, x_vars);
                };
                uploadOptions.isHTML5 = !!(File && FormData);
                uploadOptions.fileInputClick = function(input) {
                    var input = document.getElementById(input);
                    input.click();
                };
                uploadOptions.options = {
                    runtimes: 'html5,flash,html4', // 上传模式，依次退化
                    browse_button: '', // 上传选择的点选按钮，必需
                    // 在初始化时，uptoken，uptoken_url，uptoken_func三个参数中必须有一个被设置
                    // 切如果提供了多个，其优先级为uptoken > uptoken_url > uptoken_func
                    // 其中uptoken是直接提供上传凭证，uptoken_url是提供了获取上传凭证的地址，如果需要定制获取uptoken的过程则可以设置uptoken_func
                    uptoken: '', // uptoken是上传凭证，由其他程序生成
                    // uptoken_url: '/uptoken',         // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
                    // uptoken_func: function(file){    // 在需要获取uptoken时，该方法会被调用
                    //    // do something
                    //    return uptoken;
                    // },
                    get_new_uptoken: false, // 设置上传文件的时候是否每次都重新获取新的uptoken
                    // downtoken_url: '/downtoken',
                    // Ajax请求downToken的Url，私有空间时使用，JS-SDK将向该地址POST文件的key和domain，服务端返回的JSON必须包含url字段，url值为该文件的下载地址
                    // unique_names: true,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
                    save_key: true, // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
                    domain: '', // bucket域名，下载资源时用到，必需
                    container: '', // 上传区域DOM ID，默认是browser_button的父元素
                    max_file_size: '20mb', // 最大文件体积限制
                    //flash_swf_url: 'path/of/plupload/Moxie.swf', //引入flash，相对路径
                    max_retries: 3, // 上传失败最大重试次数
                    dragdrop: true, // 开启可拖曳上传
                    drop_element: '', // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                    // chunk_size: '', // 分块上传时，每块的体积
                    auto_start: false, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                    multi_selection: true, //是否允许同时选择多文件
                    //文件类型过滤，这里限制为图片类型
                    filters: {
                        mime_types: [
                            { title: "Image files", extensions: "jpg,jpeg,gif,png" }
                        ]
                    },
                    x_vars: {
                        //查看自定义变量
                        classify: 1, //1->主图 6->详情图, project_id 为3时必传
                        type: 1, //1->原始图 2->已修图, project_id 为3时必传
                        sequence: 1, //各分类图片顺序: 1 2 3..., project_id 为3时必传
                    },
                    init: {
                        'FilesAdded': function(up, files) {
                            plupload.each(files, function(file) {
                                if (up.settings.container == 'leftInputContainer') {
                                    uploadOptions.checkCount('left', 15, '商品主图不允许超过15张', file);
                                }
                                if (up.settings.container == 'rightInputContainer') {
                                    uploadOptions.checkCount('right', 5, '商品详情图不允许超过5张', file);
                                }
                                scope.safeApply();
                            });
                        },
                        'BeforeUpload': function(up, file) {
                            // 每个文件上传前，处理相关的事情
                        },
                        'UploadProgress': function(up, file) {
                            // 每个文件上传时，处理相关的事情
                        },
                        'FileUploaded': function(up, file, info) {},
                        'Error': function(up, err, errTip) {
                            //上传出错时，处理相关的事情
                            console.log(err);
                        },
                        'UploadComplete': function() {
                            //队列文件处理完毕后，处理相关的事情
                        },
                        'Key': function(up, file) {
                            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                            // 该配置必须要在unique_names: false，save_key: false时才生效

                            var key = "";
                            // do something with key here
                            return key
                        }
                    }
                };
                uploadOptions.showUploadBox = function(sku) {
                    uploadOptions.uploader.leftImgList = [];
                    uploadOptions.uploader.rightImgList = [];
                    uploadOptions.uploader.leftUploaderFiles = [];
                    uploadOptions.uploader.rightUploaderFiles = [];
                    if (uploadOptions.uploader.leftUploader) {
                        uploadOptions.uploader.leftUploader.destroy();
                    };
                    if (uploadOptions.uploader.rightUploader) {
                        uploadOptions.uploader.rightUploader.destroy();
                    };
                    if (!sku.sku_id) {
                        uploadOptions.getSkuId().then(function(data) {
                            sku.sku_id = data.sku_id;
                            scope.uploadOptions.initUpload(sku, 3, '');
                            uploadOptions.uploadBox = true;
                        }, function() {
                            /*通过接口获取SKUID失败时的友好提示*/
                            growl.addErrorMessage('调用商品图片服务失败,请稍后重试');
                        });
                    } else {
                        scope.uploadOptions.initUpload(sku, 3, '');
                        uploadOptions.uploadBox = true;
                    }
                };
                uploadOptions.removeFile = function(files, file, index, up) {
                    uploadOptions.uploader[up + 'Uploader'].removeFile(file);
                    files.splice(index, 1);
                };
                uploadOptions.removeAllFiles = function(up) {
                    var len = uploadOptions.uploader[up + 'UploaderFiles'].length;
                    uploadOptions.uploader[up + 'Uploader'].splice(0, len);
                    uploadOptions.uploader[up + 'UploaderFiles'].splice(0, len);
                };
                uploadOptions.compareSequence = function(imgList, type) {
                    var len = imgList.length;
                    var result = {
                        bundle_number: '',
                        key: '',
                        classify: '',
                        sequence: 0,
                        img_url: ''
                    };
                    if (len) {
                        if (len > 1) {
                            for (var i = 1; i < len; i++) {
                                if ((imgList[i - 1].sequence - imgList[i].sequence) < 0) {
                                    if (type == 'max') {
                                        result = imgList[i];
                                    }
                                    if (type == 'min') {
                                        result = imgList[i - 1];
                                    }
                                } else {
                                    if (type == 'max') {
                                        result = imgList[i - 1];
                                    }
                                    if (type == 'min') {
                                        result = imgList[i];
                                    }
                                }
                            }
                        } else {
                            result = imgList[0];
                        }
                    }
                    return result;
                };
                uploadOptions.checkCount = function(up, max, msg, file) {
                    var uploaderFilesLen = uploadOptions.uploader[up + 'UploaderFiles'].length;
                    var successCount = 0;
                    for (var i = 0; i < uploaderFilesLen; i++) {
                        if (uploadOptions.uploader[up + 'UploaderFiles'][i].status == 5) {
                            successCount++;
                        }
                    }
                    var imgListLen = uploadOptions.uploader[up + 'ImgList'].length;
                    var count = uploaderFilesLen + imgListLen - successCount;
                    if (count < max) {
                        uploadOptions.uploader[up + 'UploaderFiles'].push(file);
                    } else {
                        uploadOptions.uploader[up + 'Uploader'].removeFile(file);
                        growl.addErrorMessage(msg);
                    }
                }
            }
        }
    }]).directive('uploadContainer', [function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var uploadContainer = element[0];
                var uploadArea = element.find('div.upload-area')[0];

                function styleReset() {
                    uploadContainer.style.border = '';
                }

                function initHandlers() {
                    uploadContainer.addEventListener('drop', handleDrop, false);
                    uploadContainer.addEventListener('dragover', handleDragOver, false);
                    uploadContainer.addEventListener('dragleave', handleDragLeave, false);
                }

                function handleDragOver(event) {
                    event.stopPropagation();
                    event.preventDefault();
                    uploadContainer.style.border = '2px dashed red';
                }

                function handleDragLeave(event) {
                    event.stopPropagation();
                    event.preventDefault();
                    styleReset();
                }

                function handleDrop(event) {
                    // event.stopPropagation();
                    // event.preventDefault();
                    styleReset();
                }
                initHandlers();
            }
        };
    }]);
});
