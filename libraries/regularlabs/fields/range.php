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

if ( ! is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
	return;
}

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';

JFormHelper::loadFieldClass('range');

<<<<<<< HEAD
class JFormFieldRL_Range extends JFormFieldRange
=======
class JFormFieldRL_Range extends \JFormFieldRange
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
{
	protected $layout = 'range';

	protected function getInput()
	{
		$this->value = (float) ($this->value ?: $this->default);

		if ( ! empty($this->max))
		{
			$this->value = min($this->value, $this->max);
		}
		if ( ! empty($this->min))
		{
			$this->value = max($this->value, $this->min);
		}

		return parent::getInput();
	}

<<<<<<< HEAD
=======
	protected function getLayoutPaths()
	{
		$paths   = parent::getLayoutPaths();
		$paths[] = JPATH_LIBRARIES . '/regularlabs/layouts';

		return $paths;
	}

>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
	protected function getLayoutData()
	{
		$data = parent::getLayoutData();

		// Initialize some field attributes.
		$extraData = [
			'prepend' => (string) $this->element['prepend'] ?? '',
			'append'  => (string) $this->element['append'] ?? '',
		];

		return array_merge($data, $extraData);
	}
<<<<<<< HEAD

	protected function getLayoutPaths()
	{
		$paths   = parent::getLayoutPaths();
		$paths[] = JPATH_LIBRARIES . '/regularlabs/layouts';

		return $paths;
	}
=======
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
}
