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

<<<<<<< HEAD
use RegularLabs\Library\Field;
=======
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
use RegularLabs\Library\License as RL_License;

if ( ! is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
	return;
}

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';

<<<<<<< HEAD
class JFormFieldRL_License extends Field
=======
class JFormFieldRL_License extends \RegularLabs\Library\Field
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
{
	public $type = 'License';

	protected function getInput()
	{
		$extension = $this->get('extension');

		if (empty($extension))
<<<<<<< HEAD
=======
		{
			return '';
		}

		$message = RL_License::getMessage($extension, true);

		if (empty($message))
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
		{
			return '';
		}

<<<<<<< HEAD
		$message = RL_License::getMessage($extension, true);

		if (empty($message))
		{
			return '';
		}

		return '</div><div>' . $message;
	}

	protected function getLabel()
	{
		return '';
=======
		return '</div><div>' . $message;
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
	}
}
