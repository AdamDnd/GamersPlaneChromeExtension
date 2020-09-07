if(document.referrer)
{
    var postNumMatch=window.location.pathname.match(/.*\/(\d*)\//);
    if(postNumMatch.length==2)
    {
        var postNum=postNumMatch[1];
        if(document.referrer.match(/.*\/(\d*)\/\.*/))
        {
            $.get(document.referrer, function (data) {    
                var pageContent = $(data);
                var postBlock=$('a[href="/forums/editPost/'+postNum+'/"]',pageContent).closest('.postBlock ');
                var lastRolls=$('.rolls',postBlock);
                if(lastRolls.length>0)
                {
                    var prevRollSection=$('<div><hr/><h3>Previous rolls</h3><div class="previousRolls"></div></div>').insertAfter($('#newRolls'));
                    $('div.previousRolls',prevRollSection).html(lastRolls.html());
                }
            });
        
        }
        
    }
    
}


