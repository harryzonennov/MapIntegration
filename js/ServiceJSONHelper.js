/**
 * Defination of constants, should be consistant with Java constant class
 * platform.foundation.LogicManager.Common.ServiceJSONDataConstants
 */
var ELE_API_KEY = "apiKey";

var ELE_CONTENT = "content";

var ELE_ERROR_CODE = "errorCode";

var ELE_ERROR_MSG = "errorMessage";

var ERROR_CODE_OK = 1;

var ERROR_CODE_UNKNOWN_SYS_ERROR = 200;

/**
 * This is for generate the JSON union
 * @param fieldName
 * @param fieldValue
 * @returns
 */
function generateBasicContentUnion(fieldName1, fieldValue1, fieldName2, fieldValue2, fieldName3, fieldValue3,
		fieldName4, fieldValue4, fieldName5, fieldValue5, fieldName6, fieldValue6,fieldName7, fieldValue7, fieldName8, fieldValue8,
		fieldName9, fieldValue9, fieldName10, fieldValue10,fieldName11, fieldValue11, fieldName12, fieldValue12){	
	var content = generateInnerBasicContentUnion(fieldName1,fieldValue1);
	if(fieldName2 != null && fieldValue2 != null){
		content = content + "," + generateInnerBasicContentUnion(fieldName2, fieldValue2);
	}
	if(fieldName3 != null && fieldValue3 != null){
		content = content + "," + generateInnerBasicContentUnion(fieldName3, fieldValue3);
	}
	if(fieldName4 != null && fieldValue4 != null){
		content = content + "," + generateInnerBasicContentUnion(fieldName4, fieldValue4);
	}
	if(fieldName5 != null && fieldValue5 != null){
		content = content + "," + generateInnerBasicContentUnion(fieldName5, fieldValue5);
	}
	if(fieldName6 != null && fieldValue6 != null){
		content = content + "," + generateInnerBasicContentUnion(fieldName6, fieldValue6);
	}
	if(fieldName7 != null && fieldValue7 != null){
		content = content + "," + generateInnerBasicContentUnion(fieldName7, fieldValue7);
	}
	if(fieldName8 != null && fieldValue8 != null){
		content = content + "," + generateInnerBasicContentUnion(fieldName8, fieldValue8);
	}
	if(fieldName9 != null && fieldValue9 != null){
		content = content + "," + generateInnerBasicContentUnion(fieldName9, fieldValue9);
	}
	if(fieldName10 != null && fieldValue10 != null){
		content = content + "," + generateInnerBasicContentUnion(fieldName10, fieldValue10);
	}
	if(fieldName11 != null && fieldValue11 != null){
		content = content + "," + generateInnerBasicContentUnion(fieldName11, fieldValue11);
	}
	if(fieldName12 != null && fieldValue12 != null){
		content = content + "," + generateInnerBasicContentUnion(fieldName12, fieldValue12);
	}
	return content;
}

function generateServiceSimpleContentUnion(fieldName1, fieldValue1, fieldName2, fieldValue2, fieldName3, fieldValue3,
		fieldName4, fieldValue4, fieldName5, fieldValue5, fieldName6, fieldValue6,fieldName7, fieldValue7, fieldName8, fieldValue8,
		fieldName9, fieldValue9, fieldName10, fieldValue10,fieldName11, fieldValue11, fieldName12, fieldValue12){	
	var content = generateBasicContentUnion(fieldName1, fieldValue1, fieldName2, fieldValue2, fieldName3, fieldValue3,
			fieldName4, fieldValue4, fieldName5, fieldValue5, fieldName6, fieldValue6,fieldName7, fieldValue7, fieldName8, fieldValue8,
			fieldName9, fieldValue9, fieldName10, fieldValue10,fieldName11, fieldValue11, fieldName12, fieldValue12);	
	return "{"+ content + "}";
}

function generateInnerBasicContentUnion(fieldName, fieldValue){
	return "\"" + fieldName + "\":" + "\"" + fieldValue + "\"";
}

/**
 * 
 * @param innerContentUnion:the inner content union in the form the JSON union to be included as [content].
 * @returns
 */
function generateServiceContentUnion(innerContentUnion){
	return "\"" + ELE_CONTENT + "\":{" + innerContentUnion + "}"; 
}

function generateServiceSimpleUnion(innerContentUnion){
	return "{" + innerContentUnion + "}"; 
}

/**
 * Serialize the form and return JSON data
 * @param formData
 * @returns
 */
function serializeForm(formData) {
	var requestData = formData.serializeArray();
	var content = "";
	$.each(requestData, function(i, val) {
		if (i < requestData.length - 1) {
			content = content
					+ generateInnerBasicContentUnion(requestData[i].name,
							requestData[i].value) + ","
		} else {
			content = content
					+ generateInnerBasicContentUnion(requestData[i].name,
							requestData[i].value)
		}
	});
	content = generateServiceSimpleUnion(content);
	return content;
}

/**
 * Generate the final JSON request data by content union and JSON 
 * 
 * @param apiKye
 * @param contentUnion
 * @returns
 */
function getJSONData(apiKey, contentUnion){
	return "{\"" + ELE_API_KEY + "\":\"" + apiKey + "\", "+ contentUnion + "}"; 
}

/**
 * Function to generate default JSON request for single field value
 * 
 * @param apiKey
 * @param fieldName
 * @param fieldValue
 * @returns
 */
function getSimpleFileRequestData(apiKey,fieldName1, fieldValue1, fieldName2, fieldValue2, fieldName3, fieldValue3,
		fieldName4, fieldValue4, fieldName5, fieldValue5, fieldName6, fieldValue6){
	var basicUnion = generateBasicContentUnion(fieldName1, fieldValue1, fieldName2, fieldValue2, fieldName3, fieldValue3,
			fieldName4, fieldValue4, fieldName5, fieldValue5, fieldName6, fieldValue6);
	var contentUnion = generateServiceContentUnion(basicUnion);
	var jsonData = getJSONData(apiKey,contentUnion);
	return jsonData;
}

