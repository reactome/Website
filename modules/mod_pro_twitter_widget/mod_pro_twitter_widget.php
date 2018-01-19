<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_pro_twitter_widget
 *
 * @copyright   Copyright (C) 2016 - All rights reserved by HIGHSCHOOLDIPLOMAONLINEFAST.COM
 * @license     GNU General Public License version 2 or later
 */


defined('_JEXEC') or die;

$moduleclass_sfx = htmlspecialchars($params->get('moduleclass_sfx'));
require JModuleHelper::getLayoutPath('mod_pro_twitter_widget', $params->get('layout', 'default'));