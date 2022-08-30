/**
<<<<<<< HEAD
 * @copyright   (C) 2010 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

/**
 * JCaption javascript behavior
 *
 * Used for displaying image captions
 *
 * @package     Joomla
 * @since       1.5
 * @version  1.0
 */
var JCaption = function(_selector) {
    var $, selector,
    
    initialize = function(_selector) {
        $ = jQuery.noConflict();
        selector = _selector;
        $(selector).each(function(index, el) {
            createCaption(el);
        })
    },
    
    createCaption = function(element) {
        var $el = $(element), 
        caption = $el.attr('title'),
        width = $el.attr("width") || element.width,
        align = $el.attr("align") || $el.css("float") || element.style.styleFloat || "none",
        $p = $('<p/>', {
            "text" : caption,
            "class" : selector.replace('.', '_')
        }),
        $container = $('<div/>', {
            "class" : selector.replace('.', '_') + " " + align,
            "css" : {
                "float" : align,
                "width" : width
            }
        });
        $el.before($container);
        $container.append($el);
        if (caption !== "") {
            $container.append($p);
        }
    }
    initialize(_selector);
}
