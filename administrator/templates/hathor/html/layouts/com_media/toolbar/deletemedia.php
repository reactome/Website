<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_media
 *
<<<<<<< HEAD
 * @copyright   (C) 2013 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

$title = JText::_('JTOOLBAR_DELETE');
?>
<button onclick="MediaManager.submit('folder.delete')" class="toolbar">
	<span class="icon-32-delete" title="<?php echo $title; ?>"></span> <?php echo $title; ?>
</button>
