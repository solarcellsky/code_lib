//photo_tag module
(function(photoTags) {
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
    
    photoTags.initPhotoTagsCanvas = function() {
        jQuery(this).addClass("active");
        jQuery(this).siblings(".itooltip").fadeIn();
        jQuery(this).siblings('.photo_tag_canvas').show();
    };

    photoTags.hidePhotoTagsCanvas = function() {
        jQuery(this).removeClass("active");
        jQuery(this).siblings(".itooltip").fadeOut();
        jQuery(this).siblings('.photo_tag_canvas').hide();
    };

    photoTags.addPhotoTags = function(e) {
        e.preventDefault();
        var x = e.offsetX - this.offsetLeft - 11;
        var y = e.offsetY - this.offsetTop - 11;
        var photo_tag_marker = jQuery('<div class="photo_tag_marker"><div class="inner"></div></div>');
        photo_tag_marker.css('top', y);
        photo_tag_marker.css('left', x);
        photo_tag_marker.appendTo('.photo_tag_container');
        jQuery.fancybox.open('#add_new_photo_tags',fancyOptions);
    };

    photoTags.editPhotoTags = function() {
        jQuery.fancybox.open('#edit_photo_tags',fancyOptions);
    };

    photoTags.photoTagsTabs = jQuery(function(){
        jQuery(".new_photo_tags_tabs li:first").addClass("active");
        jQuery(".new_photo_tags_tabs div.new_photo_tags_tabs_content:gt(0)").hide();
        jQuery(".new_photo_tags_tabs li").click(function(){
            jQuery(this).addClass("active").siblings("li").removeClass();
            jQuery(".new_photo_tags_tabs div.new_photo_tags_tabs_content:eq("+jQuery(this).index()+")").show().siblings("div.new_photo_tags_tabs_content").hide();
        });
    });
})(window.photoTags = window.photoTags || {});

jQuery(document).ready(function() {
    jQuery(".photo_tag_container").hover(
        function () {
            jQuery(this).children(".init_photo_tag_canvas").fadeIn();
        },function () {
            jQuery(this).children(".init_photo_tag_canvas").fadeOut();
    });

    jQuery(".init_photo_tag_canvas").toggle(
        photoTags.initPhotoTagsCanvas,
        photoTags.hidePhotoTagsCanvas
    );

    jQuery(".photo_tag_canvas").hover(
        function () {
            jQuery(this).children(".photo_tag_marker").fadeIn();
        },function () {
            jQuery(this).children(".photo_tag_marker").fadeOut();
    });

    jQuery(".photo_tag_canvas").click(photoTags.addPhotoTags);
    jQuery(".photo_tag_marker").live("click",photoTags.editPhotoTags);

    jQuery(".cancel_photo_tags").click(function(){
        jQuery.fancybox.close();
    });

    photoTags.photoTagsTabs;
});