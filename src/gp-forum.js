var gameDetails = $('#fixedMenu_window .rightCol a.menuLink');

if (gameDetails.length > 0) {
    var gameDetailsHref = gameDetails.attr('href').split('/');
    var gameId = gameDetailsHref[2];
    var isGm = false;

    gpAjaxPost("https://api.gamersplane.com/games/details", { gameID: gameId }, function (gameData) {
        var gameDataJson=JSON.parse(gameData);
        (!gameDataJson.details.description)||(applyPageStyle(gameDataJson.details.description));
    });
}
    
var analysisLink=$('<div class="userAnalysis userAnalysisLink">...</div>').appendTo($('#forumOptions'));
analysisLink.on('click',function(){

    if(analysisLink.text()!='...')
        return;

    analysisLink.removeClass('userAnalysisLink');
    analysisLink.html('<h3 class="analysisWorking">Collecting data (go get a coffee)...</h3>');

    var forumsFound=[];

    var forumComplete=function(forum){
        forum.forumJq.removeClass('analysisWorking');
        forum.forumJq.addClass('analysisComplete');
        if($('.forumWorking.analysisWorking',analysisLink).length==0){
            analysisLink.html('<h3 class="analysisWorking">Analysing...</h3>');
            //analyse data
            analyseData();
        }
    };

    var wordCount=function (str) {
        return str.split(' ').filter(function(n) { return n != '' }).length;
   };

    var analyseData=function(){
        var users={};
        var dateNow=Date.now();
        var maxWeeksBetween=0;
        var maxActivity=0;
        for(var i=0;i<forumsFound.length;i++){
            var forum=forumsFound[i];
            for(var j=0;j<forum.posts.length;j++)
            {
                var post=forum.posts[j];
                
                if(users[post.posterId]== undefined){
                     users[post.posterId]={dateCount:[],wordCount:0,posterName:post.posterName,posts:0,maxHeat:0};
                }

                var postedDate=Date.parse(post.postedOn);
                users[post.posterId].wordCount=users[post.posterId].wordCount+post.wordCount;
                users[post.posterId].posts=users[post.posterId].posts+1;

                var weeksBetween=Math.floor(( dateNow - postedDate ) / (86400000*3));

                if(users[post.posterId].dateCount[weeksBetween]==undefined){
                    users[post.posterId].dateCount[weeksBetween]=1;
                }
                else{
                    users[post.posterId].dateCount[weeksBetween]=users[post.posterId].dateCount[weeksBetween]+1;
                }

                if(users[post.posterId].dateCount[weeksBetween]>maxActivity){
                    maxActivity=users[post.posterId].dateCount[weeksBetween];
                }
                if(users[post.posterId].dateCount[weeksBetween]>users[post.posterId].maxHeat){
                    users[post.posterId].maxHeat=users[post.posterId].dateCount[weeksBetween];
                }

                if(weeksBetween>maxWeeksBetween){
                    maxWeeksBetween=weeksBetween;
                }
            }
        }

        var userList=Object.keys(users);

        analysisLink.html('');

        for(var i=0;i<userList.length;i++){
            var userId=userList[i];
            var posterDetails=$('<div>'+
                                    '<h3></h3>'+
                                    '<div class="userHeat"></div>'+
                                    '<div class="normUserHeat"></div>'+
                                    '<div>Posts: <span class="postCount"></span></div>'+
                                    '<div>Words: <span class="wordCount"></span></div>'+
                                '</div>').appendTo(analysisLink);

            $('h3',posterDetails).text(users[userId].posterName);
            $('.postCount',posterDetails).text(users[userId].posts.toLocaleString());
            $('.wordCount',posterDetails).text(users[userId].wordCount.toLocaleString());
            var userHeat=$('.userHeat',posterDetails);
            var normUserHeat=$('.normUserHeat',posterDetails);
            for(var j=maxWeeksBetween;j>=0;j--){
                if(users[userId].dateCount[j]==undefined){
                    $('<span class="heat0 heat"></span>').appendTo(userHeat);
                    $('<span class="heat0 heat"></span>').appendTo(normUserHeat);
                }
                else{
                    var heatLevel=Math.ceil(((users[userId].dateCount[j]*4)-1)/maxActivity);
                    $('<span class="heat'+heatLevel+' heat"></span>').appendTo(userHeat);
                    var normHeatLevel=Math.ceil(((users[userId].dateCount[j]*4)-1)/users[userId].maxHeat);
                    $('<span class="heat'+normHeatLevel+' heat"></span>').appendTo(normUserHeat);

                }

            }
        }

        
    };

    var getForums=function(pageLink,pageNum)
    {
        $.get(pageLink+'?page='+pageNum, function (data) {
            var pageData = $(data);
            var breadcrumb=$('#breadcrumbs',pageData).text();

            var forum={pageLink:pageLink, breadcrumb:breadcrumb,posts:[]};

            var subForums=$('.forumList .tr .name>a',pageData);
            var threads=$('.threadList .tr .threadInfo>a',pageData);

            var forumJq=$('<div class="analysisWorking forumWorking"></div>').text(breadcrumb+' ('+pageNum+')').appendTo(analysisLink);
            forum.forumJq=forumJq;

            forumsFound.push(forum);

            //load subforums if on page 1
            if(pageNum==1){
                for(var i=0;i<subForums.length;i++){
                    getForums(subForums.eq(i).attr('href'),1);
                }
            }

            var threadsRead=0;
            //load threads
            if(threads.length==0){
                forumComplete(forum);
            }
            else{
                for(var i=0;i<threads.length;i++){
                    getPosts(forum,threads.eq(i).attr('href'),1,function(){
                        threadsRead++;
                        if(threads.length==threadsRead){
                            forumComplete(forum);
                        }                        
                    });
                }

                if(threads.length==0){
                    forumComplete(forum);
                }else{
                    getForums(pageLink,pageNum+1);
                }

    
            }

        });

    };

    var getPosts=function(forum,threadHref,pageNum,onComplete){
        var loadPage=threadHref + '?page=' + pageNum;
        var cachedStorage=localStorage.getItem('gpanalysis-'+loadPage);
        if(cachedStorage==null)
        {
            $.get(loadPage, function (data) {
                var pageData = $(data);
                var thisPage=[];
    
                var posts=$('.postBlock',pageData);
                for(var i=0;i<posts.length;i++){
                    var post=posts.eq(i);
                    var posterName=$('.posterName',post).text();
                    var posterId='p_'+$('.posterName .username',post).attr('href').replace(/\//g, "_");
                    
                    var postedOn=$('.postedOn',post).text();
                    var postContent=$('.post',post);
                    $('blockquote.quote',postContent).remove();
                    var storeData={posterName:posterName,posterId:posterId,postedOn:postedOn,wordCount:wordCount(postContent.text())};
                    forum.posts.push(storeData);
                    thisPage.push(storeData);
                }
    
                var hasMorePages = false;
                var pagination = $('.paginateDiv', pageData);
                if (pagination.length > 0) {
                    var nextPage = $('a', pagination).filter(function () { return $(this).text() === ">"; });
                    if (nextPage.length > 0) {
                        hasMorePages = true;
                    }
                }
                if (hasMorePages) {
                    window.localStorage.setItem('gpanalysis-'+loadPage,JSON.stringify(thisPage));
                    getPosts(forum,threadHref, pageNum + 1,onComplete);
                }
                else {
                    onComplete();
                }
        
            });
    
        }
        else{
            var cachedPage=JSON.parse(cachedStorage);
            for(var i=0;i<cachedPage.length;i++){
                forum.posts.push(cachedPage[i]);
            }
            getPosts(forum,threadHref, pageNum + 1,onComplete);
        }

    };

    getForums(window.location.href,1);


});