window.addEventListener("DOMContentLoaded", function() {

    var isNightMode=false;
    chrome.storage.sync.get({darkmode:false},function(result) {
        console.log(result.darkmode);
        var isNightMode=result.darkmode;
        if(isNightMode){
            toggleDarkMode();
        }
      });


    $(document).keydown(function(e) {
        if(e.altKey && e.keyCode == 78)
        {
            toggleDarkMode();
        }
  });    


  var invertedColors=false;
  var toggleDarkMode=function(){

        $('body').toggleClass('dark');
        isNightMode=!isNightMode;
  
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

        console.log(isNightMode);
        chrome.storage.sync.set({darkmode: isNightMode}, function() {
          });        
  };

});
