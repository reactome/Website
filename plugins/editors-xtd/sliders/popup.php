<?php
/**
 * @package         Sliders
 * @version         7.7.8
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2019 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Plugin\EditorButton\Sliders\Popup;

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;
use Joomla\CMS\Language\Text as JText;
use RegularLabs\Library\Document as RL_Document;
use RegularLabs\Library\RegEx as RL_RegEx;

class Popup
	extends \RegularLabs\Library\EditorButtonPopup
{
	var $require_core_auth = false;

	public function loadScripts()
	{
		// Tag character start and end
		list($tag_start, $tag_end) = explode('.', $this->params->tag_characters);

		$editor = JFactory::getApplication()->input->getString('name', 'text');
		// Remove any dangerous character to prevent cross site scripting
		$editor = RL_RegEx::replace('[\'\";\s]', '', $editor);

		$script = "
			var sliders_tag_open = '" . RL_RegEx::replace('[^a-z0-9-_]', '', $this->params->tag_open) . "';
			var sliders_tag_close = '" . RL_RegEx::replace('[^a-z0-9-_]', '', $this->params->tag_close) . "';
			var sliders_tag_delimiter = '" . (($this->params->tag_delimiter == '=') ? '=' : ' ') . "';
			var sliders_tag_characters = ['" . $tag_start . "', '" . $tag_end . "'];
			var sliders_editorname = '" . $editor . "';
			var sliders_content_placeholder = '" . JText::_('SLD_TEXT', true) . "';
			var sliders_error_empty_title = '" . JText::_('SLD_ERROR_EMPTY_TITLE', true) . "';
			var sliders_max_count = " . (int) $this->params->button_max_count . ";
		";
		RL_Document::scriptDeclaration($script);

		RL_Document::script('sliders/popup.min.js', '7.7.8');
	}

	public function loadStyles()
	{
		RL_Document::style('sliders/popup.min.css', '7.7.8');
	}
}

(new Popup('sliders'))->render();
