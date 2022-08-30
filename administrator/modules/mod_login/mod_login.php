<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  mod_login
 *
<<<<<<< HEAD
 * @copyright   (C) 2006 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

// Include the login functions only once
JLoader::register('ModLoginHelper', __DIR__ . '/helper.php');

$langs            = ModLoginHelper::getLanguageList();
$twofactormethods = JAuthenticationHelper::getTwoFactorMethods();
$return           = ModLoginHelper::getReturnUri();

require JModuleHelper::getLayoutPath('mod_login', $params->get('layout', 'default'));
