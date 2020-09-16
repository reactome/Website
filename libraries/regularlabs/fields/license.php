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

use RegularLabs\Library\License as RL_License;

if ( ! is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
	return;
}

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';

class JFormFieldRL_License extends \RegularLabs\Library\Field
{
	public $type = 'License';

	protected function getLabel()
	{
		return '';
	}

	protected function getInput()
	{
		$extension = $this->get('extension');

		if ( ! strlen($extension))
		{
			return '';
		}

		return '</div><div>' . RL_License::getMessage($extension, true);
	}
}
