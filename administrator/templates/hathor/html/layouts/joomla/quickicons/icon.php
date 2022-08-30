<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  Template.hathor
 *
<<<<<<< HEAD
 * @copyright   (C) 2013 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

$id      = empty($displayData['id']) ? '' : (' id="' . $displayData['id'] . '"');
$target  = empty($displayData['target']) ? '' : (' target="' . $displayData['target'] . '"');
$onclick = empty($displayData['onclick']) ? '' : (' onclick="' . $displayData['onclick'] . '"');
$title   = empty($displayData['title']) ? '' : (' title="' . $this->escape($displayData['title']) . '"');
$text    = empty($displayData['text']) ? '' : ('<span>' . $displayData['text'] . '</span>')

?>
<div class="quickicon-wrapper"<?php echo $id; ?>>
	<div class="icon">
		<a href="<?php echo $displayData['link']; ?>"<?php echo $target . $onclick . $title; ?>>
			<?php echo JHtml::_('image', empty($displayData['icon']) ? '' : $displayData['icon'], empty($displayData['alt']) ? null : htmlspecialchars($displayData['alt'], ENT_COMPAT, 'UTF-8'), null, true); ?>
			<?php echo $text; ?>
		</a>
	</div>
</div>
