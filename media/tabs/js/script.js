/**
 * @package         Tabs
 * @version         7.4.1
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2018 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

var RegularLabsTabs = null;

(function($) {
	"use strict";

	RegularLabsTabs = {
		options    : {},
		timers     : [],
		stop_timers: [],
		scroll_to  : null,
		scrolling  : false,

		init: function(options) {
			var self = this;

			options      = options ? options : this.getOptions();
			this.options = options;

			try {
				this.hash_id = decodeURIComponent(window.location.hash.replace('#', ''));
				// Ignore the url hash if it contains weird characters
				if (this.hash_id.indexOf('/') > -1 || this.hash_id.indexOf('/') > -1) {
					this.hash_id = '';
				}
			} catch (err) {
				this.hash_id = '';
			}

			this.current_url = window.location.href;
			if (this.current_url.indexOf('#') > -1) {
				this.current_url = this.current_url.substr(0, this.current_url.indexOf('#'));
			}

			// Remove the transition durations off to make initial setting of active tabs as fast as possible
			$('.rl_tabs').removeClass('has_effects');


			this.initScrollTracking();

			this.showByURL();

			this.showByHash();

			this.initEqualHeights();

			setTimeout((function() {
				self.initActiveClasses();


				self.initClickMode();


				if (options.use_hash) {
					self.initHashHandling();
				}

				self.initHashLinkList();

				if (options.reload_iframes) {
					self.initIframeReloading();
				}


				// Add the transition durations
				$('.rl_tabs').addClass('has_effects');
			}), 1000);

		},

		show: function(id, scroll, openparents, slideshow) {
			if (openparents) {
				this.openParents(id);
				return;
			}

			var self = this;
			var $el  = this.getElement(id);

			if (!$el.length) {
				return;
			}


			if (this.scroll_to) {
				this.setScrollOnLoad($el);
			}

			$el.tab('show');

			$el.closest('ul.nav-tabs').find('.rl_tabs-toggle').attr('aria-selected', false);
			$el.attr('aria-selected', true);

			$el.closest('div.rl_tabs').find('.tab-content').first().children().attr('aria-hidden', true);
			$('div#' + id).attr('aria-hidden', false);

			this.updateActiveClassesOnTabLinks($el);

			// trigger resize event to make certain scripts (like galleries) work
			window.dispatchEvent(new Event('resize'));

			if (!slideshow) {
				// For some reason Chrome 67 throws an error when not using a small delay
				setTimeout(function() {
					$el[0].focus();
				}, 10);
			}
		},

		setScrollOnLoad: function($el) {

			var self = this;

			// If tab is already open, do scroll immediately
			if ($el.parent().hasClass('in') || $el.parent().hasClass('active')) {
				self.scrollOnLoad();
				return;
			}

			// If tab is not open yet, do scroll when opened
			$el.one('shown.bs.tab', function() {
				self.scrollOnLoad();
			});
		},

		scrollOnLoad: function() {
			var self = this;

			if (this.scrolling) {
				setTimeout(function() {
					self.scrollOnLoad();
				}, 100);

				return;
			}

			clearTimeout(self.timers['scroll']);

			self.timers['scroll'] = setTimeout(function() {
				if (!self.scroll_to) {
					return;
				}

				$('html,body').animate({scrollTop: self.scroll_to.offset().top});
				self.scroll_to = null;
			}, 100);
		},


		getElement: function(id) {
			return this.getTabElement(id);
		},

		getTabElement: function(id) {
			return $('a.rl_tabs-toggle[data-id="' + id + '"]');
		},

		getSliderElement: function(id) {
			return $('#' + id + '.rl_sliders-body');
		},


		initScrollTracking: function() {
			var self = this;

			self.scrolling = true;

			self.timers['scrolling'] = setTimeout((function() {
				self.scrolling = false;
			}), 250);

			var scroll_function_orig = window.onscroll;

			window.onscroll = (function() {
				self.scrolling = true;

				clearTimeout(self.timers['scrolling']);

				self.timers['scrolling'] = setTimeout((function() {
					self.scrolling = false;
				}), 250);

				if (scroll_function_orig) {
					scroll_function_orig();
				}
			});
		},

		showByURL: function() {
			var id = this.getUrlVar();

			if (id == '') {
				return;
			}

			this.showByID(id);
		},

		showByHash: function() {
			if (this.hash_id == '') {
				return;
			}

			var id = this.hash_id;

			if (id == '' || id.indexOf("&") > -1 || id.indexOf("=") > -1) {
				return;
			}

			// check if element is a slider -> leave to Sliders
			if ($('a#rl_sliders-scrollto_' + id).length) {
				return;
			}

			// check if element is not a tab
			if (!$('a.rl_tabs-toggle[data-id="' + id + '"]').length) {
				this.showByHashAnchor(id);

				return;
			}

			// hash is a tab
			if (!this.options.use_hash) {
				return;
			}

			if (!this.options.urlscroll) {
				// Prevent scrolling to anchor
				$('html,body').animate({scrollTop: 0});
			}

			this.showByID(id);
		},

		showByHashAnchor: function(id) {
			if (id == '') {
				return;
			}

			var $anchor = $('#' + id + ',a[name="' + id + '"],a#anchor-' + id + '');

			if (!$anchor.length) {
				return;
			}

			$anchor = $anchor.first();

			// Check if anchor has a parent tab
			if (!$anchor.closest('.rl_tabs').length) {
				return;
			}

			var $tab = $anchor.closest('.tab-pane').first();

			this.setScrollToElement($anchor);

			this.openParents($tab.attr('id'));
		},

		showByID: function(id, scroll) {
			var $el = $('a.rl_tabs-toggle[data-id="' + id + '"]');

			if (!$el.length) {
				return;
			}


			this.openParents(id);
		},


		setScrollToElement: function($el) {
			if (!$el.length) {
				return;
			}

			this.scroll_to = $el;
		},

		openParents: function(id) {
			var $el = this.getElement(id);

			if (!$el.length) {
				return;
			}

			var parents = [];

			var parent = this.getElementArray($el);
			while (parent) {
				parents[parents.length] = parent;

				parent = this.getParent(parent.el);
			}

			if (!parents.length) {
				return false;
			}

			this.stepThroughParents(parents, null);
		},

		stepThroughParents: function(parents, parent) {
			var self = this;

			if (!parents.length && parent) {
				self.show(parent.id);
				return;
			}

			parent = parents.pop();

			if (parent.el.hasClass('in') || parent.el.parent().hasClass('active')) {
				self.stepThroughParents(parents, parent, scroll);
				return;
			}

			switch (parent.type) {
				case 'tab':
					parent.el.one('shown.bs.tab', function() {
						self.stepThroughParents(parents, parent);
					});

					self.show(parent.id);
					break;

				case 'slider':
					if (typeof RegularLabsSliders === 'undefined') {
						self.stepThroughParents(parents, parent);
						break;
					}

					parent.el.one('shown.bs.collapse', function() {
						self.stepThroughParents(parents, parent);
					});

					RegularLabsSliders.show(parent.id);
					break;
			}
		},

		getParent: function($el) {
			if (!$el) {
				return false;
			}

			var $parent = $el.parent().closest('.rl_tabs-pane, .rl_sliders-body');

			if (!$parent.length) {
				return false;
			}

			return this.getElementArray($parent);
		},

		getElementArray: function($el) {
			var id   = $el.attr('data-toggle') ? $el.attr('data-id') : $el.attr('id');
			var type = ($el.hasClass('rl_tabs-pane') || $el.hasClass('rl_tabs-toggle')) ? 'tab' : 'slider'

			return {
				'type': type,
				'id'  : id,
				'el'  : type == 'tab' ? this.getTabElement(id) : this.getSliderElement(id)
			};
		},

		fixEqualHeights: function(parent) {
			var self = this;
			setTimeout((function() {
				self.fixEqualTabHeights(parent);
			}), 250);

		},

		fixEqualTabHeights: function(parent) {
			parent = parent ? 'div.rl_tabs-pane#' + parent.attr('data-id') : 'div.rl_tabs';

			$(parent + ' ul.nav-tabs').each(function() {
				var $lis       = $(this).children();
				var min_height = 9999;
				var max_height = 0;

				// Set heights to auto
				$lis.each(function() {
					$(this).find('a').first().height('auto');
				});

				setTimeout((function() {
					// Get the min and max heights
					$lis.each(function() {
						min_height = Math.min(min_height, $(this).find('a').first().height());
						max_height = Math.max(max_height, $(this).find('a').first().height());
					});

					if (!max_height || min_height == max_height) {
						return;
					}

					// Set all elements in the set to that max height
					$lis.each(function() {
						$(this).find('a').first().height(max_height);
					});
				}), 10);
			});
		},

		initActiveClasses: function() {
			$('li.rl_tabs-tab-sm').removeClass('active');
		},

		updateActiveClassesOnTabLinks: function(active_el) {
			active_el.parent().parent().find('.rl_tabs-toggle').each(function($i, el) {
				$('a.rl_tabs-link[data-id="' + $(el).attr('data-id') + '"]').each(function($i, el) {
					var $link = $(el);

					if ($link.attr('data-toggle') || $link.hasClass('rl_tabs-toggle-sm') || $link.hasClass('rl_sliders-toggle-sm')) {
						return;
					}

					if ($link.attr('data-id') !== active_el.attr('data-id')) {
						$link.removeClass('active');
						return;
					}

					$link.addClass('active');
				});
			});
		},

		initEqualHeights: function() {
			var self = this;

			self.fixEqualHeights();

			$('a.rl_tabs-toggle').on('shown.bs.tab', function(e) {
				self.fixEqualHeights($(this));
			});

			$(window).resize(function() {
				self.fixEqualHeights();
			});
		},

		initHashLinkList: function() {
			var self = this;

			$('a[href^="#"],a[href^="' + this.current_url + '#"],area[href^="#"],area[href^="' + this.current_url + '#"]').each(function($i, el) {
				self.initHashLink(el);
			});
		},

		initHashLink: function(el) {
			var self  = this;
			var $link = $(el);

			// link is a tab or slider or list link, so ignore
			if ($link.attr('data-toggle') || $link.hasClass('rl_aliders-link') || $link.hasClass('rl_tabs-toggle-sm') || $link.hasClass('rl_sliders-toggle-sm')) {
				return;
			}

			var id = $link.attr('href').substr($link.attr('href').indexOf('#') + 1);

			// clean up weird hash values
			id = id.replace(/^\//, '');
			id = id.replace(/^(.*?) .*$/, '$1');

			// No id found
			if (id == '') {
				return;
			}

			var scroll = false;

			var is_tab  = true;
			var $anchor = $('a[data-toggle="tab"][data-id="' + id + '"]');

			if (!$anchor.length) {
				$anchor = $('#' + id + ',a[name="' + id + '"]');

				// No accompanying link found
				if (!$anchor.length) {
					return;
				}

				scroll = true;
				is_tab = false;
			}

			$anchor = $anchor.first();

			// Check if anchor has a parent tab
			if (!$anchor.closest('.rl_tabs').length) {
				return;
			}

			// anchor is a tab
			var $tab = $anchor;

			// anchor is not a tab
			if (!$anchor.hasClass('rl_tabs-toggle')) {
				$tab = $anchor.closest('.tab-pane').first();
				$tab = this.getElement($tab.attr('id'));
			}

			var tab_id = $tab.attr('data-id');

			// Check if link is inside the same tab
			if ($link.closest('.rl_tabs').length) {
				if ($link.closest('.tab-pane').first().attr('id') == tab_id) {
					return;
				}
			}

			$link.click(function(e) {
				// Open tab and parents
				e.preventDefault();


				self.showByID(tab_id);

				e.stopPropagation();
			});
		},

		initHashHandling: function() {
			if (!window.history.replaceState) {
				return;
			}

			var self = this;

			$('a.rl_tabs-toggle').on('shown.bs.tab', function(e) {
				if ($(this).closest('ul.nav-tabs').hasClass('rl_tabs-slideshow-switch')) {
					return;
				}
				history.replaceState({}, '', self.current_url + '#' + $(this).attr('data-id'));
				e.stopPropagation();
			});
		},

		initClickMode: function() {
			var self = this;

			$('body').on('click.tab.data-api', 'a.rl_tabs-toggle', function(e) {
				var $el = $(this);

				e.preventDefault();

				RegularLabsTabs.show($el.attr('data-id'), $el.hasClass('rl_tabs-doscroll'));


				$el.closest('ul.nav-tabs').removeClass('rl_tabs-slideshow-switch');
				e.stopPropagation();
			});
		},


		initIframeReloading: function() {
			// Mark iframes in active tabs as reloaded
			$('.tab-pane.active iframe').each(function() {
				$(this).attr('reloaded', true);
			});
			// Undo marking of iframes as reloaded in non-active tabs
			$('.tab-pane:not(.active) iframe').each(function() {
				$(this).attr('reloaded', false);
			});

			$('a.rl_tabs-toggle').on('show.bs.tab', function(e) {
				// Re-inintialize Google Maps on tabs show
				if (typeof initialize == 'function') {
					initialize();
				}

				var $el = $('#' + $(this).attr('data-id'));

				$el.find('iframe').each(function() {
					if (!this.src || $(this).attr('reloaded') == 'true') {
						return;
					}

					this.src += '';
					$(this).attr('reloaded', true);
				});
			});

			$(window).resize(function() {
				if (typeof initialize == 'function') {
					initialize();
				}

				$('.tab-pane iframe').each(function() {
					$(this).attr('reloaded', false);
				});

				$('.tab-pane.active iframe').each(function() {
					if (this.src) {
						this.src += '';
						$(this).attr('reloaded', true);
					}
				});
			});
		},


		getUrlVar: function() {
			var search = 'tab';
			var query  = window.location.search.substring(1);

			if (query.indexOf(search + '=') < 0) {
				return '';
			}

			var vars = query.split('&');
			for (var i = 0; i < vars.length; i++) {
				var keyval = vars[i].split('=');

				if (keyval[0] != search) {
					continue;
				}

				return keyval[1];
			}

			return '';
		},

		getOptions: function() {
			if (typeof rl_tabs_options !== 'undefined') {
				return rl_tabs_options;
			}

			if (typeof Joomla === 'undefined' || typeof Joomla.getOptions === 'undefined') {
				console.error('Joomla.getOptions not found!\nThe Joomla core.js file is not being loaded.');
				return false;
			}

			return Joomla.getOptions('rl_tabs');
		}
	};

	$(document).ready(function() {
		var options = RegularLabsTabs.getOptions();

		if (!options) {
			return;
		}

		if (typeof options.init_timeout === 'undefined') {
			return;
		}

		setTimeout(function() {
			RegularLabsTabs.init(options);
		}, options.init_timeout);
	});
})(jQuery);
