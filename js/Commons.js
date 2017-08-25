/*!
 * Important basic tool file, should be imported by every page
 */
/**
 * SE Controller Constant list block: Should be consistent with back end
 * class:platform.foundation.Controller.SEBasicController
 */
var LABEL_PROCESSMODE = "processMode";

var PROCESSMODE_NEW = 1;

var PROCESSMODE_EDIT = 2;

var PROCESSMODE_DISPLAY = 3;

var PROCESSMODE_STANDBY = 4;

var UIFLAG_STANDARD = 1;

var UIFLAG_FRAME = 2;

var UIFLAG_CHOOSER = 3;

/**
 * JSON View simple response constant, Should be consistent with backend
 * class:platform.foundation.Model.Basic.IServiceJSONBasicErrorCode
 */

var ERROR_CODE_OK = 1;

var ERROR_CODE_UNKNOWN_SYS_ERROR = 200;

var LABEL_SAVESUCCESS = "saveSuccess";

/**
 * This constant is used for later variable <code>processFlag</code>
 * indicate if current window is refresh again because of process
 * action,such as SAVE, or just exit the window, in order to avoid incorrect
 * action
 */
var PROCESS_FLAG_INITIAL = 1;

var PROCESS_FLAG_ACTION = 2;

/**
 * This variable is used to indicate if current window is refresh again
 * because of process action,such as SAVE, or just exit the window, in order
 * to avoid incorrect action
 */
var processFlag = PROCESS_FLAG_INITIAL;

/**
 * This constant is used for system standard switch value
 * should be consistent with backend class <code>platform.foundation.LogicManager.Common.StandardSwitchProxy</code>
 *
 */
var SWITCH_ON = 1;

var SWITCH_OFF = 2;

var SWITCH_INITIAL = 3;

/**
 * This constant is used for system standard message (error) type
 * should be consistent with backend class <code>platform.foundation.LogicManager.Common.StandardErrorTypeProxy</code>
 *
 */
var MESSAGE_TYPE_NOTIFICATION = 1;

var MESSAGE_TYPE_WARNING = 2;

var MESSAGE_TYPE_ERROR = 3;

/**
 * i18n folder constants
 */
var I18N_ROOTPATH = 'i18n/';

/**
 * Get i18n root path
 * @returns {string}
 */
function getI18nRootPath(){
   return I18N_ROOTPATH;
}

/**
 * Get current browser lanuguage
 *
 * @returns {string}
 */
function getLan(){
    var language = window.navigator.language;
    if(!language){
        language = window.navigator.browserLanguage;
    }
    language = language.toLowerCase();
    console.log(language);
    return language
}

/**
 * Return URL parameters
 * @returns {Array}
 */
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

/**
 * Get URL parameter value by parameter name
 * @param name
 * @returns {*}
 */
function getUrlVar(name) {
    var resultList = getUrlVars();
    return resultList[name];
}

var urlEncode = function (param, key, encode) {
    if(param==null) return '';
    var paramStr = '';
    var t = typeof (param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
    } else {
        for (var i in param) {
            var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
            paramStr += urlEncode(param[i], k, encode);
        }
    }
    return paramStr;
};

/**
 * Generate the common Edit url with uuid and set default edit process mode
 * @param baseEditURL
 * @param uuid
 * @returns {string}
 */
function genCommonEditURL(baseEditURL, uuid){
    var paras = {};
    paras.uuid = uuid;
    paras.processMode = PROCESSMODE_EDIT;
    var resultURL = baseEditURL + "?" + urlEncode(paras);
    return resultURL;
}

function genUUID(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}


/**
 * Get sub path for common 18n
 * @returns {string}
 */
function getCommonI18nPath(){
    return "foundation/";
}

function getCommonI18n(i18n, callBackFunction){
    i18n.properties({
        name : 'ComElements', //properties file name
        path : getI18nRootPath() + getCommonI18nPath(), //path for properties files
        mode : 'map', //Using map mode to consume properties files
        language : getLan(),
        callback: callBackFunction
    });
}


function changeTwoDecimal(x) {
    var f_x = parseFloat(x);
    if (isNaN(f_x)) {
        alert('function:changeTwoDecimal->parameter error');
        return false;
    }
    f_x = Math.round(f_x * 100) / 100;
    return f_x;
}

function formatSelectResult(rawList, idField, textField){
    if(!rawList || rawList.length == 0){
        return null;
    }
    var resultList = [];
    for(var i=0; i < rawList.length; i++){
        var element = {'id':rawList[i][idField], 'text':rawList[i][textField]}
        resultList.push(element);
    }
    return resultList;
}

function changeSixDecimal(x) {
    var f_x = parseFloat(x);
    if (isNaN(f_x)) {
        alert('function:changeTwoDecimal->parameter error');
        return false;
    }
    f_x = Math.round(f_x * 1000000) / 1000000;
    return f_x;
}


function stringFormat(template, arg) {
    if (!template) {
        return;
    }
    var re = "%S";
    return template.replace(re, arg);
}

stringMultipleFormat = function () {
    if (arguments.length == 0)
        return null;
    var template = arguments[0];
    var re = "%S";
    for (var i = 1; i < arguments.length; i++) {
        template = template.replace(re, arguments[i]);
    }
    return template;
}

function stopLoadingIcon(target, coverObject) {
    if (target) {
        if (coverObject) {
            coverObject.style.opacity = "1";
        } else {
            target.style.opacity = "1";
        }
        spinner.spin();
    }
}

/**
 * Non empty value check the mobile number
 * @param inputVal
 * @returns {boolean}
 */
function checkMobileInput(inputVal) {
    if (!inputVal) {
        return false;
    }
    var mobile = $.trim(inputVal);
    if (!mobile) {
        return false;
    }
    var isMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
    if (!isMobile.exec(mobile) && mobile.length != 11) {
        return false;
    } else {
        return true;
    }
}

/**
 * OK with the empty value
 * @param inputVal
 * @returns {boolean}
 */
function checkGenEmptyTelephoneNumber(inputVal) {
    if (!inputVal) {
        return true;
    }
    var isMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
    var isPhone = /^(?:(?:0\d{2,3})-)?(?:\d{7,8})(-(?:\d{3,}))?$/;
    if (inputVal.substring(0, 1) == 1) {
        var mobile = $.trim(inputVal);
        if (!isMobile.exec(mobile) && mobile.length != 11) {
            return false;
        }
    }
    // if start with 1. then checking the mobile phone
    else if (inputVal.substring(0, 1) == 0) {
        var telephone = $.trim(inputVal);
        if (!isPhone.test(telephone)) {
            return false;
        }
    }
    else {
        return false;
    }
    return true;
}

/**
 * if the string contains the substring
 * @param string
 * @param substr
 * @param isIgnoreCase
 * @returns {Boolean}
 */
function contains(string, substr, isIgnoreCase){
    if (isIgnoreCase){   
    	 string = string.toLowerCase();
         substr = substr.toLowerCase();
    }
    if(string){
    	string = trimString(string);
    }
    if(substr){
    	substr = trimString(substr);
    }
    var startChar = substr.substring(0, 1);
    var strLen = substr.length;
    for (var j = 0; j<string.length - strLen + 1; j++){
         if (string.charAt(j) == startChar) { 
        	 //if matches start char then start search
             if (string.substring(j, j+strLen) == substr){
                 return true;
             }   
         }
    }
    return false;
}


function trimString(string){
	return string.replace(/^\s\s*/, '' ).replace(/\s\s*$/, '' ); 
}





