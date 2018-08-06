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
  var pluginName = 'mobileSialShow',
    defaults = {};

  // The actual plugin constructor
  function mobileSialShow(_caller, options) {
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
  mobileSialShow.prototype = {
    init: function() {
      var _self = this;
      _self.mssBinding();
      _self.mssLoadEvent();
      return this;
    },
    // register eventlistener
    mssBinding: function() {
      var _self = this,
        $_self = $(_self),
        $container = $(this._caller);
      $('.mss-tiles').on('click', _self.mssSelectShow );
      $container.on('mssSelectChange', _self.mssSelectChange );
      $container.on('click', '.mss-close' , _self.mssClose );
    },
    // action Select an country
    mssSelectShow: function( e ) {
      e.preventDefault();
      var _self = this,
        $_self = $(_self);
      if( ! $_self.hasClass('js-current') ){
        $_self.parent().find('.js-current').removeClass('js-current');
        $_self.addClass('js-current');
        $_self.closest('.js-mobileSialShow').trigger('mssSelectChange');
      }
      return this;
    },
    // change selection
    mssSelectChange: function() {
      var _self = this,
        $_self = $(_self),
        plugin = $_self.data('mobileSialShow'),
        $current = $_self.find('.js-current'),
        country = $_self.find('.js-current').data('country'),
        lstEvents = $_self.data('json');

      //send the right object to load in the container info
      plugin.mssLoadInfo(lstEvents[country]);
      return this;
    },
    // on Load get JSON and the next event
    mssLoadEvent: function() {

      var _self = this,
        $_self = $(_self),
        $container = $(this._caller),
        index = '',
        url = $container.data('url');

        // Get events JSON
        $.getJSON( url )
          .done( function(json) {
            $container.data('json',json);

            $.each( json, function( i ) {
              var event = this;
              if( event.next ) {
                next = event;
                index = i;
                return false;
              }
            });

            $container.find('[data-country="'+ index + '"]').addClass('mss-is-next');
          });

        // Add mss-info
        mssInfoText = '<div class="mss-info mss-hidden">'+
          '<a href="#" class="mss-close"><i class="icon icon-cross-alt" aria-hidden="true"></i><span class="visually-hidden">Close the window</span></a>'+
            '<div class="mss-info-inside">'+
              '<h2 class="mss-info-title"></h2>'+
              '<p class="mss-info-date"></p>'+
              '<p class="mss-info-location"></p>'+
              '<img class="mss-info-img" alt="" src="#"/>'+
              '<a class="mss-info-link" href="#">Get inspired</a>'+
            '</div>'+
          '</div>';
        var mssTilesBeforeInfo;
        // Know about the first tiles states
        if(! $container.length%2 ) {
          mssTilesBeforeInfo = $container.find('a:nth-child(2n)');
        } else {
          mssTilesBeforeInfo = $container.find('a:nth-child(2n+1)');
          mssTilesBeforeInfo.first().addClass('mss-tiles-large');
          mssTilesBeforeInfo = mssTilesBeforeInfo.add($container.find('a:last'));
        }
        mssTilesBeforeInfo = $.unique(mssTilesBeforeInfo);
        $(mssInfoText).insertAfter(mssTilesBeforeInfo);

      return this;
    },
    //Load information in Info
    mssLoadInfo: function(json) {
      var _self = this,
        $_self = $(_self),
        $container = $(this._caller),
        $current = $container.find('.js-current'),
        $containerInfo = $current.find('~ .mss-info').first(),
        $containerInfoInside = $containerInfo.find('.mss-info-inside'),
        timeout = 0;

        $container.find('.mss-info').not( $containerInfo ).slideUp(200).removeClass('mss-visible');

        if( $containerInfo.hasClass( 'mss-visible' ) ) {
          $containerInfoInside.fadeOut(200);
          timeout = 200;
        }
        setTimeout( function(){
          $containerInfo.find('.mss-info-title').html(json.country);
          $containerInfo.find('.mss-info-date').html(json.date);
          $containerInfo.find('.mss-info-location').html(json.location);
          $containerInfo.find('.mss-info-title').html(json.country);
          $containerInfo.find('.mss-info-img').prop('src',json.image);
          $containerInfo.find('.mss-info-link').prop('href',json.link);
          if( $containerInfo.hasClass( 'mss-visible' ) ) {
            $containerInfoInside.fadeIn(200);
          }
        }, timeout);
        $containerInfo.slideDown(200).addClass('mss-visible');

        $('html, body').animate({
          scrollTop: $current.offset().top,
        }, 200);
    },
    // close the mss-info
    mssClose: function(e) {
      e.preventDefault();
      var _self = this,
        $_self = $(_self),
        $containerInfo = $_self.closest('.mss-info').slideUp(200).removeClass('mss-visible');
        $containerInfo.closest('.inside').find('.js-current').removeClass('js-current');
    }
  };

  // Instanciate the plugin and put it in a variable
  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, pluginName)) {
        $.data(this, pluginName, new mobileSialShow(this, options));
      }
    });
  };
  if ($('.js-mobileSialShow').length > 0) {
    $('.js-mobileSialShow').mobileSialShow();
  }

})(jQuery, window, document);
