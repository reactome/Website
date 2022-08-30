/**
<<<<<<< HEAD
 * @copyright  (C) 2017 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

Joomla = window.Joomla || {};

(function(Joomla) {
	Joomla.fieldIns = function(id, editor) {
		/** Use the API, if editor supports it **/
		if (window.parent.Joomla && window.parent.Joomla.editors && window.parent.Joomla.editors.instances && window.parent.Joomla.editors.instances.hasOwnProperty(editor)) {
			window.parent.Joomla.editors.instances[editor].replaceSelection("{field " + id + "}")
		} else {
			window.parent.jInsertEditorText("{field " + id + "}", editor);
		}

		window.parent.jModalClose();
	};

	Joomla.fieldgroupIns = function(id, editor) {
		/** Use the API, if editor supports it **/
		if (window.parent.Joomla && window.parent.Joomla.editors && window.parent.Joomla.editors.instances && window.parent.Joomla.editors.instances.hasOwnProperty(editor)) {
			window.parent.Joomla.editors.instances[editor].replaceSelection("{fieldgroup " + id + "}")
		} else {
			window.parent.jInsertEditorText("{fieldgroup " + id + "}", editor);
		}

		window.parent.jModalClose();
	};
})(Joomla);
