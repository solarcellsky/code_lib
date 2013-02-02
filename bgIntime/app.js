//colorEgg module
(function(colorEgg) {
    var D = new Date();
    colorEgg.showDifferentBg = function(){
        var currentHour = D.getHours();
        jQuery('#page_background').html('<img src=bg/bg_'+parseInt(currentHour/3)+'.jpg width=100% height=100%>');
    };
    colorEgg.showCurrentDate = function(){
        jQuery('time').text(D.toString());
    };
})(window.colorEgg = window.colorEgg || {});