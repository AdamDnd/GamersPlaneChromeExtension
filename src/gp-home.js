$('#partners .skewedDiv').text('Game forums');
var widgetBody=$('#partners .widgetBody').html('');
$.get( "https://gamersplane.com/forums/", function( data ) {
    var forumPage=$(data);
    var games=$('.tableDiv:has(.pubGameToggle) .forumList .tr',forumPage);
    games.each(function(){
      var tr=$(this);
      var post=$('<div class="post"></div>').appendTo(widgetBody);
      var icon=$($('.icon',tr).html()).appendTo(post);
      var title=$('<div class="title"></div>').html($('.name',tr).html()).appendTo(post);
      $('.description',title).remove();
      var title=$('<div class="byLine"></div>').html('by '+$('.lastPost',tr).html().replace(/<br ?\/?>/g, ", ")).appendTo(post);
        });

    $('.post',widgetBody).sort(function(a, b) {
        var titleA = $.trim($('.title', a).text());
        var titleB = $.trim($('.title', b).text());
      
        if(titleA=='Games Tavern')
          return 1;  //always at the bottom
        if(titleB=='Games Tavern')
          return -1;  //always at the bottom

        if(titleA == titleB) 
          return 0; 
        if(titleA < titleB) 
          return -1; 
        else 
          return 1;
    }).appendTo(widgetBody);


      $('#partners').attr('id','partners_old');
});

$('#announcements').contents().filter(function() {return this.nodeType == 3;}).remove();
$('#announcements>*:not(.readMore):not(h2):not(h4)').remove();