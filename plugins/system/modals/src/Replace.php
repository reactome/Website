<?php
/**
 * @package         Modals
 * @version         11.7.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2020 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Plugin\System\Modals;

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;
use RegularLabs\Library\File as RL_File;
use RegularLabs\Library\Html as RL_Html;
use RegularLabs\Library\Protect as RL_Protect;
use RegularLabs\Library\RegEx as RL_RegEx;
use RegularLabs\Library\StringHelper as RL_String;

class Replace
{
	public static function replaceTags(&$string, $area = 'article', $context = '')
	{
		if ( ! is_string($string) || $string == '')
		{
			return false;
		}

		// Check if tags are in the text snippet used for the search component
		if (strpos($context, 'com_search.') === 0)
		{
			$limit = explode('.', $context, 2);
			$limit = (int) array_pop($limit);

			$string_check = substr($string, 0, $limit);

			if ( ! RL_String::contains($string_check, Params::getTags(true)))
			{
				return false;
			}
		}

		$params = Params::get();

		RL_Protect::removeFromHtmlTagAttributes(
			$string,
			[
				$params->tag,
			]
		);

		// allow in component?
		if (RL_Protect::isRestrictedComponent(isset($params->disabled_components) ? $params->disabled_components : [], $area))
		{

			Protect::_($string);

			$regex = Params::getRegex();

			$string = RL_RegEx::replace($regex, '\4', $string);

			Clean::cleanFinalHtmlOutput($string);

			RL_Protect::unprotect($string);

			return true;
		}

		Protect::_($string);

		// Handle content inside the iframed modal
		if (JFactory::getApplication()->input->getInt('ml', 0) && JFactory::getApplication()->input->getInt('iframe', 0))
		{
			self::replaceInsideModal($string, $area);

			Clean::cleanFinalHtmlOutput($string);

			RL_Protect::unprotect($string);

			return true;
		}

		self::replaceLinks($string);

		// tag syntax inside links
		self::replaceTagSyntaxInsideLinks($string);

		list($start_tags, $end_tags) = Params::getTags();

		list($pre_string, $string, $post_string) = RL_Html::getContentContainingSearches(
			$string,
			$start_tags,
			$end_tags
		);

		// tag syntax
		self::replaceTagSyntax($string, $area);

		$string = $pre_string . $string . $post_string;


		Clean::cleanFinalHtmlOutput($string);

		RL_Protect::unprotect($string);

		return true;
	}

	// add ml to internal links
	private static function replaceInsideModal(&$string, $area = '')
	{
		self::replaceTagSyntax($string, $area);

		$regex = Params::getRegex('link');

		RL_RegEx::matchAll($regex, $string, $matches);

		if (empty($matches))
		{
			return;
		}

		$params = Params::get();

		foreach ($matches as $match)
		{
			// get the link attributes
			$attributes = Link::getAttributeList($match[0]);

			// ignore if the link has no href or is an anchor or has a target
			if (empty($attributes->href) || $attributes->href[0] == '#' || isset($attributes->target))
			{
				continue;
			}

			// ignore if link is external or an image
			if (RL_File::isExternal($attributes->href)
				|| RL_File::isMedia($attributes->href, $params->mediafiles)
				|| RL_File::isVideo($attributes->href)
			)
			{
				continue;
			}

			$href = Document::addUrlAttributes($attributes->href, true);

			self::replaceOnce('href="' . $href . '"', 'href="' . $attributes->href . '"', $string);
		}
	}

	private static function replaceTagSyntaxInsideLinks(&$string)
	{
		$regex = Params::getRegex('inlink');

		RL_RegEx::matchAll($regex, $string, $matches);

		if (empty($matches))
		{
			return;
		}

		$params = Params::get();

		foreach ($matches as $match)
		{
			$content = trim($match['image_pre'] . $match['text'] . $match['image_post']);

			list($link, $extra) = Link::get($match['data'], $match['link_start'], $content);
			$link = $link ? $link . '</a>' : '';

			if ($params->place_comments)
			{
				$link = Protect::wrapInCommentTags($link);
			}

			self::replaceOnce($match[0], $link, $string, $extra);
		}
	}

	private static function replaceTagSyntax(&$string, $area = '')
	{
		$regex = Params::getRegex();

		RL_RegEx::matchAll($regex, $string, $matches);

		if (empty($matches))
		{
			return;
		}

		$params = Params::get();

		foreach ($matches as $match)
		{
			$tags = RL_Html::cleanSurroundingTags(
				[
					'end_pre'    => $match['end_pre'],
					'start_post' => $match['start_post'],
				]
			);
			$tags = RL_Html::cleanSurroundingTags(
				[
					'end_pre'    => $tags['end_pre'],
					'pre'        => $match['pre'],
					'post'       => $match['post'],
					'start_post' => $tags['start_post'],
				],
				['p']
			);

			list($link, $extra) = Link::get($match['data'], '', trim($tags['pre'] . $match['text'] . $tags['post']));

			$link = $link ? $link . '</a>' : '';

			if ($params->place_comments)
			{
				$link = Protect::wrapInCommentTags($link);
			}

			$html = $match['start_pre'] . $tags['start_post']
				. $link
				. $tags['end_pre'] . $match['end_post'];

			self::replaceOnce($match[0], $html, $string, $extra);
		}
	}

	private static function replaceLinks(&$string)
	{
		$params = Params::get();

		if (
			(
				empty($params->classnames)
				&& ! RL_RegEx::match('class\s*=\s*(?:"[^"]*|\'[^\']*)(?:' . implode('|', $params->classnames) . ')', $string)
			)
		)
		{
			return;
		}

		$regex = Params::getRegex('link');

		RL_RegEx::matchAll($regex, $string, $matches);

		if (empty($matches))
		{
			return;
		}

		foreach ($matches as $match)
		{
			self::replaceLink($string, $match);
		}
	}

	private static function replaceLink(&$string, $match)
	{
		// get the link attributes
		$attributes = Link::getAttributeList($match[0]);

		if ( ! Pass::passLinkChecks($attributes))
		{
			return;
		}

		$params = Params::get();

		$data       = [];
		$isexternal = RL_File::isExternal($attributes->href);
		$ismedia    = RL_File::isMedia($attributes->href, $params->mediafiles);
		$iframe     = File::isIframe($attributes->href, $data);

		// Find data-modal attributes set in html tag
		foreach ($attributes as $key => $value)
		{
			if (strpos($key, 'data-modal-') !== 0)
			{
				continue;
			}


			// Remove the attribute from the attributes object
			unset($attributes->{$key});
		}

		// Force/overrule certain data values
		if ($iframe || ($isexternal && ! $ismedia))
		{
			// use iframe mode for external urls
			$data['iframe'] = 'true';
			Data::setDataWidthHeight($data, $isexternal);
		}

		$params = Params::get();

		$attributes->class = ! empty($attributes->class) ? $attributes->class . ' ' . $params->class : $params->class;
		$link              = Link::build($attributes, $data);

		if ($params->place_comments)
		{
			$link = Protect::wrapInCommentTags($link);
		}

		self::replaceOnce($match[0], $link, $string);
	}


	private static function replaceOnce($search, $replace, &$string, $extra = '')
	{
		if ( ! $extra
			|| ! RL_RegEx::match(RL_RegEx::quote($search) . '(?<post>.*?</(?:div|p)>)', $string, $match)
		)
		{
			$string = RL_String::replaceOnce($search, $replace . $extra, $string);

			return;
		}

		// Place the extra div stuff behind the first ending div/p tag
		$string = RL_String::replaceOnce(
			$match[0],
			$replace . $match['post'] . $extra,
			$string
		);
	}
}
