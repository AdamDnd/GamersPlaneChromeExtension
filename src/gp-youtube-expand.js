$('.postContent .post').each(function(){
    var postContent=$(this);
    var linkNumber=1;

    $('a',postContent).each(function(){
        var thisLink=$(this);
        var href=$(this).attr('href');
        const regExp = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
        const match = href.match(regExp);

        if(match && match[5].length === 11)
        {
            var youtubeId=match[5];
            var footnoteLink='yt_'+linkNumber+'_'+youtubeId;
            var footnoteName='['+linkNumber+']';
            $('<a></a>').attr('href','#'+footnoteLink).text(footnoteName).addClass('ytLinkFootnote').insertAfter(thisLink);
            if(linkNumber==1)
            {
                $('<hr/>').appendTo(postContent);

            }
            $('<a></a>').attr('name',footnoteLink).text(footnoteName+' '+thisLink.text()).addClass('ytFootnote').appendTo(postContent);
            $('<iframe width="560" height="315" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>').attr('src','https://www.youtube.com/embed/'+youtubeId).appendTo(postContent);
        linkNumber++;
        }

    });

});