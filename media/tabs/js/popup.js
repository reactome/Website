/**
 * @package         Tabs
 * @version         8.0.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2021 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

var RegularLabsTabsPopup = null;

(function($) {
	"use strict";

	RegularLabsTabsPopup = {
		texts   : [
			'alias', 'mainclass', 'class',
		],
		booleans: [
			'color_inactive_handles', 'outline_handles', 'outline_content',
		],

		init: function() {
			var self = this;

			$('input[name$="[open]"][value="1"]').click(function() {
				self.setDefault(this);
			});

			var has_default = false;
			$('input[name$="[open]"][value="1"]').each(function($i, el) {
				if ($(el).attr('checked')) {
					$('.' + $(el).parent().attr('id') + '_icon').show();
					has_default = true;
				}
			});

			if (!has_default) {
				this.setRadioOption('tab_1[open]', 1);
				$('.' + $('input[name="tab_1[open]"][value="1"]').parent().attr('id') + '_icon').show();
			}

			$('.reglab-overlay').css('cursor', '').fadeOut();
		},

		setDefault: function(el) {
			$('.' + $(el).parent().attr('id') + '_icon').show();
			this.closeOtherDefaults(el);
		},

		closeOtherDefaults: function(el) {
			var self = this;
			var $el  = $(el);

			$('input[name$="[open]"][value="1"]').each(function($i, input) {
				if ($(input).attr('name') == $el.attr('name')) {
					return;
				}

				$('.' + $(input).parent().attr('id') + '_icon').hide();
				self.setRadioOption($(input).attr('name'), 0);
			});
		},

		insertText: function() {
			var self = this;
			var form = document.getElementById('tabsForm');

			var html      = '';
			var nested_id = $('input[name="tab_1[nested]"][value="1"]').attr('checked') ? '-' + form['tab_1[nested_id]'].value.trim() : '';

			if (form['tab_1[title]'].value.trim() == '') {
				alert(tabs_error_empty_title);

				return false;
			}

			var first = true;
			$('.tab-pane').each(function($i, el) {
				var parameters = {};

				var title = form[el.id + '[title]'].value.trim();

				if (title == '') {
					return;
				}

				parameters.title = title;

				var open_yes = $('input[name="' + el.id + '[open]"][value="1"]');

				if (!first && open_yes.attr('checked')) {
					parameters.open = true;
				}


				$.each(self.texts, function(b, name) {
					var field_name = el.id + '[' + name + ']';
					var text_field = $('input[name="' + field_name + '"]');

					if (text_field.val()) {
						parameters[name] = text_field.val();
					}
				});

				$.each(self.booleans, function(b, name) {
					var field_name = el.id + '[' + name + ']';

					var input_default = $('input[name="' + field_name + '"][value=""]');
					var input_no      = $('input[name="' + field_name + '"][value="0"]');
					var input_yes     = $('input[name="' + field_name + '"][value="1"]');

					if (input_default.attr('checked')) {
						return;
					}

					if (input_default.length && input_no.attr('checked')) {
						parameters[name] = 'false';
						return;
					}

					if (input_yes.attr('checked')) {
						parameters[name] = 'true';
					}
				});


				var content = $('#' + el.id + '_content').html().trim();

				if (content == '') {
					content = tabs_content_placeholder;
				}

				var params = [];

				for (var key in parameters) {
					params.push(key + '="' + self.escape(parameters[key]) + '"');
				}


				html += '<p>' + tabs_tag_characters[0] + tabs_tag_open + nested_id + tabs_tag_delimiter;
				html += params.join(' ');
				html += tabs_tag_characters[1] + '</p>';
				html += content ? content : '<p></p>';

				first = false;
			});

			if (html == '') {
				alert(tabs_error_empty_title);

				return false;
			}

			html += '<p>' + tabs_tag_characters[0] + '/' + tabs_tag_close + nested_id + tabs_tag_characters[1] + '</p>';

			window.parent.jInsertEditorText(html, tabs_editorname);

			return true;
		},

		setRadioOption: function(name, value) {
			var inputs = $('input[name="' + name + '"]');
			var input  = $('input[name="' + name + '"][value="' + value + '"]');

			$('label[for="' + input.attr('id') + '"]').click();
			inputs.attr('checked', false);
			input.attr('checked', true).click();
		},

		setSelectOption: function(name, value) {
			var self = this;

			var select = $('select[name="' + name + '"]');
			var option = $('select[name="' + name + '"] option[value="' + value + '"]');

			if (!option.length) {
				var options = $('select[name="' + name + '"] option');
				$.each(options, function() {
					var text = self.toSimpleValue($(this).text());

					if (self.toSimpleValue(value) != text) {
						return;
					}

					option = $(this);
					return false;
				});
			}

			if (!option.length) {
				return;
			}

			select.attr('value', value).click();
			option.attr('selected', true).click();
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
		}
	};

	$(document).ready(function() {
		setTimeout(function() {
			RegularLabsTabsPopup.init();
		}, 1000);
	});
})
(jQuery);
