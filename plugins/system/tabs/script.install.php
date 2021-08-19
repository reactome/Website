<?php
/**
 * @package         Tabs
 * @version         8.1.1
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://regularlabs.com
 * @copyright       Copyright © 2021 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

defined('_JEXEC') or die;

require_once __DIR__ . '/script.install.helper.php';

class PlgSystemTabsInstallerScript extends PlgSystemTabsInstallerScriptHelper
{
	public $alias          = 'tabs';
	public $extension_type = 'plugin';
	public $name           = 'TABS';

	public function uninstall($adapter)
	{
		$this->uninstallPlugin($this->extname, 'editors-xtd');
	}
}
