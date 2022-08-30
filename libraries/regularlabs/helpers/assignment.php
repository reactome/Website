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

use RegularLabs\Library\Condition;

defined('_JEXEC') or die;

if (is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
	require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';
}

<<<<<<< HEAD
class RLAssignment extends Condition
=======
class RLAssignment extends \RegularLabs\Library\Condition
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
{
	public function pass($pass = true, $include_type = null)
	{
		return $this->_($pass, $include_type);
	}

	public function passAuthors($field = 'created_by', $author = '')
	{
		return $this->passAuthors($field, $author);
	}

	public function passByPageTypes($option, $selection = [], $assignment = 'all', $add_view = false, $get_task = false, $get_layout = true)
	{
		return $this->passByPageType($option, $selection, $assignment, $add_view, $get_task, $get_layout);
	}

	public function passContentIds()
	{
		return $this->passContentId();
	}

	public function passContentKeywords($fields = ['title', 'introtext', 'fulltext'], $text = '')
	{
		return $this->passContentKeyword($fields, $text);
	}

	public function passMetaKeywords($field = 'metakey', $keywords = '')
	{
		return $this->passMetaKeyword($field, $keywords);
	}
}
