define(['../controllers'], function(controllers) {
    controllers.controller('ForgetpwdCtrl', ['$scope',
        '$interval',
        '$location',
        '$state',
        '$cookieStore',
        'ForgetpwdServices',
        function($scope, $interval, $location, $state, $cookieStore, ForgetpwdServices) {
            $scope.mobileValidateErr = false;
            $scope.validateCaptchaErr = false;
            //再次获取等待时间
            $scope.second = 0;
            //验证码文字
            $scope.vercodebtntext = '获取短信验证码';

            //获取验证码
            $scope.getvercode = function() {
                if ($scope.second !== 0 || !$scope.mobile) {
                    return;
                }

                ForgetpwdServices.getbackpwdsms($scope.mobile).then(function(data) {

                    $scope.second = 60;
                    var timer = null;
                    timer = $interval(function() {
                        if ($scope.second <= 0) {
                            $scope.second = 0;
                            $scope.vercodebtntext = '获取短信验证码';
                            $interval.cancel(timer);
                        } else {
                            $scope.vercodebtntext = '{second}秒后,再次获取'.replace('{second}', $scope.second);
                            $scope.second--;
                        }
                    }, 1000);
                });
            };

            //验证短信验证码
            $scope.validateCaptcha = function() {
                if(!$scope.mobile || !$scope.captcha){return;}
                if(!$scope.captcha){
                    $scope.validateCaptchaErr = true;
                }
                ForgetpwdServices.valigetbackpwdsms($scope.mobile, $scope.captcha).then(function(data) {
                    $scope.sign = data.sign;
                    $state.go('users.resetpwd',{mobile:$scope.mobile,sign:$scope.sign});
                }, function(data, error) {
                    $scope.errMessage = data.message;
                });
            };

            //验证手机号
            $scope.validateMobile = function(mobile){
                var mobileReg = /^1[34578]\d{9}$/; //手机号验证
                if (mobileReg.test(mobile)) {
                    $scope.mobileValidateErr = false;
                }else {
                    $scope.mobileValidateErr = true;
                }
            };

        }
    ]);
});
