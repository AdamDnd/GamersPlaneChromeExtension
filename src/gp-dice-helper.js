var gameDetails = $('#fixedMenu_window .rightCol a.menuLink');

if (gameDetails.length > 0) {
    var gameDetailsHref = gameDetails.attr('href').split('/');
    var gameId = gameDetailsHref[2];
    var curUserId = 0;
    var isGm = false;

    gpAjaxPost("https://api.gamersplane.com/users/getCurrentUser/", null, function (data) {
        curUserId = JSON.parse(data).userID;

        gpAjaxPost("https://api.gamersplane.com/games/details", { gameID: gameId }, function (gameData) {
            var gameDataJson=JSON.parse(gameData);
            if (gameDataJson.details.system == "dnd5") {
                isGm = gameDataJson.details.gm.userID == curUserId;
                addDiceWizards();
            }
           // (!gameDataJson.details.description)||(applyPageStyle(gameDataJson.details.description));
        });
    });


    var charSection = $('<div><div id="charButtons"></div><div id="charSheetRoller" style="display:none;"></div></div>').insertAfter($('#rollExplination'));
    var charList = $('#charButtons', charSection);
    var charSheet = $('#charSheetRoller', charSection);


    $('#rolls_decks').on('click', '.rollForChar', function () {
        var rollerForChar = $(this);
        if (rollerForChar.hasClass('sel')) {
            charSheet.hide();
        }
        else {
            $('#rolls_decks .rollForChar.sel').removeClass('sel');
            //load character bonuses
            charSheet.html('');
            var charId = $(this).attr('charid');
            $.get('https://gamersplane.com/characters/dnd5/' + charId, function (data) {
                var charSheetContent = $(data);

                {
                    var roller = $('<div class="roller rollerInit"><span></span><ul class="rollSel"><li><small></small></li><li class="adv">A</li><li class="dis">D</li></ul></roller>').appendTo(charSheet);
                    var initiative = $.trim($('div', $('#stats .tr label:contains(Initiative)', charSheetContent).closest('.tr')).text());
                    if (initiative >= 0) {
                        initiative = ('+' + initiative);
                    }

                    $('span', roller).text('Initiative');
                    $('ul', roller).attr('d20', initiative);
                    $('small', roller).text('Initiative ' + initiative);
                }

                $('<h3>Abilities</h3>').appendTo(charSheet);
                $('.abilityScore', charSheetContent).each(function () {
                    var abilityScore = $(this);
                    var label = $.trim($('.shortText', abilityScore).text());
                    var check = $.trim($('.stat_mod', abilityScore).text());
                    var save = $.trim($('.saveProficient', abilityScore).text());
                    var roller = $('<div class="roller"><span></span><ul class="check rollSel"><li>Check <small></small></li><li class="adv">A</li><li class="dis">D</li></ul><ul class="save rollSel"><li>Save <small></small></li><li class="adv">A</li><li class="dis">D</li></ul></roller>').appendTo(charSheet);
                    $('span', roller).text(label);
                    $('ul.check', roller).attr('d20', check);
                    $('ul.save', roller).attr('d20', save);
                    $('.check small', roller).text(check);
                    $('.save small', roller).text(save);
                });

                $('<h3>Weapons</h3>').appendTo(charSheet);
                $('.weapon', charSheetContent).each(function () {
                    var weapon = $(this);
                    var label = $.trim($('.weapon_name', weapon).text());
                    var toHit = $.trim($('.weapons_ab', weapon).text());
                    var dmg = $.trim($('.weapon_damage', weapon).text());
                    var roller = $('<div class="roller"><span></span><ul class="rollSel attack"><li>To hit: <small></small></li><li class="adv">A</li><li class="dis">D</li></ul></roller> <ul class="rollSel dmg"><li>Dmg: <small></small></li></ul>').appendTo(charSheet);
                    $('span', roller).text(label);
                    $('ul.attack', roller).attr('d20', toHit);
                    $('ul.dmg', roller).attr('dmg', dmg);
                    $('ul.attack small', roller).text(toHit);
                    $('ul.dmg small', roller).text(dmg);
                });

                $('<h3>Skills</h3>').appendTo(charSheet);
                $('.skill', charSheetContent).each(function () {
                    var skill = $(this);
                    var label = $.trim($('.skill_name', skill).text());
                    var bonus = $.trim($('.skill_stat', skill).text());
                    //extract the number from +1 (wis)
                    bonus = bonus.match(/[^\d\-\+]*([\-\+]\d+)[^\d\-\+]*/)[1];

                    //if the number is hiding in the skill name (e.g. Medicine + 8) then use that
                    var labelBonus = label.match(/[^\d\-\+]*([\-\+]\d+)[^\d\-\+]*/);
                    if (labelBonus) {
                        bonus = labelBonus[1];
                    }

                    var roller = $('<div class="roller skill"><span></span><ul class="rollSel"><li><small></small></li><li class="adv">A</li><li class="dis">D</li></ul></roller>').appendTo(charSheet);
                    $('span', roller).text(label);
                    $('ul', roller).attr('d20', bonus);
                    $('ul small', roller).text(bonus);
                });

            });

            charSheet.show();
        }
        rollerForChar.toggleClass('sel');
    });

    var waitForNewRollRow=function(rollCount,reason,roll,onComplete){

        var rolls=$('.newRoll .reason input');
        if(rolls.length==rollCount)
        {
            setTimeout(function(){
                waitForNewRollRow(rollCount,reason,roll,onComplete);
            },100);
    
        }
        else if(rolls.length>0)
        {
            var newRow=$(rolls[rolls.length-1]).closest('.newRoll');
            if (isGm) {
                reason = $('.rollForChar.sel').text() + ': ' + reason;
            }
            $('.reason input', newRow).val(reason);
            $('.roll input', newRow).val(roll);
            if (onComplete) {
                onComplete();
            }

        }

    };

    var addRollToList = function (reason, roll, onComplete) {
        var rollCount = $('.newRoll .reason input').length;
        $('#addRoll button').click();
        setTimeout(function(){
            waitForNewRollRow(rollCount,reason,roll,onComplete);
        },100);
    };

    //clicking a roll
    $('#rolls_decks').on('click', '.roller li', function () {
        var thisRoll = $(this);
        var ul = thisRoll.closest('ul');
        var itemText = $('span', thisRoll.closest('.roller')).text();
        var reason = itemText;
        var d20Bonus = ul.attr('d20');
        if (!isNaN(d20Bonus) && d20Bonus >= 0 && !d20Bonus.startsWith('+')) {
            d20Bonus = '+' + d20Bonus;
        }
        var roll = '1d20' + d20Bonus;
        if (ul.hasClass('check')) {
            reason += ' check';
        } else if (ul.hasClass('save')) {
            reason += ' save';
        }

        if (thisRoll.hasClass('adv')) {
            reason += ' (advantage)';
            roll = roll + ',' + roll;
        }
        if (thisRoll.hasClass('dis')) {
            reason += ' (disadvantage)';
            roll = roll + ',' + roll;
        }
        var dmg = ul.attr('dmg');
        if (dmg) {
            addRollToList(itemText + ' damage', dmg, null);
        }
        else {
            addRollToList(reason, roll, null);
        }

    });

    var addDiceChars = function (userBlock) {
        $('.charName a', userBlock.closest('li')).each(function () {
            var addChar = $(this);
            var charid = addChar.attr('href').split('/')[3];
            $('<span class="rollForChar"></span>').text(addChar.text()).attr('charid', charid).appendTo(charList);
        });

    };

    var addDiceWizards = function () {
        $('#fm_characters .username a').each(function () {
            var forUser = $(this);
            var userId = forUser.attr('href').split('/')[2];
            if ((userId != curUserId) && (isGm)) {
                addDiceChars(forUser);
            }
            else if ((userId == curUserId) && (!isGm)) {
                addDiceChars(forUser);
            }
        });

    };
}


