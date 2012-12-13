$(function(){
    $(".photo-list").each(function(i){
        if((i+1)%4 == 0){$(".photo-list").eq(i).addClass("photo-list-last");}
    })
})