/**
 * @package         Regular Labs Library
 * @version         19.3.16030
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2019 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

var RegularLabsScripts = null;

(function($) {
	"use strict";

	RegularLabsScripts = {
		ajax_list        : [],
		started_ajax_list: false,
		ajax_list_timer  : null,

		loadajax: function(url, success, fail, query, timeout, dataType, cache) {
			// console.log(url);

			if (url.indexOf('index.php') !== 0 && url.indexOf('administrator/index.php') !== 0) {
				url = url.replace('http://', '');
				url = 'index.php?rl_qp=1&url=' + encodeURIComponent(url);
				if (timeout) {
					url += '&timeout=' + timeout;
				}
				if (cache) {
					url += '&cache=' + cache;
				}
			}

			var base = window.location.pathname;
			base     = base.substring(0, base.lastIndexOf('/'));

			if (
				typeof Joomla !== 'undefined'
				&& typeof Joomla.getOptions !== 'undefined'
				&& Joomla.getOptions('system.paths')
			) {
				var paths = Joomla.getOptions('system.paths');
				base      = paths.base;
			}

			// console.log(url);
			// console.log(base + '/' + url);

			$.ajax({
				type    : 'post',
				url     : base + '/' + url,
				dataType: dataType ? dataType : '',
				success : function(data) {
					if (success) {
						eval(success + ';');
					}
				},
				error   : function(data) {
					if (fail) {
						eval(fail + ';');
					}
				}
			});
		},

		displayVersion: function(data, extension, version) {
			if (!data) {
				return;
			}

			var xml = this.getObjectFromXML(data);

			if (!xml) {
				return;
			}

			if (typeof xml[extension] === 'undefined') {
				return;
			}

			var dat = xml[extension];

			if (!dat || typeof dat.version === 'undefined' || !dat.version) {
				return;
			}

			var new_version = dat.version;
			var compare     = this.compareVersions(version, new_version);

			if (compare != '<') {
				return;
			}

			var el = $('#regularlabs_newversionnumber_' + extension);
			if (el) {
				el.text(new_version);
			}

			el = $('#regularlabs_version_' + extension);
			if (el) {
				el.css('display', 'block');
				el.parent().removeClass('hide');
			}
		},

		addToLoadAjaxList: function(url, success, error) {
			// wrap inside the loadajax function (and escape string values)
			var action = "RegularLabsScripts.loadajax(" +
				"'" + url.replace(/'/g, "\\'") + "'," +
				"'" + success.replace(/'/g, "\\'") + ";RegularLabsScripts.ajaxRun();'," +
				"'" + error.replace(/'/g, "\\'") + ";RegularLabsScripts.ajaxRun();'" +
				")";

			this.addToAjaxList(action);
		},

		addToAjaxList: function(action) {
			this.ajax_list.push(action);

			if (!this.started_ajax_list) {
				this.ajaxRun();
			}
		},

		ajaxRun: function() {
			if (typeof RegularLabsToggler !== 'undefined') {
				RegularLabsToggler.initialize();
			}

			if (!this.ajax_list.length) {
				return;
			}

			clearTimeout(this.ajax_list_timer);

			this.started_ajax_list = true;

			var action = this.ajax_list.shift();

			eval(action + ';');

			if (!this.ajax_list.length) {
				return;
			}

			// Re-trigger this ajaxRun function just in case it hangs somewhere
			this.ajax_list_timer = setTimeout(
				function() {
					RegularLabsScripts.ajaxRun();
				},
				5000
			);
		},

		in_array: function(needle, haystack, casesensitive) {
			if ({}.toString.call(needle).slice(8, -1) != 'Array') {
				needle = [needle];
			}
			if ({}.toString.call(haystack).slice(8, -1) != 'Array') {
				haystack = [haystack];
			}

			for (var h = 0; h < haystack.length; h++) {
				for (var n = 0; n < needle.length; n++) {
					if (casesensitive) {
						if (haystack[h] == needle[n]) {
							return true;
						}
					} else {
						if (haystack[h].toLowerCase() == needle[n].toLowerCase()) {
							return true;
						}
					}
				}
			}
			return false;
		},

		getObjectFromXML: function(xml) {
			if (!xml) {
				return;
			}

			var obj = [];
			$(xml).find('extension').each(function() {
				var el = [];
				$(this).children().each(function() {
					el[this.nodeName.toLowerCase()] = String($(this).text()).trim();
				});
				if (typeof el.alias !== 'undefined') {
					obj[el.alias] = el;
				}
				if (typeof el.extname !== 'undefined' && el.extname != el.alias) {
					obj[el.extname] = el;
				}
			});

			return obj;
		},

		compareVersions: function(num1, num2) {
			num1 = num1.split('.');
			num2 = num2.split('.');

			var let1 = '';
			var let2 = '';

			var max = Math.max(num1.length, num2.length);
			for (var i = 0; i < max; i++) {
				if (typeof num1[i] === 'undefined') {
					num1[i] = '0';
				}
				if (typeof num2[i] === 'undefined') {
					num2[i] = '0';
				}

				let1    = num1[i].replace(/^[0-9]*(.*)/, '$1');
				num1[i] = parseInt(num1[i]);
				let2    = num2[i].replace(/^[0-9]*(.*)/, '$1');
				num2[i] = parseInt(num2[i]);

				if (num1[i] < num2[i]) {
					return '<';
				}

				if (num1[i] > num2[i]) {
					return '>';
				}
			}

			// numbers are same, so compare trailing letters
			if (let2 && (!let1 || let1 > let2)) {
				return '>';
			}

			if (let1 && (!let2 || let1 < let2)) {
				return '<';
			}

			return '=';
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

		/* 2018-11-01: These methods have moved to RegularLabsForm. Keeping them here for backwards compatibility. */
		setRadio                 : function(id, value) {
		},
		initCheckAlls            : function(id, classname) {
		},
		allChecked               : function(classname) {
			return false;
		},
		checkAll                 : function(checkbox, classname) {
		},
		toggleSelectListSelection: function(id) {
		},
		prependTextarea          : function(id, content, separator) {
		},
		setToggleTitleClass      : function(input, value) {
		}
	};
})(jQuery);
