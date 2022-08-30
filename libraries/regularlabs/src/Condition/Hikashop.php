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

namespace RegularLabs\Library\Condition;

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;
use RegularLabs\Library\Condition;

/**
 * Class Hikashop
 * @package RegularLabs\Library\Condition
 */
abstract class Hikashop extends Condition
{
	public function beforePass()
	{
		$input = JFactory::getApplication()->input;

		// Reset $this->request because HikaShop messes with the view after stuff is loaded!
		$this->request->option = $input->get('option', $this->request->option);
		$this->request->view   = $input->get('view', $input->get('ctrl', $this->request->view));
		$this->request->id     = $input->getInt('id', $this->request->id);
		$this->request->Itemid = $input->getInt('Itemid', $this->request->Itemid);
	}
}
