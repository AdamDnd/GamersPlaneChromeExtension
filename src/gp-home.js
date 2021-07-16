$('#latestGamePosts .skewedDiv').text('Game forums');

var widgetBody = $('#latestGamePosts .widgetBody').html('');
var latestGames = $('<div class="latestGamePosts"></div>').appendTo($('#latestPosts .widgetBody'));
if($('.sideWidget .loggedIn .games .gameInfo').length>0){
  $('<h3 class="headerbar" style="transform: skew(-30deg); margin-left: 9px; margin-right: 9px;"><div class="skewedDiv" style="transform: skew(30deg); margin-left: 9px; margin-right: 9px;">Your Games</div></h3>').appendTo($('#latestGames'));
  $('.sideWidget .loggedIn .games').appendTo(($('<div class="widgetBody"></div>').appendTo($('#latestGames'))));
}

$.get("https://gamersplane.com/forums/", function (data) {
  var forumPage = $(data);
  var games = $('.tableDiv:has(.pubGameToggle) .forumList .tr', forumPage);
  games.each(function () {
    var tr = $(this);
    if(!($.trim($('.name', tr).text()).toLowerCase().startsWith('zzz'))){
      var post = $('<div class="post"></div>').appendTo(widgetBody);
      var icon = $($('.icon', tr).html()).appendTo(post);
      var title = $('<div class="title"></div>').html($('.name', tr).html()).appendTo(post);
      $('.description', title).remove();
      var title = $('<div class="byLine"></div>').html('by ' + $('.lastPost', tr).html().replace(/<br ?\/?>/g, ", ")).appendTo(post);
    }
  });

  $('.post', widgetBody).sort(function (a, b) {
    var titleA = $.trim($('.title', a).text());
    var titleB = $.trim($('.title', b).text());

    if (titleA == 'Games Tavern')
      return 1;  //always at the bottom
    if (titleB == 'Games Tavern')
      return -1;  //always at the bottom

    if (titleA == titleB)
      return 0;
    if (titleA < titleB)
      return -1;
    else
      return 1;
  }).appendTo(widgetBody);


  $('#latestGamePosts').attr('id', 'partners_old');
});

$.get("https://gamersplane.com/forums/search/?search=latestGamePosts", function (data) {
  var forumPage = $(data);
  var posts = $('.threadTable .forumList .tr', forumPage);

  for (var i = 0; i < posts.length && i<5; i++) {
    var post = posts[i];
    var postLinks = $('.threadInfo>a', post);
    if (postLinks.length > 0) {
      var useLink = postLinks.eq(postLinks.length - 1);
      var postLink = $('<div class="post"><div class="title"><a></a></div><div class="byLine">by <a class="username"></a> on <span class="convertTZ"></span></div><div class="forum">in <a></a></div></div>').appendTo(latestGames);
      var titleLink = $('.title a', postLink)
      $(titleLink).attr('href', useLink.attr('href') + '/?view=newPost#newPost').text(useLink.text());
      if (postLinks.length == 2) {
        $('<div class="forumIcon newPosts" title="New posts in forum" alt="New posts in forum"></div>').prependTo(postLink);
      }
      else{
        $('<div class="forumIcon" title="No new posts in forum" alt="No new posts in forum"></div>').prependTo(postLink);
      }

      var author = $('.byLine a', postLink);
      var authorLink = $('.lastPost .username', post);
      author.text(authorLink.text());
      author.attr('href', authorLink.attr('href'));

      var forum = $('.forum a', postLink);
      var forumLink = $('.threadAuthor a', post).eq(1);
      forum.text(forumLink.text());
      forum.attr('href', forumLink.attr('href'));
      

      $('.byLine span', postLink).text($('.lastPost .convertTZ', post).text());
      
    }

  }

  if (posts.length > 0) {
    $('<h3 class="headerbar" style="transform: skew(-30deg); margin-left: 9px; margin-right: 9px;"><div class="skewedDiv" style="transform: skew(30deg); margin-left: 9px; margin-right: 9px;">Latest Game Posts</div></h3>').prependTo(latestGames);
    $('<div id="latestGamePostLink"><a href="/forums/search/?search=latestGamePosts">Latest Game Posts</a></div>').appendTo(latestGames);
  }

});

$('#announcements').contents().filter(function () { return this.nodeType == 3; }).remove();
$('#announcements>*:not(.readMore):not(h2):not(h4)').remove();