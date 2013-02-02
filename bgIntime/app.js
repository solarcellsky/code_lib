var app = {};
app.show_different_bg = function(){
    var D = new Date();
    var currentHour = D.getHours();
    jQuery('#page_background').append('<img src=bg/bg_'+parseInt(currentHour/3)+'.jpg width=100% height=100%>');
}