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
use RegularLabs\Library\ShowOn as RL_ShowOn;

if ( ! is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
	return;
}

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';

<<<<<<< HEAD
class JFormFieldRL_ShowOn extends Field
{
	public $type = 'ShowOn';

=======
class JFormFieldRL_ShowOn extends \RegularLabs\Library\Field
{
	public $type = 'ShowOn';

	protected function getLabel()
	{
		return '';
	}

>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
	protected function getInput()
	{
		$value       = (string) $this->get('value');
		$class       = $this->get('class', '');
		$formControl = $this->get('form', $this->formControl);
		$formControl = $formControl == 'root' ? '' : $formControl;

		if ( ! $value)
		{
			return RL_ShowOn::close();
		}

		return '</div></div>'
			. RL_ShowOn::open($value, $formControl, $this->group, $class)
			. '<div><div>';
	}
<<<<<<< HEAD

	protected function getLabel()
	{
		return '';
	}
=======
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
}
