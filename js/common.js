/**
 * common lib
 */

window.common = {};

/**
 * Get currencies
 */

window.common.GetCurrencies = new Function;
window.common.GetCurrencies.prototype = {
		
	curr:$('.currency'),
		
	init: function(){
		if(this.curr.length > 0){
			this.load(this.curr);
		}
	},
	
	load: function(el){
		
		var obj = this;
		$.ajax({
			type: "GET",
			url: '/data/currencies.json',
			data : {},
            cache: false,
			async: true,
			dataType:'json',
			success: function(data){
				obj.draw(data);
    		}
		});
	},
	
	draw: function(data){
		this.curr.each(function(){
			var type = $(this).attr('type');
			if(type == 'trub'){
				$('.'+type+'_tt').html(data[type]['tt']);
				$('.'+type+'_tt_raw').html(data[type]['tt_raw']);
			} else if(type == 'tbyr'){
				$('.'+type+'_tt').html(data[type]['tt']);
				$('.'+type+'_tt_raw').html(data[type]['tt_raw']);
			} else {
				$('.'+type+'_tm').html(data[type]['tm']);
				$('.'+type+'_td').html(data[type]['td']);
				$('.'+type+'_tm_raw').html(data[type]['tm_raw']);
				$('.'+type+'_td_raw').html(data[type]['td_raw']);
			}			
		});
		
		$('.date_tm').html(data['tm']);
		$('.date_td').html(data['td']);
		$('.date_tt').html(data['tt']);
	}
};

/**
 * Search Suggest
 */

window.common.SearchSuggest = new Function;
window.common.SearchSuggest.prototype = {
	
	curr:$('.currency'),
	block: false,
	phrase: '',
	phrase_last: '',
	
	init: function(){
		
	     var $searchForm = $('.b-header form.b-search'),
	     $searchSuggest = $('.b-dropdown', $searchForm),
	     $searchInput = $searchForm.find('.b-search__input :text'),
	     $searchSubmit = $searchForm.find('.b-but :submit');
	     
	     var obj = this;

		 function lookup(phrase) {
		     if(phrase.length < 2) {
		         $searchSuggest.fadeOut();
		     } else {
		    	 obj.phrase = obj.phrase_last;
		    	 obj.block = true;
		         $.post("/search/suggest", $.extend({
			             q: obj.phrase
			         }, csrfToken),
			         function(data) {
			             if (data.length){
			                 $searchSuggest.html(data);
			                 $searchSuggest.fadeIn();
			             }else{
			                 $searchSuggest.fadeOut();
			             }
		         })
		         .done(function(){
		        	 //console.log('done');  console.log(obj.block);
		        	 //console.log(obj.phrase+' | '+obj.phrase_last);
		        	 obj.block = false;
		        	 if(obj.phrase != obj.phrase_last){
		        		 //console.log('re lookup');
		        		 lookup(obj.phrase);
		        	 }
		         });
		     }
		 }
		
		 $searchInput.keyup(function(){
		     var value = $(this).val();
		     obj.phrase_last = value; //set last value
		     //console.log(obj.block);
		     if ($.trim(value).length && obj.block == false){
		         lookup(value);
		     }
		 }).blur(function(){
		     //$searchSuggest.fadeOut();
		 });
		
		 $searchSubmit.click(function(){
		     return !!$.trim($searchInput.val()).length;
		 });
	}
}

$(document).ready(function() {
	$('.js-submenu-h').click(function () { 
		$(this).parent().toggleClass('open');
		$(this).next().slideToggle();
	});

	$('.js-mob-menu-hand').click(function () {
		$(this).parent().toggleClass('open-mob');
		$(this).next().slideToggle();
	});

	$('.js-mob-menu-show').click(function () {
		$('.b-header__menu').fadeIn(100);
		$('.js-overlay').fadeIn(100);
	});
	$('.js-mob-menu-hide').click(function () {
		$(this).parent().fadeOut(100);
		$('.js-overlay').fadeOut(100);
	});
	
	$('.js-promo-slider').bxSlider({
		speed: 1000,
		pause: 7000,
  		auto: true,
		pager: true,
		infiniteLoop:true,
		nextSelector:'.js-promo-slider_next',
		prevSelector:'.js-promo-slider_prev',
		hideControlOnEnd:true,
		nextText:'',
		prevText:''
	});
	
	$('.js-carousel').bxSlider({
		speed: 500,
  		auto: false,
		pager: false,
		slideWidth: 5000,
		minSlides: 4,
		maxSlides: 4,
		infiniteLoop:true,
		hideControlOnEnd:true,
		nextSelector:'.js-carousel_next',
		prevSelector:'.js-carousel_prev',
		nextText:'',
		prevText:''
	});
	
	var items = $('.js-tab');
	var tabs = $('.js-tab-content');
    var _this = '';
	tabs.hide().filter(':first').show();
	items.click(function (e) {
        if(_this){
            if (_this != $(this)){
                _this.find('a').removeClass('selected');
                 tabs.hide();
            }
        }
        if ($(this).find('a').hasClass() != 'selected'){
     		$(this).find('a').addClass('selected');
            tabs.hide();
            _id = $(this).find('a').attr('href');
	        tabs.filter(_id).stop().fadeIn(); 
            _this = $(this);
        }
		return false;
	}).filter(':first').click();
	
	/* accordeon */
	var hand = $('.js-acc-hand');
	var cont = $('.js-acc-cont');
	//cont.hide();
	//hand.removeClass('open');
	
	hand.click(function () {
		var isOpened = $(this).hasClass('open');
		cont.slideUp(300);
		hand.removeClass('open');
		if (!isOpened){
			$(this).next().slideToggle(300);
			$(this).toggleClass('open');
		}
	});
	
	
	$('.js-select').styler();
	

     
     var GetCurrencies = new window.common.GetCurrencies;
     GetCurrencies.init();
     
     var SearchSuggest = new window.common.SearchSuggest;
     SearchSuggest.init();
     
     //mk link 
     var mname = $('.js-id-news').html();
     $('.js-id-news').replaceWith('<a href="/news">'+mname+'</a>');
});
