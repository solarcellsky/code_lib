//photo_tag module
(function(photo_tag) {
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
    photo_tag.init_photo_tag_canvas = function() {
        jQuery(this).addClass("active");
        jQuery(this).siblings(".itooltip").fadeIn();
        jQuery(this).siblings('.photo_tag_canvas').show();
    };

    photo_tag.hide_photo_tag_canvas = function() {
        jQuery(this).removeClass("active");
        jQuery(this).siblings(".itooltip").fadeOut();
        jQuery(this).siblings('.photo_tag_canvas').hide();
    };

    photo_tag.add_photo_tags = function(e) {
        e.preventDefault();
        var x = e.offsetX - this.offsetLeft - 11;
        var y = e.offsetY - this.offsetTop - 11;
        var photo_tag_marker = jQuery('<div class="photo_tag_marker"><div class="inner"></div></div>');
        photo_tag_marker.css('top', y);
        photo_tag_marker.css('left', x);
        photo_tag_marker.appendTo('.photo_tag_container');
        jQuery.fancybox.open('#add_new_photo_tags',fancyOptions);
    };

    photo_tag.edit_photo_tags = function() {
        jQuery.fancybox.open('#edit_photo_tags',fancyOptions);
    };

    photo_tag.photo_tags_tabs = jQuery().ready(function() {
        jQuery(function(){
            jQuery(".new_photo_tags_tabs li:first").addClass("active");
            jQuery(".new_photo_tags_tabs div.new_photo_tags_tabs_content:gt(0)").hide();
            jQuery(".new_photo_tags_tabs li").click(function(){
                jQuery(this).addClass("active").siblings("li").removeClass();
                jQuery(".new_photo_tags_tabs div.new_photo_tags_tabs_content:eq("+jQuery(this).index()+")").show().siblings("div.new_photo_tags_tabs_content").hide();
            });
        });
    });
})(window.photo_tag = window.photo_tag || {});

jQuery(document).ready(function() {
    jQuery(".photo_tag_container").hover(
        function () {
            jQuery(this).children(".init_photo_tag_canvas").fadeIn();
        },function () {
            jQuery(this).children(".init_photo_tag_canvas").fadeOut();
    });

    jQuery(".init_photo_tag_canvas").toggle(
        photo_tag.init_photo_tag_canvas,
        photo_tag.hide_photo_tag_canvas
    );

    jQuery(".photo_tag_canvas").hover(
        function () {
            jQuery(this).children(".photo_tag_marker").fadeIn();
        },function () {
            jQuery(this).children(".photo_tag_marker").fadeOut();
    });

    jQuery(".photo_tag_canvas").click(photo_tag.add_photo_tags);
    jQuery(".photo_tag_marker").live("click",photo_tag.edit_photo_tags);

    jQuery(".cancel_photo_tags").click(function(){
        jQuery.fancybox.close();
    });

    photo_tag.photo_tags_tabs;
});