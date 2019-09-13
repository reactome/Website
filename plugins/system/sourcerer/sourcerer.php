<?php
/**
 * @package         Sourcerer
 * @version         8.2.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2019 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

defined('_JEXEC') or die;

use RegularLabs\Plugin\System\Sourcerer\Plugin;

// Do not instantiate plugin on install pages
// to prevent installation/update breaking because of potential breaking changes
$input = \Joomla\CMS\Factory::getApplication()->input;
if (in_array($input->get('option'), ['com_installer', 'com_regularlabsmanager']) && $input->get('action') != '')
{
	return;
}

if ( ! is_file(__DIR__ . '/vendor/autoload.php'))
{
	return;
}

require_once __DIR__ . '/vendor/autoload.php';

/**
 * Plugin that replaces Sourcerer code with its HTML / CSS / JavaScript / PHP equivalent
 */
class PlgSystemSourcerer extends Plugin
{
	public $_alias       = 'sourcerer';
	public $_title       = 'SOURCERER';
	public $_lang_prefix = 'SRC';

	public $_can_disable_by_url    = false;
	public $_disable_on_components = true;
	public $_page_types            = ['html', 'feed', 'pdf', 'xml', 'ajax', 'json', 'raw'];

	/*
	 * Below are the events that this plugin uses
	 * All handling is passed along to the parent run method
	 */
	public function onContentPrepare()
	{
		$this->run();
	}

	public function onAfterDispatch()
	{
		$this->run();
	}

	public function onAfterRender()
	{
		$this->run();
	}
}
