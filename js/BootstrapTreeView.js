var ELEMENT_UUID_ID = "x_element_uuid";

/**
 * ICON style constants area
 */

var ICON_STYLE_GLYPHICON = "glyphicon";

/**
 * ICON class constants area
 */

var ICON_BARCODE = "icon-barcode";

var ICON_TH = "icon-th";

var ICON_TH_LIST = "icon-th-list";

var ICON_OK = "icon-ok";

var ICON_OFF = "icon-off";

var ICON_REMOVE = "icon-remove";

var ICON_LIST = "icon-list";

var ICON_PENCIL = "icon-pencil";

var ICON_CALENDAR = "icon-calendar";

var ICON_RANDOM = "icon-random";

var ICON_TIME = "icon-time";

var ICON_SHOPPING_CART = "icon-shopping-cart";

var ICON_FILTER = "icon-filter";

var ICON_TASKS = "icon-tasks";

var ICON_WRENCH = "icon-wrench";

/**
 * Main entrance method for get ICON class
 * @param rawICONClass
 * @param iconStyle
 */
function getICONClass(rawICONClass, iconStyle) {
    switch (iconStyle) {
        case ICON_STYLE_GLYPHICON:
            return getICONClassGlyphicon(rawICONClass);
        default :
            return rawICONClass;
    }
}

/**
 * Core method for mapping icon class to glyphicon style
 * @param rawICONClass
 * @returns {*}
 */
function getICONClassGlyphicon(rawICONClass) {
    switch (rawICONClass) {
        case ICON_BARCODE:
            return "glyphicon glyphicon-th";
        case ICON_TH:
            return "glyphicon glyphicon-th";
        case ICON_TH_LIST:
            return "glyphicon glyphicon-th-list";
        case ICON_OK :
            return "glyphicon glyphicon-ok";
        case ICON_OFF:
            return "glyphicon glyphicon-off";
        case ICON_REMOVE :
            return "glyphicon glyphicon-remove";
        case ICON_LIST :
            return "glyphicon glyphicon-list";
        case ICON_PENCIL:
            return "glyphicon glyphicon-pencil";
        case ICON_CALENDAR:
            return "glyphicon glyphicon-calendar";
        case ICON_RANDOM :
            return "glyphicon glyphicon-random";
        case ICON_TIME :
            return "glyphicon glyphicon-time";
        case ICON_SHOPPING_CART:
            return "glyphicon glyphicon-shopping-cart";
        case ICON_FILTER :
            return "glyphicon glyphicon-filter";
        case ICON_TASKS:
            return "glyphicon glyphicon-tasks";
        case ICON_WRENCH :
            return "glyphicon glyphicon-wrench";
        default :
            return rawICONClass;
    }
}


function generateBootstrapTreeContent(content) {
    var xmlDoc = document.implementation.createDocument("", "", null);
    // Add li element
    var treeLIElement = xmlDoc.createElement("li");
    treeLIElement.setAttribute("class", "parent_li");
    generateHead(treeLIElement, xmlDoc, content);
    return treeLIElement
}


function generateHead(parentElement, xmlDoc, content) {
    var spanElement = xmlDoc.createElement("span");
    parentElement.appendChild(spanElement);
    // Add span element
    if (content.spanClass && content.spanClass != "") {
        spanElement.setAttribute("class", content.spanClass);
    }
    // Add UUID element
    if (content.uuid && content.uuid != null) {
        generateUUIDElement(xmlDoc, spanElement, content.uuid);
    }
    // Add icon element
    if (content.iconClass && content.iconClass != "") {
        var iconElement = xmlDoc.createElement("i");
        spanElement.appendChild(iconElement);
        var iconClass = getICONClass(content.iconClass, ICON_STYLE_GLYPHICON);
        iconElement.setAttribute("class", iconClass);
    }
    // Add span text element
    var spanTextNode = xmlDoc.createTextNode(content.spanContent);
    spanElement.appendChild(spanTextNode);
    if (content.editURL && content.editURL != "") {
        var ahrefElement = xmlDoc.createElement("a");
        spanElement.appendChild(ahrefElement);
        ahrefElement.setAttribute("href", content.editURL);
        ahrefElement.setAttribute("class","badge");
        // Add Post Icon class
        if (content.postIconClass && content.postIconClass != "") {
            var postIconElement = xmlDoc.createElement("i");
            ahrefElement.appendChild(postIconElement);
            var iconClass = getICONClass(content.postIconClass, ICON_STYLE_GLYPHICON);
            postIconElement.setAttribute("class", iconClass);
        }
    }
    // Add post content Array
    if (content.postModelList && content.postModelList.length > 0) {
        for (var i = 0; i < content.postModelList.length; i++) {
            var postContent = content.postModelList[i];
            if (postContent) {
                generatePostContentUnion(parentElement, xmlDoc, postContent);
            }
        }
    }
    var ulElement = xmlDoc.createElement("ul");
    parentElement.appendChild(ulElement);
    if (content.subModelList && content.subModelList.length > 0) {
        for (var i = 0; i < content.subModelList.length; i++) {
            var liElement = xmlDoc.createElement("li");
            ulElement.appendChild(liElement);
            var subContent = content.subModelList[i];
            if (subContent) {
                liElement.setAttribute("class", "parent_li");
                generateSubContentRecurv(liElement, xmlDoc, subContent);
            }
        }
    }
}

