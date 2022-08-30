<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_messages
 *
<<<<<<< HEAD
 * @copyright   (C) 2013 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

$text = JText::_('COM_MESSAGES_TOOLBAR_MY_SETTINGS');
?>
<a rel="{handler:'iframe', size:{x:700,y:300}}" href="index.php?option=com_messages&amp;view=config&amp;tmpl=component" title="<?php echo $text; ?>" class="messagesSettings toolbar">
	<span class="icon-32-options"></span> <?php echo $text; ?>
</a>
