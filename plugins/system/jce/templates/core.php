<?php

/**
 * @copyright   Copyright (C) 2021 Ryan Demmer. All rights reserved
 * @license     GNU General Public License version 2 or later
 */
defined('JPATH_BASE') or die;

class WfTemplateCore extends JPlugin
{
    public function onWfGetTemplateStylesheets(&$files, $template)
    {                        
        // already processed by a framework
        if (!empty($files)) {
            return false;
        }
<<<<<<< HEAD

        // search for template.css file using JPath
        $file = JPath::find(array(
            JPATH_SITE . '/templates/' . $template->name . '/css',
            JPATH_SITE . '/media/templates/site/' . $template->name . '/css'
        ), 'template.css');
                
        if (!$file) {
            return false;
        }

        // make relative
        $file = str_replace(JPATH_SITE, '', $file);
        
        // remove leading slash
        $file = trim($file, '/');

        $files[] = $file;
=======
        
        // Joomla! 1.5 standard
        $file = 'template.css';
        $css = array();

        $path = JPATH_SITE . '/templates/' . $template->name . '/css';

        if (!is_dir($path)) {
            return false;
        }

        $css = JFolder::files($path, '(base|core|template|template_css)\.(css|less)$', false, true);

        if (!empty($css)) {
            // use the first result
            $file = $css[0];
        }

        // check for php version, eg: template.css.php
        if (is_file($path . '/' . $file . '.php')) {
            $file .= '.php';
        }

        // get file name only
        $file = basename($file);

        // check for default css file
        if (is_file($path . '/' . $file)) {
            $files[] = 'templates/' . $template->name . '/css/' . $file;
        }
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
    }
}