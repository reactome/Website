/**
 * @package         Regular.js
 * @description     A light and simple JavaScript Library
 *
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            https://github.com/regularlabs/regularjs
<<<<<<< HEAD
 * @copyright       Copyright © 2022 Regular Labs - All Rights Reserved
 * @license         https://github.com/regularlabs/regularjs/blob/master/LICENCE MIT
 */

"use strict";

if (typeof window.Regular === 'undefined'
	|| typeof Regular.version === 'undefined'
	|| Regular.version < 1.5) {
=======
 * @copyright       Copyright © 2021 Regular Labs - All Rights Reserved
 * @license         https://github.com/regularlabs/regularjs/blob/master/LICENCE MIT
 */

if (typeof window.Regular === 'undefined'
	|| typeof Regular.version === 'undefined'
	|| Regular.version < 1.3) {

	"use strict";
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090

	window.Regular = new function() {
		/**
		 *
		 * PUBLIC PROPERTIES
		 *
		 */

<<<<<<< HEAD
		this.version = 1.5;
=======
		this.version = 1.3;
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090

		/**
		 *
		 * PUBLIC METHODS
		 *
		 */

		/**
		 * Sets a global alias for the Regular class.
		 *
		 * @param word  A string (character or word) representing the alias for the Regular class.
		 *
		 * @return boolean
		 */
		this.alias = function(word) {
			if (typeof window[word] !== 'undefined') {
<<<<<<< HEAD
				console.error(`Cannot set '${word}' as an alias of Regular, as it already exists.`);
=======
				console.error(`Cannot set '${word}' as am alias of Regular, as it already exists.`);
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090

				return false;
			}

			window[word] = $;

			return true;
		};

		/**
		 * Returns a boolean based on whether the element contains one or more of the given class names.
		 *
		 * @param selector  A CSS selector string or a HTMLElement object.
		 * @param classes   A string or array of class names.
		 * @param matchAll  Optional boolean whether the element should have all given classes (true) or at least one (false).
		 *
		 * @return boolean
		 */
		this.hasClasses = function(selector, classes, matchAll = true) {
			if ( ! selector) {
				return false;
			}

			const element = typeof selector === 'string'
<<<<<<< HEAD
				? document.querySelector(selector)
				: selector;

			if ( ! element) {
				return false;
			}

=======
				? document.querySelectorAll(selector)
				: selector;

>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
			if (typeof classes === 'string') {
				classes = classes.split(' ');
			}

			let hasClass = false;

			for (const clss of classes) {
				hasClass = element.classList.contains(clss);

				if (matchAll && ! hasClass) {
					return false;
				}

				if ( ! matchAll && hasClass) {
					return true;
				}
			}

			return hasClass;
		};

		/**
		 * Adds given class name(s) to the element(s).
		 *
		 * @param selector  A CSS selector string, a HTMLElement object or a collection of HTMLElement objects.
		 * @param classes   A string or array of class names.
		 */
		this.addClasses = function(selector, classes) {
			doClasses('add', selector, classes);
		};

		/**
		 * Removes given class name(s) from the element(s).
		 *
		 * @param selector  A CSS selector string, a HTMLElement object or a collection of HTMLElement objects.
		 * @param classes   A string or array of class names.
		 */
		this.removeClasses = function(selector, classes) {
			doClasses('remove', selector, classes);
		};

		/**
		 * Toggles given class name(s) of the element(s).
		 *
		 * @param selector  A CSS selector string, a HTMLElement object or a collection of HTMLElement objects.
		 * @param classes   A string or array of class names.
<<<<<<< HEAD
		 * @param force     An optional boolean value that forces the class to be added or removed.
		 */
		this.toggleClasses = function(selector, classes, force) {
			switch (force) {
				case true:
					doClasses('add', selector, classes);
					break;

				case false:
					doClasses('remove', selector, classes);
					break;

				default:
					doClasses('toggle', selector, classes);
					break;
			}
		};

		/**
		 * Makes the given element(s) visible (changes visibility and display attributes).
		 *
		 * @param selector  A CSS selector string, a HTMLElement object or a collection of HTMLElement objects.
		 */
		this.makeVisible = function(selector) {
=======
		 */
		this.toggleClasses = function(selector, classes) {
			doClasses('toggle', selector, classes);
		};

		/**
		 * Shows the given element(s) (changes opacity and display attributes).
		 *
		 * @param selector  A CSS selector string, a HTMLElement object or a collection of HTMLElement objects.
		 */
		this.show = function(selector) {
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
			if ( ! selector) {
				return;
			}

			const element = typeof selector === 'string'
				? document.querySelectorAll(selector)
				: selector;

			if ('forEach' in element) {
<<<<<<< HEAD
				element.forEach(subElement => $.makeVisible(subElement));
=======
				element.forEach(subElement => $.show(subElement));
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
				return;
			}

			let computedDisplay = getComputedStyle(element, 'display');

			if ( ! ('origDisplay' in element)) {
				element.origDisplay = computedDisplay === 'none'
					? getDefaultComputedStyle(element, 'display')
					: computedDisplay;
			}

			if (computedDisplay === 'none') {
				element.style.display = ('origDisplay' in element) ? element.origDisplay : '';
			}

			computedDisplay = getComputedStyle(element, 'display');
			if (computedDisplay === 'none') {
				element.style.display = 'block';
			}

			element.style.visibility = 'visible';
<<<<<<< HEAD
		};

		/**
		 * Shows the given element(s) (makes visible and changes opacity attribute).
		 *
		 * @param selector  A CSS selector string, a HTMLElement object or a collection of HTMLElement objects.
		 */
		this.show = function(selector) {
			if ( ! selector) {
				return;
			}

			const element = typeof selector === 'string'
				? document.querySelectorAll(selector)
				: selector;

			if ('forEach' in element) {
				element.forEach(subElement => $.show(subElement));
				return;
			}

			this.makeVisible(element);

			element.style.opacity = 1;
=======
			element.style.opacity    = 1;
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
		};

		/**
		 * Hides the given element(s) (changes opacity and display attributes).
		 *
		 * @param selector  A CSS selector string, a HTMLElement object or a collection of HTMLElement objects.
		 */
		this.hide = function(selector) {
			if ( ! selector) {
				return;
			}

			const element = typeof selector === 'string'
				? document.querySelectorAll(selector)
				: selector;

			if ('forEach' in element) {
				element.forEach(subElement => $.hide(subElement));
				return;
			}

			const computedDisplay = getComputedStyle(element, 'display');

			if (computedDisplay !== 'none' && ! ('origDisplay' in element)) {
				element.origDisplay = computedDisplay;
			}

			element.style.display    = 'none';
			element.style.visibility = 'hidden';
			element.style.opacity    = 0;
		};

		/**
<<<<<<< HEAD
		 * Shows or hides the given element(s).
		 *
		 * @param selector  A CSS selector string, a HTMLElement object or a collection of HTMLElement objects.
		 * @param force     An optional boolean value that forces the class to be added or removed.
		 */
		this.toggle = function(selector, force) {
			if ( ! selector) {
				return;
			}

			switch (force) {
				case true:
					$.show(selector);
					break;

				case false:
					$.hide(selector);
					break;

				default:
					const element = typeof selector === 'string'
						? document.querySelectorAll(selector)
						: selector;

					if ('forEach' in element) {
						element.forEach(subElement => $.toggle(subElement));
						return;
					}

					element.style.display === 'none' ? $.show(selector) : $.hide(selector);
					break;
			}
		};

		/**
		 * Fades in the given element(s).
=======
		 * Fades in the the given element(s).
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
		 *
		 * @param selector    A CSS selector string, a HTMLElement object or a collection of HTMLElement objects.
		 * @param duration    Optional duration of the effect in milliseconds.
		 * @param oncomplete  Optional callback function to execute when effect is completed.
		 */
		this.fadeIn = function(selector, duration = 250, oncomplete) {
			if ( ! selector) {
				return;
			}

			const element = typeof selector === 'string'
				? document.querySelectorAll(selector)
				: selector;

<<<<<<< HEAD
			this.makeVisible(element);

			$.fadeTo(
				element,
				1,
				duration,
				() => {
					$.show(element);
					if (oncomplete) {
						oncomplete.call(element);
					}
				}
			);
		};

		/**
		 * Fades out the given element(s).
		 *
		 * @param selector    A CSS selector string, a HTMLElement object or a collection of HTMLElement objects.
		 * @param duration    Optional duration of the effect in milliseconds.
		 * @param oncomplete  Optional callback function to execute when effect is completed.
		 */
		this.fadeOut = function(selector, duration = 250, oncomplete) {
			if ( ! selector) {
				return;
			}

			const element = typeof selector === 'string'
				? document.querySelectorAll(selector)
				: selector;

			$.fadeTo(
				element,
				0,
				duration,
				() => {
					$.hide(element);
					if (oncomplete) {
						oncomplete.call(element);
					}
				}
			);
		};

		/**
		 * Fades out the given element(s).
		 *
		 * @param selector    A CSS selector string, a HTMLElement object or a collection of HTMLElement objects.
		 * @param opacity     Opacity Value to fade to
		 * @param duration    Optional duration of the effect in milliseconds.
		 * @param oncomplete  Optional callback function to execute when effect is completed.
		 */
		this.fadeTo = function(selector, opacity, duration = 250, oncomplete) {
=======
			if ('forEach' in element) {
				element.forEach(subElement => $.fadeIn(subElement, duration, oncomplete));
				return;
			}

			element.setAttribute('data-fading', 'in');

			const wait        = 50; // amount of time between steps
			const nr_of_steps = duration / wait;
			const change      = 1 / nr_of_steps; // time to wait before next step

			element.style.opacity = getComputedStyle(element, 'opacity');

			if ( ! element.style.opacity) {
				element.style.opacity = 0;
			}

			if (element.style.display === 'none') {
				element.style.display = 'block';
			}

			element.style.visibility = 'visible';

			(function fade() {
				if (element.getAttribute('data-fading') === 'out') {
					return;
				}

				const new_opacity = parseFloat(element.style.opacity) + change;

				if (new_opacity >= 1) {
					$.show(element);
					element.setAttribute('data-fading', '');
					if (oncomplete) {
						oncomplete.call(element);
					}
					return;
				}

				element.style.opacity = new_opacity;

				setTimeout(function() {
					fade.call();
				}, wait);
			})();
		};

		/**
		 * Fades out the the given element(s).
		 *
		 * @param selector    A CSS selector string, a HTMLElement object or a collection of HTMLElement objects.
		 * @param duration    Optional duration of the effect in milliseconds.
		 * @param oncomplete  Optional callback function to execute when effect is completed.
		 */
		this.fadeOut = function(selector, duration = 250, oncomplete) {
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
			if ( ! selector) {
				return;
			}

			const element = typeof selector === 'string'
				? document.querySelectorAll(selector)
				: selector;

			if ('forEach' in element) {
<<<<<<< HEAD
				element.forEach(subElement => $.fadeTo(subElement, opacity, duration));
				return;
			}

=======
				element.forEach(subElement => $.fadeOut(subElement, duration, oncomplete));
				return;
			}

			element.setAttribute('data-fading', 'out');

>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
			const wait        = 50; // amount of time between steps
			const nr_of_steps = duration / wait;
			const change      = 1 / nr_of_steps; // time to wait before next step

			element.style.opacity = getComputedStyle(element, 'opacity');

<<<<<<< HEAD
			if (opacity === element.style.opacity) {
				element.setAttribute('data-fading', '');

				if (oncomplete) {
					oncomplete.call(element);
				}

				return;
			}

			this.makeVisible(element);

			const direction = opacity > element.style.opacity ? 'in' : 'out';

			element.setAttribute('data-fading', direction);

			(function fade() {
				if (element.getAttribute('data-fading')
					&& element.getAttribute('data-fading') !== direction
				) {
					return;
				}

				const new_opacity = direction === 'out'
					? parseFloat(element.style.opacity) - change
					: parseFloat(element.style.opacity) + change;

				if ((direction === 'in' && new_opacity >= opacity)
					|| (direction === 'out' && new_opacity <= opacity)
				) {
					element.style.opacity = opacity;

					element.setAttribute('data-fading', '');

					if (oncomplete) {
						oncomplete.call(element);
					}

=======
			(function fade() {
				if (element.getAttribute('data-fading') === 'in') {
					return;
				}

				const new_opacity = parseFloat(element.style.opacity) - change;

				if (element.style.opacity <= 0) {
					$.hide(element);
					element.setAttribute('data-fading', '');
					if (oncomplete) {
						oncomplete.call(element);
					}
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
					return;
				}

				element.style.opacity = new_opacity;

<<<<<<< HEAD
				setTimeout(() => {
=======
				setTimeout(function() {
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
					fade.call();
				}, wait);
			})();
		};

		/**
		 * Runs a function when the document is loaded (on ready state).
		 *
		 * @param func  Callback function to execute when document is ready.
		 */
		this.onReady = function(func) {
			document.addEventListener('DOMContentLoaded', func);
		};

		/**
		 * Converts a string with HTML code to 'DOM' elements.
		 *
		 * @param html  String with HTML code.
		 *
		 * @return element
		 */
		this.createElementFromHTML = function(html) {
			return document.createRange().createContextualFragment(html);
		};

		/**
		 * Loads a url with optional POST data and optionally calls a function on success or fail.
		 *
		 * @param url      String containing the url to load.
		 * @param data     Optional string representing the POST data to send along.
		 * @param success  Optional callback function to execute when the url loads successfully (status 200).
		 * @param fail     Optional callback function to execute when the url fails to load.
		 */
		this.loadUrl = function(url, data, success, fail) {
			const request = new XMLHttpRequest();

<<<<<<< HEAD
			request.open('POST', url, true);
=======
			request.open("POST", url, true);
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090

			request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

			request.onreadystatechange = function() {
				if (this.readyState !== 4) {
					return;
				}

				if (this.status === 200) {
					success && success.call(null, this.responseText, this.status, this);
					return;
				}

				fail && fail.call(null, this.responseText, this.status, this);
			};

<<<<<<< HEAD
			request.send(this.toUrlQueryString(data));
		};

		/**
		 * Converts a data object (key, value) to a serialized query string.
		 *
		 * @param data    The object with the data to serialize.
		 * @param prefix  An Optional prefix.
		 */
		this.toUrlQueryString = function(data, prefix) {
			if (typeof data !== 'object') {
				return data;
			}

			const parts = [];

			if ( ! (Symbol.iterator in Object(data))) {
				data = Object.entries(data);
			}

			for (let i in data) {
				let value = data[i];
				let name  = '';

				if (value instanceof Array) {
					[name, value] = value;
				}

				let key = name ? (prefix ? `${prefix}[${name}]` : name) : prefix;

				if ( ! key) {
					continue;
				}

				if (value !== null && typeof value === 'object') {
					if (value instanceof Array) {
						key += '[]';
					}

					parts.push(this.toUrlQueryString(value, key));
					continue;
				}

				parts.push(`${key}=${value}`);
			}

			return parts.join('&');
=======
			request.send(data);
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
		};

		/**
		 *
		 * ALIASES
		 *
		 */

		this.as          = this.alias;
		this.hasClass    = this.hasClasses;
		this.addClass    = this.addClasses;
		this.removeClass = this.removeClasses;
		this.toggleClass = this.toggleClasses;

		/**
		 *
		 * PRIVATE FUNCTIONS
		 *
		 */

		/**
		 * Executes an action on the element(s) to add/remove/toggle classes.
		 *
		 * @param action    A string that identifies the action: add|remove|toggle.
		 * @param selector  A CSS selector string, a HTMLElement object or a collection of HTMLElement objects.
		 * @param classes   A string or array of class names.
		 */
		const doClasses = function(action, selector, classes) {
			if ( ! selector) {
				return;
			}

			const element = typeof selector === 'string'
				? document.querySelectorAll(selector)
				: selector;

			if ('forEach' in element) {
				element.forEach(subElement => doClasses(action, subElement, classes));
				return;
			}

			if (typeof classes === 'string') {
				classes = classes.split(' ');
			}

			element.classList[action](...classes);
		};

		/**
		 * Finds the computed style of an element.
		 *
		 * @param element   A HTMLElement object.
		 * @param property  The style property that needs to be returned.
		 *
		 * @returns mixed
		 */
		const getComputedStyle = function(element, property) {
			if ( ! element) {
				return null;
			}

			return window.getComputedStyle(element).getPropertyValue(property);
		};

		/**
		 * Finds the default computed style of an element by its type.
		 *
		 * @param element   A HTMLElement object.
		 * @param property  The style property that needs to be returned.
		 *
		 * @returns mixed
		 */
		const getDefaultComputedStyle = function(element, property) {
			if ( ! element) {
				return null;
			}

			const defaultElement = document.createElement(element.nodeName);

			document.body.append(defaultElement);
			let propertyValue = window.getComputedStyle(defaultElement).getPropertyValue(property);
			defaultElement.remove();

			return propertyValue;
		};

		/**
		 *
		 * PRIVATE VARIABLES
		 *
		 */

		/**
		 * @param  $  internal shorthand for the 'this' keyword.
		 */
		const $ = this;
	};
}
