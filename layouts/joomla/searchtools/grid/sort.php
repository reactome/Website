<?php
/**
 * @package     Joomla.Site
 * @subpackage  Layout
 *
<<<<<<< HEAD
 * @copyright   (C) 2013 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

$data = $displayData;

$title = htmlspecialchars(JText::_($data->tip ?: $data->title));
JHtml::_('bootstrap.popover');
?>
<a href="#" onclick="return false;" class="js-stools-column-order hasPopover"
   data-order="<?php echo $data->order; ?>" data-direction="<?php echo strtoupper($data->direction); ?>" data-name="<?php echo JText::_($data->title); ?>"
   title="<?php echo $title; ?>" data-content="<?php echo htmlspecialchars(JText::_('JGLOBAL_CLICK_TO_SORT_THIS_COLUMN')); ?>" data-placement="top">
<?php if (!empty($data->icon)) : ?><span class="<?php echo $data->icon; ?>"></span><?php endif; ?>
<?php if (!empty($data->title)) : ?><?php echo JText::_($data->title); ?><?php endif; ?>
<?php if ($data->order == $data->selected) : ?><span class="<?php echo $data->orderIcon; ?>"></span><?php endif; ?>
</a>
