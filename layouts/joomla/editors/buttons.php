<?php
/**
 * @package     Joomla.Site
 * @subpackage  Layout
 *
<<<<<<< HEAD
 * @copyright   (C) 2014 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

$buttons = $displayData;

?>
<div id="editor-xtd-buttons" class="btn-toolbar pull-left" role="toolbar" aria-label="<?php echo JText::_('JTOOLBAR'); ?>">
	<?php if ($buttons) : ?>
		<?php foreach ($buttons as $button) : ?>
			<?php echo $this->sublayout('button', $button); ?>
		<?php endforeach; ?>
	<?php endif; ?>
</div>
