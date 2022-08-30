<?php
/**
 * @package         Regular Labs Library
<<<<<<< HEAD
 * @version         22.6.8549
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://regularlabs.com
 * @copyright       Copyright © 2022 Regular Labs All Rights Reserved
=======
 * @version         21.7.10061
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://regularlabs.com
 * @copyright       Copyright © 2021 Regular Labs All Rights Reserved
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

defined('_JEXEC') or die;

use RegularLabs\Library\Article as RL_Article;
use RegularLabs\Library\CacheNew as RL_Cache;
use RegularLabs\Library\Document as RL_Document;
use RegularLabs\Library\ParametersNew as RL_Parameters;

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

<<<<<<< HEAD
		$cache = new RL_Cache([__METHOD__, $plugin->get('_type'), $plugin->get('_name'), $params]);
=======
		$cache = new RL_Cache([__METHOD__, $plugin->get('_type'), $plugin->get('_name'),$params]);
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090

		if ($cache->exists())
		{
			return $cache->get();
		}

		if ( ! $params)
		{
			$params = RL_Parameters::getPlugin($plugin->get('_name'));
		}

		$file = JPATH_PLUGINS . '/' . $plugin->get('_type') . '/' . $plugin->get('_name') . '/helper.php';

		if ( ! is_file($file))
		{
			return null;
		}

		require_once $file;
		$class = get_class($plugin) . 'Helper';

		return $cache->set(new $class($params));
	}

	public static function isCategoryList($context)
	{
		return class_exists('RegularLabs\Library\Document') && RL_Document::isCategoryList($context);
	}

	public static function processArticle(&$article, &$context, &$helper, $method, $params = [])
	{
		class_exists('RegularLabs\Library\Article') && RL_Article::process($article, $context, $helper, $method, $params);
	}
}
