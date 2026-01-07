/**
 * @package         Regular Labs Library
 * @version         23.9.3039
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            https://regularlabs.com
 * @copyright       Copyright © 2023 Regular Labs All Rights Reserved
 * @license         GNU General Public License version 2 or later
 */

"use strict";

(function($) {
    $(document).ready(function() {
        $('.rl_resize_textarea').click(function() {
            var $el    = $(this);
            var $field = $(`#${$el.attr('data-id')}`);

            if ($el.hasClass('rl_minimize')) {
                $el.removeClass('rl_minimize').addClass('rl_maximize');
                $field.css({'height': $el.attr('data-min')});
                return;
            }

            $el.removeClass('rl_maximize').addClass('rl_minimize');
            $field.css({'height': $el.attr('data-max')});
        });
    });
})(jQuery);
