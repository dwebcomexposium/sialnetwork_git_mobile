/**!
 Tab Nav
 Description du module

 @contributors: Guillaume Focheux (Alsacréations)
 @date-created: 2015-04-24
 @last-update: 2015-04-24
 */

;
(function ($) {

    if ($('.tabs-nav').length > 0) {
        $AllTabNav = $('.tabs-nav');
        $AllTabNav.find('.tn-item-link').on('click', function (e) {
            e.preventDefault();
            var indexTab = $(this).closest('.tn-item').index(),
            $tabNav = $(this).closest('.tabs-nav');
            $('.tn-item-link', $tabNav).removeClass('is-active');
            $(this).addClass('is-active');
            $('.tn-panel', $tabNav).removeClass('is-visible');
            $('.tn-panel', $tabNav).eq(indexTab).addClass('is-visible');
            // if ($('.tn-panel', $tabNav).eq(indexTab).find('.slider').length > 0) {
                // Reset the slider in the hidden tab
                // $('.tn-panel', $tabNav).eq(indexTab).find('.slider').each(function (e) {
                //     var sliderClass = $(this).attr("class").match(/slider-instance[\w-]*\b/);
                //     sliderClass = sliderClass[0];
                // });
            // }
        });
    }

})(jQuery);