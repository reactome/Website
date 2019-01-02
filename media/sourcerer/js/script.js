/**
 * @package         Sourcerer
 * @version         7.4.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2018 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

var RegularLabsSourcererPopup = null;

(function($) {
	var $editor = null;

	RegularLabsSourcererPopup = {
		init: function() {
			$editor = Joomla.editors.instances['source'];

			try {
				var string = $editor.getValue();
			} catch (err) {
				setTimeout("RegularLabsSourcererPopup.init();", 100);
				return;
			}

			var editor_textarea = window.parent.document.getElementById(sourcerer_editorname);
			if (editor_textarea) {
				var iframes = editor_textarea.parentNode.getElementsByTagName('iframe');
				if (!iframes.length) {
					return;
				}

				var editor_frame  = iframes[0];
				var contentWindow = editor_frame.contentWindow;
				var selection     = '';

				if (typeof contentWindow.getSelection !== 'undefined') {
					var sel = contentWindow.getSelection();
					if (sel.rangeCount) {
						var container = contentWindow.document.createElement("div");
						for (var i = 0, len = sel.rangeCount; i < len; ++i) {
							container.appendChild(sel.getRangeAt(i).cloneContents());
						}
						selection = container.innerHTML;
					}
				} else if (typeof contentWindow.document.selection !== 'undefined') {
					if (contentWindow.document.selection.type == "Text") {
						selection = contentWindow.document.selection.createRange().htmlText;
					}
				}

				selection = this.cleanRange(selection);

				if (selection != '') {
					$editor.setValue(selection);
				}

				this.resizeEditorHeight();
			}

			string = $editor.getValue();

			// Handle indentation
			string = string.replace(/^\t/gm, '    ');
			$editor.setValue(string);

			var icon = $('span.icon-src_sourcetags');
			if (string.search(this.preg_quote(sourcerer_tag_characters[0] + sourcerer_syntax_word)) != -1) {
				icon.addClass('icon-src_nosourcetags');
			}

			if (sourcerer_default_addsourcetags) {
				this.toggleSourceTags(1);
			}

			icon = $('span.icon-src_tagstyle');
			if (string.search(/\[\[/g) != -1 && string.search(/\]\]/g) != -1) {
				icon.addClass('icon-src_tagstyle_brackets');
			}
		},

		resizeEditorHeight: function() {
			var min_height  = 220;
			var html_height = $('html').height();
			var new_height  = Math.max(html_height, min_height);

			// Start by setting the editor to the height of the html page
			// which we know is too large to fit inside the modal
			$('.CodeMirror-wrap').css('min-height', 0).height(new_height);

			// Then decrease the size is steps of 5px till the body is no longer larger than the html
			while ($('body').height() > html_height && new_height > min_height) {
				new_height = new_height - 5;

				$('.CodeMirror-wrap').height(new_height);
			}

			// Also set the sizer element to this new height
			$('.CodeMirror-sizer').height(new_height);
		},

		insertText: function() {
			var string = $editor.getValue();

			// convert to html entities
			string = this.htmlentities(string, 'ENT_NOQUOTES');

			var t_word  = sourcerer_syntax_word;
			var t_start = sourcerer_tag_characters[0];
			var t_end   = sourcerer_tag_characters[1];

			var start_tag = this.preg_quote(t_start + t_word) + '.*?' + this.preg_quote(t_end);
			var end_tag   = this.preg_quote(t_start + '/' + t_word + t_end);

			// Set all code (with {source} tags) in courier
			var regex = new RegExp('(' + start_tag + ')((?:.|[\n\r])*?)(' + end_tag + ')', 'gim');
			string    = string.replace(regex, '$1<span style="font-family: courier new, courier, monospace;">$2</span>$3');

			// replace linebreaks with br tags
			regex  = new RegExp('\n\r?', 'gm');
			string = string.replace(regex, '<br>');

			regex = new RegExp('((^|<br>)(    |\t)*)(   ? ?|\t)', 'gm');
			while (regex.test(string)) {
				string = string.replace(regex, '$1<img src="' + sourcerer_root + '/media/sourcerer/images/tab.png">');
			}

			window.parent.jInsertEditorText(string, sourcerer_editorname);
		},

		toggleSourceTags: function(add) {
			var icon   = $('span.icon-src_sourcetags');
			var string = $editor.getValue();

			var t_word  = sourcerer_syntax_word;
			var t_start = sourcerer_tag_characters[0];
			var t_end   = sourcerer_tag_characters[1];

			var start_tag = this.preg_quote(t_start + t_word) + '.*?' + this.preg_quote(t_end);
			var end_tag   = this.preg_quote(t_start + '/' + t_word + t_end);

			var regex = new RegExp('(' + start_tag + ')\\s*', 'gim');
			start_tag = t_start + t_word + t_end;
			if (string.match(regex)) {
				start_tag = regex.exec(string)[1];
				string    = string.replace(regex, '');
			}

			regex   = new RegExp('\\s*' + end_tag, 'gim');
			end_tag = t_start + '/' + t_word + t_end;
			string  = string.replace(regex, '');

			if (!add && !icon.hasClass('icon-src_nosourcetags')) {
				icon.addClass('icon-src_nosourcetags');
			} else {
				string = string.trim();

				if (string.trim() != '' && (string.substr(0, 5) != '<?php' || string.substr(-2) != '?>')) {
					string = '\n' + string + '\n';
				}

				string = start_tag + string + end_tag;
				icon.removeClass('icon-src_nosourcetags');
			}

			$editor.setValue(string);
		},

		toggleTagStyle: function() {
			var icon   = $('span.icon-src_tagstyle');
			var string = $editor.getValue();

			string = string.replace(/\[\[/g, '<');
			string = string.replace(/\]\]/g, '>');

			if (!icon.hasClass('icon-src_tagstylebrackets')) {
				string = string.replace(/<(\/?\w+((\s+\w+(\s*=\s*(?:"[\s\S.]*?"|'[\s\S.]*?'|[^'">\s]+))?)+\s*|\s*)\/?(--)?)>/gm, '[[$1]]');
				string = string.replace(/<(!--[\s\S.]*?--)>/gm, '[[$1]]');
				string = string.replace(/<\?(?:php)?([^a-z0-9])/gim, '[[?php$1');
				string = string.replace(/( *)\?>/g, '$1?]]');
				icon.addClass('icon-src_tagstylebrackets');
			} else {
				icon.removeClass('icon-src_tagstylebrackets');
			}

			$editor.setValue(string);
		},

		cleanRange: function(string) {
			var regex = new RegExp('[\n\r]', 'gim');
			string    = string.replace(regex, '');
			regex     = new RegExp('(</p><p>|<p>|</p>|<br>|<br>)', 'gim');
			string    = string.replace(regex, '\n');
			string    = string.replace(/^\s+/, '').replace(/\s+$/, '');
			regex     = new RegExp('<img[^>]*src="[^"]*/tab.png"[^>]*>', 'gim');
			string    = string.replace(regex, '\t');
			regex     = new RegExp('</?[^>]*>', 'gim');
			string    = string.replace(regex, '');
			regex     = new RegExp('(&nbsp;|&#160;)', 'gim');
			string    = string.replace(regex, ' ');
			regex     = new RegExp('&lt;', 'gim');
			string    = string.replace(regex, '<');
			regex     = new RegExp('&gt;', 'gim');
			string    = string.replace(regex, '>');
			regex     = new RegExp('&amp;', 'gim');
			string    = string.replace(regex, '&');
			return string;
		},

		htmlentities: function(string, quote_style) {
			tmp_str = string.toString();

			if (false === (histogram = this.get_html_translation_table('HTML_ENTITIES', quote_style))) {
				return false;
			}

			for (symbol in histogram) {
				entity  = histogram[symbol];
				tmp_str = tmp_str.split(symbol).join(entity);
			}

			return tmp_str;
		},

		get_html_translation_table: function(table, quote_style) {
			var entities          = {}, histogram = {}, decimal = 0, symbol = '';
			var constMappingTable = {}, constMappingQuoteStyle = {};
			var useTable          = {}, useQuoteStyle = {};

			// Translate arguments
			constMappingTable[0]      = 'HTML_SPECIALCHARS';
			constMappingTable[1]      = 'HTML_ENTITIES';
			constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
			constMappingQuoteStyle[2] = 'ENT_COMPAT';
			constMappingQuoteStyle[3] = 'ENT_QUOTES';

			useTable      = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
			useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT';

			if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
				throw Error('Table: ' + useTable + ' not supported');
				// return false;
			}

			// ascii decimals for better compatibility
			entities['38'] = '&amp;';
			if (useQuoteStyle !== 'ENT_NOQUOTES') {
				entities['34'] = '&quot;';
			}
			if (useQuoteStyle === 'ENT_QUOTES') {
				entities['39'] = '&#039;';
			}
			entities['60'] = '&lt;';
			entities['62'] = '&gt;';

			if (useTable === 'HTML_ENTITIES') {
				entities['160'] = '&nbsp;';
				entities['161'] = '&iexcl;';
				entities['162'] = '&cent;';
				entities['163'] = '&pound;';
				entities['164'] = '&curren;';
				entities['165'] = '&yen;';
				entities['166'] = '&brvbar;';
				entities['167'] = '&sect;';
				entities['168'] = '&uml;';
				entities['169'] = '&copy;';
				entities['170'] = '&ordf;';
				entities['171'] = '&laquo;';
				entities['172'] = '&not;';
				entities['173'] = '&shy;';
				entities['174'] = '&reg;';
				entities['175'] = '&macr;';
				entities['176'] = '&deg;';
				entities['177'] = '&plusmn;';
				entities['178'] = '&sup2;';
				entities['179'] = '&sup3;';
				entities['180'] = '&acute;';
				entities['181'] = '&micro;';
				entities['182'] = '&para;';
				entities['183'] = '&middot;';
				entities['184'] = '&cedil;';
				entities['185'] = '&sup1;';
				entities['186'] = '&ordm;';
				entities['187'] = '&raquo;';
				entities['188'] = '&frac14;';
				entities['189'] = '&frac12;';
				entities['190'] = '&frac34;';
				entities['191'] = '&iquest;';
				entities['192'] = '&Agrave;';
				entities['193'] = '&Aacute;';
				entities['194'] = '&Acirc;';
				entities['195'] = '&Atilde;';
				entities['196'] = '&Auml;';
				entities['197'] = '&Aring;';
				entities['198'] = '&AElig;';
				entities['199'] = '&Ccedil;';
				entities['200'] = '&Egrave;';
				entities['201'] = '&Eacute;';
				entities['202'] = '&Ecirc;';
				entities['203'] = '&Euml;';
				entities['204'] = '&Igrave;';
				entities['205'] = '&Iacute;';
				entities['206'] = '&Icirc;';
				entities['207'] = '&Iuml;';
				entities['208'] = '&ETH;';
				entities['209'] = '&Ntilde;';
				entities['210'] = '&Ograve;';
				entities['211'] = '&Oacute;';
				entities['212'] = '&Ocirc;';
				entities['213'] = '&Otilde;';
				entities['214'] = '&Ouml;';
				entities['215'] = '&times;';
				entities['216'] = '&Oslash;';
				entities['217'] = '&Ugrave;';
				entities['218'] = '&Uacute;';
				entities['219'] = '&Ucirc;';
				entities['220'] = '&Uuml;';
				entities['221'] = '&Yacute;';
				entities['222'] = '&THORN;';
				entities['223'] = '&szlig;';
				entities['224'] = '&agrave;';
				entities['225'] = '&aacute;';
				entities['226'] = '&acirc;';
				entities['227'] = '&atilde;';
				entities['228'] = '&auml;';
				entities['229'] = '&aring;';
				entities['230'] = '&aelig;';
				entities['231'] = '&ccedil;';
				entities['232'] = '&egrave;';
				entities['233'] = '&eacute;';
				entities['234'] = '&ecirc;';
				entities['235'] = '&euml;';
				entities['236'] = '&igrave;';
				entities['237'] = '&iacute;';
				entities['238'] = '&icirc;';
				entities['239'] = '&iuml;';
				entities['240'] = '&eth;';
				entities['241'] = '&ntilde;';
				entities['242'] = '&ograve;';
				entities['243'] = '&oacute;';
				entities['244'] = '&ocirc;';
				entities['245'] = '&otilde;';
				entities['246'] = '&ouml;';
				entities['247'] = '&divide;';
				entities['248'] = '&oslash;';
				entities['249'] = '&ugrave;';
				entities['250'] = '&uacute;';
				entities['251'] = '&ucirc;';
				entities['252'] = '&uuml;';
				entities['253'] = '&yacute;';
				entities['254'] = '&thorn;';
				entities['255'] = '&yuml;';
			}

			// ascii decimals to real symbols
			for (decimal in entities) {
				symbol            = String.fromCharCode(decimal);
				histogram[symbol] = entities[decimal];
			}

			return histogram;
		},

		preg_quote: function(str) {
			return (str + '').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!<>\|\:])/g, '\\$1');
		}
	};

	String.prototype.ltrim = function() {
		return this.replace(/^ */, "");
	};
	String.prototype.rtrim = function() {
		return this.replace(/ *$/, "");
	};
	String.prototype.trim  = function() {
		return this.ltrim().rtrim();
	};

})(jQuery);
