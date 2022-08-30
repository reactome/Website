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

use Joomla\CMS\HTML\HTMLHelper as JHtml;
use Joomla\Registry\Registry;
<<<<<<< HEAD
use RegularLabs\Library\Field;
=======
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090

if ( ! is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
	return;
}

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';

<<<<<<< HEAD
class JFormFieldRL_Languages extends Field
=======
class JFormFieldRL_Languages extends \RegularLabs\Library\Field
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
{
	public $type = 'Languages';

	public function getAjaxRaw(Registry $attributes)
	{
		$name     = $attributes->get('name', $this->type);
		$id       = $attributes->get('id', strtolower($name));
		$value    = $attributes->get('value', []);
		$size     = $attributes->get('size');
		$multiple = $attributes->get('multiple');

		$options = $this->getLanguages($value);

		return $this->selectListSimple($options, $name, $value, $id, $size, $multiple);
	}

	public function getLanguages($value)
	{
		$langs = JHtml::_('contentlanguage.existing');

		if ( ! is_array($value))
		{
			$value = [$value];
		}

		$options = [];

		foreach ($langs as $lang)
		{
			if (empty($lang->value))
			{
				continue;
			}

			$options[] = (object) [
				'value'    => $lang->value,
				'text'     => $lang->text . ' [' . $lang->value . ']',
				'selected' => in_array($lang->value, $value),
			];
		}

		return $options;
	}

	protected function getInput()
	{
		$size     = (int) $this->get('size');
		$multiple = $this->get('multiple');

		return $this->selectListSimpleAjax(
			$this->type, $this->name, $this->value, $this->id,
			compact('size', 'multiple')
		);
	}
}
