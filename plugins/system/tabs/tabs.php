<?php
/**
 * @package         Tabs
 * @version         7.4.1
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2018 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

defined('_JEXEC') or die;

// Do not instantiate plugin on install pages
// to prevent installation/update breaking because of potential breaking changes
if (
	in_array(JFactory::getApplication()->input->get('option'), ['com_installer', 'com_regularlabsmanager'])
	&& JFactory::getApplication()->input->get('action') != ''
)
{
	return;
}

if ( ! is_file(__DIR__ . '/vendor/autoload.php'))
{
	return;
}

require_once __DIR__ . '/vendor/autoload.php';

use RegularLabs\Plugin\System\Tabs\Plugin;

/**
 * System Plugin that places a Tabs code block into the text
 */
class PlgSystemTabs extends Plugin
{
	public $_alias       = 'tabs';
	public $_title       = 'TABS';
	public $_lang_prefix = 'TAB';

	public $_has_tags              = true;
	public $_disable_on_components = true;

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

