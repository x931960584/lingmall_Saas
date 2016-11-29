define(['../controllers'], function(controllers) {
    controllers.controller('PlatformCtrl', ['$scope', '$http', '$cookieStore', 'ConsoleServices', '$uibModal', '$sce', function($scope, $http, $cookieStore, ConsoleServices, $uibModal,$sce) {
        $scope.startTimePlaceholder = "通知时间";
        $scope.endTimePlaceholder = "截止时间";
        $scope.dateFormat = "yyyy-mm-dd";
        var limit = 10;
        var offset = 0;
        var title='';
        var startTime='';
        var endTime='';
        $scope.denudedShow=false;
        $scope.inputTitle=function(){
            if($scope.title != ""){
            $scope.denudedShow=true;
            }else{
                $scope.denudedShow=false;
            }
        }
        $scope.denuded=function(){
            $scope.title="";
            $scope.denudedShow=false;
        }
        //通告列表
        var platformList = function() {
            ConsoleServices.getNotices(offset, limit, title, startTime, endTime).then(function(data) {
                $scope.bigTotalItems = data.count;
                $scope.noteList = data.list;
            }, function(data) {

            })
        };
        platformList();
        //分页
        $scope.setPage=function(){
            offset=($scope.bigCurrentPage-1)*limit;
            platformList();
        }
        //搜索
        $scope.search=function(){
            offset=0;
            title=$scope.title;
            startTime=$scope.start_time;
            endTime=$scope.end_time;
            platformList();
        }
        //点击查看

        $scope.checkMore = function(id) {
            var modtitle, modcontent, modtime;
            ConsoleServices.NoticesCheck(id).then(function(data) {
                modtitle = data.title;
                modcontent = data.content;
                modtime = data.created_at;
                var modalInstance = $uibModal.open({
                    templateUrl: './views/modal/modal_tem.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'lg',
                    backdrop: 'static',
                    resolve: {
                        header: function() {
                            return "平台通知";
                        },
                        contents: {
                            scope: {
                                pageName: 'view',
                                pageView: 'view',
                                mainContent: $sce.trustAsHtml(modcontent),
                                title: modtitle,
                                time: modtime.slice(0,10)
                            },
                            templateurl: './views/console/platModal.html',
                        },
                        footer: function() {}
                    }
                })
            }, function(data) {

            })

        }

    }])
});
