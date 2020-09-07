var settingStorage=(/chrome/.test(navigator.userAgent.toLowerCase()))?chrome.storage.sync:chrome.storage.local;

function getXMLHttp(){
    try {
       return XPCNativeWrapper(new window.wrappedJSObject.XMLHttpRequest());
    }
    catch(evt){
       return new XMLHttpRequest();
    }
 }

function gpAjaxPost(url,data,onSuccess){
    var xhr=getXMLHttp();
    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");    
    xhr.withCredentials = true;
    
    xhr.onreadystatechange = function() { 
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            onSuccess(xhr.responseText);
        }
    }
    xhr.send(JSON.stringify(data));
 }

 function gpAjaxPostFormData(url,data,onSuccess){
    var xhr=getXMLHttp();
    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");    
    xhr.withCredentials = true;
    
    xhr.onreadystatechange = function() { 
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            onSuccess(xhr.responseText);
        }
    }

    var urlEncodedDataPairs = [];

    for(var propertyName in data) {
        urlEncodedDataPairs.push( encodeURIComponent( propertyName ) + '=' + encodeURIComponent( data[propertyName] ) );
    }

    var urlEncodedData = urlEncodedDataPairs.join( '&' ).replace( /%20/g, '+' );
    xhr.send(urlEncodedData);
 }
