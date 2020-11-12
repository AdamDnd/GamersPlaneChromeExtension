var gameDetails = $('#fixedMenu_window .rightCol a.menuLink');

if (gameDetails.length > 0) {
    var gameDetailsHref = gameDetails.attr('href').split('/');
    var gameId = gameDetailsHref[2];
    var isGm = false;

    gpAjaxPost("https://api.gamersplane.com/games/details", { gameID: gameId }, function (gameData) {
        var gameDataJson=JSON.parse(gameData);
        (!gameDataJson.details.description)||(applyPageStyle(gameDataJson.details.description));
    });
}
    