<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  com_config
 *
<<<<<<< HEAD
 * @copyright   (C) 2009 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

try
{
	JLog::add(
		sprintf('ConfigModelApplication has moved from %1$s to %2$s', __FILE__, dirname(__DIR__) . '/model/application.php'),
		JLog::WARNING,
		'deprecated'
	);
}
catch (RuntimeException $exception)
{
	// Informational log only
}

include_once JPATH_ADMINISTRATOR . '/components/com_config/model/application.php';
