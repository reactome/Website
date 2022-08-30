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

use Joomla\CMS\Language\Text as JText;

require_once __DIR__ . '/header.php';

class JFormFieldRL_Header_Library extends JFormFieldRL_Header
{
	protected function getInput()
	{
		$extensions = [
			'Add to Menu',
			'Advanced Module Manager',
			'Advanced Template Manager',
			'Articles Anywhere',
			'Articles Field',
			'Better Preview',
			'Better Trash',
			'Cache Cleaner',
			'CDN for Joomla!',
			'Components Anywhere',
			'Conditional Content',
			'Content Templater',
			'DB Replacer',
			'Dummy Content',
			'Email Protector',
			'GeoIP',
			'IP Login',
			'Keyboard Shortcuts',
			'Modals',
			'Modules Anywhere',
			'Quick Index',
			'Regular Labs Extension Manager',
			'ReReplacer',
			'Simple User Notes',
			'Sliders',
			'Snippets',
			'Sourcerer',
			'Tabs',
			'Tooltips',
			'What? Nothing!',
		];

		$list = '<ul><li>' . implode('</li><li>', $extensions) . '</li></ul>';

		$attributes = $this->element->attributes();

		$warning = '';
		if (isset($attributes['warning']))
		{
			$warning = '<div class="alert alert-danger">' . JText::_($attributes['warning']) . '</div>';
		}

		$this->element->attributes()['description'] = JText::sprintf($attributes['description'], $warning, $list);

		return parent::getInput();
	}
}
