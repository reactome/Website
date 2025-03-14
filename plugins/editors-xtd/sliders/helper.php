<?php
/**
 * @package         Sliders
 * @version         8.4.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            https://regularlabs.com
 * @copyright       Copyright © 2023 Regular Labs All Rights Reserved
 * @license         GNU General Public License version 2 or later
 */

defined('_JEXEC') or die;

use Joomla\CMS\Language\Text as JText;
use Joomla\CMS\Object\CMSObject as JObject;
use RegularLabs\Library\Document as RL_Document;
use RegularLabs\Library\EditorButtonHelper as RL_EditorButtonHelper;
use RegularLabs\Library\RegEx as RL_RegEx;

/**
 ** Plugin that places the button
 */
class PlgButtonSlidersHelper extends RL_EditorButtonHelper
{

    /**
     * Display the button
     *
     * @param string $editor_name
     *
     * @return JObject|null A button object
     */
    public function render($editor_name)
    {
        RL_Document::loadEditorButtonDependencies();

        if ($this->params->button_use_simple_button)
        {
            return $this->renderSimpleButton($editor_name);
        }

        return $this->renderPopupButton($editor_name);
    }

    private function getCustomText()
    {
        $text = trim($this->params->button_custom_code);
        $text = str_replace(["\r", "\n"], ['', '</p>\n<p>'], trim($text)) . '</p>';
        $text = RL_RegEx::replace('^(.*?)</p>', '\1', $text);
        $text = str_replace(
            ['{slider ', '{/sliders}'],
            ['{' . $this->params->tag_open . $this->params->tag_delimiter, '{/' . $this->params->tag_close . '}']
            , trim($text)
        );

        return $text;
    }

    private function getDefaultText()
    {
        return
            '{' . $this->params->tag_open . $this->params->tag_delimiter . JText::_('SLD_TITLE') . ' 1}\n' .
            '<p>[:SELECTION:]</p>\n' .
            '<p>{' . $this->params->tag_open . $this->params->tag_delimiter . JText::_('SLD_TITLE') . ' 2}</p>\n' .
            '<p>' . JText::_('SLD_TEXT') . '</p>\n' .
            '<p>{/' . $this->params->tag_close . '}</p>';
    }

    private function getExampleText()
    {
        switch (true)
        {
            case ($this->params->button_use_custom_code && $this->params->button_custom_code):
                return $this->getCustomText();
            default:
                return $this->getDefaultText();
        }
    }

    private function renderSimpleButton($editor_name)
    {
        $this->params->tag_open      = RL_RegEx::replace('[^a-z0-9-_]', '', $this->params->tag_open);
        $this->params->tag_close     = RL_RegEx::replace('[^a-z0-9-_]', '', $this->params->tag_close);
        $this->params->tag_delimiter = ($this->params->tag_delimiter == '=') ? '=' : ' ';

        $text = $this->getExampleText();
        $text = str_replace('\\\\n', '\\n', addslashes($text));
        $text = str_replace('{', '{\'+\'', $text);

        $js = "
            function insertSliders(editor) {
                selection = RegularLabsScripts.getEditorSelection(editor);
                selection = selection ? selection : '" . JText::_('SLD_TEXT', true) . "';

                text = '" . $text . "';
                text = text.replace('[:SELECTION:]', selection);

                jInsertEditorText(text, editor);
            }
        ";
        RL_Document::scriptDeclaration($js);

        $button = new JObject;

        $button->modal   = false;
        $button->class   = 'btn';
        $button->link    = '#';
        $button->onclick = 'insertSliders(\'' . $editor_name . '\');return false;';
        $button->text    = $this->getButtonText();
        $button->name    = $this->getIcon();

        return $button;
    }
}
