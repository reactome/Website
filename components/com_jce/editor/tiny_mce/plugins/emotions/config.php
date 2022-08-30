<?php

/**
<<<<<<< HEAD:components/com_jce/editor/tiny_mce/plugins/emotions/config.php
 * @copyright 	Copyright (c) 2009-2022 Ryan Demmer. All rights reserved
=======
 * @copyright 	Copyright (c) 2009-2021 Ryan Demmer. All rights reserved
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090:components/com_jce/editor/tiny_mce/plugins/emotions/classes/config.php
 * @license   	GNU/GPL 2 or later - http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * JCE is free software. This version may have been modified pursuant
 * to the GNU General Public License, and as distributed it includes or
 * is derivative of works licensed under the GNU General Public License or
 * other free or open source software licenses
 */
class WFEmotionsPluginConfig
{
    public static function getConfig(&$settings)
    {
        // Get JContentEditor instance
        $wf = WFApplication::getInstance();

        $settings['emotions_smilies'] = $wf->getParam('emotions.smilies');
        $settings['emotions_url'] = $wf->getParam('emotions.url');
    }
}
