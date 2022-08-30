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

use Joomla\CMS\Factory as JFactory;
use Joomla\CMS\Language\Text as JText;
<<<<<<< HEAD
use RegularLabs\Library\Field;
=======
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
use RegularLabs\Library\RegEx as RL_RegEx;

jimport('joomla.form.formfield');

if ( ! is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
	return;
}

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';

<<<<<<< HEAD
class JFormFieldRL_Dependency extends Field
=======
class JFormFieldRL_Dependency extends \RegularLabs\Library\Field
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
{
	public $type = 'Dependency';

	protected function getInput()
	{
		$file = $this->get('file');

		if ($file)
		{
			$label = $this->get('label', 'the main extension');

			RLFieldDependency::setMessage($file, $label);

			return '';
		}

		$path      = ($this->get('path') == 'site') ? '' : '/administrator';
		$label     = $this->get('label');
		$file      = $this->get('alias', $label);
		$file      = RL_RegEx::replace('[^a-z-]', '', strtolower($file));
		$extension = $this->get('extension');

		switch ($extension)
		{
			case 'com':
				$file = $path . '/components/com_' . $file . '/com_' . $file . '.xml';
				break;
			case 'mod':
				$file = $path . '/modules/mod_' . $file . '/mod_' . $file . '.xml';
				break;
			default:
				$file = '/plugins/' . str_replace('plg_', '', $extension) . '/' . $file . '.xml';
				break;
		}

		$label = JText::_($label) . ' (' . JText::_('RL_' . strtoupper($extension)) . ')';

		RLFieldDependency::setMessage($file, $label);

		return '';
	}

	protected function getLabel()
	{
		return '';
	}
}

class RLFieldDependency
{
	static function setMessage($file, $name)
	{
		jimport('joomla.filesystem.file');

		$file = str_replace('\\', '/', $file);
		$file = (strpos($file, '/administrator') === 0)
			? str_replace('/administrator', JPATH_ADMINISTRATOR, $file)
			: JPATH_SITE . '/' . $file;

		$file = str_replace('//', '/', $file);

		$file_alt = RL_RegEx::replace('(com|mod)_([a-z-_]+\.)', '\2', $file);

		if (file_exists($file) || file_exists($file_alt))
		{
			return;
		}

		$msg          = JText::sprintf('RL_THIS_EXTENSION_NEEDS_THE_MAIN_EXTENSION_TO_FUNCTION', JText::_($name));
		$messageQueue = JFactory::getApplication()->getMessageQueue();

		foreach ($messageQueue as $queue_message)
		{
			if ($queue_message['type'] == 'error' && $queue_message['message'] == $msg)
			{
				return;
			}
		}

		JFactory::getApplication()->enqueueMessage($msg, 'error');
	}
}
