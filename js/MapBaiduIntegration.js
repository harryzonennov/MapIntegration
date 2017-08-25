/**
 * Created by Zhang,Hang on 8/23/2016.
 */

var searchModel = new Vue({
    el: "#x_data",
    data: {
        content: {
            latitude:"",
            longitude:"",
            addressInfo: ""
        },
        map:{},
        elMap:'x_map_addressInfo',
        DEFAULT_X:121.443532,
        DEFAULT_Y:31.24603
    },

    ready: function(){
        // Connection the web socket
        var vm = this;
        vm.map = new BMap.Map(vm.elMap);
        $("#x_map_addressInfo").height(800);
        var routePolicy = [BMAP_DRIVING_POLICY_LEAST_TIME,BMAP_DRIVING_POLICY_LEAST_DISTANCE,BMAP_DRIVING_POLICY_AVOID_HIGHWAYS];
        if(vm.content.latitude &&  vm.content.longitude && vm.content.latitude > 0 && vm.content.longitude > 0){
            var point = new BMap.Point(vm.content.latitude,vm.content.longitude);
            vm.map.centerAndZoom(point,13);
            var marker = new BMap.Marker(point);  // Create new mark
            vm.map.addOverlay(marker);
            var content = "<br/><br/>纬度：" + vm.latitude + "<br/>经度：" + vm.longitude;
            var infoWindow = new BMap.InfoWindow("<p style='font-size:14px;'>" + content + "</p>");
            marker.addEventListener("click", function () { this.openInfoWindow(infoWindow); });
        }else{
            if(vm.addressInfo){
                vm.map.zoomTo(13);
                vm.searchOnAddressMap(vm.content.addressInfo);
            }else{
                vm.map.centerAndZoom(new BMap.Point(vm.DEFAULT_X, vm.DEFAULT_Y),13);
                vm.map.zoomTo(13);
                vm.map.clearOverlays();
                var i = 0;
                var p1 = new BMap.Point(121.443532,31.24603);
                var p2 = new BMap.Point(121.481477,31.240103);
                var p3 = new BMap.Point(121.493262,31.237015);
                var p4 = new BMap.Point(121.494987,31.230099);
                var arrayList = [] ;
                arrayList.push(p1);arrayList.push(p2);arrayList.push(p3);arrayList.push(p4);
                vm.searchRouteByMuliMarker(arrayList, vm.map);

                vm.content.latitude = vm.DEFAULT_X;
                vm.content.longitude = vm.DEFAULT_Y;
            }
        }

        vm.map.enableScrollWheelZoom();
        vm.map.enableKeyboard();
        vm.map.enableContinuousZoom();
        vm.map.enableInertialDragging();

        vm.map.addControl(new BMap.NavigationControl()); //添加标准地图控件(左上角的放大缩小左右拖拽控件)
        vm.map.addControl(new BMap.ScaleControl());      //添加比例尺控件(左下角显示的比例尺控件)
        vm.map.addControl(new BMap.OverviewMapControl()); // 缩略图控件
        vm.map.addControl(new BMap.MapTypeControl());
    },

    methods: {

        /**
         * Search the Route map by muliple points list.
         * @param pointList
         */
        searchRouteByMuliMarker: function(pointList, map){
            // [Step1]:Show Markers on Baidu Map
            for(c=0;c<pointList.length;c++){
                var marker = new BMap.Marker(pointList[c]);
                map.addOverlay(marker);
                //将途经点按顺序添加到地图上
                var label = new BMap.Label(c+1,{offset:new BMap.Size(20,-10)});
                marker.setLabel(label);
            }

            // [Step2]: Special handling of Baidu Map's search limits to 11, if points list number is over 11, then divide into groups.
            var group = Math.floor( pointList.length /11 ) ;
            var mode = pointList.length %11 ;

            // [Step3]: Definiation of Driving and How to draw Polyline after search successfully.
            var driving = new BMap.DrivingRoute( map, {onSearchComplete: function(results){
                if (driving.getStatus() == BMAP_STATUS_SUCCESS){
                    var plan = driving.getResults().getPlan(0);
                    var  num = plan.getNumRoutes();
                    console.log("plan.num ："+num);
                    for(var j =0;j<num ;j++){
                        // Draw Polyline on Map
                        var pts= plan.getRoute(j).getPath();
                        var polyline = new BMap.Polyline(pts);
                        map.addOverlay(polyline);
                    }
                }
            }});

            // [Step4] Execute search by each group.
            for(var i =0;i<group;i++){
                var waypoints = pointList.slice(i*11+1,(i+1)*11);
                //注意这里的终点如果是11的倍数的时候，数组可是取不到最后一位的，所以要注意终点-1喔。
                driving.search(pointList[i*11], pointList[(i+1)*11-1],{waypoints:waypoints});//waypoints表示途经点
            }
            if( mode != 0){
                var waypoints = pointList.slice(group*11,pointList.length-1);//多出的一段单独进行search
                //driving.search(pointList[group*11],pointList[pointList.length-1],{waypoints:waypoints});
                for(c=1;c<pointList.length;c++){
                    driving.search(pointList[c-1],pointList[c]);
                }

            }


        },

        searchRouteByLocationName: function(map, route,start, end){
            var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true},policy: route});
            driving.search(start,end);
        },

        searchOnMap: function(){
            this.searchOnAddressMap(this.content.addressInfo);
        },

        searchByLongLatitude: function(){
            var vm = this;
            console.log("latitude:" + vm.content.latitude);
            console.log("longitude:" + vm.content.longitude);
            var point = new BMap.Point(vm.content.latitude,vm.content.longitude);
            vm.map.centerAndZoom(point,13);
            var marker = new BMap.Marker(point);  // Create new mark
            vm.map.addOverlay(marker);
            var content = "<br/><br/>纬度：" + vm.content.latitude + "<br/>经度：" + vm.content.longitude;
            var infoWindow = new BMap.InfoWindow("<p style='font-size:14px;'>" + content + "</p>");
            marker.addEventListener("click", function () { this.openInfoWindow(infoWindow); });

        },

        // hanlder method for send message
        searchOnAddressMap: function (location) {

            var vm = this;

            var localSearch = new BMap.LocalSearch(vm.map, { renderOptions: { map: vm.map, autoViewport: true} });
            vm.map.clearOverlays(); // Clear the old markers on map

            localSearch.setSearchCompleteCallback(function (searchResult) {
                var poi = searchResult.getPoi(0);
                if(!poi){
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
                marker.addEventListener("click", function () { this.openInfoWindow(infoWindow); });
                // marker.setAnimation(BMAP_ANIMATION_BOUNCE); //GIF cartoon
            });
            localSearch.search(location);
        }
    }
});



$(document).ready(function () {


});