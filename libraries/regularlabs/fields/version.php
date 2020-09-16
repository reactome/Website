<?php
/**
 * @package         Regular Labs Library
 * @version         20.9.11663
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2020 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;
use RegularLabs\Library\Version as RL_Version;

if ( ! is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
	return;
}

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';

class JFormFieldRL_Version extends \RegularLabs\Library\Field
{
	public $type = 'Version';

	protected function getLabel()
	{
		return '';
	}

	protected function getInput()
	{
		$extension = $this->get('extension');
		$xml       = $this->get('xml');

		if ( ! $xml && $this->form->getValue('element'))
		{
			if ($this->form->getValue('folder'))
			{
				$xml = 'plugins/' . $this->form->getValue('folder') . '/' . $this->form->getValue('element') . '/' . $this->form->getValue('element') . '.xml';
			}
			else
			{
				$xml = 'administrator/modules/' . $this->form->getValue('element') . '/' . $this->form->getValue('element') . '.xml';
			}
			if ( ! file_exists(JPATH_SITE . '/' . $xml))
			{
				return '';
			}
		}

		if ( ! strlen($extension) || ! strlen($xml))
		{
			return '';
		}

		$authorise = JFactory::getUser()->authorise('core.manage', 'com_installer');
		if ( ! $authorise)
		{
			return '';
		}

		return '</div><div class="hide">' . RL_Version::getMessage($extension);
	}
}
