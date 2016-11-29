;
(function() {
    require.config({
        baseUrl: './',
        paths: {
            'app': 'app',
            'bootstrap': 'bootstrap',
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
            //'ui.bootstrap.tpls' : 'scripts/vendor/angular-bootstrap/ui-bootstrap-tpls',
            'angular.md5': 'scripts/vendor/angular-md5/angular-md5',
            'plupload.full': 'scripts/vendor/plupload/plupload.full.min',
            'qiniu': 'scripts/vendor/plupload/qiniu.min',
            'ngsku': 'scripts/lingmall/common/ngsku/ngsku',
            'ngtree':'scripts/lingmall/common/ngtree/ngtree',
            'ngLocale': 'scripts/lingmall/controllers/ui/angular-locale_zh_cn',
            'ng.ueditor': 'scripts/lingmall/common/ueditor/angular-ueditor',
            'ueditor': 'scripts/lingmall/common/ueditor/ueditor.all',
            'ueditorconfig': 'scripts/lingmall/common/ueditor/ueditor.config',
            'bootstrap-datetimepicker': 'scripts/lingmall/common/datetimepicker/bootstrap-datetimepicker',
            'datetimepicker-zh': 'scripts/lingmall/common/datetimepicker/bootstrap-datetimepicker.zh-CN',
            'zipfile': 'scripts/lingmall/common/zipfile/zipfile',
            'FileSaver': 'scripts/vendor/file-saver/FileSaver'
        },
        shim: {
            'jquery': { exports: 'jquery' },
            'angular': { deps: ['jquery'], exports: 'angular' },
            'ui.router': { deps: ['angular'] },
            'angular-loading-bar': { deps: ['angular'] },
            'angular.animate': { deps: ['angular'] },
            'angular.cookies': { deps: ['angular'] },
            'angular.translate': { deps: ['angular'] },
            'angular.sanitize': { deps: ['angular'] },
            'angular.growl': { deps: ['angular'] },
            'ui.bootstrap': { deps: ['angular'] },
            //'ui.bootstrap.tpls': {deps: ['angular']},
            'angular.md5': { deps: ['angular'] },
            'plupload.full': { deps: ['angular'] },
            'qiniu': { deps: ['angular'] },
            'ngsku': { deps: ['angular'] },
            'ngtree':{deps:['angular']},
            'ngLocale': { deps: ['angular'] },
            'ng.ueditor': { deps: ['angular'] },
            'ueditor': { deps: ['angular'] },
            'ueditorconfig': { deps: ['angular'] },
            'bootstrap-datetimepicker':{ deps: ['jquery'] },
            'datetimepicker-zh':{ deps: ['angular','bootstrap-datetimepicker'] },
            'zipfile':{deps:['angular','FileSaver']},
            'FileSaver':{deps:['angular']}

        },
        urlArgs: "bust=v1.0" +  (new Date()).getTime()
    });
    require(['bootstrap'], function() {
        window.lingmall_urlPrefix ='http://192.168.1.245:10000';
    });
})();
