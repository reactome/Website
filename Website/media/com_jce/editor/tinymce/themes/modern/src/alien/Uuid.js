/* jce - 2.9.89 | 2025-07-16 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
var count = 0, seed = function() {
    function rnd() {
        return Math.round(4294967295 * Math.random()).toString(36);
    }
    return "s" + Date.now().toString(36) + rnd() + rnd() + rnd();
}, uuid = function(prefix) {
    return prefix + count++ + seed();
};

export default {
    uuid: uuid
};