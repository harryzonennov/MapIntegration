/**
 * Created by Zhang,Hang on 8/23/2016.
 */

var searchModel = new Vue({
    el: "#x_data",
    data: {
        content: {
            latitude: "",
            longitude: "",
            addressInfo: ""
        },
        map: {},
        marker1: {},
        marker2: {},
        marker3: {},
        elMap: 'x_map_addressInfo',
        DEFAULT_X: 103.56,
        DEFAULT_Y: 30.35
    },

    ready: function () {
        // Connection the web socket
        var vm = this;
        vm.map = new AMap.Map('x_map_addressInfo', {
            resizeEnable: true,
            zoom: 11,
            center: [116.397428, 39.90923]
        });
        var marker = new AMap.Marker({
            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: [116.397428, 39.90923]
        });
        marker.setMap(vm.map);

        // Following code shows how to set driving route with multiple markers.
        AMap.plugin(["AMap.Driving"], function () {
            var drivingOption = {
                policy: AMap.DrivingPolicy.LEAST_TIME,
                map: vm.map
            };

//            var driving1 = new AMap.Driving({
//                city: '北京市',
//                map: vm.map
//            });



//            driving1.search([
//                {keyword: '方恒国际', city: '北京'},
//                {keyword: '百度大厦', city: '北京'},
//                {keyword: '天坛', city: '北京'}
//            ], function (status, result) {
//                //TODO parse result
//            });



            var aRoutingOption = [];
            var union1 = [];
            union1.push(104.053787);
            union1.push(30.53792);


            var union2 = [];
            union2.push(104.049298);
            union2.push(30.546702);
            aRoutingOption.push(union2);

            var union3 = [];
            union3.push(104.048745);
            union3.push(30.55115);
            aRoutingOption.push(union3);

            var union4 = [];
            union4.push(104.05568);
            union4.push(30.586697);


            vm.marker1 = new AMap.Marker({
                map: vm.map,
                position: union1,

                icon: new AMap.Icon({
                    size: new AMap.Size(40, 50),  //图标大小
                    image: "http://webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png",
                    imageOffset: new AMap.Pixel(0, -60)
                })
            });

            vm.marker2 = new AMap.Marker({
                map: vm.map,
                position: union2,

                icon: new AMap.Icon({
                    size: new AMap.Size(40, 50),  //图标大小
                    image: "http://webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png",
                    imageOffset: new AMap.Pixel(0, -60)
                })
            });

            vm.marker3 = new AMap.Marker({
                map: vm.map,
                position: union3,

                icon: new AMap.Icon({
                    size: new AMap.Size(40, 50),  //图标大小
                    image: "http://webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png",
                    imageOffset: new AMap.Pixel(0, -60)
                })
            });


            var driving2 = new AMap.Driving({
                map: vm.map,
                hideMarkers: false,
                policy: AMap.DrivingPolicy.LEAST_TIME
            });

            driving2.search(
                union1, union4,{waypoints:aRoutingOption},
                 function (status, result) {
                //TODO parse result
            });

          //driving2.clear();
            //vm.map.cleanMap();


//            driving2.search([
//                {keyword: '四川成都望江路93号'},
//                {keyword: '成都成双大道北段49号'},
//                {keyword: '四川成都顺城大街391号'}
//            ], function (status, result) {
//                //TODO parse result
//            });
//
//            driving2.clear();
//
               driving2.search(
                union1, union4,
                function (status, result) {
                    //TODO parse result
                });

        });

        $("#x_map_addressInfo").height(800);
    },

    methods: {

        searchOnMap: function () {
            this.searchOnAddressMap(this.content.addressInfo);
        },

        searchByLongLatitude: function () {
            var vm = this;
            console.log("latitude:" + vm.content.latitude);
            console.log("longitude:" + vm.content.longitude);
            vm.map.panTo([vm.content.latitude, vm.content.longitude]);

            var marker = new AMap.Marker({
                icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                position: [vm.content.latitude, vm.content.longitude]
            });
            marker.setMap(vm.map);
//            var point = new BMap.Point(vm.content.latitude,vm.content.longitude);
//            vm.map.centerAndZoom(point,13);
//            var marker = new BMap.Marker(point);  // Create new mark
//            vm.map.addOverlay(marker);
//            var content = "<br/><br/>纬度：" + vm.content.latitude + "<br/>经度：" + vm.content.longitude;
//            var infoWindow = new BMap.InfoWindow("<p style='font-size:14px;'>" + content + "</p>");
//            marker.addEventListener("click", function () { this.openInfoWindow(infoWindow); });

        },

        clearMarker: function(){
            var vm = this;
            //vm.marker1.setMap(null);
            //vm.marker2.setMap(null);
           // vm.map.remove(vm.marker1);
           // vm.map.remove(vm.marker2);
            vm.map.remove( vm.map.getAllOverlays("marker"));
            //vm.map.getAllOverlays("marker")[2].setMap(null);
        },

        // hanlder method for send message
        searchOnAddressMap: function (location) {

            var vm = this;

            var localSearch = new BMap.LocalSearch(vm.map, { renderOptions: { map: vm.map, autoViewport: true} });
            vm.map.clearOverlays(); // Clear the old markers on map

            localSearch.setSearchCompleteCallback(function (searchResult) {
                var poi = searchResult.getPoi(0);
                if (!poi) {
                    alert("没有找到地址！");
                    return;
                }
                var latitude = poi.point.lat;
                var longitude = poi.point.lng;
                // set on page
                vm.content.latitude = latitude;
                vm.content.longitude = longitude;
                vm.map.centerAndZoom(poi.point, 13);
                var marker = new BMap.Marker(new BMap.Point(poi.point.lng, poi.point.lat));  // Create new mark
                vm.map.addOverlay(marker);
                var content = "<br/><br/>经度：" + poi.point.lng + "<br/>纬度：" + poi.point.lat;
                var infoWindow = new BMap.InfoWindow("<p style='font-size:14px;'>" + content + "</p>");
                marker.addEventListener("click", function () {
                    this.openInfoWindow(infoWindow);
                });
                // marker.setAnimation(BMAP_ANIMATION_BOUNCE); //GIF cartoon
            });
            localSearch.search(location);
        }
    }
});


$(document).ready(function () {


});