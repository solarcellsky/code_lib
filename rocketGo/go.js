$(function(){var o,n=$(".rockets"),t=$(".rockkets_bg"),i=["-298px 0px","-447px 0px","-596px 0px","-745px 0px"],s=$.browser.msie&&9>$.browser.version,c=!0,e=!0,a=!0,r=0;s&&t.attr("class","rockkets_bg1"),n.init=function(){this.attr("style",""),clearInterval(o),s?t.hide():t.show(),e=!0,a=!0},$(window).scroll(function(){1==c&&1==a&&($(document).scrollTop()>0?"none"==n.css("display")&&(s?(n.show(),t.hide()):n.fadeIn()):s?e?n.hide():(a=!1,n.animate({top:"-30%"},function(){n.init()})):"block"==t.css("display")?n.fadeOut():(a=!1,n.animate({top:"-30%"},function(){n.init()})))}),n.hover(function(){s?t.show():t.stop(!0).animate({opacity:1},"slow")},function(){s?t.hide():t.stop(!0).animate({opacity:0},"slow")}).click(function(){function s(){t.hide(),4>r?(n.css("background-position",i[r]),r+=1):(n.css("background-position",i[0]),r=0)}0!=c&&(c=!1,e=!1,$("html,body").animate({scrollTop:0},800,function(){c=!0,$(window).scroll()}),o=setInterval(s,40))})});