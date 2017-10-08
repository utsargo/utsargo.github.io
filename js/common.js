---
---
$(window).scroll(function() {
   if ($(this).scrollTop() >= 50) {      
     $('#return-to-top').fadeIn(200);    
   } else {
     $('#return-to-top').fadeOut(200);   
   }
 });
 $('#return-to-top').click(function() {  
   $('body,html').animate({
     scrollTop : 0                       
   }, 500);
 });

function fancyFootnote(element) {
    notenum = 0;
    $(element).each(function(){
        $(this).find(".footnotes").find("[id^='fn:']").each(function() {
            $(this).find(".reversefootnote").each(function () {
                $(this).remove();
            });
            var note = document.createElement("div");
            did = $(this).attr("id").split(":")[1];
            notename = "fnote" + "-" + notenum + "-" + did;
            note.id = notename;
            note.className = "fnote";
            note.innerHTML = '<div class="note-wrapper">' + $(this).html() + '</div>';
            $("body").append(note);
            $(this).hide();
        });
        
        $(this).find("[id^='fnref:']").each(function(){
            fid = "fnote" + ":" + notenum + "-" + $(this).attr('id').split(":")[1];
            $(this).attr('id', fid);
            $(this).html('<i class="fa fa-asterisk"></i>');
            $(this).click(function(){
                f = "fnote-" + $(this).attr('id').split(":")[1];
                shownote(f);
            });
        });
        notenum += 1;
    });
};

{% if page.title == "চিন্তা" %}
fancyFootnote(".post-excerpt");
{% else %}
fancyFootnote(".post-content");
{% endif %}

function shownote(f) {
    $(".fnote").removeClass("shownote");
    $("#" + f).addClass("shownote");
};

$(document).mouseup(function (e){
    var container = $(".fnote");
    
     if (!container.is(e.target)
         && container.has(e.target).length === 0)
    {
        container.removeClass("shownote");
    }
});
