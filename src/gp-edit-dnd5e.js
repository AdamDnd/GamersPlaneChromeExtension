jQuery.fn.setVal = function(val) {
    this.focus().val(val).blur();
    return this; 
};

jQuery.fn.setValIfBlank = function(val) {
    var curVal=$.trim(this.val());
    if(!curVal || curVal=='0'){
        this.setVal(val);
    }
    return this; 
};

jQuery.fn.setCheck = function(val) {
    this.prop('checked',val);
    
    if(val){
        this.parent().addClass('checked');
    }else{
        this.parent().removeClass('checked');
    }

    return this; 
};

$.expr[':'].valstarts =  $.expr[':'].valstarts || $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).val().toLowerCase().startsWith(arg.toLowerCase());
    };
});


var pasteDndBCharacter=function(character){
    $('input[name="name"]').setVal(character.name);
    //stats and saves
    for(var i=0;i<6;i++){
        $('input.stat').eq(i).setVal(character.abilityScores[i]);
        $('.saveProficient input').eq(i).setCheck(character.saveProficiencies[i]);
    }

    //other scores
    $('input[name="race"]').setVal(character.race);
    $('.classSet input.medText').setValIfBlank(character.classes);
    $('input[name="background"]').setVal(character.background);
    $('input[name="profBonus"]').setVal(character.profBonus);
    $('input[name="speed"]').setVal(character.speed);
    $('input[name="initiative"]').setVal(character.initiative);
    $('input[name="ac"]').setValIfBlank(character.ac);
    $('input[name="hp[current]"]').setValIfBlank(character.hpCur);
    $('input[name="hp[temp]"]').setValIfBlank(character.hpTemp);
    $('input[name="hp[total]"]').setVal(character.hpMax);

    //skills
    for(var i=0;i<character.skills.length;i++){
        var skill=character.skills[i];
        $('.skill_prof input',$('.skill .skill_name:valstarts("'+skill.name+'")').closest('.skill')).setCheck(skill.proficient);
    }

    if(character.inspiration){
        $('input[name="inspiration"]').setValIfBlank(1);
    }


    var addFeatureFromArray=function(features,index){
        if(index<features.length){
            var existingFeatures=$('.feat_name');

            var feature=features[index];

            //do we have a feature with this name?
            var hasFeature=false;
            existingFeatures.each(function(){
                var pThis=$(this);
                var pThisVal=$.trim(pThis.val());
                if(pThisVal.toLowerCase()==feature.name.toLowerCase() || pThis.hasClass('default')){
                    pThis.setVal(feature.name);
                    $('textarea',$(this).closest('.feat')).setVal(feature.text);
                    hasFeature=true;
                    return false;
                }
            });
    
            if(hasFeature){
                addFeatureFromArray(character.features,index+1);
            }else{
                //add a new feat - wait and try again
                $('#feats a.addItem')[0].click();

                setTimeout(function(){addFeatureFromArray(features,index);},250);
            }
    
        }
    };

    addFeatureFromArray(character.features,0);

    var classToAbility=function(className){

        if(className=='Artificer'){return 'Int';}
        if(className=='Bard'){return 'Cha';}
        if(className=='Cleric'){return 'Wis';}
        if(className=='Druid'){return 'Wis';}
        if(className=='Paladin'){return 'Cha';}
        if(className=='Ranger'){return 'Wis';}
        if(className=='Sorcerer'){return 'Cha';}
        if(className=='Warlock'){return 'Cha';}
        if(className=='Wizard'){return 'Int';}
        if(className=='Improved Minor Illusion'){return 'Int';}
        if(className=='Infernal Legacy'){return 'Cha';}

        return 'Str';
    };

    //add spells
    var addSpellsFromArray=function(index){
        if(index<character.spells.length){
            var existingSpells=$('.spell_name');

            var spell=character.spells[index];

            //do we have a spell  with this name?
            var hasSpell=false;
            existingSpells.each(function(){
                var pThis=$(this);
                var pThisVal=$.trim(pThis.val());
                if(pThisVal.toLowerCase()==spell.name.toLowerCase() || pThis.hasClass('default')){
                    pThis.setVal(spell.name);
                    var ability=classToAbility(spell.spellClass);
                    $('select',$(this).closest('.spell')).val(ability.toLowerCase());
                    $('.prettySelectCurrent',$(this).closest('.spell')).text(ability);
                    $('textarea',$(this).closest('.spell')).setVal(spell.text);
                    hasSpell=true;
                    return false;
                }
            });
    
            if(hasSpell){
                addSpellsFromArray(index+1);
            }else{
                //add a new feat - wait and try again
                $('#spells #addSpell')[0].click();

                setTimeout(function(){addSpellsFromArray(index);},250);
            }
    
        }
    };

    addSpellsFromArray(0);

    //add weapons
    var addWeaponsFromArray=function(index){
        if(index<character.attacks.length){
            var existingItems=$('.weapon_name');

            var item=character.attacks[index];

            //do we have a spell  with this name?
            var hasItem=false;
            existingItems.each(function(){
                var pThis=$(this);
                var pThisVal=$.trim(pThis.val());
                if(pThisVal.toLowerCase()==item.name.toLowerCase() || pThisVal==''){
                    pThis.setVal(item.name);
                    $('.weapons_ab',$(this).closest('.weapon')).setVal(item.toHit);
                    $('.weapon_damage',pThis.closest('.weapon')).setVal(item.damage);
                    $('.weapon_notes',pThis.closest('.weapon')).setVal(item.notes);
                    hasItem=true;
                    return false;
                }
            });

            if(hasItem){
                addWeaponsFromArray(index+1);
            }else{
                //add a new feat - wait and try again
                $('#weapons #addWeapon')[0].click();

                setTimeout(function(){addWeaponsFromArray(index);},250);
            }

        }
    };

    addWeaponsFromArray(0);    

    //inventory
    var inventory='';
    for(var i=0;i<character.inventory.length;i++){
        if(i!=0){
            inventory+='\n';
        }

        inventory+=character.inventory[i].name;
        if(character.inventory[i].quantity>1){
            inventory+=(' ('+character.inventory[i].quantity+')');
        }
    }

    $('#items textarea').setValIfBlank(inventory);

    //notes
    var notes='';
    for(var i=0;i<character.descriptionTraits.length;i++){
        if(i!=0){
            notes+='\n';
        }

        notes+=character.descriptionTraits[i].name;
        notes+='\n';
        notes+=character.descriptionTraits[i].text;
        notes+='\n';
    }

    if(character.backgroundImage){
        notes+='\n[style]{"background":{"image":"'+character.backgroundImage+'"}}[/style]';
    }

    $('#notes textarea').setValIfBlank(notes);

};


chrome.storage.local.get({dndbcharacter:null},function(result) {        
    if(result && result.dndbcharacter){
        $('<span class="pasteFromDndB"></span>').text('Paste DndB:'+result.dndbcharacter.name).prependTo($('#charAvatar')).on('click',function(){
            pasteDndBCharacter(result.dndbcharacter);

            settingStorage.set({
                dndbcharacter: null
                }, function() {});

            $(this).remove();
        });
    }
});
