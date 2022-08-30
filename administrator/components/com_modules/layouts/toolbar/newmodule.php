<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_modules
 *
<<<<<<< HEAD
 * @copyright   (C) 2013 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

$text = JText::_('JTOOLBAR_NEW');
?>
<button onclick="location.href='index.php?option=com_modules&amp;view=select'" class="btn btn-small btn-success" title="<?php echo $text; ?>">
	<span class="icon-plus icon-white" aria-hidden="true"></span>
	<?php echo $text; ?>
</button>
