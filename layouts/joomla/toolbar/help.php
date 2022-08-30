<?php
/**
 * @package     Joomla.Site
 * @subpackage  Layout
 *
<<<<<<< HEAD
 * @copyright   (C) 2013 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

JHtml::_('behavior.core');

$doTask = $displayData['doTask'];
$text   = $displayData['text'];

?>
<button onclick="<?php echo $doTask; ?>" rel="help" class="btn btn-small">
	<span class="icon-question-sign" aria-hidden="true"></span>
	<?php echo $text; ?>
</button>
