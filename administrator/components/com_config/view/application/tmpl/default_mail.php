<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_config
 *
<<<<<<< HEAD
 * @copyright   (C) 2013 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

JHtml::_('jquery.token');
JHtml::_('script', 'system/sendtestmail.js', array('version' => 'auto', 'relative' => true));

// Load JavaScript message titles
JText::script('ERROR');
JText::script('WARNING');
JText::script('NOTICE');
JText::script('MESSAGE');

// Add strings for JavaScript error translations.
JText::script('JLIB_JS_AJAX_ERROR_CONNECTION_ABORT');
JText::script('JLIB_JS_AJAX_ERROR_NO_CONTENT');
JText::script('JLIB_JS_AJAX_ERROR_OTHER');
JText::script('JLIB_JS_AJAX_ERROR_PARSE');
JText::script('JLIB_JS_AJAX_ERROR_TIMEOUT');

// Ajax request data.
$ajaxUri = JRoute::_('index.php?option=com_config&task=config.sendtestmail.application&format=json');

$this->name = JText::_('COM_CONFIG_MAIL_SETTINGS');
$this->fieldsname = 'mail';
echo JLayoutHelper::render('joomla.content.options_default', $this);

echo '<button class="btn btn-small" data-ajaxuri="' . $ajaxUri . '"  type="button" id="sendtestmail">
		<span>' . JText::_('COM_CONFIG_SENDMAIL_ACTION_BUTTON') . '</span>
	</button>';
