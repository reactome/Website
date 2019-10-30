/**
 * @package         Sliders
 * @version         7.7.8
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2019 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

var RegularLabsSliders = null;

(function($) {
	"use strict";

	RegularLabsSliders = {
		options  : {},
		timers   : [],
		scroll_to: null,
		scrolling: false,

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
			this.current_path = this.current_url.replace(/^.*\/\/.*?\//, '');

			// Hide all non-active slider bodies
			$('.rl_sliders-body:not(.in)').height(0);

			// Remove the transition durations off to make initial setting of active tabs as fast as possible
			$('.rl_sliders').removeClass('has_effects');

			var timeout = $('.rl_tabs').length ? 250 : 0;
			setTimeout((function() {
				self.initActiveClasses();


				self.initScrollTracking();

				self.showByURL();

				self.showByHash();

				setTimeout((function() {
					self.initClickMode();


					if (options.use_hash) {
						self.initHashHandling();
					}

					self.initHashLinkList();

					if (options.reload_iframes) {
						self.initIframeReloading();
					}

					// Add the transition durations
					// But not for Bootstrap 3!
					if (typeof $().emulateTransitionEnd != 'function') {
						$('.rl_sliders').addClass('has_effects');
					}
				}), 1000);
			}), timeout);
		},

		show: function(id, scroll, openparents) {
			if (openparents) {
				this.openParents(id);
				return;
			}

			var self = this;
			var $el  = this.getElement(id);

			if (!$el.length) {
				return;
			}

			$el.one('hidden.bs.collapse', function() {
				$('a#slider-' + id).attr('aria-expanded', false);
				$('div#' + id).attr('aria-hidden', true);
			});


			if (this.scroll_to) {
				this.setScrollOnLoad($el);
			}

			var show = (!$el.hasClass('in') && !$el.hasClass('active'));

			if (show) {
				$el.collapse({
					toggle: true,
					parent: $el.parent().parent()
				});

				$el.collapse('show');

				$el.closest('div.rl_sliders').find('.rl_sliders-toggle').attr('aria-expanded', false);
				$('a#slider-' + id).attr('aria-expanded', true);

				$el.closest('div.rl_sliders').find('.rl_sliders-body').attr('aria-hidden', true);
				$('div#' + id).attr('aria-hidden', false);

				// trigger resize event to make certain scripts (like galleries) work
				window.dispatchEvent(new Event('resize'));
			}

			this.updateActiveClassesOnSliderLinks($el);

			// For some reason Chrome 67 throws an error when not using a small delay
			setTimeout(function() {
				$el[0].focus();
			}, 10);
		},

		setScrollOnLoad: function($el) {
			var self = this;

			// If slider is already open, do scroll immediately
			if ($el.hasClass('in')) {
				self.scrollOnLoad();
				return;
			}

			// If slider is not open yet, do scroll when opened
			$el.one('shown.bs.collapse', function() {
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
			return this.getSliderElement(id);
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
				}), 1250);

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

			if (id == '' || id.indexOf("&") != -1 || id.indexOf("=") != -1) {
				return;
			}

			// check if element is a tab -> leave to Tabs
			if ($('a.rl_tabs-toggle[data-id="' + id + '"]').length) {
				return;
			}

			// check if element is not a slider
			if (!$('a#rl_sliders-scrollto_' + id).length) {
				this.showByHashAnchor(id);
				return;
			}

			// hash is a slider
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

			var $anchor = $('[id="' + id + '"],a[name="' + id + '"],a#anchor-' + id);

			if (!$anchor.length) {
				return;
			}

			$anchor = $anchor.first();

			// Check if anchor has a parent slider
			if (!$anchor.closest('.rl_sliders').length) {
				return;
			}

			var $slider = $anchor.closest('.rl_sliders-body').first();

			this.setScrollToElement($anchor);

			this.openParents($slider.attr('id'));
		},

		showByID: function(id, scroll) {
			var $el = $('a#rl_sliders-scrollto_' + id);

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
				self.stepThroughParents(parents, parent);
				return;
			}

			switch (parent.type) {
				case 'tab':
					if (typeof RegularLabsTabs === 'undefined') {
						self.stepThroughParents(parents, parent);
						break;
					}

					parent.el.one('shown.bs.tab', function() {
						self.stepThroughParents(parents, parent);
					});

					RegularLabsTabs.show(parent.id);
					break;

				case 'slider':
					parent.el.one('shown.bs.collapse', function() {
						self.stepThroughParents(parents, parent);
					});

					self.show(parent.id);
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

		initActiveClasses: function() {
			$('.rl_sliders-body').on('show.bs.collapse', function(e) {
				if (!$(e.target).hasClass('rl_sliders-body')) {
					return;
				}

				$(this).parent().addClass('active');
				$('a[data-toggle="collapse"][data-id="' + this.id + '"]').removeClass('collapsed');
				e.stopPropagation();
			});
			$('.rl_sliders-body').on('hidden hidden.bs.collapse', function(e) {
				if (!$(e.target).hasClass('rl_sliders-body')) {
					return;
				}

				$(this).parent().removeClass('active');
				$('a[data-toggle="collapse"][data-id="' + this.id + '"]').addClass('collapsed');
				e.stopPropagation();
			});
		},

		updateActiveClassesOnSliderLinks: function(active_el) {
			active_el.parent().parent().find('.rl_sliders-toggle').each(function($i, el) {
				$('a.rl_sliders-link[data-id="' + $(el).attr('data-id') + '"]').each(function($i, el) {
					var $link = $(el);

					if ($link.attr('data-toggle') || $link.hasClass('rl_tabs-toggle-sm') || $link.hasClass('rl_sliders-toggle-sm')) {
						return;
					}

					if ($link.attr('data-id') !== active_el.attr('id')) {
						$link.removeClass('active');
						return;
					}

					$link.addClass('active');
				});
			});
		},

		initHashLinkList: function() {
			var self = this;

			$(
				'a[href^="#"],'
				+ 'a[href^="' + this.current_url + '#"],'
				+ 'a[href^="' + this.current_path + '#"],'
				+ 'a[href^="/' + this.current_path + '#"],'
				+ 'area[href^="#"],'
				+ 'area[href^="' + this.current_url + '#"]'
				+ 'area[href^="' + this.current_path + '#"]'
				+ 'area[href^="/' + this.current_path + '#"]'
			).each(function($i, el) {
				self.initHashLink(el);
			});
		},

		initHashLink: function(el) {
			var self  = this;
			var $link = $(el);

			// link is a tab or slider or list link, so ignore
			if ($link.attr('data-toggle')
				|| $link.hasClass('rl_sliders-toggle')
				|| $link.hasClass('rl_tabs-toggle')
				|| $link.hasClass('rl_tabs-toggle-sm')
				|| $link.hasClass('rl_tabs-link')
			) {
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

			var is_slider = true;
			var $anchor   = $('a[data-toggle="collapse"][data-id="' + id + '"]');

			if (!$anchor.length) {
				$anchor = $('[id="' + id + '"],a[name="' + id + '"]');

				// No accompanying link found
				if (!$anchor.length) {
					return;
				}

				scroll    = true;
				is_slider = false;
			}

			$anchor = $anchor.first();

			// Check if anchor has a parent slider
			if (!$anchor.closest('.rl_sliders').length) {
				return;
			}

			var $slider   = $anchor.closest('.rl_sliders-group').find('.rl_sliders-body').first();
			var slider_id = $slider.attr('id');

			// Check if link is inside the same slider
			if ($link.closest('.rl_sliders').length) {
				if ($link.closest('.rl_sliders-body').first().attr('id') == slider_id) {
					return;
				}
			}

			$link.click(function(e) {
				// Open parent slider and parents
				e.preventDefault();


				self.showByID(slider_id);
				e.stopPropagation();
			});
		},

		initHashHandling: function() {
			if (!window.history.replaceState) {
				return;
			}

			var self = this;

			$('.rl_sliders-body').on('shown.bs.collapse', function(e) {
				history.replaceState({}, '', self.current_url + '#' + this.id);
				e.stopPropagation();
			});
		},

		initClickMode: function() {
			var self = this;
			$('body').on('click.collapse.data-api', 'a.rl_sliders-toggle', function(e) {
				e.preventDefault();

				var id  = $(this).attr('data-id');
				var $el = self.getElement(id);

				if (!$el.hasClass('in')) {
					self.show(id, $(this).hasClass('rl_sliders-item-scroll'));
				} else {
					$el.collapse('hide');
				}

				e.stopPropagation();
			});
		},


		initIframeReloading: function() {
			$('.rl_sliders-body.in iframe').each(function() {
				$(this).attr('reloaded', true);
			});

			$('.rl_sliders-body').on('show.bs.collapse', function(e) {
				// Re-inintialize Google Maps on tabs show
				if (typeof initialize == 'function') {
					initialize();
				}

				var $el = $(this);

				$el.find('iframe').each(function() {
					if (this.src && !$(this).attr('reloaded')) {
						this.src += '';
						$(this).attr('reloaded', true);
					}
				});
			});

			$(window).resize(function() {
				if (typeof initialize == 'function') {
					initialize();
				}

				$('.rl_sliders-body iframe').each(function() {
					$(this).attr('reloaded', false);
				});

				$('.rl_sliders-body.in iframe').each(function() {
					if (this.src) {
						this.src += '';
						$(this).attr('reloaded', true);
					}
				});
			});
		},

		getUrlVar: function() {
			var search = 'slider';
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
			if (typeof rl_sliders_options !== 'undefined') {
				return rl_sliders_options;
			}

			if (typeof Joomla === 'undefined' || typeof Joomla.getOptions === 'undefined') {
				console.error('Joomla.getOptions not found!\nThe Joomla core.js file is not being loaded.');
				return false;
			}

			return Joomla.getOptions('rl_sliders');
		}
	};

	$(document).ready(function() {
		var options = RegularLabsSliders.getOptions();

		if (!options) {
			return;
		}

		if (typeof options.init_timeout === 'undefined') {
			return;
		}

		setTimeout(function() {
			RegularLabsSliders.init(options);
		}, options.init_timeout);
	});
})(jQuery);

/* For custom use */

