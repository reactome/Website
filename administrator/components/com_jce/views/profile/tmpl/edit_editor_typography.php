<?php
/**
 * @copyright   Copyright (C) 2005 - 2018 Open Source Matters, Inc. All rights reserved
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 *
 */
defined('_JEXEC') or die;

$this->name = JText::_('WF_PROFILES_EDITOR_TYPOGRAPHY');
$this->fieldsname = 'editor.typography';
echo JLayoutHelper::render('joomla.content.options_default', $this);