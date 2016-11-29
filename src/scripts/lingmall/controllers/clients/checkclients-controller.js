define(['../controllers'], function(controllers) {
    controllers.controller('checkClientsCtrl', ['$scope', '$location', '$cookieStore', '$uibModal', 'ConsoleServices', 'MyClientsSernice', 'OrgServices', '$stateParams', function($scope, $location, $cookieStore, $uibModal, ConsoleServices, MyClientsSernice, OrgServices, $stateParams) {

        MyClientsSernice.custCheck($stateParams.id).then(function(data) {
            $scope.clientsNo = data.no;
            $scope.custName = data.name;
            $scope.province = data.address.province;
            $scope.city = data.address.city;
            $scope.district = data.address.district;
            $scope.detAddres = data.address.street;
            $scope.linkMan = data.contact_name;
            $scope.cuntNumber = data.contact_phone;
            $scope.remark = data.desc;
            $scope.cataName = data.catagory.name;
            $scope.rankName = data.grade.name;
            if (data.region != null) {
                $scope.regionName = data.region.name;
                $scope.regionId = data.region.region_id
            } else {
                $scope.regionName = null;
                $scope.regionId = null
            }
            $scope.countMan = data.business.salesman_name;
            $scope.lemeName = data.business.settlement.name;;
            $scope.bankName = data.finance.bank_name;
            $scope.accountName = data.finance.user_name;
            $scope.accBank = data.finance.card_id;
            $scope.taxpayerNumber = data.finance.tax_id;
            $scope.invoiceTitle = data.finance.invoice_title;
            $scope.statues = data.verify_flag;
        }, function() {

        })


    }])
})
