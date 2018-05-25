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

/**
 * Class MijoshopProduct
 * @package RegularLabs\Library\Condition
 */
class MijoshopProduct
	extends Mijoshop
{
	public function pass()
	{
		if ( ! $this->request->id || $this->request->option != 'com_mijoshop' || $this->request->view != 'product')
		{
			return $this->_(false);
		}

		return $this->passSimple($this->request->id);
	}
}
