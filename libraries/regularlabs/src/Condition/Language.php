<?php
/**
 * @package         Regular Labs Library
 * @version         18.5.18576
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2018 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Library\Condition;

defined('_JEXEC') or die;

use JFactory;

/**
 * Class Language
 * @package RegularLabs\Library\Condition
 */
class Language
	extends \RegularLabs\Library\Condition
{
	public function pass()
	{
		return $this->passSimple(JFactory::getLanguage()->getTag(), true);
	}
}
