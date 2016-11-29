define(['../../controllers'], function(controllers) {
    controllers.controller('PayrecordCtrl', ['$scope', 'growl', 'PayrecordServices', 'OrgServices', '$cookieStore', '$filter', function($scope, growl, PayrecordServices, OrgServices, $cookieStore, $filter) {
        var dateFilter = $filter('date');
        $scope.dateFormat = 'yyyy-mm-dd';
        $scope.startTimePlaceholder="开始时间";
        $scope.endTimePlaceholder="结束时间";
       // $scope.buyer_company_id = $cookieStore.get('company_id');
        //
        $scope.type = '全部支付方式';
        $scope.status = '全部支付状态';
        $scope.payCompany = '支付方';
        $scope.startDate = ' ';
        $scope.endDate = ' ';
        $scope.order_code = null;

        //order_code:商户唯一订单号 trade_no:第三方交易号
        //$scope.buyer_company_id 支付方公司id
        $scope.pageIndex = 0;
        $scope.pageSize = 8;
        //获取支付列表
        $scope.getPayList = function() {
            $scope.startDate = dateFilter($scope.startTime, 'yyyy-MM-dd');
            $scope.endDate = dateFilter($scope.endTime, 'yyyy-MM-dd');
            PayrecordServices.getPayList($scope.order_code, $scope.pay_type, $scope.pay_status, $scope.startDate, $scope.endDate, $scope.pageIndex, $scope.pageSize).then(function(data) {
                $scope.payList = data.list;
                $scope.payCount = data.count;
                $scope.maxSize = 5;
                $scope.bigTotalItems = $scope.payCount;
                //搜索提示
                if(($scope.order_code != null || $scope.pay_type != null || $scope.pay_status != null || $scope.startDate || $scope.endDate ) && $scope.payCount == 0){
                    growl.addInfoMessage("未搜索到相关记录.");
                }
                //支付方公司列表
                $scope.payCompanyList = [];
                if($scope.payCount == 0){return;}
                _.map($scope.payList,function(n){return $scope.payCompanyList.push({company_id:n.company_id,company_name:n.company.company_name})});
                $scope.payCompanyList.push({company_id:null,company_name:'全部支付方'});
            })
        };
        $scope.getPayList();

        //页码
        $scope.setPage = function() {
            $scope.pageIndex = $scope.bigCurrentPage;
            $scope.pageIndex = $scope.pageSize * ($scope.pageIndex - 1);
            $scope.getPayList();
        };

        //支付方式
        $scope.payType = [ {
            pay_type: null,
            type_name: '全部支付方式'
        },{
            pay_type: 'alipay',
            type_name: '支付宝'
        }, {
            pay_type: 'wxpay',
            type_name: '微信支付'
        }];
        //支付状态
        $scope.payStatus = [{
            pay_status: null,
            status_name: '全部支付状态',
        },{
            pay_status: 'WAIT_BUYER_PAY',
            status_name: '等待付款',
        }, {
            pay_status: 'TRADE_SUCCESS',
            status_name: '支付成功',
        }, {
            pay_status: 'TRADE_FAIL',
            status_name: '支付失败',
        } ];
        //
        //支付方
        $scope.selectPayCompanny = function(id, name) {
            $scope.payCompany = name;
            $scope.buyer_company_id = id;
        };
        //选择支付方式
        $scope.selectType = function(type, name) {
            $scope.pay_type = type;
            $scope.type = name;
        };
        //选择支付状态
        $scope.selectStatus = function(status, name) {
            $scope.pay_status = status;
            $scope.status = name;
        };

    }]);
});
