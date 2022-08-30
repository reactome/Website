<?php
/**
 * @package     Joomla.Site
 * @subpackage  com_fields
 *
<<<<<<< HEAD
 * @copyright   (C) 2016 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;

if (!key_exists('field', $displayData))
{
	return;
}

$field = $displayData['field'];
$label = JText::_($field->label);
$value = $field->value;
$showLabel = $field->params->get('showlabel');
$labelClass = $field->params->get('label_render_class');
<<<<<<< HEAD
$valueClass = $field->params->get('value_render_class');
=======
$renderClass = $field->params->get('render_class');
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090

if ($value == '')
{
	return;
}

?>
<?php if ($showLabel == 1) : ?>
	<span class="field-label <?php echo $labelClass; ?>"><?php echo htmlentities($label, ENT_QUOTES | ENT_IGNORE, 'UTF-8'); ?>: </span>
<?php endif; ?>
<<<<<<< HEAD
<span class="field-value <?php echo $valueClass; ?>"><?php echo $value; ?></span>
=======
<span class="field-value <?php echo $renderClass; ?>"><?php echo $value; ?></span>
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
