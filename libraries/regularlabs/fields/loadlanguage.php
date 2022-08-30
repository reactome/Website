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
use RegularLabs\Library\Language as RL_Language;

if ( ! is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
	return;
}

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';

<<<<<<< HEAD
class JFormFieldRL_LoadLanguage extends Field
{
	public $type = 'LoadLanguage';

=======
class JFormFieldRL_LoadLanguage extends \RegularLabs\Library\Field
{
	public $type = 'LoadLanguage';

	public function loadLanguage($extension, $admin = 1)
	{
		if ( ! $extension)
		{
			return;
		}

		RL_Language::load($extension, $admin ? JPATH_ADMINISTRATOR : JPATH_SITE);
	}

	protected function getLabel()
	{
		return '';
	}

>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
	protected function getInput()
	{
		$extension = $this->get('extension');
		$admin     = $this->get('admin', 1);

		self::loadLanguage($extension, $admin);

		return '';
	}
<<<<<<< HEAD

	public function loadLanguage($extension, $admin = 1)
	{
		if ( ! $extension)
		{
			return;
		}

		RL_Language::load($extension, $admin ? JPATH_ADMINISTRATOR : JPATH_SITE);
	}

	protected function getLabel()
	{
		return '';
	}
=======
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
}
