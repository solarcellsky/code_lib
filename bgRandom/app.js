//colorEgg module
(function(colorEgg) {
    colorEgg.randomString = function(len, charSet) {
        charSet = charSet || '01234567';
        var randomString = '';
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz,randomPoz+1);
        }
        return randomString;
    };
    colorEgg.showDifferentBg = function(){
        jQuery('#random_background').html('<img src=bg/bg_'+colorEgg.randomString(1)+'.jpg width=100% height=100%>');
    };
})(window.colorEgg = window.colorEgg || {});

jQuery(document).ready(function() {
    colorEgg.showDifferentBg();
});