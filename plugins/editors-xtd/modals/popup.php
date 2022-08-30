<?php
/**
 * @package         Modals
<<<<<<< HEAD
 * @version         11.10.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://regularlabs.com
 * @copyright       Copyright © 2022 Regular Labs All Rights Reserved
=======
 * @version         11.9.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://regularlabs.com
 * @copyright       Copyright © 2021 Regular Labs All Rights Reserved
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Plugin\EditorButton\Modals\Popup;

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;
use RegularLabs\Library\Document as RL_Document;
use RegularLabs\Library\EditorButtonPopup as RL_EditorButtonPopup;
use RegularLabs\Library\RegEx as RL_RegEx;

class Popup extends RL_EditorButtonPopup
{
	var $require_core_auth = false;

	public function loadScripts()
	{
		// Tag character start and end
		[$tag_start, $tag_end] = explode('.', $this->params->tag_characters);

		$editor = JFactory::getApplication()->input->getString('name', 'text');
		// Remove any dangerous character to prevent cross site scripting
		$editor = RL_RegEx::replace('[\'\";\s]', '', $editor);

		$script = "
			var modals_tag = '" . RL_RegEx::replace('[^a-z0-9-_]', '', $this->params->tag) . "';
			var modals_tag_characters = ['" . $tag_start . "', '" . $tag_end . "'];
			var modals_editorname = '" . $editor . "';
		";
		RL_Document::scriptDeclaration($script);

<<<<<<< HEAD
		RL_Document::script('modals/popup.min.js', '11.10.0');
=======
		RL_Document::script('modals/popup.min.js', '11.9.0');
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
	}

	public function loadStyles()
	{
<<<<<<< HEAD
		RL_Document::style('modals/popup.min.css', '11.10.0');
=======
		RL_Document::style('modals/popup.min.css', '11.9.0');
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
	}
}

(new Popup('modals'))->render();
