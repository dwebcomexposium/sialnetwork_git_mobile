/**!
	mySelection

	Zero raccoon was used for testing this plugin

	 @contributors: Guillaume Focheux (Alsacréations)
	 @date-created: 2015-10-09
	 @last-update: 2015-10-09

	dépendance jquery + Noty
 */

;(function ($, window, document, undefined) {

	// Create the defaults once
	var pluginName = 'mySelection',
		defaults = {
			//Options Plugin Here
		};

	// The actual plugin constructor
	function mySelection(_caller, options) {
		this._caller = _caller;
		this.$caller = $(_caller);
		//options override
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		// initialization
		this.init();
	}

	//Prototype of the object
	mySelection.prototype = {
		init: function() {
			var _self = this;
			_self.msBinding();
			return this;
		},
		msBinding: function() {
			var _self = this,
			$_self = $(_self);
			this.$caller.off('click').on('click', function(e){
				var $_this = $(this);
				switch ($_this.attr('data-action')) {
					case "add":
						_self.msAdd().msUpdate().msRebind();
						break;
					case "remove":
						_self.msRemove().msUpdate();
						break;
					default:
					//nothing to do
				}
			});

		},
		msRebind: function(){
			$('.js-mySelection').mySelection();
		},
		// action Add
		msAdd: function() {
			var _self = this,
			$_self = $(_self);
			this.$caller.closest('.catal-ex-item-buttons').addClass('is-selected');
			this.$caller.attr('data-action','remove');

			var myselection_line = '<li class="mysel-item">'+
				'<a href="'+this.$caller.data('itemlink')+'" class="mysel-item-link">'+
						'<span class="mysel-item-txt">'+this.$caller.data('itemtitle')+'</span>'+
				'</a>'+
				'<a href="#" class="mysel-item-remove js-mySelection" data-action="remove" data-itemid="'+this.$caller.data('itemid')+'" data-itemtype="'+this.$caller.data('itemtype')+'" data-target="'+this.$caller.data('target')+'" data-removenotiftxt="'+this.$caller.data('removenotiftxt')+'" title="Remove '+this.$caller.data('itemtitle')+' from My selection"><i class="icon icon-star-delete" aria-hidden="true"></i></a>'+
						'</li>';
			$(_self.$caller.data('target')).find('.mysel-'+this.$caller.data('itemtype')+' .mysel-list').prepend(myselection_line);
			_self.msNotif(this.$caller.data('addnotiftxt'));
			return this;
		},
		// action Remove
		msRemove: function() {
			var _self = this,
			$_self = $(_self),
			$allButton = $('[data-itemid="'+ this.$caller.data('itemid')+'"]');
			$allButton.each(function(e){
				$_this = $(this);
				$parent = $_this.parents('.myselection-list');
				if ($parent.length) {
					var $group = $_this.parents('.catal-ed-group'),
							$item = $_this.parents('.catal-ex-item'),
							$number = $group.find('.qty-round-nb'),
							$bigTitle = $('.mysel-cata-title-container'),
							titleId = $group.find('.catal-ed-activity-main-title').prop('id'),
							$sidebarLink = $('.catal-nav-affix-list').find('[href=#'+titleId+']')	;
					$item.remove();
					if ($group.length && $number.length) {
						var numberOld = $number.html(),
								numberNow = numberOld - 1;
						$number.html(numberNow);
					}
					//Update bigTitle number
					$bigTitle.find('.qty-round-nb').html( parseInt( $bigTitle.find('.qty-round-nb').html() ) - 1 );
					//Update sidebar part number
					$sidebarLink.find('.qty-round-nb').html( parseInt( $sidebarLink.find('.qty-round-nb').html() ) - 1 );

				} else {
					if( $(this).hasClass('mysel-item-remove')){
 						$(this).closest('.mysel-item').remove();
					} else {
						$(this).closest('.catal-ex-item-buttons').removeClass('is-selected');
						$(this).attr('data-action','add');
					}
				}
			});
			_self.msNotif(this.$caller.data('removenotiftxt'));
			return this;
		},// toggle
		// launch a notif
		msNotif: function(message) {

			var notif = noty({
				layout: 'topRight',
				theme: 'relax',
				type: '',
				text: message, // can be html or string
				dismissQueue: true, // If you want to use queue feature set this true
				template: '<div class="catal-ex-notif-container noty_message"><span class="catal-ex-notif-txt noty_text"></span><button class="catal-ex-notif-close-btn"><i class="icon icon-cross noty_close" aria-hidden="true"></i></button></div>',
				animation: {
						open: {height: 'toggle'}, // or Animate.css class names like: 'animated bounceInLeft'
						close: {height: 'toggle'}, // or Animate.css class names like: 'animated bounceOutLeft'
						easing: 'swing',
						speed: 500 // opening & closing animation speed
				},
				timeout: 1500, // delay for closing event. Set false for sticky notifications
				maxVisible: 7, // you can set max visible notification for dismissQueue true option,
				closeWith: ['click'] // ['click', 'button', 'hover', 'backdrop'] // backdrop click will close all notifications
			});

		},
		msUpdate: function(e) {
			var _self     = this,
			$_self        = $(_self),
			container     = $(_self.$caller.data('target')),
			totalElement  = _self.msTitleUpdate(container),
			totalExposant = _self.msPartTitleUpdate( $('.mysel-exposant', container) ),
			totalBrand    = _self.msPartTitleUpdate( $('.mysel-brand', container) ),
			totalProduct  = _self.msPartTitleUpdate( $('.mysel-product', container) );
			_self.msCalcVisibility(totalElement,totalExposant,totalBrand,totalProduct);
			return this;
		},
		msTitleUpdate: function($elem) {
			$elem.find('.mysel-title .qty-round-nb').html($elem.find('.mysel-item').length);
			return $elem.find('.mysel-item').length;
		},
		msPartTitleUpdate: function($elem) {
			$elem.find('.qty-round-nb').html($elem.find('.mysel-item').length);
			if( $elem.find('.mysel-item').length === 0 ){
				$elem.hide();
			} else {
				$elem.show();
			}
			return $elem.find('.mysel-item').length;
		},
		msCalcVisibility: function(totalElement,totalExposant,totalBrand,totalProduct) {
			console.log('Calculation in progress...');
			var _self     = this,
			$_self        = $(_self),
			container     = $(_self.$caller.data('target')),
			$exposantContainer 	= $('.mysel-exposant', container),
			$brandContainer 		= $('.mysel-brand', container),
			$productContainer 	= $('.mysel-product', container),
			nbExposantVisible		= 0,
			nbBrandVisible		= 0,
			nbProductVisible		= 0;

			if(  totalExposant > 1 && totalBrand > 1 && totalProduct > 1 ){
				nbExposantVisible		= 2;
				nbBrandVisible			= 2;
				nbProductVisible		= 2;
			}else {
				if( totalExposant < 3 &&  totalBrand < 3  &&  totalProduct < 3 ) {
					nbExposantVisible	=  totalExposant;
					nbBrandVisible		=  totalBrand;
					nbProductVisible	= totalProduct;
				}else {
					var bonus = 0,
					iterate = 0;
					// define the bonus
					if( totalExposant < 2 ) {
						nbExposantVisible = totalExposant;
						bonus += 2 - totalExposant;
					}else {
						nbExposantVisible = 2;
					}
					if( totalBrand < 2 ) {
						nbBrandVisible = totalBrand;
						bonus += 2 - totalBrand;
					} else {
						nbBrandVisible = 2;
					}
					if( totalProduct < 2 ) {
						nbProductVisible = totalProduct;
						bonus += 2 - totalProduct;
					} else {
						nbProductVisible = 2;
					}
					while( bonus > 0 && iterate !== 6){

						if( totalExposant > 2 && nbExposantVisible != totalExposant && bonus > 0){

							nbExposantVisible++ ;
							bonus = bonus-1;
						}
						if( totalBrand > 2 && nbBrandVisible != totalBrand && bonus > 0){
							//console.log('brand +1' );
							nbBrandVisible++ ;
							bonus = bonus-1;
						}
						if( totalProduct > 2 && nbProductVisible != totalProduct && bonus > 0){
							//console.log('product +1' );
							nbProductVisible++ ;
							bonus = bonus-1;
						}
						iterate++;
						if( iterate === 6 ){
							break;
						}
					}
				}
			}
			$('.mysel-item',$exposantContainer).removeClass('js-visible').removeClass('js-no-border');
			$('.mysel-item:nth-child(-n+'+nbExposantVisible+')',$exposantContainer).addClass('js-visible').last().addClass('js-no-border');
			$('.mysel-item',$brandContainer).removeClass('js-visible').removeClass('js-no-border');
			$('.mysel-item:nth-child(-n+'+nbBrandVisible+')',$brandContainer).addClass('js-visible').last().addClass('js-no-border');
			$('.mysel-item',$productContainer).removeClass('js-visible').removeClass('js-no-border');
			$('.mysel-item:nth-child(-n+'+nbProductVisible+')',$productContainer).addClass('js-visible').last().addClass('js-no-border');
		},
	};

	// Instanciate the plugin and put it in a variable
	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new mySelection(this, options));
			}
		});
	};
	if( $('.js-mySelection').length > 0){
		$('.js-mySelection').mySelection();
	}

})(jQuery, window, document);
