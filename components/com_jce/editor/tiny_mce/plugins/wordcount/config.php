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
class WFWordcountPluginConfig
{
    public static function getConfig(&$settings)
    {
        $wf = WFApplication::getInstance();
        $settings['wordcount_limit'] = $wf->getParam('editor.wordcount_limit', 0, 0);
        $settings['wordcount_alert'] = $wf->getParam('editor.wordcount_alert', 0, 0);
    }
}
