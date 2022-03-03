var byJsonPath = function(obj, path) {
    path = path.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');
    var splitPath = path.split('.');
    for (var i = 0; i < splitPath.length; i++) {
        var entry = splitPath[i];
        if (entry in obj) {
            obj = obj[entry];
        } else {
            return null;
        }
    }
    return obj;
};

var replaceHandlebars = function(text,obj){

    text = text.replace(/{{#([\w.]*)}}(.*?){{\/#\1}}/gs, function(match, p1,p2){
        var objInner=byJsonPath(obj,p1);
        var ret='';
        if(objInner && Array.isArray(objInner)){
            for(var i=0;i<objInner.length;i++){
                ret+=replaceHandlebars(p2,objInner[i]);
            }
        }
        return ret;
    });


    text = text.replace(/({{)([\w\.\[\]]+)(}})/g, function(match, p1,p2,p3){
        var retObj=byJsonPath(obj,p2);
        if (typeof retObj == "boolean") {
            return retObj?"1":"0";
        }
        return (retObj!=null)?retObj.toString():"";
    });

    return text;

}

var pasteDndBCharacter=function(character){

    var charSheet=$('textarea.markItUpEditor').val();

    charSheet=replaceHandlebars(charSheet,character);

    $('textarea.markItUpEditor').focus().val(charSheet);

    var customEvent = document.createEvent('Event');
    customEvent.initEvent('change', true, true);
    $('textarea.markItUpEditor')[0].dispatchEvent(customEvent);
};


chrome.storage.local.get({dndbcharacter:null},function(result) {
    if(result && result.dndbcharacter){
        $('<span class="pasteFromDndB"></span>').text('Paste DndB:'+result.dndbcharacter.name).prependTo($('#charAvatar')).on('click',function(){
            pasteDndBCharacter(result.dndbcharacter);

            settingStorage.set({
                dndbcharacter: null
                }, function() {});

            $(this).remove();
        });
    }
});
