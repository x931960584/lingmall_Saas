define(['./services'], function(services) {
    'use strict';
    services.service('config', [function() {
        return {
            urlPrefix: lingmall_urlPrefix,
            imgUrl: lingmall_urlPrefix,
            urlClients:'http://b2b-api.lingmall.com',
            urlDict: {
                //登录
                login: '/user_login/login',
                //刷新token 替换refresh_token
                refresh_token: '/user_login/refresh_token',
                //主账号验证
                mainVerify: '/users/main_mobile/verify',
                //员工账号验证
                childVerify: '/users/child_mobile/verify',
                //登录之后权限列表 main.html使用
                roleList: '/roles/modules/{role_id}',
                //注册
                //主账号注册
                mainreg: '/user_register/users/main/reg',
                //员工账号注册
                childreg: '/user_register/users/child_reg',
                //注册短信 验证码
                captcha: '/sms/register',
                //验证短信验证码
                captchaVerify: '/sms/register/verify',
                //主账号注册验证
                mainVerify: '/users/main_mobile/verify',
                //员工账号注册验证
                childVerify: '/users/child_mobile/verify',

                //忘记 修改密码
                getbackpwd: '/user_register/users/password/get_back',
                //主账号修改子账号密码时调用
                modifypwd: '/user_register/user/modify_password/{uuid}',
                //找回密码短信
                getbackpwdsms: '/sms/get_back_password',
                //验证找回密码短信验证码
                valigetbackpwdsms: '/sms/get_back_password/frontend/verify',

                //组织架构
                //组织架构
                //公司
                companys: '/user_groups/companys',
                editCompany: '/user_groups/companys/{company_id}',
                //组织架构用户组
                userGroup: '/user_groups',
                userGroupStatus: '/user_groups/{ugid}/status',
                editUserGroup: '/user_groups/{ugid}',
                getSingleUserGroup: '/user_groups/{ugid}',

                //用户列表
                //获取用户组列表
                getUserList: '/users',
                //删除用户信息,获取单个用户信息,修改用户信息
                editUserInfo: '/users/{uuid}',
                //1->启用 2->禁用
                userStatus: '/users/{uuid}/status',
                //设为主账号
                setMainAccount: '/users/{uuid}/main_account',
                //添加子账号
                addChildAccount: '/user_register/users/child_reg',
                //获取角色列表
                getRoles: '/roles/{company_id}',
                //权限控制列表
                accessControl: '/roles/permission_list/{module_id}',

                //角色权限
                permissionlist: '/roles/{company_id}', //角色列表搜索
                permissiondel: '/roles/{company_id}', //删除角色
                permissionadd: '/roles/operation', //添加修改角色
                permissionforbidden: '/roles/forbidden', //禁用启用
                permissionmodules: '/roles/modules/{role_id}', //模块列表
                permissioneditor: '/roles/modules/permission', //编辑权限
                permissionmodsearch: '/roles/modules/permission/{module_id}', //单一模块权限
                permissionpitchall: '/roles/modules/pitchall/{module_id}', //统一修改模块权限
                permissionjudgement: '/roles/permission_list/{module_id}', //权限控制
                //商品管理
                //获取商品列表
                getGoodsList: '/aggregator/goods/spus',
                addGoods: '/goods/spus',
                //操作商品,增删改查
                operateGoods: '/goods/spus/{spu_id}',
                //获取单个商品信息
                getSingleInfo: '/aggregator/goods/spus/{spu_id}',
                //查询spu数量
                spuCount: '/goods/spus/count',
                //获取sku
                getSkuId: '/goods/skus/actions/create_sku_id',
                //获取sku详细信息
                getSkuDetail: '/goods/skus/{sku_id}',
                //生成spu编码
                createSpuCode: '/codes/spu_codes',
                //上架 下架
                editStatus: '/goods/spus/{spu_id}/actions/update_status',

                //获取上传token
                getUploadToken: '/gpbs/service/upload_token',
                //获取bundle_number的图片列表
                getPicsList: '/gpbs/bundle_pics/{bundle_number}',
                //批量获取bundle_number的缩略图
                getThumbnailList: '/gpbs/bundle_pics/thumbnails',
                //批量修改bundle_number的图片业务关系
                modifyPics: '/gpbs/bundle_pics/',
                //我的商品

                //添加商品

                //品牌
                brandlist: '/brands', //搜索列表
                brandadd: '/brands', //添加品牌
                branddel: '/brands/{brand_id}', //删除品牌
                brandcheck: '/brands/{brand_id}', //品牌详情
                brandeditor: '/brands/{brand_id}', //编辑品牌
                uploadtoken: '/gpbs/service/upload_token',

                //拼团活动
                activitylist: '/groupons', //拼团活动列表
                activityadd: '/groupons', //拼团活动添加
                activitysearch: '/groupons/groupon_skus', //数据查询
                activityeditor: '/groupons/{groupon_id}', //拼团活动修改
                activitydetail: '/aggregator/groupons/{groupon_id}', //拼团活动详情
                activitydel: '/groupons', //拼团活动删除
                activityexp: '/groupons/groupon_skus/actions/verify', //判断过期库存
                activitygather: '/groupons/groupon_skus/actions/verify_status', //判断商品是否在采集
                activitynum: '/groupons/groupon_skus/actions/update_sold_count', //销售数量
                goodslist: '/aggregator/goods/spus',
                actividown: '/groupons/{groupon_id}/actions/update_status', //上下线

                //查询品牌列表
                getBrands: '/brands',
                //分类(供应商分类)
                classifyinit: '/categorys/Supplier_categorys/actions/init', //初始化默认分类
                classifylist: '/categorys/supplier_categorys', //分类列表
                classifyadd: '/categorys/supplier_categorys', //添加分类
                classifydel: '/categorys/supplier_categorys/{supplier_category_id}', //删除分类
                classifycheck: '/categorys/supplier_categorys/{supplier_category_id}', //获取单个的信息
                classifyeditor: '/categorys/supplier_categorys/{supplier_category_id}', //修改
                //分类(运营分类)
                operationCategory: '/categorys/operation_categorys', //运营分类列表
                //入库单
                warehousesList:'/warehouses',//获取仓库
                outstockNum: '/warehouses/actions/get_number',  //入库单编号获取
                outstockAdd: '/warehouses/warehouse_bills/warehouse_in_bills',  //新增入库单
                //outstockList: '/warehouses/warehouses_bills/warehouse_in_bills', //入库单列表
                //outstockCheck: '/warehouses/warehouses_bills/warehouse_in_bills/{warehouse_in_bill_id}', //查看入库单
                outstockEdit: '/warehouses/warehouse_bills/warehouse_in_bills/{warehouse_in_bill_id}', //修改入库单
                outstcokStat: '/warehouses/warehouse_bills/warehouse_in_bills/{warehouse_in_bill_id}/actions/update_status', //修改状态
                getUserName: '/users/{uuid}',
                outstockList: '/aggregator/warehouses/warehouse_bills/warehouse_in_bills', //聚合入库单列表
                outstockCheck: '/aggregator/warehouses/warehouse_bills/warehouse_in_bills/{warehouse_in_bill_id}', //聚合查看入库单
                //查询分类列表
                getCategorys: '/categorys/supplier_categorys',
                //计量单位


                //订单管理
                //销售订单
                getOrderList: '/aggregator/orders/groupon_orders',
                createOrder: '/orders/groupon_orders',
                orderDetail: '/aggregator/orders/groupon_orders/{order_id}',
                orderPay: '/orders/groupon_orders/{order_id}/actions/pay',
                updateFee: '/orders/groupon_orders/{order_id}/actions/update_fee',
                orderSend: '/orders/groupon_orders/{order_id}/actions/send',
                orderReceive: '/orders/groupon_orders/{order_id}/actions/receive',
                orderClose: '/orders/groupon_orders/{order_id}/actions/close',
                orderCancel: '/orders/groupon_orders/{order_id}/actions/cancel',
                //不同状态下的订单数量
                getOrderCount: '/orders/groupon_orders/count',
                //平台通告
                getNotices: '/notices',
                //操作
                operationNotices: '/notices/{notice_id}',
                //广告管理

                //销售订单


                //财务管理
                //支付记录
                //获取支付列表
                getPayList: '/aggregator/finances/payment',

                //库存管理
                //仓库管理
                //获取仓库列表
                getWarehouseList: '/aggregator/warehouses/actions/search_warehouses',
                //获取仓库编号
                getWarehouseNumber: '/warehouses/actions/get_number',
                //添加仓库
                addWarehouses: '/warehouses',
                //获取仓库详情
                getWarehouseDetail: '/aggregator/warehouses/{warehouse_id}',
                //添加仓库配送范围
                addRange: '/warehouses/{warehouse_id}/actions/add_range',
                //删除仓库
                deleteWarehouse: '/warehouses/{warehouse_id}',
                //编辑仓库
                editWarehouse: '/warehouses/{warehouse_id}',
                //禁用启用仓库
                warehouseStatus: '/warehouses/{warehouse_id}/actions/update_status',

                //出库
                outbound: '/warehouses/warehouse_skus/actions/out',
                //入库
                inbound: '/warehouses/warehouse_skus/actions/in',
                //下单验证地址及库存
                verifyBound: '/warehouses/warehouse_skus/actions/verify',
                //库存查询
                queryInventory: '/warehouses/warehouse_skus/stock',

                //地址
                //获取所有城市列表
                getAllCityList: '/address/regions/cities',
                cityClassily: '/address/regions', //地址分层级
                companyDetail:'/aggregator/user_groups/companys/{company_id}',  //获取公司信息
                companyEdit:'/user_groups/companys/{company_id}',   //修改公司信息
                companyVerify:'/user_groups/companys/{company_id}/actions/verifyInfo',  //验证公司信息
                mainCategorys:'/categorys/main_categorys',    //主营项目

                //客户管理
                gradelist:'/lcrm/customers/grades', //等级添加,列表
                gradecheck:'/lcrm/customers/grades/{grade_id}',//等级查看,修改,删除
                catalist:'/lcrm/customers/catagorys', //分类新增,列表
                catacheck:'/lcrm/customers/catagorys/{catagory_id}',//分类查看,删除,修改
                custlist:'/lcrm/customers',//客户新增 ,列表
                custcheck:'/lcrm/customers/{customer_id}', //客户查看,修改, 删除
                regionlist:'/lcrm/customers/regions',//区域列表
                regioncheck:'/lcrm/customers/regions/{region_id}',//区域查看,修改,删除
                settlement:'/lcrm/settlements',//结算方式
                clientno:'/lcrm/customers/actions/gen_no',//获取客户编码
                strategylist:'/lcrm/customers/strategys',//客户管控列表,新增
                strategycheck:'/lcrm/customers/strategys/{strategy_id}', //客户管控编辑  查看  删除
                aggretlist:'/aggregator/lcrm/customers/strategys',//客户管控列表,新增
            }
        }
    }]);
});
