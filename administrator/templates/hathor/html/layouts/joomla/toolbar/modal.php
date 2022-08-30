<?php
/**
 * @package     Joomla.Administrator
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

JHtml::_('behavior.core');

$selector = $displayData['selector'];
$class    = isset($displayData['class']) ? $displayData['class'] : 'toolbar';
$icon     = isset($displayData['icon']) ? $displayData['icon'] : '';
$text     = isset($displayData['text']) ? $displayData['text'] : '';
?>
<a class="<?php echo $class; ?>" data-toggle="modal" data-target="#<?php echo $selector; ?>">
	<span class="icon-32-<?php echo $icon; ?>"></span>
	<?php echo $text; ?>
</a>
