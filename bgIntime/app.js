//colorEgg module
(function(colorEgg) {
    var D = new Date();
    colorEgg.show_different_bg = function(){
        var currentHour = D.getHours();
        jQuery('#page_background').append('<img src=bg/bg_'+parseInt(currentHour/3)+'.jpg width=100% height=100%>');
    };
    colorEgg.show_currentDate = function(){
        jQuery('time').append(D.toString());
    };
})(window.colorEgg = window.colorEgg || {});