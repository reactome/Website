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

namespace RegularLabs\Library;

defined('_JEXEC') or die;

use RegularLabs\Library\CacheNew as Cache;
use SimpleXMLElement;

jimport('joomla.filesystem.file');

/**
 * Class File
 * @package RegularLabs\Library
 */
class Xml
{
	/**
	 * Get an object filled with data from an xml file
	 *
	 * @param string $url
	 * @param string $root
	 *
	 * @return object
	 */
	public static function toObject($url, $root = '')
	{
		$cache = new Cache([__METHOD__, $url, $root]);

		if ($cache->exists())
		{
			return $cache->get();
		}

		if (file_exists($url))
		{
			$xml = @new SimpleXMLElement($url, LIBXML_NONET | LIBXML_NOCDATA, 1);
		}
		else
		{
			$xml = simplexml_load_string($url, "SimpleXMLElement", LIBXML_NONET | LIBXML_NOCDATA);
		}

		if ( ! @count($xml))
		{
			return $cache->set((object) []);
		}

		if ($root)
		{
			if ( ! isset($xml->{$root}))
			{
				return $cache->set((object) []);
			}

			$xml = $xml->{$root};
		}

		$json = json_encode($xml);
		$xml  = json_decode($json);
		if (is_null($xml))
		{
			$xml = (object) [];
		}

		if ($root && isset($xml->{$root}))
		{
			$xml = $xml->{$root};
		}

		return $cache->set($xml);
	}
}
