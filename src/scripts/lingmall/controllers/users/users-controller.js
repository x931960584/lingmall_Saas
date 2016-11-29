define(['../controllers'], function(controllers) {
    controllers.controller('UsersCtrl', ['$scope', '$interval', '$location', 'growl', '$cookieStore', '$state', 'RegisterServices', function($scope, $interval, $location, growl, $cookieStore, $state, RegisterServices) {
        //重构
        //验证错误提示信息
        $scope.mobileValidateErr = false;
        $scope.pwdValidateErr = false;
        $scope.repwdValidateErr = false;
        $scope.successMobile = false;
        $scope.validateOne = false;
        $scope.validateTwo = false;
        $scope.validateThree = false;
        $scope.captchaErr = false;
        // 是否同意零猫协议
        $scope.isChecked = false;
        $scope.showService = false;

        //验证手机号
        $scope.validateMobile = function(mobile) {
            var mobileReg = /^1[34578]\d{9}$/; //手机号验证
            if (mobileReg.test(mobile)) {
                $scope.mobileValidateErr = false;
                //后台验证手机号是否存在
                RegisterServices.mainVerify(mobile).then(function(data) {
                    $scope.validateOne = true;
                }, function(data) {
                    $scope.mobileMessage = data;
                    $scope.successMobile = true;
                })
            } else {
                $scope.mobileValidateErr = true;
            }
        };
        //验证密码
        $scope.validatePwd = function(pwd) {
            var pwdReg = /^(?![^a-zA-Z]+$)(?!\D+$).{5,20}$/; //6-20位数字和字母组成
            if (pwdReg.test(pwd)) {
                $scope.pwdValidateErr = false;
                $scope.validateTwo = true;
            } else {
                $scope.pwdValidateErr = true;
            }
        };
        //验证再次输入密码
        $scope.validateRepwd = function(repwd, pwd) {
            var pwdReg = /^(?![^a-zA-Z]+$)(?!\D+$).{5,20}$/; //6-20位数字和字母组成
            if (pwdReg.test(repwd) && pwd === repwd) {
                $scope.repwdValidateErr = false;
                $scope.validateThree = true;
            } else {
                $scope.repwdValidateErr = true;
            }
        };
        //重置验证
        $scope.resetValidate = function(name) {
            if (name == 'mobile') {
                $scope.mobileValidateErr = false;
                $scope.successMobile = false;
            } else if (name === 'pwd') {
                $scope.pwdValidateErr = false;
            } else if (name == 'repwd') {
                $scope.repwdValidateErr = false;
            }
        };
        //零猫服务协议
        $scope.checkbox = function() {
            $scope.isChecked = !$scope.isChecked;
            if ($scope.isChecked == false) {
                $scope.showService = true;
            } else {
                $scope.showService = false;
            }
        };
        //主账号注册
        $scope.mainReg = function(mobile, pwd, repwd, captcha) {
            var mobile = mobile;
            var pwd = pwd;
            var captcha = captcha;
            if (!($scope.validateOne && $scope.validateTwo && $scope.validateThree)) {
                return;
            }
            if (captcha == null) {
                $scope.captchaErr = true;
                return;
            }
            if ($scope.isChecked == false) {
                $scope.showService = true;
                return;
            } else {
                $scope.showService = false;
            }
            RegisterServices.mainReg(mobile, captcha, pwd).then(function(data) {
                growl.addSuccessMessage("注册成功");
                $location.path('/login');
            })
        };

        //再次获取等待时间
        $scope.second = 0;
        //验证码文字
        $scope.captchabtntext = '获取短信验证码';

        //获取验证码
        $scope.getCaptcha = function(mobile) {
            if ($scope.second !== 0 || !($scope.validateOne && $scope.validateTwo && $scope.validateThree)) {
                return;
            }
            RegisterServices.captcha(mobile).then(function(data) {
                $scope.second = 60;
                var timer = null;
                timer = $interval(function() {
                    if ($scope.second <= 0) {
                        $scope.second = 0;
                        $scope.captchabtntext = '获取短信验证码';
                        $interval.cancel(timer);
                    } else {
                        $scope.captchabtntext = '{second}秒后,再次获取'.replace('{second}', $scope.second);
                        $scope.second--;
                    }
                }, 1000);
            });
        };

        // //验证是否在登录状态
        // $scope.validateLoginStatus = function() {
        //     var token = $cookieStore.get('access_token');
        //     if (token != null) {
        //         $location.path('/main/console');
        //     } else {
        //         $location.path('/login');
        //     }
        // };
        // //$scope.validateLoginStatus();

    }]);
});
