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
 * Class ContentArticle
 * @package RegularLabs\Library\Condition
 */
class ContentArticle extends Content
{
	public function pass()
	{
		if ( ! $this->request->id
			|| ! (($this->request->option == 'com_content' && $this->request->view == 'article')
				|| ($this->request->option == 'com_flexicontent' && $this->request->view == 'item')
			)
		)
		{
			return $this->_(false);
		}

		$pass = false;

		// Pass Article Id
		if ( ! $this->passItemByType($pass, 'ContentId'))
		{
			return $this->_(false);
		}

		// Pass Featured
		if ( ! $this->passItemByType($pass, 'Featured'))
		{
			return $this->_(false);
		}

		// Pass Content Keywords
		if ( ! $this->passItemByType($pass, 'ContentKeyword'))
		{
			return $this->_(false);
		}

		// Pass Meta Keywords
		if ( ! $this->passItemByType($pass, 'MetaKeyword'))
		{
			return $this->_(false);
		}

		// Pass Author
		if ( ! $this->passItemByType($pass, 'Author'))
		{
			return $this->_(false);
		}

		// Pass Date
		if ( ! $this->passItemByType($pass, 'Date'))
		{
			return $this->_(false);
		}

		// Pass Fields
		if ( ! $this->passItemByType($pass, 'Field'))
		{
			return $this->_(false);
		}

		return $this->_($pass);
	}
}
