window.addEventListener("DOMContentLoaded", function() {

    var isDarkMode=false;
    chrome.storage.sync.get({darkmode:false},function(result) {
        var isDarkMode=result.darkmode;
        if(isDarkMode){
            toggleDarkMode();
        }
      });


    $(document).keydown(function(e) {
        if(e.altKey && e.keyCode == 78){
            toggleDarkMode();
        }
  });    


  var invertedColors=false;
  var toggleDarkMode=function(){
        $('body').toggleClass('dark');
        isDarkMode=!isDarkMode;
  
        if(!invertedColors){
            $('.post span').filter(function() {
                var style=$(this).attr('style');
                if(style)
                {
                    return style.indexOf('color') !==-1;
                }
                return false;
            }).addClass('invertColors');
            invertedColors=true;
        }

        chrome.storage.sync.set({darkmode: isDarkMode}, function() { });        
  };

});
