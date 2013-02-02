var photo_tag = {};
var fancyOptions = {
    autoSize : true,
    closeBtn : false,
    helpers:  {
        overlay : {
            closeClick: false,
            css : {
                'background' : 'transparent'
            }
        }
    }
};

$(document).ready(function() {
    $(".photo_tag_container").hover(
        function () {
            $(this).children(".init_photo_tag_canvas").fadeIn();
        },function () {
            $(this).children(".init_photo_tag_canvas").fadeOut();
    });

    $(".init_photo_tag_canvas").toggle(
        photo_tag.init_photo_tag_canvas,
        photo_tag.hide_photo_tag_canvas
    );

    $(".photo_tag_canvas").hover(
        function () {
            $(this).children(".photo_tag_marker").fadeIn();
        },function () {
            $(this).children(".photo_tag_marker").fadeOut();
    });

    $(".photo_tag_canvas").click(photo_tag.add_photo_tags);
    $(".photo_tag_marker").live("click",photo_tag.edit_photo_tags);

    $(".cancel_photo_tags").click(function(){
        $.fancybox.close();
    });

    photo_tag.photo_tags_tabs;
});

photo_tag.init_photo_tag_canvas = function() {
    $(this).addClass("active");
    $(this).siblings(".itooltip").fadeIn();
    $(this).siblings('.photo_tag_canvas').show();
};

photo_tag.hide_photo_tag_canvas = function() {
    $(this).removeClass("active");
    $(this).siblings(".itooltip").fadeOut();
    $(this).siblings('.photo_tag_canvas').hide();
};

photo_tag.add_photo_tags = function(e) {
    e.preventDefault();
    var x = e.offsetX - this.offsetLeft - 11;
    var y = e.offsetY - this.offsetTop - 11;
    var photo_tag_marker = $('<div class="photo_tag_marker"><div class="inner"></div></div>');
    photo_tag_marker.css('top', y);
    photo_tag_marker.css('left', x);
    photo_tag_marker.appendTo('.photo_tag_container');
    $.fancybox.open('#add_new_photo_tags',fancyOptions);
};

photo_tag.edit_photo_tags = function() {
    $.fancybox.open('#edit_photo_tags',fancyOptions);
};

photo_tag.photo_tags_tabs = $().ready(function() {
    $(function(){
        $(".new_photo_tags_tabs li:first").addClass("active");
        $(".new_photo_tags_tabs div.new_photo_tags_tabs_content:gt(0)").hide();
        $(".new_photo_tags_tabs li").click(function(){
            $(this).addClass("active").siblings("li").removeClass();
            $(".new_photo_tags_tabs div.new_photo_tags_tabs_content:eq("+$(this).index()+")").show().siblings("div.new_photo_tags_tabs_content").hide();
        });
    });
});