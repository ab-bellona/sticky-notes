/***************Define Basics**************/
(function($)
{
    $.fn.autogrow = function(options)
    {
        return this.filter('textarea').each(function()
        {
            var self         = this;
            var $self        = $(self);
            var minHeight    = $self.height();
            var noFlickerPad = $self.hasClass('autogrow-short') ? 0 : parseInt($self.css('lineHeight')) || 0;

            var shadow = $('<div></div>').css({
                position:    'absolute',
                top:         -10000,
                left:        -10000,
                width:       $self.width(),
                fontSize:    $self.css('fontSize'),
                fontFamily:  $self.css('fontFamily'),
                fontWeight:  $self.css('fontWeight'),
                lineHeight:  $self.css('lineHeight'),
                resize:      'none',
                'word-wrap': 'break-word'
            }).appendTo(document.body);

            var update = function(event)
            {
                var times = function(string, number)
                {
                    for (var i=0, r=''; i<number; i++){
						r += string;
						return r;
					} 
                };

                var val = self.value.replace(/</g, '&lt;')
                                    .replace(/>/g, '&gt;')
                                    .replace(/&/g, '&amp;')
                                    .replace(/\n$/, '<br/>&nbsp;')
                                    .replace(/\n/g, '<br/>')
                                    .replace(/ {2,}/g, function(space){ return times('&nbsp;', space.length - 1) + ' '; });
                if (event && event.data && event.data.event === 'keydown' && event.keyCode === 13) {
                    val += '<br />';
                }
                shadow.css('width', $self.width());
                shadow.html(val + (noFlickerPad === 0 ? '...' : ''));
                $self.height(Math.max(shadow.height() + noFlickerPad, minHeight));
            };

            $self.change(update).keyup(update).keydown({event:'keydown'},update);
            $(window).resize(update);

            update();
        });
    };
})(jQuery);

/********StickyNote in HTML**********/
var noteTemp =  '<div class="note"><a href="javascript:;" class="button remove"><i class="ti-trash"></i></a><a href="javascript:;" onClick="newNote()" class="button"><i class="ti-plus"></i></a><div class="note_cnt"><textarea class="cnt" onkeyup="Direction(this)" placeholder="یادداشت خود را بنویسید.."></textarea></div></div>';

var noteZindex = 1;

/********Make New StickyNote**********/
function newNote() {
  $(noteTemp).hide().appendTo("#board").show("fade", 300).draggable().on('dragstart',
    function(){
       $(this).zIndex(++noteZindex);
    });
 
	$('.remove').click(deleteNote);
	$('textarea').autogrow();
	
  $('.note');
	return false; 
}

/********Delete StickyNote**********/
function deleteNote(){
    $(this).parent('.note').fadeOut(300, function() { $(this).remove(); });
}
$(document).ready(function() {
    
    $("#board").height($(document).height());
    
    $("#add_new").click(newNote);
    $('.remove').click(deleteNote);
    newNote();
	  
    return false;
});		

/********change Direction**********/
function isUnicode(str) {
		var letters = [];
		for (var i = 0; i <= str.length; i++) {
			letters[i] = str.substring((i - 1), i);
			if (letters[i].charCodeAt() > 255) { return true; }
		}
		return false;
	}
function Direction(val){
			if (isUnicode(val.value)) {
				val.style.direction="rtl";
				val.style.textAlign="right";
				val.style.fontFamily="Bardiya";
				
			}else {
				val.style.direction="ltr";
				val.style.textAlign="left";
				val.style.fontFamily="Gloria Hallelujah";
			}
	if(!val.value){
		val.style.direction="rtl";
		val.style.textAlign="right";
		val.style.fontFamily="Bardiya";
	}
}

/**********Search**********/
function srch(){
	var num =document.querySelectorAll('#board .note').length;
	var i,thing,str,res,content;
	content=document.getElementById('search_value');
	for (i = 0; i<num; i++){
		thing = document.getElementsByClassName('cnt')[i];
		str=thing.value;
		res=str.indexOf(content.value);
		if(res===-1){
			document.getElementsByClassName('note')[i].style.display="none";
		}else {
			document.getElementsByClassName('note')[i].style.display="block";
		}
	}
}
function searchToggle(obj, evt){
    var container = $(obj).closest('.search-wrapper');
    if(!container.hasClass('active')){
		container.addClass('active');
		evt.preventDefault();
    }
    else if(container.hasClass('active') && $(obj).closest('.input-holder').length === 0){
		container.removeClass('active');
		container.find('.search-input').val('');
		container.find('.result-container').fadeOut(100, function(){$(this).empty();});
    }
}