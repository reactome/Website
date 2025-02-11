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
        // remove all empty control groups
        $('div.rl_simplecategory').each(function(i, el) {
            var $el = $(el);

            var func = function() {
                var new_value = $(this).val();

                if (new_value == '-1') {
                    $el.find('.rl_simplecategory_value').val($el.find('.rl_simplecategory_new input').val());
                    return;
                }

                $el.find('.rl_simplecategory_value').val(new_value);
            };

            $el.find('.rl_simplecategory_select select').on('change', func).on('keyup', func);
            $el.find('.rl_simplecategory_new input').on('change', func).on('keyup', func);
        });
    });
})(jQuery);
