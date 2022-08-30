<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_users_latest
 *
<<<<<<< HEAD
 * @copyright   (C) 2009 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;
?>
<?php if (!empty($names)) : ?>
	<ul class="latestusers<?php echo $moduleclass_sfx; ?> mod-list" >
	<?php foreach ($names as $name) : ?>
		<li>
			<?php echo $name->username; ?>
		</li>
	<?php endforeach; ?>
	</ul>
<?php endif; ?>
