<?php
/**
 * @package         Modals
 * @version         11.6.2
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2020 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;
use Joomla\CMS\Form\FormField as JFormField;
use Joomla\CMS\HTML\HTMLHelper as JHtml;
use Joomla\CMS\Language\Text as JText;
use Joomla\CMS\Session\Session as JSession;

/**
 * Supports a modal article picker.
 */
class JFormFieldModals_Article extends JFormField
{
	protected $type = 'Article';

	/**
	 * Method to get the field input markup.
	 *
	 * @return  string  The field input markup.
	 */
	protected function getInput()
	{
		$modalId    = 'ModalSelectArticle_' . $this->id;
		$functionId = 'Modals_SelectArticle_' . $this->id;

		JHtml::_('jquery.framework');
		JHtml::_('script', 'system/modal-fields.js', ['version' => 'auto', 'relative' => true]);

		JFactory::getDocument()->addScriptDeclaration("
				function " . $functionId . "(id, title, catid, object, url, language) {
					window.processModalSelect('Article', '" . $this->id . "', id + '::' + title, title, catid, object, url, language);
				}
				");

		$title = empty($title) ? JText::_('RL_SELECT_AN_ARTICLE') : htmlspecialchars($title, ENT_QUOTES, 'UTF-8');

		// The current article display field.
		$html = '<span class="input-append">';
		$html .= '<input class="input-medium" id="' . $this->id . '_name" type="text" value="' . $title . '" disabled="disabled" size="35" />';

		// Select article button
		$html .= '<a'
			. ' class="btn"'
			. ' id="' . $this->id . '_select"'
			. ' data-toggle="modal"'
			. ' role="button"'
			. ' href="#' . $modalId . '">'
			. '<span class="icon-file" aria-hidden="true"></span> ' . JText::_('RL_SELECT')
			. '</a>';

		// Clear article button
		$html .= '<a'
			. ' class="btn hidden"'
			. ' id="' . $this->id . '_clear"'
			. ' href="#"'
			. ' onclick="window.processModalParent(\'' . $this->id . '\'); return false;">'
			. '<span class="icon-remove" aria-hidden="true"></span>' . JText::_('JCLEAR')
			. '</a>';

		$html .= '</span>';

		// Setup variables for display.
		$urlSelect = 'index.php?option=com_content&amp;view=articles&amp;layout=modal&amp;tmpl=component'
			. '&amp;function=' . $functionId
			. '&amp;' . JSession::getFormToken() . '=1';

		// Select article modal
		$html .= JHtml::_(
			'bootstrap.renderModal',
			$modalId,
			[
				'title'      => JText::_('RL_SELECT_AN_ARTICLE'),
				'url'        => $urlSelect,
				'height'     => '400px',
				'width'      => '800px',
				'bodyHeight' => '70',
				'modalWidth' => '80',
				'footer'     => '<a role="button" class="btn" data-dismiss="modal" aria-hidden="true">' . JText::_('JLIB_HTML_BEHAVIOR_CLOSE') . '</a>',
			]
		);

		// Note: class='required' for client side validation.
		$class = $this->required ? ' class="required modal-value"' : '';

		$html .= '<input type="hidden" id="' . $this->id . '_id" ' . $class . ' data-required="' . (int) $this->required . '" name="' . $this->name
			. '" data-text="' . htmlspecialchars(JText::_('RL_SELECT_AN_ARTICLE', true), ENT_COMPAT, 'UTF-8') . '" value="" />';

		return $html;
	}

	/**
	 * Method to get the field label markup.
	 *
	 * @return  string  The field label markup.
	 */
	protected function getLabel()
	{
		return str_replace($this->id, $this->id . '_id', parent::getLabel());
	}
}
