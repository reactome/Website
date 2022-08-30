<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_installer
 *
<<<<<<< HEAD
 * @copyright   (C) 2007 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

$state    = $this->get('State');
$message1 = $state->get('message');
$message2 = $state->get('extension_message');
?>

<?php if ($message1) : ?>
	<div class="row-fluid"> 
		<div class="span12"> 
			<strong><?php echo $message1; ?></strong>
		</div>
	</div> 
<?php endif; ?> 
<?php if ($message2) : ?> 
	<div class="row-fluid">
		<div class="span12"> 
			<?php echo $message2; ?>
		</div> 
	</div>
<?php endif; ?>
