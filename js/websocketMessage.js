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
            password: "",
            messagePool:"",
            messageContent:""
        },
        loginURL: '../common/loginService.html',
        webSocket:{}
    },

    ready: function(){
        // Connection the web socket
        var vm = this;
        this.webSocket = new WebSocket('ws://localhost:8080/ContentPlatform/websocket');

        this.webSocket.onerror = function(event) {
            console.log(event);
        };

        this.webSocket.onopen = function(event) {
            console.log(event);
        };

        this.webSocket.onmessage = function(event) {
            console.log(event);
            var messageObject = JSON.parse(event.data);
            vm.content.messagePool = vm.content.messagePool + "\n" + messageObject.userID + " said:" + messageObject.messageContent;
        };

    },

    methods: {
        // hanlder method for send message
        sendMessage: function () {
            var vm = this;
            var requestData = generateServiceSimpleContentUnion("userID", this.content.userID, "messageContent", this.content.messageContent, "client", "001");
            vm.webSocket.send(requestData);
        }
    }
});



$(document).ready(function () {


});