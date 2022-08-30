<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_stats
 *
<<<<<<< HEAD
 * @copyright   (C) 2006 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;
?>
<dl class="stats-module<?php echo $moduleclass_sfx; ?>">
<?php foreach ($list as $item) : ?>
	<dt><?php echo $item->title; ?></dt>
	<dd><?php echo $item->data; ?></dd>
<?php endforeach; ?>
</dl>
