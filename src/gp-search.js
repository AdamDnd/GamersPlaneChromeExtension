var backfillButton = $('<a id="backfillPage">Backfill</a>').prependTo($('#threadMenu .rightCol .paginateDiv'));

var getPostBlocks = function (basePage, pageNum, onLoadingPage, onLoadedPosts, onComplete) {
    onLoadingPage(pageNum);

    $.get(basePage + '?page=' + pageNum, function (data) {
        var pageData = $(data);
        onLoadedPosts($('.postBlock', pageData));

        var hasMorePages = false;
        var pagination = $('.paginateDiv', pageData);
        if (pagination.length > 0) {
            var nextPage = $('a', pagination).filter(function () { return $(this).text() === ">"; });
            if (nextPage.length > 0) {
                hasMorePages = true;
            }
        }
        if (hasMorePages) {
            getPostBlocks(basePage, pageNum + 1,onLoadingPage, onLoadedPosts, onComplete);
        }
        else {
            onComplete();
        }
    });
}



backfillButton.on('click',function(){
    $('.postBlockFound').remove();

    var basePage = window.location.href.split('?')[0];
    var prevPages=$('.paginateDiv a.page').prevAll('a').filter(function( index ) {return !isNaN($(this).text());});
    var topOfPage=$('#threadMenu');


    var loadPageNumbers=function(prevPages,i)
    {
        if(i<prevPages.length)
        {
            var startScroll = $(window).scrollTop();
            var startHeight=$(document ).height()

            $.get(basePage + '?page=' + $(prevPages[i]).text(), function (data) {
                var block=$('.postBlock', $(data));
                var addedBlock = (block.clone().insertAfter(topOfPage)).addClass('postBlockFound');

                var newHeight=$(document).height()
                $(window).scrollTop(startScroll+(newHeight-startHeight));

                loadPageNumbers(prevPages,i+1);
            });

        }
    };

    loadPageNumbers(prevPages,0);

});