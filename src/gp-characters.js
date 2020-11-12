applyPageStyle($('#notes').text());

$('.feat_notesLink').on('click',function(){$(this).toggleClass('open');});

$('<div></div>').prependTo('#page_characterSheet').addClass('avatarPreview').css({'background-image':'url(https://gamersplane.com/characters/avatars/'+$('#characterID').val()+'.jpg?'+(new Date().getTime())+')'});