// Open the sliders inside the given element (by id)
// If no id is given, all sliders will be opened
// If the id of a single slider is given, only that slider will be opened
function openSliders(id) {
	var parent   = findSliderSetBy(id);
	var elements = parent.find('.rl_sliders-body:not(.in)');

	if (!elements.length) {
		return;
	}

	elements.collapse('show');
}

// Alias for openSliders
function openAllSliders(id) {
	openSliders(id);
}

// Alias for openSliders
function openSlider(id) {
	openSliders(id);
}

// Close the sliders inside the given element (by id)
// If no id is given, all sliders will be closed
// If the id of a single slider is given, only that slider will be closed
function closeSliders(id) {
	var parent   = findSliderSetBy(id);
	var elements = parent.find('.rl_sliders-body.in');

	if (!elements.length) {
		return;
	}

	elements.collapse('hide');
}

// Alias for closeSliders
function closeAllSliders(id) {
	closeSliders(id);
}

// Alias for closeSliders
function closeSlider(id) {
	closeSliders(id);
}

function findSliderSetBy(id) {
	// Try to find a slider with this id and return the children sliders of its parent
	var el = jQuery('#' + id + '.rl_sliders-body');

	if (el.length) {
		return el.closest('.rl_sliders');
	}

	// Try to find another element with this id and close its children sliders
	el = jQuery('#' + id);

	if (el.length) {
		return el;
	}

	return jQuery('body');
}
