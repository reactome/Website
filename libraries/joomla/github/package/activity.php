<?php
/**
 * @package     Joomla.Platform
 * @subpackage  GitHub
 *
<<<<<<< HEAD
 * @copyright   (C) 2014 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

defined('JPATH_PLATFORM') or die;

/**
 * GitHub API Activity class for the Joomla Platform.
 *
 * @since       3.3 (CMS)
 * @deprecated  4.0  Use the `joomla/github` package via Composer instead
 *
 * @documentation  https://developer.github.com/v3/activity/
 *
 * @property-read  JGithubPackageActivityEvents  $events  GitHub API object for markdown.
 */
class JGithubPackageActivity extends JGithubPackage
{
	protected $name = 'Activity';

	protected $packages = array('events', 'notifications', 'starring', 'watching');
}
