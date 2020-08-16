var snippetMenu=$('<li class="markItUpButton markItUpButtonSnippet markItUpDropMenu"><span>Snippet</span><ul></ul></li>').appendTo('.markItUpHeader>ul');

chrome.storage.sync.get({
    snippets: []
  }, function(items) {
      var subMenu=$('ul',snippetMenu);
      for(var i=0;i<items.snippets.length;i++)
      {  
          var li=$('<li class="markItUpAddSnippet"><a></a></li>').appendTo(subMenu);
          $('a',li).text(items.snippets[i].name);
          li.data('snippet',items.snippets[i].val);

      }
      $('<li class="markItUpManageSnippets"><a>Manage...</a></li>').appendTo(subMenu);
    });


$('.markItUpHeader').on('click','.markItUpManageSnippets',function(){
    window.open(chrome.extension.getURL("options.html"));
});

$('.markItUpHeader').on('click','.markItUpAddSnippet',function(){
    var chosenSnippet=$(this);
    var snippetVal=chosenSnippet.data('snippet');
    var txtArea=$('textarea',chosenSnippet.closest('.markItUpContainer'));

    txtArea.focus();
    document.execCommand('insertText', false , snippetVal);

});

//forums menu
var forumsLink=$('#threadMenu .leftCol a').attr('href');
$.get( 'https://gamersplane.com'+forumsLink, function( data ) {
    var newMenu=$('#fm_tools');
    $('.menuLink',newMenu).text('Forums');
    $('.submenu',newMenu).html('');
    var dataObj=$(data);
    var forums=$('.forumList .tr',dataObj);
    var subMenu=$('.submenu',newMenu);
    if(forums.length>0)
    {
        $('h3',$('<li><h3></h3></li>').appendTo(subMenu)).text('Forums');
        for(var i=0;i<forums.length;i++)
        {
            $('<li></li>').html($('.name',forums[i]).html()).appendTo(subMenu);
        }
    }
    var threads=$('.threadList .tr',dataObj);
    if(threads.length>0)
    {
        $('h3',$('<li><h3></h3></li>').appendTo(subMenu)).text('Threads');
        for(var i=0;i<threads.length;i++)
        {
            var menuItem=$('<li><a></a></li>').appendTo(subMenu);
            var threadText=$('.td.threadInfo>a',threads[i]);
            $('a',menuItem).attr('href',threadText.attr('href')).text(threadText.text());
        }

    }

  });

  
