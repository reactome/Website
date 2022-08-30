<?php
/**
 * @package         Sourcerer
<<<<<<< HEAD
 * @version         9.2.3
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://regularlabs.com
 * @copyright       Copyright © 2022 Regular Labs All Rights Reserved
=======
 * @version         8.5.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://regularlabs.com
 * @copyright       Copyright © 2021 Regular Labs All Rights Reserved
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Plugin\EditorButton\Sourcerer\Popup;

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;
use Joomla\CMS\Uri\Uri as JUri;
use RegularLabs\Library\Document as RL_Document;
use RegularLabs\Library\EditorButtonPopup as RL_EditorButtonPopup;
use RegularLabs\Library\RegEx as RL_RegEx;

class Popup extends RL_EditorButtonPopup
{
	var $require_core_auth = false;

	public function loadScripts()
	{
		JFactory::getDocument()->addScript('//code.jquery.com/ui/1.9.2/jquery-ui.js');

		// Tag character start and end
		[$tag_start, $tag_end] = explode('.', $this->params->tag_characters);

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

<<<<<<< HEAD
		RL_Document::script('sourcerer/script.min.js', '9.2.3');
=======
		RL_Document::script('sourcerer/script.min.js', '8.5.0');
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
	}

	public function loadStyles()
	{
		JFactory::getDocument()->addStyleSheet('//code.jquery.com/ui/1.9.2/themes/smoothness/jquery-ui.css');

<<<<<<< HEAD
		RL_Document::style('sourcerer/popup.min.css', '9.2.3');
=======
		RL_Document::style('sourcerer/popup.min.css', '8.5.0');
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
	}
}

(new Popup('sourcerer'))->render();
