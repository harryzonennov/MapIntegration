var NavigationElementModel = function(){
    this.navModel = new Vue({
        el:"#sidebar-menu",
        data:{
            content:{
                elementList:[]
            },
            loadNaviElementURL: '../common/loadSpinnerElementList.html'
        },

        methods:{
            loadNaviElementList: function(){
                var vm = this;
                this.$http.post(vm.loadNaviElementURL).then(function (response) {
                    if (!JSON.parse(response.data).content) {
                        $.Notification.notify('error', 'top left', listVar.label.msgConnectFailure, listVar.label.msgLoadDataFailure);
                        return;
                    }
                    var naviElementList = JSON.parse(response.data).content;
                    vm.setActiveElement(naviElementList, 'resourceSpinnner', 'ServiceDocConfigure');
                    vm.setElementClass(naviElementList);
                    vm.$set('content.elementList', naviElementList);

                    setTimeout(function () {
                        $.Sidemenu.$menuItem = $("#sidebar-menu a");
                        $.Sidemenu.init();
                    }, 0);
                })
            },

            /**
             *  Generate default class value of element ahref, should be call after <code>setActiveElement</code>
              */
            setElementClass: function(elementList){
                if(!elementList){
                    return;
                }
                for(var i= 0; i < elementList.length; i++){
                    var classValue = 'waves-effect waves-primary';
                    if(i == 0){
                        classValue = classValue + ' topItem';
                    }
                    if(elementList[i].activeFlag == true){
                        classValue = classValue + ' active subdrop';
                    }
                    elementList[i].elementClass = classValue;
                }
            },

            setActiveElement: function(elementList, activeId, subActiveId){
                if(!elementList){
                    return;
                }
                for(var i= 0; i < elementList.length; i++){
                    if(activeId == elementList[i].id){
                        elementList[i].activeFlag = true;
                    }
                    if(subActiveId && elementList[i].secondNavigationList){
                        for(var j = 0; j < elementList[i].secondNavigationList.length; j++){
                            if(subActiveId ==  elementList[i].secondNavigationList[j].id){
                                elementList[i].secondNavigationList[j].activeFlag = true;
                                var styleObject ={
                                    display: "block"
                                }
                                elementList[i].styleObject = styleObject;
                            }
                        }
                    }
                }
            }
        }
    });

}

var getNavigationElementModel = function(){
    var navi = new NavigationElementModel();
    return navi.navModel;
}

