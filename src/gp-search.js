var searchButton = $('<a id="postSearch">Search</a>').prependTo($('#threadMenu .rightCol'));
$('<span"> | </span>').prependTo($('#threadMenu .rightCol'));
var singlePageButton = $('<a id="postSinglePage">One page</a>').prependTo($('#threadMenu .rightCol'));
$('<span"> | </span>').prependTo($('#threadMenu .rightCol'));
var backfillButton = $('<a id="backfillPage">Backfill</a>').prependTo($('#threadMenu .rightCol'));

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

searchButton.on('click', function () {
    var searchFor = prompt("Text to find", "");
    if (searchFor != null && searchFor.length > 0) {
        searchFor = searchFor.toLowerCase();
        var ret = [];

        $('.postBlockFound').remove();
        $('.postBlock').show();

        var basePage = window.location.href.split('?')[0];
        var postBlocks = getPostBlocks(basePage, 1,
            function (pageNum) {
                searchButton.text('Searching (' + pageNum + ')...');
            },
            function (blocks) {
                blocks.each(function () {
                    var block = $(this);
                    if (($('.post', block).html().toLowerCase().indexOf(searchFor) != -1) ||
                        ($('.posterDetails', block).html().toLowerCase().indexOf(searchFor) != -1)) {
                        ret.push(block.clone());
                    }
                });

            },
            function () {
                if (ret.length > 0) {

                    var threadMenu = $('#threadMenu');
                    for (var i = ret.length - 1; i >= 0; i--) {
                        var addedBlock = ($(ret[i]).insertAfter(threadMenu)).addClass('postBlockFound');
                        if (i == (ret.length - 1)) {
                            addedBlock.addClass('lastPostBlockFound');
                        }

                        $('.spoiler>.tag', addedBlock).on('click', function () { $(this).closest('.spoiler').toggleClass('closed'); });
                    }
                }
                var title = $('<div class="postBlock postRight postAsChar withCharAvatar clearfix postBlockFound"><h1></h1></div>').insertAfter(threadMenu);
                $('h1', title).text(searchFor + ": " + ret.length + ' results');

                searchButton.text('Search');
            });
    }
});

singlePageButton.on('click', function () {
    $('.postBlockFound').remove();
    $('.postBlock').hide();
    var basePage = window.location.href.split('?')[0];
    var lastAdded = $('#threadMenu');
    var postBlocks = getPostBlocks(basePage, 1,
        function (pageNum) {
            singlePageButton.text('Loading (' + pageNum + ')...');
        },
        function (blocks) {
            blocks.each(function () {
                var block = $(this);
                var addedBlock = (block.clone().insertAfter(lastAdded)).addClass('postBlockFound');
                lastAdded = addedBlock;
                $('.spoiler>.tag', addedBlock).on('click', function () { $(this).closest('.spoiler').toggleClass('closed'); });
            });
        },
        function () {
            singlePageButton.text('One page');
        });
});

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
                $('.spoiler>.tag', addedBlock).on('click', function () { $(this).closest('.spoiler').toggleClass('closed'); });

                var newHeight=$(document).height()
                $(window).scrollTop(startScroll+(newHeight-startHeight));
            
                loadPageNumbers(prevPages,i+1);
            });
        
        }
    };
    
    loadPageNumbers(prevPages,0);

});