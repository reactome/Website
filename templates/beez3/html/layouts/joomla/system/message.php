<?php
/**
 * @package     Joomla.Site
 * @subpackage  Templates.beez3
 *
<<<<<<< HEAD
 * @copyright   (C) 2014 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

$msgList = $displayData['msgList'];

?>
<div id="system-message-container">
	<?php if (is_array($msgList) && $msgList) : ?>
		<dl id="system-message">
			<?php foreach ($msgList as $type => $msgs) : ?>
				<?php if ($msgs) : ?>
					<dt class="<?php echo strtolower($type); ?>"><?php echo JText::_($type); ?></dt>
					<dd class="<?php echo strtolower($type); ?> message">
						<ul>
							<?php foreach ($msgs as $msg) : ?>
								<li><?php echo $msg; ?></li>
							<?php endforeach; ?>
						</ul>
					</dd>
				<?php endif; ?>
			<?php endforeach; ?>
		</dl>
	<?php endif; ?>
</div>
