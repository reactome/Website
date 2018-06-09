<?php
/**
 * @package         Modals
 * @version         9.12.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2018 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Plugin\EditorButton\Modals\Popup;

defined('_JEXEC') or die;

use JFactory;
use JHtml;
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

		JHtml::_('behavior.core');

		$script = "
			var modals_tag = '" . RL_RegEx::replace('[^a-z0-9-_]', '', $this->params->tag) . "';
			var modals_tag_characters = ['" . $tag_start . "', '" . $tag_end . "'];
			var modals_editorname = '" . JFactory::getApplication()->input->getString('name', 'text') . "';
		";
		RL_Document::scriptDeclaration($script);

		RL_Document::script('modals/popup.min.js', '9.12.0');
	}

	public function loadStyles()
	{
		RL_Document::style('modals/popup.min.css', '9.12.0');
	}
}

$class = new Popup('modals');
$class->render();
