
var findDndB=function(){
    var notesText=$('#notes textarea').val();
    var notesRegex = notesText.matchAll(/ddb.ac\/characters\/([\w]*)\/uTskQp/gm);
    var charId=null;

    var arr=Array.from(notesRegex, m => m[1]);
    if(arr && arr.length==1){
        charId=arr[0];
    }

    $('#notes .getDnDBFn').remove();
    if(charId!=null){
        $('<a target="_blank" class="getDnDBFn getDnDB">Get D&amp;D Beyond character JSON</a>').attr('href','https://character-service.dndbeyond.com/character/v3/character/'+charId).prependTo($('#notes'));
    }

    $('#notes').on('click','.getDnDB',function(){
        if($('#notes .pasteDnDBSjson').length==0){
            var pThis=$(this);
            pThis.after($('<p class="getDnDBFn">Copy all the JSON from the other tab. <span class="pasteDnDBSjson">Click here to paste it</span></p>'));
    
        }
    });

    $('#notes').on('click','.pasteDnDBSjson',function(){
        $('<div id="panelPasteDnDBJsonOverlay"></div>').appendTo('body');
        $('<div id="panelPasteDnDBJson">'+
                '<div class="panelPasteDnDBJsonTextAreaContainer"><textarea placeholder="Paste your character JSON here"></textarea></div>'+
                '<div class="panelPasteDnDBJsonButtonBar"><button id="panelPasteDnDBJsonOk" class="fancyButton">OK</button> <button id="panelPasteDnDBJsonCancel" class="fancyButton">Cancel</button></div>'+
            '</div>').appendTo('body');

        $('#panelPasteDnDBJson textarea').focus();
    });
    
    $('body').on('click','#panelPasteDnDBJsonCancel',function(){
        $('#panelPasteDnDBJsonOverlay').remove();
        $('#panelPasteDnDBJson').remove();
    });

    $('body').on('click','#panelPasteDnDBJsonOk',function(){
        var json=$('#panelPasteDnDBJson textarea').val();
        $('#panelPasteDnDBJsonOverlay').remove();
        $('#panelPasteDnDBJson').remove();

        var character=JSON.parse(json);


    });

}

//findDndB();

