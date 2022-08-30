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

/**
 * Class ContentPagetype
 * @package RegularLabs\Library\Condition
 */
class ContentPagetype extends Content
{
	public function pass()
	{
		$components = ['com_content', 'com_contentsubmit'];

		if ( ! in_array($this->request->option, $components))
		{
			return $this->_(false);
		}
		if ($this->request->view == 'category' && $this->request->layout == 'blog')
		{
			$view = 'categoryblog';
		}
		else
		{
			$view = $this->request->view;
		}

		return $this->passSimple($view);
	}
}
