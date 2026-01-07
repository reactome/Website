<?php defined('_JEXEC') or die('Restricted access');

/**
 * @author     Garda Informatica <info@gardainformatica.it>
 * @copyright  Copyright (C) 2014 Garda Informatica. All rights reserved.
 * @license    http://www.gnu.org/licenses/gpl-3.0.html  GNU General Public License version 3
 * @package    JSocialFeed Joomla Extension
 * @link       http://www.gardainformatica.it
 */

/*

This file is part of "JSocialFeed Joomla Extension".

"JSocialFeed Joomla Extension" is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

"JSocialFeed Joomla Extension" is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with "JSocialFeed Joomla Extension".  If not, see <http://www.gnu.org/licenses/>.

*/


require_once(JPATH_ROOT . '/' . "libraries" . '/' . "jsocialfeed" . '/' . "language" . '/' . "jsocialfeed.inc");
$language = JFactory::getLanguage();
$language->load("com_jsocialfeed.sys", realpath(dirname(__FILE__)));
$langcode = preg_replace("/-.*/", "", $language->get("tag"));
?>

<h1><?php echo($language->_("COM_JSOCIALFEED")); ?></h1>

<!-- GID -->

<table  width="90%"><tr><td>
		<h1><?php echo($language->_("COM_JSOCIALFEED_INSTRUCTIONS_LBL")); ?></h1>
		<h2><?php echo($language->_("COM_JSOCIALFEED_INSTRUCTIONS_TITLE")); ?></h2>
		<?php echo($language->_("COM_JSOCIALFEED_INSTRUCTIONS_DSC")); ?>
		<h2><?php echo($language->_("MOD_JSOCIALFEED_INSTRUCTIONS_TITLE")); ?></h2>
		<?php echo($language->_("MOD_JSOCIALFEED_INSTRUCTIONS_DSC")); ?>
	</td></tr>
</table>
<p><?php echo(sprintf($language->_("JGLOBAL_ISFREESOFTWARE"), "JSocialFeed")); ?></p>



