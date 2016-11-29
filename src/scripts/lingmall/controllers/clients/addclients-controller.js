define(['../controllers'], function(controllers) {
    controllers.controller('addClientsCtrl', ['$scope', '$location', '$cookieStore', '$uibModal', 'ConsoleServices', 'MyClientsSernice', 'OrgServices', '$stateParams', function($scope, $location, $cookieStore, $uibModal, ConsoleServices, MyClientsSernice, OrgServices, $stateParams) {
        console.log('addClientsCtrl');
        var clientsItems = {
                "address": {
                    "city": null,
                    "district": null,
                    "province": null,
                    "street": null,
                },
                "business": {
                    "salesman_id": null,
                    "salesman_name": null,
                    "settlement_mode": null
                },
                "catagory_id": null,
                "contact_name": null,
                "contact_phone": null,
                "desc": null,
                "finance": {
                    "bank_name": null,
                    "card_id": null,
                    "invoice_title": null,
                    "tax_id": null,
                    "user_name": null
                },
                "grade_id": null,
                "name": null,
                "no": null,
                "region_id": null,
                "verify_flag": 0
            }
            //获取编码
        MyClientsSernice.clientNo().then(function(data) {
                $scope.clientsNo = data.no;
            }, function(data) {

            })
            //省市区
        var province, city;
        var offset = 0;
        var limit = 100;
        $scope.isProvice = true;
        $scope.isCity = true;
        $scope.isDistrict = true;
        $scope.isClickDistrict = true; //新增时的初始化
        $scope.isClickCity = true;
        ConsoleServices.CityClassily(province, city, offset, limit).then(function(data) {
            $scope.provinces = data.list;

        }, function(data) {

        })
        $scope.Clickprovince = function(name) {
            clientsItems.address.province = name;
            $scope.isProvice = false;
            $scope.isCity = true;
            $scope.isDistrict = true;
            $scope.province = name;
            $scope.city = '';
            $scope.district = '';
            province = name
            $scope.isClickDistrict = true;
            $scope.isClickCity = false;
            city = '';
            ConsoleServices.CityClassily(province, city, offset, limit).then(function(data) {
                $scope.citys = data.list;

            }, function(data) {

            })
        }
        $scope.Clickcity = function(name) {
            clientsItems.address.city = name;
            city = name;
            $scope.isCity = false;
            $scope.isDistrict = true;
            $scope.district = '';
            $scope.city = name;
            $scope.isClickDistrict = false;
            ConsoleServices.CityClassily(province, city, offset, limit).then(function(data) {
                $scope.districts = data.list;

            }, function(data) {

            })
        }
        $scope.Clickdistrict = function(name) {
                clientsItems.address.district = name;
                $scope.district = name;
                $scope.isDistrict = false;

            }
            //客户属性
        $scope.intRegion = true;
        MyClientsSernice.cataList(offset, limit).then(function(data) {
            $scope.cataLists = data.items;
            for (var i = 0; i < $scope.cataLists.length; i++) {
                if ($scope.cataLists[i].priority == 0 && !$stateParams.id) {
                    $scope.cataName = $scope.cataLists[i].name;
                    $scope.catagory_id = $scope.cataLists[i].catagory_id;
                    clientsItems.catagory_id = $scope.cataLists[i].catagory_id;

                }
            };

        }, function(data) {

        })
        $scope.ClickCatagory = function(name, id) {
            clientsItems.catagory_id = id;
            $scope.cataName = name;
            $scope.catagory_id = id;
        }
        MyClientsSernice.gradeList(offset, limit).then(function(data) {
            $scope.rankLists = data.items;
            for (var i = 0; i < $scope.rankLists.length; i++) {
                if ($scope.rankLists[i].priority == 0 && !$stateParams.id) {
                    $scope.rankName = $scope.rankLists[i].name;
                    $scope.grade_id = $scope.rankLists[i].grade_id;
                    clientsItems.grade_id = $scope.rankLists[i].grade_id;

                }
            };

        }, function(data) {

        })
        $scope.ClickRank = function(name, id) {
            clientsItems.grade_id = id;
            $scope.rankName = name;
            $scope.grade_id = id;
        }
        MyClientsSernice.regionList(offset, limit).then(function(data) {
            $scope.regionLists = data.items;

        }, function(data) {

        })
        $scope.ClickRegion = function(name, id) {
            clientsItems.region_id = id;
            $scope.intRegion = false;
            $scope.regionName = name;
            $scope.region_id = id;
        }
        $scope.ClickRegionAll = function() {
                clientsItems.region_id = null;
                $scope.intRegion = true;
                $scope.regionName = null;
                $scope.region_id = null;
            }
            //业务信息
        $scope.manShow = false;
        MyClientsSernice.settLement().then(function(data) {
            $scope.lementLists = data.items;
            $scope.setCkecked = true;
        }, function() {

        })
        clientsItems.business.settlement_mode = 1;
        $scope.busBox = function(event, mode) {
            var check = event.checked;
            if (check) {
                $scope.setMode = mode;
                clientsItems.business.settlement_mode = mode;
            } else {
                $scope.setMode = null;
                clientsItems.business.settlement_mode = null;
            }
        }
        $scope.keyDown = function(event, count) {
            $scope.manShow = true;
            OrgServices.getUserList(count, offset, limit).then(function(data) {
                $scope.business = data.list;
            }, function(data) {

            })
        };
        $scope.businessMan = function(name, id) {
            clientsItems.business.salesman_id = id;
            clientsItems.business.salesman_name = name;
            $scope.manShow = false;
            $scope.countMan = name;
            $scope.salesman_id = id;
        }
        if ($stateParams.id) {
            //编辑页面
            $scope.titleName = '编辑客户';
            MyClientsSernice.custCheck($stateParams.id).then(function(data) {
                var province, city;
                var offset = 0;
                var limit = 100;
                $scope.clientsNo = data.no;
                $scope.custName = data.name;
                $scope.isProvice = false;
                $scope.isCity = false;
                $scope.isDistrict = false;
                $scope.isClickCity = false;
                $scope.isClickDistrict = false;
                $scope.province = data.address.province;
                $scope.city = data.address.city;
                ConsoleServices.CityClassily(data.address.province, city, offset, limit).then(function(data) {
                    $scope.citys = data.list;

                }, function(data) {

                })
                ConsoleServices.CityClassily(data.address.province, data.address.city, offset, limit).then(function(data) {
                    $scope.districts = data.list;

                }, function(data) {

                })
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
                $scope.setCkecked = true;
                $scope.bankName = data.finance.bank_name;
                $scope.accountName = data.finance.user_name;
                $scope.accBank = data.finance.card_id;
                $scope.taxpayerNumber = data.finance.tax_id;
                $scope.invoiceTitle = data.finance.invoice_title;
                $scope.statues = data.verify_flag;
                clientsItems = {
                    "address": {
                        "city": data.address.city,
                        "district": data.address.district,
                        "province": data.address.province,
                        "street": data.address.street,
                    },
                    "business": {
                        "salesman_id": data.business.salesman_id,
                        "salesman_name": data.business.salesman_name,
                        "settlement_mode": data.business.settlement.mode
                    },
                    "catagory_id": data.catagory.catagory_id,
                    "contact_name": data.contact_name,
                    "contact_phone": data.contact_phone,
                    "desc": data.desc,
                    "finance": {
                        "bank_name": data.finance.bank_name,
                        "card_id": data.finance.card_id,
                        "invoice_title": data.finance.invoice_title,
                        "tax_id": data.finance.tax_id,
                        "user_name": data.finance.user_name
                    },
                    "grade_id": data.grade.grade_id,
                    "name": data.name,
                    "no": data.no,
                    "region_id": $scope.regionId,
                    "verify_flag": data.verify_flag
                }
                $scope.keep = function() {
                    clientsItems.address.street = $scope.detAddres;
                    clientsItems.contact_name = $scope.linkMan;
                    clientsItems.contact_phone = $scope.cuntNumber;
                    clientsItems.desc = $scope.remark;
                    clientsItems.finance.bank_name = $scope.bankName;
                    clientsItems.finance.card_id = $scope.accBank;
                    clientsItems.finance.invoice_title = $scope.invoiceTitle;
                    clientsItems.finance.tax_id = $scope.taxpayerNumber;
                    clientsItems.finance.user_name = $scope.accountName;
                    clientsItems.name = $scope.custName;
                    clientsItems.no = $scope.clientsNo;
                    MyClientsSernice.custEdit($stateParams.id, clientsItems).then(function(data) {
                        $location.path('/main/myclients')
                    }, function(data) {

                    })
                }
            }, function(data) {

            })
        } else {
            $scope.titleName = '新增客户';
            $scope.keep = function() {
                clientsItems.address.street = $scope.detAddres;
                clientsItems.contact_name = $scope.linkMan;
                clientsItems.contact_phone = $scope.cuntNumber;
                clientsItems.desc = $scope.remark;
                clientsItems.finance.bank_name = $scope.bankName;
                clientsItems.finance.card_id = $scope.accBank;
                clientsItems.finance.invoice_title = $scope.invoiceTitle;
                clientsItems.finance.tax_id = $scope.taxpayerNumber;
                clientsItems.finance.user_name = $scope.accountName;
                clientsItems.name = $scope.custName;
                clientsItems.no = $scope.clientsNo;
                MyClientsSernice.custAdd(clientsItems).then(function(data) {
                    $location.path('/main/myclients')
                }, function(data) {

                })
            }
        }







    }])
})
