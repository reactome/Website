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

/* @DEPRECATED */

defined('_JEXEC') or die;

use RegularLabs\Library\Cache as RL_Cache;

if (is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
	require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';
}

class RLCache
{
	static $cache = [];

	public static function get($id)
	{
		return RL_Cache::get($id);
	}

	public static function has($id)
	{
		return RL_Cache::has($id);
	}

	public static function read($id)
	{
		return RL_Cache::read($id);
	}

	public static function set($id, $data)
	{
		return RL_Cache::set($id, $data);
	}

	public static function write($id, $data, $ttl = 0)
	{
		return RL_Cache::write($id, $data, $ttl);
	}
}
