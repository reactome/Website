<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_content
 *
<<<<<<< HEAD
 * @copyright   (C) 2015 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;
$published = (int) $this->state->get('filter.published');
?>

<div class="container-fluid">
	<div class="row-fluid">
		<div class="control-group span6">
			<div class="controls">
				<?php echo JHtml::_('batch.language'); ?>
			</div>
		</div>
		<div class="control-group span6">
			<div class="controls">
				<?php echo JHtml::_('batch.access'); ?>
			</div>
		</div>
	</div>
	<div class="row-fluid">
		<?php if ($published >= 0) : ?>
			<div class="control-group span6">
				<div class="controls">
					<?php echo JHtml::_('batch.item', 'com_content'); ?>
				</div>
			</div>
		<?php endif; ?>
		<div class="control-group span6">
			<div class="controls">
				<?php echo JHtml::_('batch.tag'); ?>
			</div>
		</div>
	</div>
</div>
