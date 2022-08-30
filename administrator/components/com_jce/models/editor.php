<?php

/**
<<<<<<< HEAD
 * @copyright     Copyright (c) 2009-2022 Ryan Demmer. All rights reserved
=======
 * @copyright     Copyright (c) 2009-2021 Ryan Demmer. All rights reserved
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license       GNU/GPL 2 or later - http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * JCE is free software. This version may have been modified pursuant
 * to the GNU General Public License, and as distributed it includes or
 * is derivative of works licensed under the GNU General Public License or
 * other free or open source software licenses
 */
defined('JPATH_PLATFORM') or die;

class WFModelEditor extends JObject
{
    private static $editor;

    public function buildEditor()
    {
        if (!isset(self::$editor)) {
            self::$editor = new WFEditor();
        }

        $settings = self::$editor->getEditorSettings();

        return self::$editor->render($settings);
    }

    public function getEditorSettings()
<<<<<<< HEAD
    {
        if (!isset(self::$editor)) {
            self::$editor = new WFEditor();
        }

        return self::$editor->getEditorSettings();
    }

    public function render($settings = array())
=======
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
    {
        if (!isset(self::$editor)) {
            self::$editor = new WFEditor();
        }

<<<<<<< HEAD
        if (empty($settings)) {
            $settings = self::$editor->getEditorSettings();
        }

        self::$editor->render($settings);

        $document = JFactory::getDocument();

        foreach (self::$editor->getScripts() as $script) {
            $document->addScript($script, array('version' => 'auto'), array('defer' => 'defer'));
        }

        foreach (self::$editor->getStyleSheets() as $style) {
            $document->addStylesheet($style, array('version' => 'auto'));
        }

        $script = "document.addEventListener('DOMContentLoaded',function handler(){" . implode("", self::$editor->getScriptDeclaration()) . ";this.removeEventListener('DOMContentLoaded',handler);});";

        $document->addScriptDeclaration($script);
=======
        return self::$editor->getEditorSettings();
    }

    public function render($settings = array())
    {
        if (!isset(self::$editor)) {
            self::$editor = new WFEditor();
        }

        if (empty($settings)) {
            $settings = self::$editor->getEditorSettings();
        }

        self::$editor->render($settings);

        $document = JFactory::getDocument();

        foreach (self::$editor->getScripts() as $script) {
            $document->addScriptVersion($script);
        }

        foreach (self::$editor->getStyleSheets() as $style) {
            $document->addStylesheetVersion($style);
        }

        $document->addScriptDeclaration(implode("\n", self::$editor->getScriptDeclaration()));
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
    }
}
