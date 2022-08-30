<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_articles_news
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
<ul class="newsflash-vert<?php echo $params->get('moduleclass_sfx'); ?> mod-list">
	<?php for ($i = 0, $n = count($list); $i < $n; $i ++) : ?>
		<?php $item = $list[$i]; ?>
		<li class="newsflash-item">
			<?php require JModuleHelper::getLayoutPath('mod_articles_news', '_item'); ?>

			<?php if ($n > 1 && (($i < $n - 1) || $params->get('showLastSeparator'))) : ?>
				<span class="article-separator">&#160;</span>
			<?php endif; ?>
		</li>
	<?php endfor; ?>
</ul>
