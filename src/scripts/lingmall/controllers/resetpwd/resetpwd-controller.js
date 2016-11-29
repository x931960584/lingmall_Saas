define(['../controllers'], function(controllers) {
    controllers.controller('ResetpwdCtrl', ['$scope',
        'ResetpwdServices',
        '$state',
        '$stateParams',
        'growl',
        '$cookieStore',
        function($scope, ResetpwdServices, $state, $stateParams, growl, $cookieStore) {

            $scope.mobile = $stateParams.mobile;
            $scope.sign = $stateParams.sign;

            $scope.showPrompt = false;
            //提交
            $scope.resetPwd = function() {
                if ($scope.pwd != $scope.repwd) {
                    $scope.validateRepwdErr = true;
                    return;
                }
                ResetpwdServices.getbackpwd($scope.mobile, $scope.sign, $scope.pwd).then(function(data) {
                    growl.addSuccessMessage('修改成功');
                    $state.go('users.login');
                }, function(data, status) {
                    $scope.resetMessage = data.message;
                })
            };

            $scope.mobileRegErr = false;
            $scope.pwdRegErr = false;
            //验证手机号
            $scope.validateMobile = function(mobile) {
                var mobileReg = /^1[34578]\d{9}$/; //手机号验证
                if (!mobileReg.test(mobile)) {
                    $scope.mobileRegErr = true;
                } else {
                    $scope.mobileRegErr = false;
                }
            };
            //验证密码
            $scope.validatePwd = function(password) {
                var pwdReg = /^(?![^a-zA-Z]+$)(?!\D+$).{5,20}$/; //6-20位数字和字母组成
                if (!pwdReg.test(password)) {
                    $scope.pwdRegErr = true;
                } else {
                    $scope.pwdRegErr = false;
                }
            };
            //验证重置
            $scope.validateReset = function(name){
                if(name == 'pwd'){
                    $scope.pwdRegErr = false;
                }else if(name == 'repwd') {
                    $scope.validateRepwdErr = false;
                }
            };

        }
    ]);
});
