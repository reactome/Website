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

namespace RegularLabs\Plugin\System\Modals;

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;
use Joomla\CMS\HTML\HTMLHelper as JHtml;
use Joomla\CMS\Language\Text as JText;
use Joomla\CMS\Router\Route as JRoute;
use RegularLabs\Library\Document as RL_Document;
use RegularLabs\Library\RegEx as RL_RegEx;

class Document
{
	public static function addHeadStuff()
	{
		// do not load scripts/styles on feeds or print pages
		if (RL_Document::isFeed() || JFactory::getApplication()->input->getInt('print', 0))
		{
			return;
		}

		$params = Params::get();

		if (JFactory::getApplication()->input->getInt('ml', 0) && $params->add_redirect)
		{
			self::addRedirectScript();

			return;
		}

		if ($params->load_jquery)
		{
			JHtml::_('jquery.framework');
		}

		$defaults             = self::getDefaults();
		$defaults['current']  = JText::sprintf('MDL_MODALTXT_CURRENT', '{current}', '{total}');
		$defaults['previous'] = JText::_('MDL_MODALTXT_PREVIOUS');
		$defaults['next']     = JText::_('MDL_MODALTXT_NEXT');
		$defaults['close']    = JText::_('MDL_MODALTXT_CLOSE');
		$defaults['xhrError'] = JText::_('MDL_MODALTXT_XHRERROR');
		$defaults['imgError'] = JText::_('MDL_MODALTXT_IMGERROR');

		$options = [
			'class'                        => $params->class ?: 'modals',
			'defaults'                     => $defaults,
			'auto_correct_size'            => (int) $params->auto_correct_size,
			'auto_correct_size_delay'      => (int) $params->auto_correct_size_delay,
		];

		RL_Document::scriptOptions($options, 'Modals');

		JHtml::script('modals/jquery.touchSwipe.min.js', false, true);
		RL_Document::script('modals/jquery.modals.min.js', ($params->media_versioning ? '11.6.2' : ''));
		RL_Document::script('modals/script.min.js', ($params->media_versioning ? '11.6.2' : ''));

		if ($params->load_stylesheet)
		{
			RL_Document::style('modals/' . $params->style . '.min.css', ($params->media_versioning ? '11.6.2' : ''));
		}
	}

	public static function removeHeadStuff(&$html)
	{
		// Don't remove if modals class is found
		if (RL_RegEx::match('class="[^"]*modal_link', $html))
		{
			return;
		}

		// remove style and script if no items are found
		RL_Document::removeScriptsStyles($html, 'Modals');
		RL_Document::removeScriptsOptions($html, 'Modals');
	}

	public static function addPrint($url)
	{
		$url = explode('#', $url, 2);

		$url[0] .= (strpos($url[0], '?') === false) ? '?print=1' : '&amp;print=1';

		$url = implode('#', $url);

		return $url;
	}

	public static function addUrlAttributes($url, $iframe = false, $fullpage = false, $print = false)
	{
		$url = explode('#', $url, 2);

		if (substr($url[0], 0, 4) != 'http'
			&& strpos($url[0], 'index.php') === 0
			&& strpos($url[0], '/') === false
		)
		{
			$url[0] = JRoute::_($url[0]);
		}

		$url[0] = self::setUrlAttribute($url[0], 'ml');

		if ($iframe)
		{
			$url[0] = self::setUrlAttribute($url[0], 'iframe');
		}

		if ($fullpage)
		{
			$url[0] = self::setUrlAttribute($url[0], 'fullpage');
		}

		if ($print)
		{
			$url[0] = self::setUrlAttribute($url[0], 'print');
		}

		$url = implode('#', $url);

		return $url;
	}

	public static function setUrlAttribute($url, $key)
	{
		if (strpos($url, $key . '=1') !== false)
		{
			return $url;
		}

		return $url
			. (strpos($url, '?') === false ? '?' : '&amp;')
			. $key . '=1';
	}

	public static function setTemplate()
	{
		$params = Params::get();

		JFactory::getApplication()->input->set('tmpl', JFactory::getApplication()->input->getWord('tmpl', $params->tmpl));
	}

	private static function addRedirectScript()
	{
		// Add redirect script
		$script =
			";if( parent.location.href === window.location.href ) {
				loc = window.location.href.replace(/(\?|&)ml=1(&iframe=1(&fullpage=1)?)?(&|$)/, '$1');
				loc = loc.replace(/(\?|&)$/, '');
				if(parent.location.href !== loc) {
					parent.location.href = loc;
				}
			}";

		if (JFactory::getApplication()->input->get('iframe'))
		{
			RL_Document::scriptDeclaration($script);

			return;
		}

		if ( ! $buffer = RL_Document::getBuffer())
		{
			return;
		}

		$buffer =
			'<script type="text/javascript">' . $script . '</script>'
			. $buffer;

		RL_Document::setBuffer($buffer);
	}

	private static function getDefaults()
	{
		$params = Params::get();

		$keyvals = [
			'opacity'        => 0.9,
			'width'          => '',
			'height'         => '',
			'initialWidth'   => 600,
			'initialHeight'  => 450,
			'maxWidth'       => false,
			'maxHeight'      => false,
			'retinaImage'    => false,
			'retinaUrl'      => false,
			'retinaSuffix'   => '@2x.$1',
		];

		$defaults = [];

		foreach ($keyvals as $key => $default)
		{
			$param_key = strtolower($key);

			if ( ! isset($params->{$param_key}) || $params->{$param_key} == $default)
			{
				continue;
			}

			$val = $params->{$param_key};

			$defaults[$key] = $val;
		}

		return $defaults;
	}
}