/**
 * Union to generate UUID element
 * @param xmlDoc
 * @param parentElement
 */
function generateUUIDElement(xmlDoc, parentElement, uuid) {
    var uuidElement = xmlDoc.createElement("input");
    uuidElement.setAttribute("type", "hidden");
    uuidElement.setAttribute("id", ELEMENT_UUID_ID);
    uuidElement.setAttribute("name", ELEMENT_UUID_ID);
    uuidElement.setAttribute("value", uuid);
    parentElement.appendChild(uuidElement);
}

/**
 * Return UUID Value by parent li element
 * @param liElement
 * @returns {*}
 */
function getUUIDValue(liElement) {
    var selected_uuid = liElement.children("#" + ELEMENT_UUID_ID).attr("value");
    return selected_uuid;
}

/**
 * [Internal method] to generate post content node
 * @param parentElement
 * @param xmlDoc
 * @param postContent
 */
function generatePostContentUnion(parentElement, xmlDoc, postContent) {
    var splitTextNode = xmlDoc.createTextNode("   ");
    var postSpanElement = xmlDoc.createElement("span");
    parentElement.appendChild(splitTextNode);
    parentElement.appendChild(postSpanElement);
    if (postContent.spanClass && postContent.spanClass != "") {
        postSpanElement.setAttribute("class", postContent.spanClass);
    }
    if (postContent.iconClass && postContent.iconClass != "") {
        var postIconElement = xmlDoc.createElement("i");
        postSpanElement.appendChild(postIconElement);
        var iconClass = getICONClass(postContent.iconClass, ICON_STYLE_GLYPHICON);
        postIconElement.setAttribute("class", iconClass);
    }
    var spanTextNode = xmlDoc.createTextNode(postContent.spanContent);
    postSpanElement.appendChild(spanTextNode);
    if (postContent.editURL && postContent.editURL != "") {
        var ahrefElement = xmlDoc.createElement("a");
        postSpanElement.appendChild(ahrefElement);
        ahrefElement.setAttribute("href", postContent.editURL);
        if (postContent.postIconClass && postContent.postIconClass != "") {
            var postAfterIconElement = xmlDoc.createElement("i");
            ahrefElement.appendChild(postAfterIconElement);
            var iconClass = getICONClass(postContent.postIconClass, ICON_STYLE_GLYPHICON);
            postAfterIconElement.setAttribute("class", iconClass);
        }
    }

}

function generateSubContentRecurv(parentElement, xmlDoc, content) {
    var spanElement = xmlDoc.createElement("span");
    parentElement.appendChild(spanElement);
    // Add Span element
    if (content.spanClass && content.spanClass != "") {
        spanElement.setAttribute("class", content.spanClass);
    }
    // Add UUID element
    if (content.uuid && content.uuid != null) {
        generateUUIDElement(xmlDoc, spanElement, content.uuid);
    }
    // Add ICON element
    if (content.iconClass && content.iconClass != "") {
        var iconElement = xmlDoc.createElement("i");
        spanElement.appendChild(iconElement);
        var iconClass = getICONClass(content.iconClass, ICON_STYLE_GLYPHICON);
        iconElement.setAttribute("class", iconClass);
    }
    // Add Span Text node
    var spanTextNode = xmlDoc.createTextNode(content.spanContent);
    spanElement.appendChild(spanTextNode);
    if (content.editURL && content.editURL != "") {
        var ahrefElement = xmlDoc.createElement("a");
        spanElement.appendChild(ahrefElement);
        ahrefElement.setAttribute("href", content.editURL);
        if (content.postIconClass && content.postIconClass != "") {
            var postIconElement = xmlDoc.createElement("i");
            ahrefElement.appendChild(postIconElement);
            var iconClass = getICONClass(content.postIconClass, ICON_STYLE_GLYPHICON);
            postIconElement.setAttribute("class", iconClass);
        }
    }

    if (content.postfixContent && content.postfixContent != "") {
        var textNode = xmlDoc.createTextNode(content.postfixContent);
        if (content.editURL && content.editURL != "") {
            var ahrefElement = xmlDoc.createElement("a");
            ahrefElement.setAttribute("href", content.editURL);
            parentElement.appendChild(ahrefElement);
            ahrefElement.appendChild(textNode);
        } else {
            parentElement.appendChild(textNode);
        }
    }
    if (content.postModelList && content.postModelList.length > 0) {
        for (var i = 0; i < content.postModelList.length; i++) {
            var postContent = content.postModelList[i];
            if (postContent) {
                generatePostContentUnion(parentElement, xmlDoc, postContent);
            }
        }
    }
    var ulElement = xmlDoc.createElement("ul");
    parentElement.appendChild(ulElement);
    if (content.subModelList && content.subModelList.length > 0) {
        for (var i = 0; i < content.subModelList.length; i++) {
            var liElement = xmlDoc.createElement("li");
            ulElement.appendChild(liElement);
            var subContent = content.subModelList[i];
            if (subContent) {
                liElement.setAttribute("class", "parent_li");
                generateSubContentRecurv(liElement, xmlDoc, subContent);
            }
        }
    }
}


