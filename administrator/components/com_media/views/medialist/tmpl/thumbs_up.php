<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_media
 *
<<<<<<< HEAD
 * @copyright   (C) 2007 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;
?>
<?php if ($this->state->folder != '') : ?>
<li class="imgOutline thumbnail height-80 width-80 center">
	<div class="imgTotal">
		<div class="imgBorder">
			<a class="btn" href="index.php?option=com_media&amp;view=mediaList&amp;tmpl=component&amp;folder=<?php echo rawurlencode($this->state->parent); ?>" target="folderframe">
				<span class="icon-arrow-up"></span></a>
		</div>
	</div>
	<div class="controls">
		<span>&#160;</span>
	</div>
	<div class="imginfoBorder">
		<a href="index.php?option=com_media&amp;view=mediaList&amp;tmpl=component&amp;folder=<?php echo rawurlencode($this->state->parent); ?>" target="folderframe">..</a>
	</div>
</li>
<?php endif; ?>
