var searchButton=$('<a id="postSearch">Search</a>').prependTo($('#threadMenu .rightCol'));

var getPostBlocks=function(basePage,pageNum,searchFor,ret,onComplete)
{
    $.get( basePage+'?page='+pageNum, function( data ) {
        var pageData=$(data);
        $('.postBlock',pageData).each(function(){
            var block=$(this);
            if(($('.post',block).html().toLowerCase().indexOf(searchFor)!=-1) ||
               ($('.posterDetails',block).html().toLowerCase().indexOf(searchFor)!=-1))
            {
                ret.push(block.clone());
            }
        });

        var hasMorePages=false;
        var pagination=$('.paginateDiv',pageData);
        if(pagination.length>0)
        {
            var nextPage=$('a',pagination).filter(function() {return $(this).text() === ">";});
            if(nextPage.length>0)
            {
                hasMorePages=true;
            }
        }
        if(hasMorePages)
        {
            searchButton.text('Searching ('+(pageNum+1)+')...');
            getPostBlocks(basePage,pageNum+1,searchFor,ret,onComplete)
        }
        else
        {
            onComplete(ret);
        }
    });    
}

searchButton.on('click',function(){
    var searchFor=prompt("Text to find", "");
    if(searchFor!=null && searchFor.length>0)
    {
        $('.postBlockFound').remove();
        var basePage=window.location.href.split('?')[0];
        searchButton.text('Searching (1)...');
        var postBlocks=getPostBlocks(basePage,1,searchFor.toLowerCase(),[],function(ret){
            if(ret.length>0)
            {

                var threadMenu=$('#threadMenu');
                for(var i=ret.length-1;i>=0;i--)
                {
                    var addedBlock=($(ret[i]).insertAfter(threadMenu)).addClass('postBlockFound');
                    if(i==(ret.length-1))
                    {
                        addedBlock.addClass('lastPostBlockFound');
                    }

                    $('.spoiler>.tag',addedBlock).on('click',function(){$(this).closest('.spoiler').toggleClass('closed');});
                }
            }
            var title=$('<div class="postBlock postRight postAsChar withCharAvatar clearfix postBlockFound"><h1></h1></div>').insertAfter(threadMenu);
            $('h1',title).text(searchFor+": "+ret.length+' results');

        searchButton.text('Search');
        });
    }
});