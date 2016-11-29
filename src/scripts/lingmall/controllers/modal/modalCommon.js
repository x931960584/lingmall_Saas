define(["../controllers"], function(controllers) {
    "use strict";
    controllers.controller('ModalInstanceCtrl', ["$scope", '$state', "$injector", "$uibModalInstance", "growl", "header", "contents", "footer", function($scope,
        $state, $injector, $uibModalInstance, growl, header, contents, footer) {
        $scope.header = header;
        $scope.templateurl = contents.templateurl;
        $scope.data = contents.scope;
        //alert($scope.data.id);
        console.log('ll',$scope.data.tree)
        $scope.submit = {
            ok: function() {
                console.log($scope.data.id)
                footer.submit($scope.data.id, $scope.data.item).then(function(data) {
                    $uibModalInstance.dismiss('cancel');
                    footer.isList();
                }, function(data) {
                    if ($scope.data.isProduct) {
                        var down = data.data.down;
                        if (down.length > 0) {
                            for (var i = 0; i < down.length; i++) {
                                growl.addErrorMessage('商品' + down[i].sku_name + '为下架状态,不允许上线')
                            };
                        }
                    }

                });

            },
            config: function() {
                footer.config();
                if ($scope.data.isSuccess == 1) {
                    $uibModalInstance.dismiss('cancel');
                }
            },
            close: function() {
                if ($scope.data.isLugg) {
                    $scope.data.luggagecancel();
                }
                $uibModalInstance.dismiss('cancel');
            },
            linkTo: function(path, order_id) {
                if(order_id){
                    $state.go(path, { order_id: order_id });
                }else{
                    $state.go(path);
                }
                $uibModalInstance.dismiss('cancel');
            },
            confirm: function(){
                footer.submit();
                $scope.$on('promiseResult',function(event, args){
                    if(args.result == 'success'){
                        $uibModalInstance.dismiss('cancel');
                    }
                });
            }
        };
        /*$scope.$watch('promiseResult',function(ov, nv){
            if(ov != nv){
                $scope.$on('promiseResult',function(event, args){
                    console.log('args1', args);
                })
            }
        });
        */
    }]);
});
