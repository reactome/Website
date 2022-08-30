<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_templates
 *
<<<<<<< HEAD
 * @copyright   (C) 2013 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;
ksort($this->files, SORT_STRING);
?>

<ul class='nav nav-list directory-tree'>
	<?php foreach ($this->files as $key => $value) : ?>
		<?php if (is_array($value)) : ?>
			<li class="folder-select">
				<a class='folder-url nowrap' data-id='<?php echo base64_encode($key); ?>' href=''>
					<span class='icon-folder'>&nbsp;<?php $explodeArray = explode('/', $key); echo $this->escape(end($explodeArray)); ?></span>
				</a>
				<?php echo $this->folderTree($value); ?>
			</li>
		<?php endif; ?>
	<?php endforeach; ?>
</ul>
