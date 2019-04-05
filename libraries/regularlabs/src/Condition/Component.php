<?php
/**
 * @package         Regular Labs Library
 * @version         19.3.16030
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2019 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Library\Condition;

defined('_JEXEC') or die;

/**
 * Class Component
 * @package RegularLabs\Library\Condition
 */
class Component
	extends \RegularLabs\Library\Condition
{
	public function pass()
	{
		return $this->passSimple(strtolower($this->request->option));
	}
}
