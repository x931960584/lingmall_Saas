define(['../controllers'], function(controllers) {
    controllers.controller('LoginCtrl', ['$scope',
        "$rootScope",
        "$location",
        '$interval',
        '$cookieStore',
        'LoginServices',
        'ConsoleServices',
        function($scope, $rootScope, $location, $interval, $cookieStore, LoginServices,ConsoleServices) {
            //
            $scope.accountIndex = 1;
            $scope.rememberChecked = false;
            $scope.showLoginMessage = false;
            //获取地址
            var province, city, offset, limit;
            ConsoleServices.CityClassily(province, city, offset, limit).then(function(data) {
                    $cookieStore.put('citylist',data.list);
                }, function(data) {

                })
            //先获取是否拥有记住的用户名
            if(localStorage.getItem('remember_me') == null){
                $scope.remember_me = false;
            }else{
                $scope.remember_me = true;
            }
            $scope.username = localStorage.getItem('remember_me');

            $scope.login = function() {
                if (!$scope.username || !$scope.pwd) {
                    $scope.loginMessage = "请输入用户名或密码";
                    return;
                }
                $scope.captcha = $scope.captcha.toUpperCase();
                if ($scope.captcha == "" || $scope.captcha != $scope.code) {
                    $scope.validateCaptcha();
                    $scope.valiCaptcha = true;
                    return;
                };
                LoginServices.login($scope.username, $scope.pwd).then(function(data) {
                    $scope.loginData = data.data;
                    $cookieStore.put('uuid',data.data.uuid);
                    $cookieStore.put('username', $scope.username);
                    $cookieStore.put('access_token', $scope.loginData.access_token);
                    $cookieStore.put('refresh_token', $scope.loginData.refresh_token);
                    $cookieStore.put('role_id', $scope.loginData.role_id);
                    $cookieStore.put('company_id', $scope.loginData.company_id);
                    $cookieStore.put('company_number', $scope.loginData.company_number);
                    $cookieStore.put('is_main', $scope.loginData.is_main);
                    $rootScope.username = $scope.username;
                    //记住用户名
                    if ($scope.remember_me) {
                        localStorage.setItem('remember_me', $scope.username);
                    } else if (localStorage.getItem('remember_me') == $scope.username) {
                        localStorage.removeItem('remember_me');
                    }

                    $location.path('/main/console');

                }, function(response) {
                    //console.log(response);
                    if (response.code == 2009) {
                        if (response.data.error_count == 3) {
                            $scope.loginMessage = "亲 您尝试登录已错误3次,还有2次机会,如您忘记密码,建议重置密码";
                        } else if (response.data.error_count == 4) {
                            $scope.loginMessage = "你的账号即将被锁定,请选择修改密码";
                        }
                        $scope.showLoginMessage = true;
                    } else {
                        $scope.showLoginMessage = true;
                        $scope.loginMessage = response.message;
                    }

                });
            };
            //键盘事件
            //用户名enter事件
            $scope.usernameEnter = function(event){
                var keycode = window.event ? event.keyCode : event.which;
                if(keycode == 13){
                    angular.element('.pwdInput').focus();
                }
            };
            //密码enter事件
            $scope.pwdEnter = function(event){
                var keycode = window.event ? event.keyCode : event.which;
                if (keycode == 13) {
                    angular.element('.vali-text').focus();
                }
            };
            $scope.keydown = function(event) {
                var keycode = window.event ? event.keyCode : event.which;
                if (keycode == 13) {
                    $scope.login();
                }
            };
            //自动生成验证码
            $scope.captcha = "";
            $scope.codeLength = 4;
            $scope.createcode = function() {
                $scope.code = "";
                var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
                    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
                for (var i = 0; i < $scope.codeLength; i++) {
                    var index = Math.floor(Math.random() * 36); //取得随机数的索引（0~35）
                    $scope.code += random[index];
                }
            };

            $scope.createcode();
            //验证验证码
            $scope.validateCaptcha = function() {
                if ($scope.captcha == "") {
                    $scope.valiPrompt = "请输入验证码！";
                    $scope.createcode();
                } else if ($scope.code != $scope.captcha) {
                    $scope.valiPrompt = "验证码输入错误！请重新输入";
                    $scope.createcode();
                    $scope.captcha = "";
                }
            };
        }
    ]);
});
