/**
 * @package         Modals
 * @version         12.6.1
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            https://regularlabs.com
 * @copyright       Copyright © 2023 Regular Labs All Rights Reserved
 * @license         GNU General Public License version 2 or later
 */

var RegularLabsModalsPopup = null;

(function($) {
    "use strict";

    RegularLabsModalsPopup = {
        init: function() {
            this.initType();
            this.initText();

            $('.reglab-overlay').css('cursor', '').fadeOut();
        },

        initText: function($el) {
            var selection = this.getSelection();

            if ( ! selection) {
                return;
            }

            $('input[name="text"]').val(selection);
        },

        initType: function($el) {
            RegularLabsModalsPopup.setTypeFromTab($('ul.nav-tabs > li.active > a').first());

            $('ul.nav-tabs > li > a').on('shown.bs.tab', function() {
                RegularLabsModalsPopup.setTypeFromTab($(this));
            });
        },

        setTypeFromTab: function($el) {
            if ( ! $el || ! $el.attr('href')) {
                return;
            }

            $('#type').val($el.attr('href').replace('#tab-', '')).trigger('change');
        },

        insertText: function() {
            var tag = this.getTag();

            if ( ! tag) {
                return false;
            }

            window.parent.Joomla.editors.instances[modals_editorname].replaceSelection(tag);

            return true;
        },

        getSelection: function() {
            var editor_textarea = window.parent.document.getElementById(modals_editorname);

            if ( ! editor_textarea) {
                return false;
            }

            var iframes = editor_textarea.parentNode.getElementsByTagName('iframe');

            if ( ! iframes.length) {
                return false;
            }

            var editor_frame  = iframes[0];
            var contentWindow = editor_frame.contentWindow;

            if (typeof contentWindow.getSelection !== 'undefined') {
                var sel = contentWindow.getSelection();
                if (sel.rangeCount) {
                    var container = contentWindow.document.createElement("div");
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        container.appendChild(sel.getRangeAt(i).cloneContents());
                    }
                    return container.innerHTML;
                }
            }

            if (typeof contentWindow.document.selection !== 'undefined'
                && contentWindow.document.selection.type == "Text") {
                return contentWindow.document.selection.createRange().htmlText;
            }

            return false;
        },

        getTag: function(type) {
            var type = $('input[name="type"]').val();


            var main_attributes = this.getAttributesByType(type);

            if ( ! main_attributes) {
                return false;
            }

            var extra_attributes = this.getAttributesExtra(type);

            return this.getTagoutput(main_attributes + ' ' + extra_attributes);
        },


        getTagoutput: function(attributes) {
            var start = modals_tag_characters[0];
            var end   = modals_tag_characters[1];

            var text = $('input[name="text"]').val();

            return start + modals_tag + ' ' + attributes.trim() + end
                + text
                + start + '/' + modals_tag + end;
        },

        getEditorContents: function(id) {
            return Joomla.editors.instances[id].getValue();
        },

        getAttributesExtra: function(type) {
            var attributes = [];

            var keys = [
                'title',
                'class',
                'classname',
                'width',
                'height'
            ];

            for (var i = 0; i < keys.length; i++) {
                var attrib = this.getAttributesDefault(keys[i], '', true);
                attrib && attributes.push(attrib);
            }

            var value = $('input[name="iframe"]:checked').val();
            if (value != 0) {
                attributes.push('iframe="true"');
            }


            return attributes.join(' ');
        },

        getAttributesByType: function(type) {
            switch (type) {
                case 'url':
                    return this.getAttributesDefault('url', 'Please enter a URL', true);

                case 'image':
                    return this.getAttributesImage();


                default:
                    return false;
            }
        },

        getAttributesDefault: function(id, error, escape, key) {
            key = key ? key : id;

            var value = $('input[name="' + id + '"]').val();

            if (value == '') {
                error && alert(error);

                return false;
            }

            if (escape) {
                value = this.escape(value);
            }

            return key + '="' + value + '"';
        },


        escape: function(str) {
            return (str + '').replace(/([\"])/g, '\\$1');
        }
    };

    $(document).ready(function() {
        setTimeout(function() {
            RegularLabsModalsPopup.init();
        }, 100);
    });
})
(jQuery);
