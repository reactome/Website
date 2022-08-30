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

?>
<textarea
	name="<?php echo $data->name; ?>"
	id="<?php echo $data->id; ?>"
	cols="<?php echo $data->cols; ?>"
	rows="<?php echo $data->rows; ?>"
	style="width: <?php echo $data->width; ?>; height: <?php echo $data->height; ?>;"
	class="<?php echo empty($data->class) ? 'mce_editable' : $data->class; ?>"
	<?php echo $data->readonly ? ' readonly disabled' : ''; ?>
>
	<?php echo $data->content; ?>
</textarea>