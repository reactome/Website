<?php
/**
 * @package         Sliders
 * @version         8.2.4
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://regularlabs.com
 * @copyright       Copyright © 2022 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Plugin\System\Sliders;

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;
use Joomla\CMS\HTML\HTMLHelper as JHtml;
use RegularLabs\Library\Document as RL_Document;

class Document
{
    public static function loadStylesAndScripts()
    {
        // do not load scripts/styles on feeds or print pages
        if (RL_Document::isFeed() || JFactory::getApplication()->input->getInt('print', 0))
        {
            return;
        }

        $params = Params::get();

        if ( ! $params->load_bootstrap_framework && $params->load_jquery)
        {
            JHtml::_('jquery.framework');
        }

        if ($params->load_bootstrap_framework)
        {
            JHtml::_('bootstrap.framework');
        }


        $options = [
            'use_hash'       => (int) $params->use_hash,
            'reload_iframes' => (int) $params->reload_iframes,
            'init_timeout'   => (int) $params->init_timeout,
            'urlscroll'      => 0,
        ];

        RL_Document::scriptOptions($options, 'Sliders');

        RL_Document::script('sliders/script.min.js', ($params->media_versioning ? '8.2.4' : ''), [], [], $params->load_jquery);

        if ($params->load_stylesheet)
        {
            // Load this declaration as soon as possible, to prevent delay in content showing
            RL_Document::styleDeclaration(
                '.rl_sliders.accordion > .accordion-group > .accordion-body > .accordion-inner[hidden] {'
                . 'display: block;'
                . '}',
                'Sliders'
            );
            RL_Document::style('sliders/style.min.css', ($params->media_versioning ? '8.2.4' : ''));
        }

    }

    public static function removeHeadStuff(&$html)
    {
        // Don't remove if sliders id is found
        if (strpos($html, 'id="set-rl_sliders') !== false)
        {
            return;
        }

        // remove style and script if no items are found
        RL_Document::removeScriptsStyles($html, 'Sliders');
        RL_Document::removeScriptsOptions($html, 'Sliders');
    }
}
