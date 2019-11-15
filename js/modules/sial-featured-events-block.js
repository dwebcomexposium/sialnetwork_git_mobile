(function($) {
    'use strict';
    var block_featured_events = $('.sial-featured-events_block');
    var events_datas = {};
    var _MS_PER_DAY = 1e3 * 60 * 60 * 24;
    var auto_switch_event_interval = false;
    $(function() {
        if (block_featured_events.length) {
            getDatas(function() {
                var now = new Date();
                events_datas.forEach(function(event_data, index) {
                    var start_date = new Date(event_data.start_date);
                    var end_date = new Date(event_data.end_date);
                    var difference_with_start_date = dateDiffInDays(now, start_date);
                    var difference_with_end_date = dateDiffInDays(now, end_date);
                    var list_element = $('<li data-diff-start-date="' + difference_with_start_date + '" class="event-element" data-key="' + index + '"><p class="event-shortname"><span>' + event_data.shortname + '</span></p><p class="event-country"><span>' + event_data.country + '</span></p></li>');
                    if (event_data.is_sial_event) {
                        list_element.addClass('is_sial_event');
                    }
                    var countdown_to_append = '';
                    if (difference_with_start_date === 0 || difference_with_start_date < 0 && difference_with_end_date >= 0) {
                        countdown_to_append += ' - <span class="countdown">LIVE</span>';
                    } else if (difference_with_start_date > 0 && difference_with_start_date <= 60) {
                        countdown_to_append += ' - <span class="countdown">D-' + difference_with_start_date + '</span>';
                    }
                    list_element.find('.event-shortname').append(countdown_to_append);
                    block_featured_events.find('.events-list').append(list_element);
                });
                var next_show = false;
                block_featured_events.find('.event-element').each(function() {
                    var difference_with_start_date = parseInt($(this).attr('data-diff-start-date'));
                    if (difference_with_start_date > 0) {
                        if (next_show) {
                            var compare_difference_with_start_date = parseInt(next_show.attr('data-diff-start-date'));
                            if (difference_with_start_date < compare_difference_with_start_date) {
                                $(this).addClass('is-next-show').siblings().removeClass('is-next-show');
                                next_show = $(this);
                            }
                        } else {
                            next_show = $(this);
                        }
                    }
                });
                if (next_show) {
                    updateHighlightedEvent(next_show, false);
                }
                $(document).on('click', '.sial-featured-events_block .event-element:not(.current)', function(e) {
                    e.preventDefault();
                    updateHighlightedEvent($(this), true);
                });
            });
        }
    });
    /* https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript */    function dateDiffInDays(a, b) {
        var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }
    function updateHighlightedEvent(list_element, scrollToEvent) {
        if (auto_switch_event_interval !== false) {
            clearInterval(auto_switch_event_interval);
        }
        auto_switch_event_interval = setInterval(function() {
            var current_event = $('.sial-featured-events_block .event-element.current');
            if (current_event.length) {
                var next_element = current_event.next('.event-element');
                if (!next_element.length) {
                    next_element = $('.sial-featured-events_block .event-element:first-of-type');
                }
                updateHighlightedEvent(next_element, false);
            }
        }, 5e3);
        list_element.addClass('current').siblings('.event-element').removeClass('current');
        var existing_highlighted_event = block_featured_events.find('.align-right .event-highlighted');
        var datas = events_datas[list_element.attr('data-key')];
        var new_highlighted_event = $('<div class="event-highlighted is_sial_event"><p class="event-shortname">' + datas.shortname + '</p><p class="event-country"><span>' + datas.country + '</span></p><p class="event-date">' + datas.displayed_date + '</p><img src="' + datas.image + '" alt="' + datas.shortname + '" /><a href="' + datas.link + '" title="More information about this event">Be inspired</a></div>');
        if (list_element.hasClass('is-next-show')) {
            new_highlighted_event.addClass('is-next-show').prepend('<p class="next-show">Next Show</p>');
        }
        if (scrollToEvent) {
            var top = block_featured_events.find('.align-right').offset().top;
            if ($('.site-banner').length) {
                top -= $('.site-banner').outerHeight(false);
            }
            $('body, html').animate({
                scrollTop: top
            }, 750);
        }
        if (existing_highlighted_event.length) {
            existing_highlighted_event.fadeOut(200, function() {
                $(this).remove();
                block_featured_events.find('.align-right').append(new_highlighted_event);
                new_highlighted_event.fadeIn(200);
            });
        } else {
            block_featured_events.find('.align-right').append(new_highlighted_event);
            new_highlighted_event.fadeIn(200);
        }
    }
    function getDatas(callback) {
        if (typeof ouragan_sial_events_datas !== 'undefined') {
            events_datas = sortDatas(ouragan_sial_events_datas);
            if (callback) {
                callback();
            }
        } else {
            $.getJSON(block_featured_events.attr('data-url')).done(function(datas) {
                events_datas = sortDatas(datas);
                if (callback) {
                    callback();
                }
            });
        }
    }
    function sortDatas(datas) {
        var new_datas = Object.keys(datas).map(function(e) {
            return datas[e];
        }).sort(function(a, b) {
            return a.shortname.localeCompare(b.shortname);
        });
        var sial_events_datas = new_datas.filter(function(event_data) {
            return event_data.is_sial_event;
        });
        var other_events_datas = new_datas.filter(function(event_data) {
            return !event_data.is_sial_event;
        });
        return sial_events_datas.concat(other_events_datas);
    }
})(jQuery);