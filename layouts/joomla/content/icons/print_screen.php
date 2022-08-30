<?php
/**
 * @package     Joomla.Site
 * @subpackage  Layout
 *
<<<<<<< HEAD
 * @copyright   (C) 2016 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

$params = $displayData['params'];
$legacy = $displayData['legacy'];

?>
<?php if ($params->get('show_icons')) : ?>
	<?php if ($legacy) : ?>
		<?php // Checks template image directory for image, if none found default are loaded ?>
		<?php echo JHtml::_('image', 'system/printButton.png', JText::_('JGLOBAL_PRINT'), null, true); ?>
	<?php else : ?>
		<span class="icon-print" aria-hidden="true"></span>
		<?php echo JText::_('JGLOBAL_PRINT'); ?>
	<?php endif; ?>
<?php else : ?>
	<?php echo JText::_('JGLOBAL_PRINT'); ?>
<?php endif; ?>
