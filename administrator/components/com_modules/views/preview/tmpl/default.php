<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_modules
 *
<<<<<<< HEAD
 * @copyright   (C) 2008 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

// @deprecated  4.0 not used for a long time

defined('_JEXEC') or die;

JFactory::getDocument()->addScriptDeclaration(
	'
	var form = window.top.document.adminForm
	var title = form.title.value;
	var alltext = window.top.' . $this->editor->getContent('text') . ';

	jQuery(document).ready(function() {
		document.getElementById("td-title").innerHTML = title;
		document.getElementById("td-text").innerHTML = alltext;
	});'
);
?>

<table class="center" width="90%">
	<tr>
		<td class="contentheading" colspan="2" id="td-title"></td>
	</tr>
<tr>
	<td valign="top" height="90%" colspan="2" id="td-text"></td>
</tr>
</table>
