$('#partners .skewedDiv').text('Game forums');
var widgetBody=$('#partners .widgetBody').html('');
$.get( "https://gamersplane.com/forums/", function( data ) {
    var forumPage=$(data);
    var games=$('.tableDiv:has(.pubGameToggle) .forumList .tr',forumPage);
    var firstLine=true;
    games.each(function(){
      var tr=$(this);

      if(!firstLine)
      {
        $('<hr/>').appendTo(widgetBody);
      }
      firstLine=false;

      var post=$('<div class="post"></div>').appendTo(widgetBody);
      var icon=$($('.icon',tr).html()).appendTo(post);
      var title=$('<div class="title"></div>').html($('.name',tr).html()).appendTo(post);
      $('.description',title).remove();
      var title=$('<div class="byLine"></div>').html('by '+$('.lastPost',tr).html().replace(/<br ?\/?>/g, ", ")).appendTo(post);
      
      });

      $('#partners').attr('id','partners_old');
});

$('#announcements').contents().filter(function() {return this.nodeType == 3;}).remove();
$('#announcements>*:not(.readMore):not(h2):not(h4)').remove();