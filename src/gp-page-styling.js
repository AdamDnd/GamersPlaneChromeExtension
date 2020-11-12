var applyPageStyle=function(styleText)
{
    var styleBlock=styleText;
    var styleRegEx=/\[style\]((\n|.)*?)\[\/style\]/m;
    const styleMatch = styleBlock.match(styleRegEx);
    if(styleMatch && styleMatch.length>=1){
        try {
        const styleObj=JSON.parse($.trim(styleMatch[1]));
        if(styleObj){
            if(styleObj.background){
                var bodyEle=$('body').addClass('style-background');
                var contentEle=$('#content');
                (!styleObj.background.image)||(contentEle.css({'background-image':'url('+styleObj.background.image+')'}));
                (!styleObj.background.color)||(contentEle.css({'background-color':styleObj.background.color}));
                (!styleObj.background.position)||(contentEle.css({'background-position':styleObj.background.position}));
                (!styleObj.background.size)||(contentEle.css({'background-size':styleObj.background.size}));
                
            }
        }
        }catch(e){
            //we tried - maybe the JSON isn't formatted correctly
        }
    }
    
}