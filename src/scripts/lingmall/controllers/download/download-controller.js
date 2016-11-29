define(['../controllers'], function(controllers) {
    controllers.controller('DownLoad', ['$scope', 'DownLoadService','MyGoodsServices','growl', function($scope, DownLoadService,MyGoodsServices,growl) {
        // 2d481a20-8457-11e6-8d1e-0242ac120003
        $scope.imgId = '';
        $scope.phone = '18018572776';
        var imgData = [];
        var promis = 0;
        $scope.sentSMS = DownLoadService.sentSMS;
        $scope.getPics = function(img_sku_id) {
            MyGoodsServices.getPicsList(img_sku_id).then(function(data) {
                if (data.length) {
                    var len = promis = data.length;
                    for (var i = 0; i < len; i++) {
                        getImage(data[i].domain + '/' + data[i].key, data[i].classify, i + 1);
                    }
                }
            },function(){
                growl.addErrorMessage('获取图片失败，请稍后重试!');
            });
        };

        function creatZip(imgData) {
            var zip = new JSZip();
            var len = imgData.length;
            var count = 0;
            function putFile(file, classifyName) {
                var img = zip.folder(classifyName);
                img.file('图片' + count + '.' + file.type, file.dataUrl, { base64: true });
            };
            for (var i = 0; i < len; i++) {
                count++;
                if (imgData[i].classify == 1) {
                    putFile(imgData[i], '商品主图')
                }
                if (imgData[i].classify == 6) {
                    putFile(imgData[i], '商品详情图')
                }
            }
            zip.generateAsync({ type: "blob" }).then(function(content) {
                console.timeEnd('getPics');
                ignoreLoadingBar: false;
                // FileSaver.js
                saveAs(content, "零猫商品数据.zip");
            });
        }

        function getBase64Image(img) {
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
            var dataURL = canvas.toDataURL("image/" + ext);
            return dataURL;
        };

        function getImage(url, classify, imgCount) {
            var image = new Image();
            image.crossOrigin = "*";
            image.src = url;
            image.onload = function() {
                imgCount++;
                var dataUrl = getBase64Image(image).split(',')[1];
                var type = getBase64Image(image).split(',')[0].split('/')[1].split(';')[0];
                imgData.push({ dataUrl: getBase64Image(image).split(',')[1], classify: classify, type: type });
                if (imgCount == promis) {
                    creatZip(imgData);
                }
            };
        };
    }])
});
