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

$user = JFactory::getUser();
?>
<?php if ($this->state->folder != '') : ?>
<tr>
	<?php if ($this->canDelete) : ?>
		<td>&#160;</td>
	<?php endif; ?>
	<td class="imgTotal">
		<a href="index.php?option=com_media&amp;view=mediaList&amp;tmpl=component&amp;folder=<?php echo rawurlencode($this->state->parent); ?>" target="folderframe">
			<span class="icon-arrow-up"></span></a>
	</td>
	<td class="description">
		<a href="index.php?option=com_media&amp;view=mediaList&amp;tmpl=component&amp;folder=<?php echo rawurlencode($this->state->parent); ?>" target="folderframe">..</a>
	</td>
	<td>&#160;</td>
	<td>&#160;</td>
	<?php if ($user->authorise('core.delete', 'com_media')) : ?>
		<td>&#160;</td>
	<?php endif; ?>
</tr>
<?php endif; ?>
