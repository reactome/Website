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

use Joomla\CMS\Editor\Editor as JEditor;
use Joomla\CMS\Factory as JFactory;
use Joomla\CMS\Plugin\PluginHelper as JPluginHelper;
use RegularLabs\Library\Document as RL_Document;
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
class JFormFieldRL_CodeEditor extends Field
=======
class JFormFieldRL_CodeEditor extends \RegularLabs\Library\Field
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
{
	public $type = 'CodeEditor';

	protected function getInput()
	{
		$width  = $this->get('width', '100%');
		$height = $this->get('height', 400);
		$syntax = $this->get('syntax', 'html');
<<<<<<< HEAD
=======

		$this->value = htmlspecialchars(str_replace('\n', "\n", $this->value), ENT_COMPAT, 'UTF-8');
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090

		$editor_plugin = JPluginHelper::getPlugin('editors', 'codemirror');

		if (empty($editor_plugin))
		{
			return
				'<textarea name="' . $this->name . '" style="'
				. 'width:' . (strpos($width, '%') ? $width : $width . 'px') . ';'
				. 'height:' . (strpos($height, '%') ? $height : $height . 'px') . ';'
				. '" id="' . $this->id . '">' . $this->value . '</textarea>';
		}

		RL_Document::script('regularlabs/codemirror.min.js');
		RL_Document::stylesheet('regularlabs/codemirror.min.css');

		JFactory::getDocument()->addScriptDeclaration("
			jQuery(document).ready(function($) {
				RegularLabsCodeMirror.init('" . $this->id . "');
			});
		");

		JFactory::getDocument()->addStyleDeclaration("
			#rl_codemirror_" . $this->id . " .CodeMirror {
			    height: " . $height . "px;
			    min-height: " . min($height, '100') . "px;
			}
		");

		return '<div class="rl_codemirror" id="rl_codemirror_' . $this->id . '">'
			. JEditor::getInstance('codemirror')->display(
				$this->name, htmlentities($this->value),
				$width, $height,
				80, 10,
				false,
				$this->id, null, null,
<<<<<<< HEAD
				['markerGutter' => false, 'activeLine' => true, 'syntax' => $syntax]
=======
				['markerGutter' => false, 'activeLine' => true, 'syntax' => $syntax, 'class' => 'xxx']
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
			)
			. '</div>';
	}
}
