/**
 * Created by Zhang,Hang on 8/15/2016.
 */

var dataVar = new Vue({
    el: "#wrapper",
    data: {
        // label area
        label: {
            sectionIndex: '',
            pageId: '',
            sectionId: '',
            sectionContent: '',
            id:'',
            name:'',

            buttonSave: '',
            lockFailureMessage: '',
            buttonExit: '',
            msgSaveOK: '',
            msgSaveOKComment: ''

        },

        content: {
            webPageSectionContentUIModel:{
                sectionIndex: '',
                pageId: '',
                sectionId: '',
                sectionContent: '',
                uuid: '',
                id:'',
                name:''
            }
        },

        saveModuleURL:'../webPageSectionContent/saveModuleService.html',
        loadModuleEditURL: '../webPageSectionContent/loadModuleEditService.html',
        exitModuleURL: "../webPageSectionContent/exitEditor.html",
        newModuleServiceURL: '../webPageSectionContent/newModuleService.html'
    },

    ready: function () {
        var vm = this;
        this.setI18nProperties();
        this.loadModuleEdit();
    },

    methods: {


        saveModule: function () {
            var vm = this;
            vm.content.webPageSectionContentUIModel.sectionContent = $('.summernote').code();
            this.$http.post(vm.saveModuleURL, vm.content).then(function (response) {
                if (!JSON.parse(response.data).content) {
                    $.Notification.notify('error', 'top left', this.label.msgConnectFailure, this.label.msgLoadDataFailure);
                    return;
                }
                $.Notification.notify('success', 'top left', this.label.msgSaveOK, this.label.msgSaveOKComment);
                this.setModuleToUI(JSON.parse(response.data).content);
            });
        },

        loadModuleEdit: function () {
            var vm = this;
            var baseUUID = getUrlVar("uuid");
            var processMode = getUrlVar(LABEL_PROCESSMODE);
            if (processMode == PROCESSMODE_NEW) {
                // in case [Create mode]
                var url = this.newModuleServiceURL;
               this.$http.post(url, requestData).then(function (response) {
                    if (!JSON.parse(response.data).content) {
                        //$.Notification.notify('error', 'top left', this.label.msgConnectFailure, this.label.msgLoadDataFailure);
                        swal({
                            title: this.label.msgConnectFailure,
                            text: this.label.msgLoadDataFailure,
                            type: "error",
                            confirmButtonClass: 'btn-danger waves-effect waves-light',
                            confirmButtonText: this.label.confirm
                        });
                        return;
                    }
                    this.setModuleToUI(JSON.parse(response.data).content);
                });

            }
            if (processMode == PROCESSMODE_EDIT) {
                // In case [Edit mode]
                var url = this.loadModuleEditURL + "?uuid=" + baseUUID;
                var requestData = generateServiceSimpleContentUnion("uuid", baseUUID);
                this.$http.get(url).then(function (response) {
                    if (!JSON.parse(response.data).content) {
                        //$.Notification.notify('error', 'top left', this.label.msgConnectFailure, this.label.msgLoadDataFailure);
                        swal({
                            title: this.label.msgConnectFailure,
                            text: this.label.msgLoadDataFailure,
                            type: "error",
                            confirmButtonClass: 'btn-danger waves-effect waves-light',
                            confirmButtonText: this.label.confirm
                        });
                        return;
                    }
                    this.setModuleToUI(JSON.parse(response.data).content);

                });
            }
        },

        setModuleToUI: function (content) {
            var vm = this;
            vm.$set('content.webPageSectionContentUIModel', content.webPageSectionContentUIModel);
            $('.summernote').code(content.webPageSectionContentUIModel.sectionContent);
        },


        setI18nProperties: function () {
            getCommonI18n(jQuery.i18n, this.setI18nCommonProperties);
            jQuery.i18n.properties({
                name: 'WebPageSectionContent', //properties file name
                path: getI18nRootPath() + this.getI18nPath(), //path for properties files
                mode: 'map', //Using map mode to consume properties files
                language: getLan(),
                callback: this.setI18nPropertiesCore
            });
        },

        setI18nCommonProperties: function () {
            this.label.buttonSave = $.i18n.prop('save');
            this.label.buttonExit = $.i18n.prop('exit');
        },

        setI18nPropertiesCore: function () {
            this.label.sectionId = $.i18n.prop('sectionId');
            this.label.pageId = $.i18n.prop('pageId');
            this.label.sectionIndex = $.i18n.prop('sectionIndex');
            this.label.name = $.i18n.prop('name');
            this.label.sectionContent = $.i18n.prop('sectionContent');
            this.label.sectionIndex = $.i18n.prop('sectionIndex');
        },

        getI18nPath: function () {
            return "foundation/socialMedia/";
        }
    }
});



