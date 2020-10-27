<?php
/**
 * @package         Regular Labs Library
 * @version         20.10.18795
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2020 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

defined('_JEXEC') or die;

use RegularLabs\Library\Article as RL_Article;
use RegularLabs\Library\Cache as RL_Cache;
use RegularLabs\Library\Document as RL_Document;
use RegularLabs\Library\Parameters as RL_Parameters;

if (is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
	require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';
}

class RLHelper
{
	public static function getPluginHelper($plugin, $params = null)
	{
		if ( ! class_exists('RegularLabs\Library\Cache'))
		{
			return null;
		}

		$hash = md5('getPluginHelper_' . $plugin->get('_type') . '_' . $plugin->get('_name') . '_' . json_encode($params));

		if (RL_Cache::has($hash))
		{
			return RL_Cache::get($hash);
		}

		if ( ! $params)
		{
			$params = RL_Parameters::getInstance()->getPluginParams($plugin->get('_name'));
		}

		$file = JPATH_PLUGINS . '/' . $plugin->get('_type') . '/' . $plugin->get('_name') . '/helper.php';

		if ( ! is_file($file))
		{
			return null;
		}

		require_once $file;
		$class = get_class($plugin) . 'Helper';

		return RL_Cache::set(
			$hash,
			new $class($params)
		);
	}

	public static function processArticle(&$article, &$context, &$helper, $method, $params = [])
	{
		class_exists('RegularLabs\Library\Article') && RL_Article::process($article, $context, $helper, $method, $params);
	}

	public static function isCategoryList($context)
	{
		return class_exists('RegularLabs\Library\Document') && RL_Document::isCategoryList($context);
	}
}
