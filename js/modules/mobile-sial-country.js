/**!
 * Sial Map Show(pasteque)
 *
 * @contributors: Guillaume Focheux (Alsacréations)
 * @date-created: 2015-11-30
 * @last-update: 2015-11-30
 * */

;
(function($, window, document, undefined) {

  // Create the defaults once
  var pluginName = 'mobileSialCountry',
    defaults = {};

  // The actual plugin constructor
  function mobileSialCountry(_caller, options) {
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
  mobileSialCountry.prototype = {
    init: function() {
      var _self = this;
      _self.mscBinding();
      _self.mscLoadEvent();
      return this;
    },
    // register eventlistener
    mscBinding: function() {
      var _self = this,
        $_self = $(_self),
        $container = $(this._caller);
      $('.msc-regions').on('click', _self.mscSelectShow );
      $container.on('mscSelectChange', _self.mscSelectChange );
      $container.on('click', '.msc-close' , _self.mscClose );
    },
    // action Select an country
    mscSelectShow: function( e ) {
      e.preventDefault();
      var _self = this,
        $_self = $(_self);
      if( ! $_self.hasClass('js-current') ){
        $_self.parent().find('.js-current').removeClass('js-current');
        $_self.addClass('js-current');
        $_self.closest('.js-mobileSialCountry').trigger('mscSelectChange');
      }
      return this;
    },
    // change selection
    mscSelectChange: function() {
      var _self = this,
        $_self = $(_self),
        plugin = $_self.data('mobileSialCountry'),
        $current = $_self.find('.js-current'),
        region= $_self.find('.js-current').data('regions'),
        json = $_self.data('json');

      //send the right object to load in the container info
      plugin.mscLoadInfo(json, region);
      return this;
    },
    // on Load get JSON and the next event
    mscLoadEvent: function() {
      var _self = this,
        $_self = $(_self),
        container = this._caller,
        $container = $(this._caller),
        index = '',
        url = $container.data('url');
        //Get Event Detail JSON
        $.getJSON( url )
          .done( function(json) {
            $container.data('json',json);
            $container.find('[data-regions="'+ index + '"]');
          });
      return this;
    },
    //Load information in Info
    mscLoadInfo: function(json, region) {
      var _self = this,
        $_self = $(_self),
        $container = $(this._caller),
        $current = $container.find('.js-current'),
        $containerInfo = $current.find('~ .msc-info').first(),
        $containerInfoInside = $containerInfo.find('.msc-info-inside'),
        $containerCountriesNb = $current.find('.msc-regions-name-subtitle').html(),
        timeout = 0,
        $listCountry = $containerInfo.find('.msc-info-list'),
        jsonListCountry = json.regions ,
        regionSelected = {
          'states': []
        },
        c_active= 0;
        region = region.split('|');

        $listCountry.find('li').remove();
        // wallthrought Regions list
        $.each(jsonListCountry, function(){
          if( $.inArray( this.name , region ) >= 0){
            // wallthrought regions's States list if region is selected
            $.each(this.states, function(){
              var country = json.state_specific[this];

              if( country.inactive === 'no' ){
                htmlCountry = '<li ><a class="msc-info-link" href="'+country.url+'"><i class="icon icon-long-arrow-right" aria-hidden="true"></i>'+country.name+'</a></li>';
                $listCountry.append(htmlCountry);
                c_active++;
              }
            });
          }
        });
        $containerInfo.find('.msc-info-title').html($current.data('regionsDisplay') + ' - ' + $containerCountriesNb);
        $container.find('.msc-info').not( $containerInfo ).slideUp(200).removeClass('msc-visible');

        if( $containerInfo.hasClass( 'msc-visible' ) ) {
          $containerInfoInside.fadeOut(200);
          timeout = 200;
        }

        setTimeout( function(){

          if( $containerInfo.hasClass( 'msc-visible' ) ) {
            $containerInfoInside.fadeIn(200);
          }
        }, timeout);
        $containerInfo.slideDown(200).addClass('msc-visible');

        $('html, body').animate({
          scrollTop: $current.offset().top,
        }, 200);
    },
    // close the msc-info
    mscClose: function(e) {
      e.preventDefault();
      var _self = this,
        $_self = $(_self),
        $containerInfo = $_self.closest('.msc-info').slideUp(200).removeClass('msc-visible');
        $containerInfo.closest('.inside').find('.js-current').removeClass('js-current');
    }
  };

  // Instanciate the plugin and put it in a variable
  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, pluginName)) {
        $.data(this, pluginName, new mobileSialCountry(this, options));
      }
    });
  };
  if ($('.js-mobileSialCountry').length > 0) {
    $('.js-mobileSialCountry').mobileSialCountry();
  }

})(jQuery, window, document);
