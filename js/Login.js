/**
 * Created by Zhang,Hang on 8/23/2016.
 */

var searchModel = new Vue({
    el: "#x_data",
    data: {
        content: {
            uuid: "",
            name: "",
            id: "",
            userID: "",
            client: "",
            password: ""
        },
        loginURL: '../common/loginService.html'
    },

    ready: function(){
        var webSocket = new WebSocket('ws://localhost:8080/ContentPlatform/websocket');

        webSocket.onerror = function(event) {
            console.log(event);
        };

        webSocket.onopen = function(event) {
            console.log(event);
        };

        webSocket.onmessage = function(event) {
            console.log(event);
        };

        function onMessage(event) {
            console.log(event);
        }

        function onOpen(event) {
            console.log(event);
        }

        function onError(event) {
            console.log(event);
        }
    },

    methods: {
        login: function () {
            var vm = this;
            var requestData = generateServiceSimpleContentUnion("userID", this.content.userID, "password", this.content.password, "client", "001");
            this.$http.post(vm.loginURL, requestData).then(function (response) {
                if (JSON.parse(response.data).errorCode == ERROR_CODE_OK) {
                    window.location.href = "ServiceDocConsumerUnionList.html";
                } else {
                    swal("登陆失败", JSON.parse(response.data).errorMessage);
                }
            }, function (response) {
                alert(response.statusText);
            });
        }
    }
});



$(document).ready(function () {


});