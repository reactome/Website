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

namespace RegularLabs\Plugin\System\Tabs;

defined('_JEXEC') or die;

use JFactory;
use JHtml;
use RegularLabs\Library\Document as RL_Document;

class Document
{
	public static function addHeadStuff()
	{
		// do not load scripts/styles on feeds or print pages
		if (RL_Document::isFeed() || JFactory::getApplication()->input->getInt('print', 0))
		{
			return;
		}

		$params = Params::get();

		if ( ! $params->load_bootstrap_framework && $params->load_jquery)
		{
			JHtml::_('jquery.framework');
		}

		if ($params->load_bootstrap_framework)
		{
			JHtml::_('bootstrap.framework');
		}


		$options = [
			'use_hash'                => (int) $params->use_hash,
			'reload_iframes'          => (int) $params->reload_iframes,
			'init_timeout'            => (int) $params->init_timeout,
			'urlscroll'               => 0,
		];

		RL_Document::scriptOptions($options, 'Tabs');

		RL_Document::script('tabs/script.min.js', ($params->media_versioning ? '7.4.1' : ''));

		if ($params->load_stylesheet)
		{
			RL_Document::stylesheet('tabs/style.min.css', ($params->media_versioning ? '7.4.1' : ''));
		}

	}

	public static function removeHeadStuff(&$html)
	{
		// Don't remove if tabs class is found
		if (strpos($html, 'class="rl_tabs-tab') !== false)
		{
			return;
		}

		// remove style and script if no items are found
		RL_Document::removeScriptsStyles($html, 'Tabs');
		RL_Document::removeScriptsOptions($html, 'Tabs');
	}
}
