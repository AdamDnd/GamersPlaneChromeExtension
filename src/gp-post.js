var snippetMenu=$('<li class="markItUpButton markItUpButtonSnippet markItUpDropMenu"><span>Snippet</span><ul></ul></li>').appendTo('.markItUpHeader>ul');
var uploadButton=$('<li class="markItUpButton"><input type="file" class="imageFileUpload"></li>').appendTo('.markItUpHeader>ul');

var _isSubmitting=false;
$('#submitDiv button').on('click',function(){
    _isSubmitting=true;
})

window.onbeforeunload = function ()
{
    var txtArea=$('#messageTextArea');
    if (!_isSubmitting && txtArea.length>0 && $.trim(txtArea.val()).length>0)
    {
        return "You haven't submitted your post. Click OK to continue without saving or Cancel to go back and save your post.";
    }
};

$('.imageFileUpload',uploadButton).on('change', function () {

    var pThis=$(this);

    var files = pThis.get(0).files;

      var imgurApi = 'https://api.imgur.com/3/image';
      var apiKey = '7de684608de179a';

      var settings = {
        url: imgurApi,
        type: 'POST',
        async: false, crossDomain: true, processData: false, contentType: false,
        headers: {
          Authorization: 'Client-ID ' + apiKey,
          Accept: 'application/json',
        },
        mimeType: 'multipart/form-data',
      };

      var formData = new FormData();
      formData.append('image', files[0]);
      settings.data = formData;

      $.ajax(settings).done(function (response) {
        var responseObj = JSON.parse(response);
        insertText(pThis,'[img]'+responseObj.data.link+'[/img]');
        $('.imageFileUpload').val('');
      }).fail(function(errorReason){
            var responseObj=JSON.parse(errorReason.responseText);
            alert(responseObj.data.error.message);

      });
  });

snippetMenu.on('mouseenter',function(){$('ul',this).show();});

settingStorage.get({
    snippets: []
  }, function(items) {
      var subMenu=$('ul',snippetMenu);
      for(var i=0;i<items.snippets.length;i++)
      {  
          var li=$('<li class="markItUpAddSnippet"><a></a></li>').appendTo(subMenu);
          $('a',li).text(items.snippets[i].name);
          li.attr('snippet',items.snippets[i].val);

      }
      $('<li class="markItUpManageSnippets"><a>Manage...</a></li>').appendTo(subMenu);
    });


$('.markItUpHeader').on('click','.markItUpManageSnippets',function(){
    window.open(chrome.extension.getURL("options.html"));
});

var insertText=function(button,text)
{
    var txtArea=$('textarea',button.closest('.markItUpContainer'));

    if(/chrome/.test(navigator.userAgent.toLowerCase()))
    {
        txtArea.focus();
        document.execCommand('insertText', false , text);
    }
    else
    {
        var txtEle=txtArea.get(0);
        txtEle.setRangeText(
            text,
            txtEle.selectionStart || 0,
            txtEle.selectionEnd || 0,
            'end'
        );        
    }

};

$('.markItUpHeader').on('click','.markItUpAddSnippet',function(){
    var chosenSnippet=$(this);
    var snippetVal=chosenSnippet.attr('snippet');
    insertText(chosenSnippet,snippetVal);
});

//forums menu
var forumsLink=$('#threadMenu .leftCol a').attr('href');
if(forumsLink)
{
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
    
}

  