(function ($) {
    $.fn.prettySelect = function (options) {
        var $selects = $(this);

        init();

        if (options == 'render') $selects.filter(function () { return !$(this).has('.rendered'); }).each(function () { updateOptions($(this).parent()); });
        if (options == 'updateOptions') $selects.each(function () { updateOptions($(this).parent()); });

        function init() {
            $selects.filter(function () { return $(this).parent('div.prettySelect').length != 1; }).each(function () {
                $select = $(this).wrap('<div class="prettySelect">');
                $prettySelect = $select.parent();
                if ($select.attr('id') && $select.attr('id').length > 0) $prettySelect.attr('id', 'ps_' + $select.attr('id'));
                //				if ($select.attr('class') && $select.attr('class').length > 0) $prettySelect.attr('class', $select.attr('class')).removeClass('prettySelect');
                $prettySelectCurrent = $('<div class="prettySelectCurrent">');
                $prettySelectLongest = $('<div class="prettySelectLongest">');
                $prettySelectDropdown = $('<div class="prettySelectDropdown">&nbsp;</div>');
                $prettySelectOptions = $('<ul class="prettySelectOptions">');

                $prettySelectCurrent.add($prettySelectDropdown).click(function (e) {
                    e.stopPropagation();
                    var $prettySelect = $(this).parent(),
                        $prettySelectOptions = $prettySelect.find('.prettySelectOptions'),
                        numOptions = $prettySelect.find('option').length;

                    if (numOptions > 8)
                        $prettySelectOptions.height($prettySelect.find('.prettySelectLongest').outerHeight() * 5 + 1).addClass('showScroll');
                    else
                        $prettySelectOptions.height($prettySelect.find('.prettySelectLongest').outerHeight() * numOptions + 1);
                    $prettySelectOptions.width($(this).parent().outerWidth() - 2).show();
                    $prettySelect.addClass('open');
                });
                $prettySelectOptions.on('click', 'li', function () {
                    if ($(this).hasClass('disabled'))
                        return;
                    $parent = $(this).closest('div.prettySelect');
                    $parent.removeClass('open');
                    $parent.find('.prettySelectOptions').hide();
                    $parent.find('select').val($(this).data('value')).change();
                });
                $select.hide();
                $prettySelect.append($prettySelectCurrent).append($prettySelectLongest).append($prettySelectDropdown).append($prettySelectOptions);

                updateOptions($prettySelect);
            }).change(function () {
                $parent = $(this).closest('div.prettySelect');
                text = '';
                if ($(this).find('option[value="' + $(this).val() + '"]').length) text = $(this).find('option[value="' + $(this).val() + '"]').text();
                else text = $(this).val();
                $parent.find('.prettySelectCurrent').text(text);
            });
        }

        function updateOptions($prettySelect) {
            var $select = $prettySelect.find('select'),
                $prettySelectCurrent = $prettySelect.find('.prettySelectCurrent'),
                $prettySelectLongest = $prettySelect.find('.prettySelectLongest'),
                $prettySelectDropdown = $prettySelect.find('.prettySelectDropdown'),
                $prettySelectOptions = $prettySelect.find('.prettySelectOptions'),
                longest = '',
                current = '';
            $prettySelectOptions.html('');
            $prettySelect.find('option').each(function () {
                if ($(this).val() == $select.val()) current = $(this).text();
                if ($(this).text().length > longest.length) longest = $(this).text();
                $li = $('<li>').data('value', $(this).val()).text($(this).text());
                if ($(this).attr('disabled'))
                    $li.addClass('disabled');
                $li.appendTo($prettySelect.find('.prettySelectOptions'));
            });
            if (current === '')
                current = $select.find('option:first').text();
            $prettySelectLongest.text(longest);
            $prettySelectCurrent.text(current);
        }

        $('html').click(function () {
            $('div.prettySelect').removeClass('open').find('.prettySelectOptions').hide();
        });
    };
}(jQuery));

$.fn.prettyCheckbox = function () {
    $(this).each(function () {
        var $checkbox = $(this);
        if ($checkbox.parent('div.prettyCheckbox').length === 0) {
            $checkbox.wrap('<div class="prettyCheckbox"></div>');
            if ($checkbox.is(':checked'))
                $checkbox.parent().addClass('checked');
            if ($checkbox.data('disabled') == 'disabled')
                $checkbox.parent().addClass('disabled');
            $checkbox.change(function (e) {
                $checkbox.parent().toggleClass('checked');
            });
        }
    });
};
