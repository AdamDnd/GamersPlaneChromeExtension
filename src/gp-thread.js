var checkOnline=function(pageNum){
    $.post( "https://api.gamersplane.com/users/gamersList/",{page:pageNum}, function( data ) {
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
      }, "json");    
};

checkOnline(1);