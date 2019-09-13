<?php
/**
 * @package         Sourcerer
 * @version         8.2.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2019 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Plugin\EditorButton\Sourcerer\Popup;

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;
use Joomla\CMS\Uri\Uri as JUri;
use RegularLabs\Library\Document as RL_Document;
use RegularLabs\Library\RegEx as RL_RegEx;

class Popup
	extends \RegularLabs\Library\EditorButtonPopup
{
	var $require_core_auth = false;

	public function loadScripts()
	{
		JFactory::getDocument()->addScript('//code.jquery.com/ui/1.9.2/jquery-ui.js');

		// Tag character start and end
		list($tag_start, $tag_end) = explode('.', $this->params->tag_characters);

		$editor = JFactory::getApplication()->input->getString('name', 'text');
		// Remove any dangerous character to prevent cross site scripting
		$editor = RL_RegEx::replace('[\'\";\s]', '', $editor);

		$script = "
			var sourcerer_syntax_word = '" . $this->params->syntax_word . "';
			var sourcerer_tag_characters = ['" . $tag_start . "', '" . $tag_end . "'];
			var sourcerer_editorname = '" . $editor . "';
			var sourcerer_root = '" . JUri::root(true) . "';
		";
		RL_Document::scriptDeclaration($script);

		RL_Document::script('sourcerer/script.min.js', '8.2.0');
	}

	public function loadStyles()
	{
		JFactory::getDocument()->addStyleSheet('//code.jquery.com/ui/1.9.2/themes/smoothness/jquery-ui.css');

		RL_Document::style('sourcerer/popup.min.css', '8.2.0');
	}
}

(new Popup('sourcerer'))->render();
