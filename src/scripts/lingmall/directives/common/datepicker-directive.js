define(['../directives'], function(directives) {
    directives.directive('datepicker', [function() {
        return {
            restrict: 'EA',
            scope: {
                dateFormat: '=dateFormat',
                timeType: '=timeType',
                minView: '=minView',
                bootcssVer: '=bootcssVer',
                autoclose: '=autoclose',
                minuteStep: '=minuteStep',
                disAbled: '=disAbled',
                timeTypePlaceholder:'=timeTypePlaceholder'
            },
            templateUrl: './views/common/datepicker/datepicker.html',
            link: function(scope, element, attrs) {
                angular.element('.datepicker').datetimepicker({
                    format: scope.dateFormat, //日期格式 默认值'mm/dd/yyyy'
                    minView: scope.minView, //日期时间选择器所能够提供的最精确的时间选择视图。默认值：0, 'hour'
                    bootcssVer: scope.bootcssVer,
                    autoclose: true, //当选择一个日期之后是否立即关闭此日期时间选择器。 默认false
                    minuteStep: scope.minuteStep, //此数值被当做步进值用于构建小时视图。对于每个 minuteStep 都会生成一组预设时间（分钟）用于选择。默认值: 5
                    language:'zh-CN',
                })
            }
        }
    }]);
})
