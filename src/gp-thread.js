var checkOnline=function(pageNum){
    gpAjaxPost( "https://api.gamersplane.com/users/gamersList/",{page:pageNum}, function( txtdata ) {
        var data=JSON.parse(txtdata);
        for(var i=0;i<data.users.length;i++)
        {
            var user=data.users[i];
            if(user.online)
            {
                $('a.userAvatar[href="/user/'+user.userID+'/"]').addClass('userOnline');
            }
            else
            {
                return;
            }
        }

        checkOnline(pageNum+1);
      });    
};

checkOnline(1);