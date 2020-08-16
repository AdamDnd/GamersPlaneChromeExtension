var addCan = function () {
    var hasEmpty = false;
    $('#snippets input').each(function () {
        if ($.trim($(this).val()).length == 0)
        {
            hasEmpty = true;
        }
    });
    if (!hasEmpty) {
        $($('#snippet_templ').html()).appendTo('#snippets');
    }
};


$('#snippets').on('change', 'input', function () { addCan(); });
$('#snippets').on('keyup', 'input', function () { addCan(); });
$('#snippets').on('blur', 'input', function () { addCan(); });


// Saves options to chrome.storage
function save_options() {

    var snippets=[];
    $('.snippet').each(function(){
        var snippet=$(this);
        var snippetName=$.trim($('input',snippet).val());
        if(snippetName.length>0)
        {
            var snippetVal=$('textarea',snippet).val();
            snippets.push({name:snippetName,val:snippetVal});
        }
    });

    console.log(snippets);
    console.log(snippets.length);

    chrome.storage.sync.set({
      snippets: snippets
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    });
  }
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  function restore_options() {
    chrome.storage.sync.get({
      snippets: []
    }, function(items) {
        for(var i=0;i<items.snippets.length;i++)
        {  
            var newSnippet = $($('#snippet_templ').html()).appendTo('#snippets');
            $('input',newSnippet).val(items.snippets[i].name);
            $('textarea',newSnippet).val(items.snippets[i].val);

        }
        addCan();

    });
  }

  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click', save_options);