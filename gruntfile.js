// Gruntfile
/*jslint devel: true, node: true, white:true */
module.exports = function(grunt) {
    'use strict';
    require('load-grunt-tasks')(grunt);
    var config = {
        nodeModules: 'node_modules',
        vendor: 'bower_components',
        src: 'src',
        release: 'release'
    };
    Date.prototype.Format = function(fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };
    var urlArgs = 'v1.0_' + (new Date().Format('yyyyMMdd')) + '_' + (new Date()).getTime();
    grunt.initConfig({
        config: config,
        clean: {
            src: ['<%= config.src %>/scripts/vendor/', '<%= config.src %>/assets/css/main.css', '<%= config.src %>/assets/css/lingmall/lingmall.css'],
            releaseAll: ['<%= config.release %>/'],
            releaseLess: ['<%= config.release %>/assets/less'],
            releaseCss: ['<%= config.release %>/assets/css/*/','<%= config.release %>/assets/css/main.css'],
            releaseJs: ['<%= config.release %>/libs.js']
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
            },
            all: [
                'Gruntfile.js',
                '<%= config.src %>/scripts/{,*/}*.js',
                '!<%= config.src %>/scripts/vendor/{,*/}*.js'
            ]
        },
        less: {
            build: {
                options: {
                    compress: false,
                    yuicompress: false
                },
                files: {
                    '<%= config.src %>/assets/css/lingmall/lingmall.css': '<%= config.src %>/assets/less/**/*.less',
                }
            }
        },
        concat: {
            css: {
                src: ['<%= config.src %>/assets/css/**/*.css'],
                dest: '<%= config.src %>/assets/css/main.css'
            },
            cssRelease: {
                src: ['<%= config.release %>/assets/css/main.css'],
                dest: '<%= config.release %>/assets/css/' + urlArgs + '.css'
            },
            urlArgs: {
                src: ['<%= config.release %>/libs.js'],
                dest: '<%= config.release %>/' + urlArgs + '.js'
            }
        },
        copy: {
            vendor: {
                files: [{
                    'expand': true,
                    'cwd': '<%=config.vendor%>/requirejs',
                    'src': 'require.js',
                    'dest': '<%=config.src%>/scripts/vendor/requirejs'
                }, {
                    'expand': true,
                    'cwd': '<%=config.vendor%>/jquery',
                    'src': 'jquery.js',
                    'dest': '<%=config.src%>/scripts/vendor/jquery'
                }, {
                    'expand': true,
                    'cwd': '<%=config.vendor%>/underscore',
                    'src': 'underscore.js',
                    'dest': '<%=config.src%>/scripts/vendor/underscore'
                }, {
                    'expand': true,
                    'cwd': '<%=config.vendor%>/angular-loading-bar/build',
                    'src': 'loading-bar.js',
                    'dest': '<%=config.src%>/scripts/vendor/angular-loading-bar'
                }, {
                    'expand': true,
                    'cwd': '<%=config.vendor%>/angular',
                    'src': 'angular.js',
                    'dest': '<%=config.src%>/scripts/vendor/angular'
                }, {
                    'expand': true,
                    'cwd': '<%=config.vendor%>/angular-ui-router/release',
                    'src': 'angular-ui-router.js',
                    'dest': '<%=config.src%>/scripts/vendor/angular-ui-router'
                }, {
                    'expand': true,
                    'cwd': '<%=config.vendor%>/angular-growl/build',
                    'src': 'angular-growl.js',
                    'dest': '<%=config.src%>/scripts/vendor/angular-growl'
                }, {
                    'expand': true,
                    'cwd': '<%=config.vendor%>/angular-animate',
                    'src': 'angular-animate.js',
                    'dest': '<%=config.src%>/scripts/vendor/angular-animate'
                }, {
                    'expand': true,
                    'cwd': '<%=config.vendor%>/angular-cookies',
                    'src': 'angular-cookies.js',
                    'dest': '<%=config.src%>/scripts/vendor/angular-cookies'
                }, {
                    'expand': true,
                    'cwd': '<%=config.vendor%>/angular-translate',
                    'src': 'angular-translate.js',
                    'dest': '<%=config.src%>/scripts/vendor/angular-translate'
                }, {
                    'expand': true,
                    'cwd': '<%=config.vendor%>/angular-sanitize',
                    'src': 'angular-sanitize.js',
                    'dest': '<%=config.src%>/scripts/vendor/angular-sanitize'
                }, {
                    'expand': true,
                    'cwd': '<%=config.vendor%>/angular-bootstrap',
                    'src': 'ui-bootstrap.js',
                    'dest': '<%=config.src%>/scripts/vendor/angular-bootstrap'
                }, {
                    'expand': true,
                    'cwd': '<%=config.vendor%>/angular-bootstrap',
                    'src': 'ui-bootstrap-tpls.js',
                    'dest': '<%=config.src%>/scripts/vendor/angular-bootstrap'
                }, {
                    'expand': true,
                    'cwd': '<%=config.vendor%>/angular-md5',
                    'src': 'angular-md5.js',
                    'dest': '<%=config.src%>/scripts/vendor/angular-md5'
                }, {
                    'expand': true,
                    'cwd': '<%=config.vendor%>/qiniu/dist',
                    'src': 'qiniu.min.js',
                    'dest': '<%=config.src%>/scripts/vendor/plupload'
                }, {
                    'expand': true,
                    'cwd': '<%=config.vendor%>/plupload/js',
                    'src': 'plupload.full.min.js',
                    'dest': '<%=config.src%>/scripts/vendor/plupload'
                },{
                    'expand': true,
                    'cwd': '<%=config.vendor%>/file-saver/',
                    'src': 'FileSaver.js',
                    'dest': '<%=config.src%>/scripts/vendor/file-saver'
                }]
            },
            css: {
                files: [{
                    'expand': true,
                    'cwd': '<%=config.vendor%>/font-awesome/css',
                    'src': 'font-awesome.css',
                    'dest': '<%=config.src%>/assets/css/font-awesome'
                }, {
                    'expand': true,
                    'cwd': '<%=config.vendor%>/angular-loading-bar/build',
                    'src': 'loading-bar.css',
                    'dest': '<%=config.src%>/assets/css/angular-loading-bar'
                }]
            },
            fonts: {
                files: [{
                    'expand': true,
                    'cwd': '<%=config.vendor%>/font-awesome/fonts',
                    'src': '*.*',
                    'dest': '<%=config.src%>/assets/fonts'
                }]
            },
            images: {
                files: [{
                    'expand': true,
                    'cwd': '<%=config.src%>/assets/images',
                    'src': '*.*',
                    'dest': '<%=config.release%>/assets/images'
                }]
            }
        },
        requirejs: {
            compile: {
                options: {
                    appDir: '<%= config.src%>',
                    baseUrl: './',
                    mainConfigFile: '<%= config.src%>/main.js',
                    dir: '<%=config.release%>',
                    removeCombined: true,
                    preserveLicenseComments: true,
                    optimizeCss: 'standard',
                    cssImportIgnore: null,
                    paths: {
                        'app': 'app',
                        'bootstrap': 'bootstrap',
                        'main': 'main',
                        'controllers': 'scripts/lingmall/controllers/controllers',
                        'controllers/_base': 'scripts/lingmall/controllers/_base',
                        'directives': 'scripts/lingmall/directives/directives',
                        'directives/_base': 'scripts/lingmall/directives/_base',
                        'states': 'scripts/lingmall/states/states',
                        'states/_base': 'scripts/lingmall/states/_base',
                        'services': 'scripts/lingmall/services/services',
                        'services/_base': 'scripts/lingmall/services/_base',
                        'jquery': 'scripts/vendor/jquery/jquery',
                        'underscore': 'scripts/vendor/underscore/underscore',
                        'angular': 'scripts/vendor/angular/angular',
                        'ui.router': 'scripts/vendor/angular-ui-router/angular-ui-router',
                        'angular-loading-bar': 'scripts/vendor/angular-loading-bar/loading-bar',
                        'angular.animate': 'scripts/vendor/angular-animate/angular-animate',
                        'angular.cookies': 'scripts/vendor/angular-cookies/angular-cookies',
                        'angular.translate': 'scripts/vendor/angular-translate/angular-translate',
                        'angular.sanitize': 'scripts/vendor/angular-sanitize/angular-sanitize',
                        'angular.growl': 'scripts/vendor/angular-growl/angular-growl',
                        'ui.bootstrap': 'scripts/vendor/angular-bootstrap/ui-bootstrap',
                        // 'ui.bootstrap.tpls': 'scripts/vendor/angular-ui-bootstrap/ui-bootstrap-tpls-1.3.3',
                        'angular.md5': 'scripts/vendor/angular-md5/angular-md5',
                        'plupload.full': 'scripts/vendor/plupload/plupload.full.min',
                        'qiniu': 'scripts/vendor/plupload/qiniu.min',
                        'ngsku': 'scripts/lingmall/common/ngsku/ngsku',
                        'ngtree':'scripts/lingmall/common/ngtree/ngtree',
                        'bootstrap-datetimepicker': 'scripts/lingmall/common/datetimepicker/bootstrap-datetimepicker',
                        'datetimepicker-zh': 'scripts/lingmall/common/datetimepicker/bootstrap-datetimepicker.zh-CN',
                        'zipfile': 'scripts/lingmall/common/zipfile/zipfile',
                        'FileSaver': 'scripts/vendor/file-saver/FileSaver'
                    },
                    shim: {
                        'jquery': { exports: 'jquery' },
                        'angular': { deps: ['jquery'], exports: 'angular' },
                        'underscore': { deps: ['angular'] },
                        'ui.router': { deps: ['angular'] },
                        'angular-loading-bar': { deps: ['angular'] },
                        'angular.animate': { deps: ['angular'] },
                        'angular.cookies': { deps: ['angular'] },
                        'angular.translate': { deps: ['angular'] },
                        'angular.sanitize': { deps: ['angular'] },
                        'angular.growl': { deps: ['angular'] },
                        'ui.bootstrap': { deps: ['angular'] },
                        // 'ui.bootstrap.tpls': { deps: ['angular'] },
                        'angular.md5': { deps: ['angular'] },
                        'plupload.full': { deps: ['angular'] },
                        'qiniu': { deps: ['angular'] },
                        'ngsku': { deps: ['angular'] },
                        'ngtree':{deps:['angular']},
                        'bootstrap-datetimepicker':{ deps: ['jquery']},
                        'datetimepicker-zh':{ deps: ['bootstrap-datetimepicker'] },
                        'zipfile':{deps:['angular','FileSaver']},
                        'FileSaver':{deps:['angular']}
                    },
                    modules: [{
                        name: 'libs',
                        include: ['app', 'bootstrap', 'main', 'jquery', 'angular', 'underscore', 'ui.router', 'angular-loading-bar', 'angular.animate',
                            'angular.cookies', 'angular.translate', 'angular.sanitize', 'angular.growl', 'ui.bootstrap', 'angular.md5', 'plupload.full', 'qiniu', 'ngsku','ngtree','bootstrap-datetimepicker','zipfile','FileSaver'
                        ]
                    }],
                    urlArgs: urlArgs
                }
            }
        },
        replace: {
            build: {
                src: ['<%=config.release%>/index.html', '<%=config.release%>/libs.js'],
                overwrite: true, // overwrite matched source files
                replacements: [{
                    from: ' data-main="main"',
                    to: ''
                }, {
                    from: 'main.css',
                    to: urlArgs + '.css'
                }, {
                    from: 'src="libs.js"',
                    to: 'src="' + urlArgs + '.js"'
                }, {
                    from: 'http://192.168.1.245:10000',
                    to: 'http://dev-api.lingmall.com'
                }]
            },
            release: {
                src: ['<%=config.release%>/index.html', '<%=config.release%>/libs.js'],
                overwrite: true, // overwrite matched source files
                replacements: [{
                    from: ' data-main="main"',
                    to: ''
                }, {
                    from: 'main.css',
                    to: urlArgs + '.css'
                }, {
                    from: 'src="libs.js"',
                    to: 'src="' + urlArgs + '.js"'
                }, {
                    from: 'http://192.168.1.245:10000',
                    to: 'http://saas-api.lingmall.com'
                }]
            },
            test: {
                src: ['<%=config.release%>/index.html'],
                overwrite: true,
                replacements: [{
                    from: ' data-main="main"',
                    to: ''
                }, {
                    from: 'main.css',
                    to: urlArgs + '.css'
                }, {
                    from: 'src="libs.js"',
                    to: 'src="' + urlArgs + '.js"'
                }]
            }
        },
        connect: {
            options: {
                port: 8002,
                livereload: 35738,
                hostname: 'localhost',
                base: '<%= config.src %>'
            },
            livereload: {
                options: {
                    open: 'http://<%= connect.options.hostname %>:<%= connect.options.port%>/',
                }
            }
        },
        watch: {
            allfiles: {
                files: ['<%=config.src%>/views/**/*.html', '<%=config.src%>/uib/**/*.html',
                    '<%=config.src%>/assets/css/bootstrap/*.css',
                    '<%=config.src%>/assets/css/iconfont/*.css',
                    '<%=config.src%>/assets/less/**/*.*',
                    '<%=config.src%>/scripts/lingmall/*.js',
                    '<%=config.src%>/scripts/lingmall/**/*.js',
                    '<%=config.src%>/*.js'
                ],
                ignore: ['<%=config.src%>/assets/css/lingmall/lingmall.css', '', '<%=config.src%>/assets/css/main.css'],
                tasks: [
                    'clean:src',
                    'clean:releaseAll',
                    'less:build',
                    'copy:vendor',
                    'copy:css',
                    'copy:fonts',
                    'concat:css',
                    'copy:images'
                ],
                options: {
                    livereload: 35738,
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    //公网正式环境
    grunt.registerTask('release', [
        'jshint',
        'clean:src',
        'clean:releaseAll',
        'less:build',
        'copy:vendor',
        'copy:css',
        'copy:fonts',
        'concat:css',
        'copy:images',
        'requirejs',
        'replace:release',
        'concat:cssRelease',
        'concat:urlArgs',
        'clean:releaseJs',
        'clean:releaseLess',
        'clean:releaseCss'
    ]);
    //公网测试环境
    grunt.registerTask('build', [
        'jshint',
        'clean:src',
        'clean:releaseAll',
        'less:build',
        'copy:vendor',
        'copy:css',
        'copy:fonts',
        'concat:css',
        'copy:images',
        'requirejs',
        'replace:build',
        'concat:cssRelease',
        'concat:urlArgs',
        'clean:releaseJs',
        'clean:releaseLess',
        'clean:releaseCss'
    ]);
    //内网测试环境
    grunt.registerTask('test', [
        'jshint',
        'clean:src',
        'clean:releaseAll',
        'less:build',
        'copy:vendor',
        'copy:css',
        'copy:fonts',
        'concat:css',
        'copy:images',
        'requirejs',
        'replace:test',
        'concat:cssRelease',
        'concat:urlArgs',
        'clean:releaseJs',
        'clean:releaseLess',
        'clean:releaseCss',
    ]);
    //开发环境
    grunt.registerTask('develop', [
        'clean:src',
        'clean:releaseAll',
        'less:build',
        'copy:vendor',
        'copy:css',
        'copy:fonts',
        'concat:css',
        'copy:images',
        'connect',
        'watch'
    ]);
    grunt.registerTask('default', [
        'jshint',
        'develop'
    ]);
};
