var gamersPlaneIntegration=(function (){

    function getFeatures(featureArray){
        $('.ct-feature-snippet').each(function(){
            var name=$.trim($('.ct-feature-snippet__heading',this).eq(0).clone().children().remove().end().text());
            var text=$.trim($('.ct-feature-snippet__content',this).text());
            if(name && text){
                featureArray.push({
                    name:name,
                    text:text
                });
            }
        });
    };

    function copyToGp(){
        var characterName=$('.ddbc-character-name').text();
        var abilityScores=[];
        $('.ddbc-ability-summary__secondary').each(function(){abilityScores.push($(this).text());});
        var saveProficiencies=[];
        $('.ddbc-saving-throws-summary__ability').each(function(){
            if($('.ddbc-tooltip[data-original-title="Proficiency"]',this).length){
                saveProficiencies.push(true);
            }else{
                saveProficiencies.push(false);
            }
        });
        
        var skills=[];
        $('.ct-skills__item').each(function(){
            var pThis=$(this);
            var skill={
                name:$('.ct-skills__col--skill',pThis).text(),
                proficient:($('.ddbc-tooltip[data-original-title="Proficiency"]',pThis).length?true:false),
                modifier:$('.ct-skills__col--modifier',pThis).text()
            };
            skills.push(skill);
        });

        var profBonus=$('.ct-proficiency-bonus-box__value').text();
        var speed=$('.ct-speed-box__box-value .ddbc-distance-number__number').text();
        var initiative=$('.ct-initiative-box__value').text();
        var ac=$('.ddbc-armor-class-box__value').text();
        var hpCur=$('.ct-health-summary__hp-number').eq(0).text();
        var hpMax=$('.ct-health-summary__hp-number').eq(1).text();
        var hpTemp=$('.ct-health-summary__hp-number').eq(2).text();
        var inspiration=($('.ct-inspiration__status--active').length?true:false);
        var race=$('.ddbc-character-summary__race').text();
        var classes=$('.ddbc-character-summary__classes').text();
        var backgroundImage=$('body').css('backgroundImage').split('"')[1];

        var features=[];

        $('.ct-proficiency-groups__group').each(function(){
            features.push({
                name:$('.ct-proficiency-groups__group-label',this).text(),
                text:$('.ct-proficiency-groups__group-items',this).text(),
            });
        });

        //actions
        $('.ct-primary-box__tab--actions').click();

        var attacks=[];
        $('.ddbc-attack-table .ddbc-combat-attack').each(function(){
            var pThis=$(this);
            attacks.push({
                name:$('.ddbc-combat-attack__name .ddbc-combat-attack__label',pThis).text(),
                toHit:$('.ddbc-combat-attack__tohit',pThis).text(),
                damage:$('.ddbc-combat-attack__damage',pThis).text(),
                notes:$('.ddbc-combat-attack__notes',pThis).text()
            });

        });
        

        getFeatures(features);

        var spells=[];
        //spells
        $('.ct-primary-box__tab--spells').click();
        $('.ct-spells-spell').each(function(){
            var pThis=$(this);
            pThis.click();
            var spellLevel=$('.ct-content-group__header-content',pThis.closest('.ct-content-group')).text();
            if(spellLevel=='Cantrip'){
                spellLevel='0';
            }else{
                spellLevel=spellLevel.substring(0,1);
            }

            var spellName=$('.ct-spells-spell__name .ct-spells-spell__label',pThis).text();
            var icons='';
            if($('.ddbc-concentration-icon',pThis).length>0){ icons+=' (C)';}
            if($('.ddbc-ritual-icon',pThis).length>0){ icons+=' (R)';}
            var spellClass=$('.ct-spells-spell__meta',pThis).text();
            
            var details='';
            var spellDet=$('.ct-spell-detail');
            $('.ddbc-property-list__property',spellDet).each(function(){
                details+=$('.ddbc-property-list__property-label',this).text();
                details+=' ';
                details+=$('.ddbc-property-list__property-content',this).text();
                details+='\n';
            });

            $('.ct-spell-detail__description p',spellDet).each(function(){
                details+=$(this).text();
                details+='\n';
            });
            details+='\n';
            details+=('https://www.dndbeyond.com/spells/'+encodeURIComponent(spellName));     

            spells.push({
                name:(spellLevel+': '+spellName+icons),
                text:details,
                spellClass:spellClass
            });
        });

        //inventory
        $('.ct-primary-box__tab--equipment').click();

        var inventory=[];
        $('.ct-inventory-item').each(function(){
            var pThis=$(this);
            inventory.push({
                name:$('.ddbc-item-name',pThis).text(),
                quantity:$('.ct-inventory-item__quantity',pThis).text()
            });

        });

        //features and traits
        $('.ct-primary-box__tab--features').click();
        getFeatures(features);

        //description
        $('.ct-primary-box__tab--description').click();
        var background=$('.ct-background__name').text();

        var descriptionTraits=[];
        $('.ct-description__traits .ct-trait-content').each(function(){
            var pThis=$(this);
            descriptionTraits.push({
                name:$('.ct-trait-content__heading',pThis).text(),
                text:$('.ct-trait-content__content',pThis).text()
            });
        });
        
        var character={
            name:characterName,
            race:race,
            classes:classes,
            background:background,
            abilityScores:abilityScores,
            saveProficiencies:saveProficiencies,
            profBonus:profBonus,
            speed:speed,
            initiative:initiative,
            ac:ac,
            hpCur:hpCur,
            hpMax:hpMax,
            hpTemp:hpTemp,
            skills:skills,
            inspiration:inspiration,
            features:features,
            spells:spells,
            inventory:inventory,
            attacks:attacks,
            descriptionTraits:descriptionTraits,
            backgroundImage:backgroundImage
        };

        //save character
        chrome.storage.local.set({
            dndbcharacter: character
          }, function() {});
    
          $("<div style='position: fixed;top: 0;bottom: 0;left: 0;right: 0;background-color: rgba(255,255,255,0.9);z-index: 60000;text-align: center;padding-top: 300px;font-size: 300%;font-weight: bold;'>Copied "+characterName+"<br/><small style='font-size:50%;'>Paste into your Gamers' Plane character sheet</small></div>")
          .appendTo('body')
          .fadeTo(3000,1.0, function(){
                $(this).fadeOut(1000, function(){
                    $(this).remove();
                });
            });

    };
    
    //Add button to menu
    function addGp(){
        var heading=$('.mm-navbar__menu-list');
        if(heading.length==0){
            setTimeout(addGp,1000);
        }
        else{
            var copyToGpMenu=$('<li class="mm-nav-item"><span class="mm-nav-item__label mm-nav-item__label--link">Copy to GP</span></li>').appendTo(heading);
            $('span',copyToGpMenu).on('click',function(){
                copyToGp();
            });
        }
    };

    addGp();

})();




