/**
 * @package         Regular Labs Library
 * @version         19.3.16030
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2019 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

var RegularLabsForm = null;

(function($) {
	"use strict";

	RegularLabsForm = {
		getValue: function(name, escape) {
			var $field = $('[name="' + name + '"]');

			if (!$field.length) {
				$field = $('[name="' + name + '[]"]');
			}

			if (!$field.length) {
				return;
			}

			var type = $field[0].type;

			switch (type) {
				case 'radio':
					$field = $('[name="' + name + '"]:checked');
					break;

				case 'checkbox':
					return this.getValuesFromList($('[name="' + name + '[]"]:checked'), escape);

				case 'select':
				case 'select-one':
				case 'select-multiple':
					return this.getValuesFromList($field.find('option:checked'), escape);
			}

			return this.prepareValue($field.val(), escape);
		},

		getValuesFromList: function($elements, escape) {
			var self = this;

			var values = [];

			$elements.each(function() {
				values.push(self.prepareValue($(this).val(), escape));
			});

			return values;
		},

		prepareValue: function(value, escape) {
			if (!isNaN(value) && value.indexOf('.') < 0) {
				return parseInt(value);
			}

			if (escape) {
				value = value.replace(/"/g, '\\"');
			}

			return value.trim();
		},

		toTextValue: function(str) {
			return (str + '').replace(/^[\s-]*/, '').trim();
		},

		toSimpleValue: function(str) {
			return (str + '').toLowerCase().replace(/[^0-9a-z]/g, '').trim();
		},

		preg_quote: function(str) {
			return (str + '').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!<>\|\:])/g, '\\$1');
		},

		escape: function(str) {
			return (str + '').replace(/([\"])/g, '\\$1');
		},

		setRadio: function(id, value) {
			value = value ? 1 : 0;
			document.getElements('input#jform_' + id + value + ',input#jform_params_' + id + value + ',input#advancedparams_' + id + value).each(function(el) {
				el.click();
			});
		},

		initCheckAlls: function(id, classname) {
			$('#' + id).attr('checked', this.allChecked(classname));
			$('input.' + classname).click(function() {
				$('#' + id).attr('checked', this.allChecked(classname));
			});
		},

		allChecked: function(classname) {
			return $('input.' + classname + ':checkbox:not(:checked)').length < 1;
		},

		checkAll: function(checkbox, classname) {
			var allchecked = this.allChecked(classname);
			$(checkbox).attr('checked', !allchecked);
			$('input.' + classname).attr('checked', !allchecked);
		},

		getEditorSelection: function(editorname) {
			var editor_textarea = document.getElementById(editorname);

			if (!editor_textarea) {
				return '';
			}

			var iframes = editor_textarea.parentNode.getElementsByTagName('iframe');

			if (!iframes.length) {
				return '';
			}

			var editor_frame  = iframes[0];
			var contentWindow = editor_frame.contentWindow;

			if (typeof contentWindow.getSelection !== 'undefined') {
				var sel = contentWindow.getSelection();

				if (sel.rangeCount) {
					var container = contentWindow.document.createElement("div");
					var len       = sel.rangeCount;
					for (var i = 0; i < len; ++i) {
						container.appendChild(sel.getRangeAt(i).cloneContents());
					}

					return container.innerHTML;
				}

				return '';
			}

			if (typeof contentWindow.document.selection !== 'undefined') {
				if (contentWindow.document.selection.type == "Text") {
					return contentWindow.document.selection.createRange().htmlText;
				}
			}

			return '';
		},

		toggleSelectListSelection: function(id) {
			var el = document.getElement('#' + id);
			if (el && el.options) {
				for (var i = 0; i < el.options.length; i++) {
					if (!el.options[i].disabled) {
						el.options[i].selected = !el.options[i].selected;
					}
				}
			}
		},

		prependTextarea: function(id, content, separator) {
			var textarea     = jQuery('#' + id);
			var orig_content = textarea.val().trim();

			if (orig_content && separator) {
				orig_content = "\n\n" + separator + "\n\n" + orig_content;
			}

			textarea.val(content + orig_content);
		},

		setToggleTitleClass: function(input, value) {
			var el = $(input).parent().parent().parent().parent();

			el.removeClass('alert-success').removeClass('alert-error');
			if (value === 2) {
				el.addClass('alert-error');
			} else if (value) {
				el.addClass('alert-success');
			}
		}
	};

	$(document).ready(function() {
		removeEmptyControlGroups();
		addKeyUpOnShowOn();

		function removeEmptyControlGroups() {
			// remove all empty control groups
			$('div.control-group > div').each(function(i, el) {
				if (
					$(el).html().trim() == ''
					&& (
						$(el).attr('class') == 'control-label'
						|| $(el).attr('class') == 'controls'
					)
				) {
					$(el).remove();
				}
			});
			$('div.control-group').each(function(i, el) {
				if ($(el).html().trim() == '') {
					$(el).remove();
				}
			});
			$('div.control-group > div.hide').each(function(i, el) {
				$(el).parent().css('margin', 0);
			});
		}

		/**
		 * Adds keyup triggers to fields to trigger show/hide of showon fields
		 */
		function addKeyUpOnShowOn() {
			var field_ids = [];

			$('[data-showon]').each(function() {
				var $target  = $(this);
				var jsondata = $target.data('showon') || [];

				// Collect an all referenced elements
				for (var i = 0, len = jsondata.length; i < len; i++) {
					field_ids.push('[name="' + jsondata[i]['field'] + '"]');
					field_ids.push('[name="' + jsondata[i]['field'] + '[]"]');
				}
			});

			// Trigger the change event on keyup
			$(field_ids.join(',')).on('keyup', function() {
				$(this).change();
			});
		}
	});

})(jQuery);
