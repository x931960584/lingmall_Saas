define(['../directives'],function(directives){
    directives.directive('upload', ['GoodsbrandService','$cookieStore',function(GoodsbrandService,$cookieStore) {
        return {
            restrict: 'A',
            scope: {
                logoUrl: '=logoUrl',
                imgUrlLogo: '=imgUrlLogo',
                showTit: '=showTit',
                imgShow: '=imgShow'
            },
            link: function(scope, element, attrs) {
                var domain = "";
                var uptoken = "";
                var getNewUptoken=function(){
                    GoodsbrandService.uploadToken().then(function(data){
                        domain=data.domain;
                        uptoken=data.token;
                        loader();
                    },function(data){
                        
                    })
                };
                getNewUptoken();
                var loader = function() {
                    var uploader = Qiniu.uploader({
                        runtimes: 'html5,flash,html4', // 上传模式，依次退化
                        browse_button: 'pickfiles', // 上传选择的点选按钮，必需
                        // 在初始化时，uptoken，uptoken_url，uptoken_func三个参数中必须有一个被设置
                        // 切如果提供了多个，其优先级为uptoken > uptoken_url > uptoken_func
                        // 其中uptoken是直接提供上传凭证，uptoken_url是提供了获取上传凭证的地址，如果需要定制获取uptoken的过程则可以设置uptoken_func
                        uptoken: uptoken, // uptoken是上传凭证，由其他程序生成
                        // uptoken_url: '/uptoken',         // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
                        // uptoken_func: function(file){    // 在需要获取uptoken时，该方法会被调用
                        //    // do something
                        //    return uptoken;
                        // },
                        get_new_uptoken: false, // 设置上传文件的时候是否每次都重新获取新的uptoken
                        // downtoken_url: '/downtoken',
                        // Ajax请求downToken的Url，私有空间时使用，JS-SDK将向该地址POST文件的key和domain，服务端返回的JSON必须包含url字段，url值为该文件的下载地址
                        //unique_names: true,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
                        save_key: true, // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
                        domain: domain, // bucket域名，下载资源时用到，必需
                        container: 'container', // 上传区域DOM ID，默认是browser_button的父元素
                        max_file_size: '100mb', // 最大文件体积限制
                        //flash_swf_url: 'path/of/plupload/Moxie.swf', //引入flash，相对路径
                        max_retries: 3, // 上传失败最大重试次数
                        dragdrop: true, // 开启可拖曳上传
                        drop_element: 'container', // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                        chunk_size: '4mb', // 分块上传时，每块的体积
                        auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                        /* x_vars: {
                         },*/
                        init: {
                            'FilesAdded': function(up, files) {
                                plupload.each(files, function(file) {
                                    // 文件添加进队列后，处理相关的事情
                                });
                            },
                            'BeforeUpload': function(up, file) {
                                // 每个文件上传前，处理相关的事情
                            },
                            'UploadProgress': function(up, file) {
                                // 每个文件上传时，处理相关的事情
                            },
                            'FileUploaded': function(up, file, info) {
                                // 每个文件上传成功后，处理相关的事情
                                var log = JSON.parse(info).domain + '/' + JSON.parse(info).key;
                                scope.logoUrl=log;
                                scope.showTit=false;
                                scope.imgShow=true;
                                scope.imgUrlLogo=log+'-hq500';
                                scope.$apply();

                            },
                            'Error': function(up, err, errTip) {
                                //上传出错时，处理相关的事情
                            },
                            'UploadComplete': function() {
                                //队列文件处理完毕后，处理相关的事情
                            },
                            /*'Key': function(up, file) {
                                // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                                // 该配置必须要在 unique_names: false , save_key: false 时才生效

                                var key = "";
                                // do something with key here
                                return key
                            }*/

                        }
                    });
                }
            }
        }
    }]);
})

