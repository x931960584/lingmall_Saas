define(['../directives'], function(directives) {
    directives.directive('ueditor', [function() {
        return {
            restrict: 'A',
            scope: {
            	goodsDesc:'=goodsDesc',
                pageStatus: '=pageStatus'
            },
            templateUrl: '../views/ueditor/ueditor.html',
            link: function(scope, element, attrs) {
                var um = UM.getEditor('myEditor');
                scope.save = function() {
                    scope.goodsDesc = um.getContent();
                    //console.log('scope.goodsDesc',scope.goodsDesc);
                    //$scope.desc = um.getContentTxt(); //纯文本 没有段落格式
                    // getPlainTxt() 纯文本 有段落格式
                    //getAllHtml() 取得完整的html代码，可以直接显示成完整的html文档
                    //getContent() 获取编辑器的内容
                    //setHeight(number) 设置高度

                };
                if(scope.pageStatus == 'view'){
                    //不可编辑
                    um.setDisabled();
                }
            }
        }
    }]);
});
