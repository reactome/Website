<?php
/**
 * @package         Tabs
 * @version         7.4.1
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2018 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Plugin\System\Tabs;

defined('_JEXEC') or die;

use JFactory;
use JRoute;
use JUri;
use RegularLabs\Library\Alias as RL_Alias;
use RegularLabs\Library\Html as RL_Html;
use RegularLabs\Library\HtmlTag as RL_HtmlTag;
use RegularLabs\Library\PluginTag as RL_PluginTag;
use RegularLabs\Library\Protect as RL_Protect;
use RegularLabs\Library\RegEx as RL_RegEx;
use RegularLabs\Library\StringHelper as RL_String;
use RegularLabs\Library\Title as RL_Title;
use RegularLabs\Library\Uri as RL_Uri;

class Replace
{
	static $context  = '';
	static $sets     = [];
	static $ids      = [];
	static $matches  = [];
	static $allitems = [];
	static $setcount = 0;

	public static function replaceTags(&$string, $area = 'article', $context = '')
	{
		if ( ! is_string($string) || $string == '')
		{
			return false;
		}

		self::$context = $context;

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

		// allow in component?
		if (RL_Protect::isRestrictedComponent(isset($params->disabled_components) ? $params->disabled_components : [], $area))
		{

			Protect::_($string);

			self::handlePrintPage($string);

			RL_Protect::unprotect($string);

			return true;
		}

		if ( ! RL_String::contains($string, Params::getTags(true)))
		{
			// Links with #tab-name or &tab=tab-name
			self::replaceLinks($string);

			return true;
		}

		Protect::_($string);

		list($start_tags, $end_tags) = Params::getTags();

		list($pre_string, $string, $post_string) = RL_Html::getContentContainingSearches(
			$string,
			$start_tags,
			$end_tags
		);

		if (JFactory::getApplication()->input->getInt('print', 0))
		{
			// Replace syntax with general html on print pages
			self::handlePrintPage($string);

			$string = $pre_string . $string . $post_string;

			RL_Protect::unprotect($string);

			return true;
		}

		$sets = self::getSets($string);
		self::initSets($sets);

		// Tag syntax: {tab ...}
		self::replaceSyntax($string, $sets);

		// Closing tag: {/tab}
		self::replaceClosingTag($string);

		// Links with #tab-name or &tab=tab-name
		self::replaceLinks($string);

		// Link tag {tablink ...}
		self::replaceLinkTag($string);

		$string = $pre_string . $string . $post_string;

		RL_Protect::unprotect($string);

		return true;
	}

	private static function handlePrintPage(&$string)
	{
		$params = Params::get();

		$sets = self::getSets($string);
		self::initSets($sets);

		$prefix = '';
		foreach ($sets as $items)
		{
			foreach ($items as $item)
			{
				$class = 'rl_tabs-print';

				if ($item->open)
				{
					$class .= ' active';
				}

				$replace = $prefix . '<div id="' . $item->id . '" class="' . $class . '">'
					. '<' . $params->title_tag . ' class="rl_tabs-title nn_tabs-title">'
					. '<a id="anchor-' . $item->id . '" class="anchor"></a>'
					. $item->title_full
					. '</' . $params->title_tag . '>';

				$string = RL_String::replaceOnce($item->orig, $replace, $string);
				$prefix = '</div>';
			}
		}

		$regex = Params::getRegex('end');

		RL_RegEx::matchAll($regex, $string, $matches);

		$replace = '</div>';
		foreach ($matches as $match)
		{
			$string  = RL_String::replaceOnce($match[0], $replace, $string);
			$replace = '';
		}

		$regex = Params::getRegex('link');

		RL_RegEx::matchAll($regex, $string, $matches);

		foreach ($matches as $match)
		{
			$href   = RL_Uri::get($match['id']);
			$link   = '<a href="' . $href . '">' . $match['text'] . '</a>';
			$string = RL_String::replaceOnce($match[0], $link, $string);
		}
	}

	public static function getSets(&$string, $only_basic_details = false)
	{
		$regex = Params::getRegex();

		RL_RegEx::matchAll($regex, $string, $matches);

		if (empty($matches))
		{
			return [];
		}

		self::$sets = [];
		$set_ids    = [];


		foreach ($matches as $match)
		{
			if (substr($match['tag'], 0, 1) == '/')
			{
				if (empty($set_ids))
				{
					continue;
				}

				$set_id = key($set_ids);

				array_pop($set_ids);

				if (empty($set_id))
				{
					continue;
				}

				self::$sets[$set_id][0]->ending = $match[0];

				continue;
			}

			end($set_ids);

			$item = self::getSetItem($match, $set_ids, $only_basic_details);

			if ($only_basic_details)
			{
				if ( ! isset(self::$sets['basic']))
				{
					self::$sets['basic'] = [];
				}

				self::$sets['basic'][] = $item;
				continue;
			}


			if ( ! isset(self::$sets[$item->set]))
			{
				self::$sets[$item->set] = [];
			}

			self::$sets[$item->set][] = $item;
		}


		return self::$sets;
	}

	private static function getSetItem($match, &$set_ids, $only_basic_details = false)
	{
		$item = (object) [];

		// Set the values from the tag
		$tag = RL_Title::clean($match['data'], false, false);
		self::setTagAttributes($item, $tag);

		if ($only_basic_details)
		{
			return $item;
		}

		$item->orig   = $match[0];
		$item->set_id = trim(str_replace('-', '_', $match['set_id']));

		// New set
		if (empty($set_ids) || current($set_ids) != $item->set_id)
		{
			self::$setcount++;
			$set_ids[self::$setcount . '.' . $item->set_id] = $item->set_id;
		}

		$item->set = array_search($item->set_id, array_reverse($set_ids));

		$item->level = self::getSetLevel($item->set, $set_ids);


		list($item->pre, $item->post) = RL_Html::cleanSurroundingTags(
			[$match['pre'], $match['post']],
			['div', 'p', 'span', 'h[0-6]']
		);

		return $item;
	}

	private static function getSetLevel($set_id, $set_ids)
	{
		// Sets are still empty, so this is the first set
		if (empty(self::$sets))
		{
			return 1;
		}

		// Grab the level from the previous entry of this set
		if (isset(self::$sets[$set_id]))
		{
			return self::$sets[$set_id][0]->level;
		}

		// Look up the level of the previous set
		$previous_set_id = array_search(prev($set_ids), array_reverse($set_ids));

		// Grab the level from the previous entry of this set
		if (isset(self::$sets[$previous_set_id]))
		{
			return self::$sets[$previous_set_id][0]->level + 1;
		}

		return 1;
	}

	private static function getParent($set_id, $level)
	{
		if (empty(self::$sets))
		{
			return false;
		}

		if (isset(self::$sets[$set_id]))
		{
			return self::$sets[$set_id][0]->parent;
		}

		reset(self::$sets);

		$previous_set = current(self::$sets);
		$prev_level   = $prev_level = $previous_set[0]->level;

		while ($prev_level >= $level)
		{
			$previous_set = prev(self::$sets);

			if (empty($previous_set))
			{
				end(self::$sets);

				return false;
			}

			$prev_level = $previous_set[0]->level;
		}

		end(self::$sets);
		end($previous_set);

		$parent_item = key($previous_set);

		return [$previous_set[$parent_item]->set, $parent_item];
	}

	private static function addChildToParent($item)
	{
		if (empty($item->parent))
		{
			return;
		}

		list($parent_set, $parent_item) = $item->parent;

		if (empty(self::$sets[$parent_set]) || empty(self::$sets[$parent_set][$parent_item]))
		{
			return;
		}

		self::$sets[$parent_set][$parent_item]->children[] = $item->set;
	}


	private static function initSets(&$sets)
	{
		$params = Params::get();

		$urlitem   = JFactory::getApplication()->input->get('tab');
		$itemcount = 0;

		foreach ($sets as $set_id => $items)
		{
			$opened_by_default = 0;


			foreach ($items as $i => $item)
			{
				$item->title      = isset($item->title) ? trim($item->title) : 'Tab';
				$item->title_full = $item->title;

				if (isset($item->{'title-opened'}) || isset($item->{'title-closed'}))
				{
					$title_closed = isset($item->{'title-closed'}) ? $item->{'title-closed'} : $item->title;
					$title_opened = isset($item->{'title-opened'}) ? $item->{'title-opened'} : $item->title;

					// Set main title to the title-opened, otherwise to title-closed
					$item->title = $title_opened ?: ($title_closed ?: $item->title);

					// place the title-opened and title-closed in css controlled spans
					$item->title_full = '<span class="rl_tabs-title-inactive nn_tabs-title-inactive">' . $title_closed . '</span>'
						. '<span class="rl_tabs-title-active nn_tabs-title-active">' . $title_opened . '</span>';
				}

				$item->haslink = RL_RegEx::match('<a [^>]*>.*?</a>', $item->title);

				$item->title = RL_Title::clean($item->title, true);
				$item->title = $item->title ?: RL_HtmlTag::getAttributeValue('title', $item->title_full);
				$item->title = $item->title ?: RL_HtmlTag::getAttributeValue('alt', $item->title_full);

				$item->alias = RL_Alias::get(isset($item->alias) ? $item->alias : $item->title);
				$item->alias = $item->alias ?: 'tab';

				$item->id    = self::createId($item->alias);
				$item->set   = (int) $set_id;
				$item->count = $i + 1;


				$set_keys = [
					'class', 'open', 'title_tag', 'onclick',
				];
				foreach ($set_keys as $key)
				{
					$item->{$key} = isset($item->{$key})
						? $item->{$key}
						: (isset($params->{$key}) ? $params->{$key} : '');
				}

				$item->matches   = RL_Title::getUrlMatches([$item->id, $item->title]);
				$item->matches[] = ++$itemcount . '';
				$item->matches[] = $item->set . '.' . ($i + 1);
				$item->matches[] = $item->set . '-' . ($i + 1);

				$item->matches = array_unique($item->matches);
				$item->matches = array_diff($item->matches, self::$matches);
				self::$matches = array_merge(self::$matches, $item->matches);

				if (self::itemIsOpen($item, $urlitem, $i == 0))
				{
					$opened_by_default = $i;
				}

				// Will be set after all items are checked based on the $opened_by_default id
				$item->open = false;

				$sets[$set_id][$i] = $item;
				self::$allitems[]  = $item;
			}

			self::setOpenItem($sets[$set_id], $opened_by_default);
		}
	}

	private static function itemIsOpen($item, $urlitem, $is_first = false)
	{

		if ($item->haslink)
		{
			return false;
		}

		if ( ! empty($item->close))
		{
			return false;
		}

		if (isset($item->open))
		{
			return $item->open;
		}

		if ($urlitem && in_array($urlitem, $item->matches))
		{
			return true;
		}

		if ($is_first)
		{
			return true;
		}

		return false;
	}

	private static function setOpenItem(&$items, $opened_by_default = 0)
	{
		$opened_by_default = (int) $opened_by_default;

		while (isset($items[$opened_by_default]) && $items[$opened_by_default]->haslink)
		{
			$opened_by_default++;
		}

		if ( ! isset($items[$opened_by_default]))
		{
			return;
		}

		$items[$opened_by_default]->open = true;
	}

	private static function setTagAttributes(&$item, $string)
	{
		$values = self::getTagAttributes($string);

		$item = (object) array_merge((array) $item, (array) $values);
	}

	private static function getTagAttributes($string)
	{
		RL_PluginTag::protectSpecialChars($string);

		$is_old_syntax = (strpos($string, '|') !== false);

		if ($is_old_syntax)
		{
			// Fix some different old syntaxes
			$string = str_replace(
				[
					'|alias:',
					'|align_',
				],
				[
					'|alias=',
					'|align=',
				],
				$string
			);
		}

		RL_PluginTag::unprotectSpecialChars($string, true);

		$known_boolean_keys = [
			'open', 'active', 'opened', 'default',
			'scroll', 'noscroll',
			'nooutline', 'outline_handles', 'outline_content', 'color_inactive_handles',
		];

		// Get the values from the tag
		$attributes = RL_PluginTag::getAttributesFromString($string, 'title', $known_boolean_keys);

		$key_aliases = [
			'title'              => ['name'],
			'title-opened'       => ['title-open', 'title-active'],
			'title-closed'       => ['title-close', 'title-inactive'],
			'open'               => ['active', 'opened', 'default'],
			'access'             => ['accesslevels', 'accesslevel'],
			'usergroup'          => ['usergroups', 'group', 'groups'],
			'position'           => ['positioning'],
			'align'              => ['alignment'],
			'heading_attributes' => ['li_attributes'],
			'link_attributes'    => ['a_attributes'],
			'body_attributes'    => ['content_attributes'],
		];

		RL_PluginTag::replaceKeyAliases($attributes, $key_aliases);

		if ($is_old_syntax)
		{
			self::setPositionFromOldClasses($attributes);
		}

		return $attributes;
	}

	private static function setPositionFromOldClasses(&$values)
	{
		if (empty($values->class) || ! empty($values->position))
		{
			return;
		}

		$classes   = explode(' ', $values->class);
		$positions = ['top', 'bottom', 'left', 'right'];
		$found     = array_intersect($classes, $positions);

		if (empty($found))
		{
			return;
		}

		$position = array_shift($found);

		$classes = array_diff($classes, [$position]);

		$values->class    = implode(' ', $classes);
		$values->position = $position;
	}

	private static function replaceSyntax(&$string, $sets)
	{
		$regex = Params::getRegex('end');

		if ( ! RL_RegEx::match($regex, $string))
		{
			return;
		}

		foreach ($sets as $items)
		{
			self::replaceSyntaxItemList($string, $items);
		}
	}

	private static function replaceSyntaxItemList(&$string, $items)
	{
		$first = key($items);
		end($items);

		foreach ($items as $i => &$item)
		{
			self::replaceSyntaxItem($string, $item, $items, ($i == $first));
		}
	}

	private static function replaceSyntaxItem(&$string, $item, $items, $first = 0)
	{
		if (strpos($string, $item->orig) === false)
		{
			return;
		}

		$params = Params::get();

		$html   = [];
		$html[] = $item->post;
		$html[] = $item->pre;

		if ($first && $params->place_comments)
		{
			$html[] = Protect::getCommentStartTag();
		}

		if ( ! in_array(self::$context, ['com_search.search', 'com_search.search.article', 'com_finder.indexer']))
		{
			$html[] = self::getPreHtml($item, $items, $first);
		}

		$class = self::getItemClass($item, 'tab-pane rl_tabs-pane nn_tabs-pane');

		$body_attributes = 'role="tabpanel"'
			. ' aria-labelledby="tab-' . $item->id . '"'
			. ' aria-hidden="' . ($item->open ? 'false' : 'true') . '"';
		if ( ! empty($item->body_attributes))
		{
			$body_attributes .= ' ' . $item->body_attributes;
		}

		$html[] = '<div class="' . trim($class) . '" id="' . $item->id . '" ' . $body_attributes . '>';

		if ( ! $item->haslink)
		{
			$class = 'anchor';
			$html[] = '<' . $item->title_tag . ' class="rl_tabs-title nn_tabs-title">'
				. '<a id="anchor-' . $item->id . '" class="' . $class . '"></a>'
				. $item->title . '</' . $item->title_tag . '>';
		}

		$html = implode("\n", $html);

		$string = RL_String::replaceOnce($item->orig, $html, $string);
	}

	private static function getPreHtml($item, $items, $first = 0)
	{
		if ( ! $first)
		{
			return '</div>';
		}

		$class = self::getMainClasses($item);


		$html[] = '<div class="' . trim($class) . '" role="presentation">';
		$html[] = self::getNav($items);
		$html[] = '<div class="tab-content">';

		return implode("\n", $html);
	}

	private static function getMainClasses($item)
	{
		$params = Params::get();

		$classes = [
			'rl_tabs nn_tabs',
			$params->mainclass,
		];

		if ( ! empty($item->mainclass))
		{
			$classes[] = $item->mainclass;
		}

		if ( ! empty($item->nooutline))
		{
			$item->outline_handles = false;
			$item->outline_content = false;
		}

		if ( ! empty($item->outline_handles) || ! empty($item->outline_content))
		{
			$item->nooutline = false;
		}

		$settings = [
			'nooutline',
			'outline_handles',
			'outline_content',
			'color_inactive_handles',
		];
		self::addClassesBySettings($item, $classes, $settings);

		$align = isset($item->align) ? 'align_' . $item->align : Params::getAlignment();
		$position = 'top';

		$classes[] = $position;
		$classes[] = $align;

		$classes = array_diff($classes, ['']);

		return trim(implode(' ', $classes));
	}

	private static function getItemClass($item, $mainclass = 'rl_tabs-tab nn_tabs-tab nav-item')
	{
		// nav-item used for Boootstrap 4
		$class = [$mainclass];

		if ($item->open)
		{
			$class[] = 'active';
		}

		if ( ! empty($item->mode))
		{
			$class[] = $item->mode == 'hover' ? 'hover' : 'click';
		}

		$class[] = trim($item->class);

		return trim(implode(' ', $class));
	}

	private static function addClassesBySettings($item, &$classes, $settings = [])
	{
		foreach ($settings as $setting)
		{
			self::addClassBySetting($item, $classes, $setting);
		}
	}

	private static function addClassBySetting($item, &$classes, $setting = '')
	{
		if (
			(empty($item->{$setting}) && empty(Params::get()->{$setting}))
			|| (isset($item->{$setting}) && ! $item->{$setting})
		)
		{
			return;
		}

		$classes[] = $setting;
	}

	private static function replaceClosingTag(&$string)
	{
		$params = Params::get();
		$regex  = Params::getRegex('end');

		RL_RegEx::matchAll($regex, $string, $matches);

		if (empty($matches))
		{
			return;
		}

		foreach ($matches as $match)
		{
			$html = '</div></div></div>';


			if ($params->place_comments)
			{
				$html .= Protect::getCommentEndTag();
			}

			list($pre, $post) = RL_Html::cleanSurroundingTags([$match['pre'], $match['post']]);

			$html = $pre . $html . $post;

			$string = RL_String::replaceOnce($match[0], $html, $string);
		}
	}

	private static function replaceLinks(&$string)
	{
		// Links with #tab-name
		self::replaceAnchorLinks($string);
		// Links with &tab=tab-name
		self::replaceUrlLinks($string);
	}

	private static function replaceAnchorLinks(&$string)
	{
		RL_RegEx::matchAll(
			'(?<link><a\s[^>]*href="(?<url>([^"]*)?)\#(?<id>[^"]*)"[^>]*>)(?<text>.*?)</a>',
			$string,
			$matches
		);

		if (empty($matches))
		{
			return;
		}

		self::replaceLinksMatches($string, $matches);
	}

	private static function replaceUrlLinks(&$string)
	{
		RL_RegEx::matchAll(
			'(?<link><a\s[^>]*href="(?<url>[^"]*)(?:\?|&(?:amp;)?)tab=(?<id>[^"\#&]*)(?:\#[^"]*)?"[^>]*>)(?<text>.*?)</a>',
			$string,
			$matches
		);

		if (empty($matches))
		{
			return;
		}

		self::replaceLinksMatches($string, $matches);
	}

	private static function replaceLinksMatches(&$string, $matches)
	{
		$uri            = JUri::getInstance();
		$current_urls   = [];
		$current_urls[] = $uri->toString(['path']);
		$current_urls[] = $uri->toString(['scheme', 'host', 'path']);
		$current_urls[] = $uri->toString(['scheme', 'host', 'port', 'path']);

		foreach ($matches as $match)
		{
			$link = $match['link'];

			if (
				strpos($link, 'data-toggle=') !== false
				|| strpos($link, 'onclick=') !== false
				|| strpos($link, 'rl_tabs-toggle-sm') !== false
				|| strpos($link, 'rl_tabs-link') !== false
				|| strpos($link, 'rl_sliders-link') !== false
			)
			{
				continue;
			}

			$url = $match['url'];
			if (strpos($url, 'index.php/') === 0)
			{
				$url = '/' . $url;
			}

			if (strpos($url, 'index.php') === 0)
			{
				$url = JRoute::_($url);
			}

			if ($url != '' && ! in_array($url, $current_urls))
			{
				continue;
			}

			$id = $match['id'];

			if ( ! self::stringHasItem($string, $id))
			{
				// This is a link to a normal anchor or other element on the page
				// Remove the prepending obsolete url and leave the hash
				// $string = str_replace('href="' . $match['url'] . '#' . $id . '"', 'href="#' . $id . '"', $string);

				continue;
			}

			$attributes = self::getLinkAttributes($id);

			// Combine attributes with original
			$attributes = RL_HtmlTag::combineAttributes($link, $attributes);

			$html = '<a ' . $attributes . '><span class="rl_tabs-link-inner nn_tabs-link-inner">' . $match['text'] . '</span></a>';

			$string = str_replace($match[0], $html, $string);
		}
	}

	private static function replaceLinkTag(&$string)
	{
		$regex = Params::getRegex('link');

		RL_RegEx::matchAll($regex, $string, $matches);

		if (empty($matches))
		{
			return;
		}

		foreach ($matches as $match)
		{
			self::replaceLinkTagMatch($string, $match);
		}
	}

	private static function replaceLinkTagMatch(&$string, $match)
	{
		$params = Params::get();

		$id = RL_Alias::get($match['id']);

		if ( ! self::stringHasItem($string, $id))
		{
			$id_by_name = self::findItemByMatch($match['id']);
			$id_by_id   = self::findItemByMatch($id);
			$id         = $id_by_name ?: ($id_by_id ?: $id);
		}

		if ( ! self::stringHasItem($string, $id))
		{
			$html = '<a href="' . RL_Uri::get($id) . '">' . $match['text'] . '</a>';

			if ($params->place_comments)
			{
				$html = Protect::wrapInCommentTags($html);
			}

			$string = RL_String::replaceOnce($match[0], $html, $string);

			return;
		}

		$html = '<a ' . self::getLinkAttributes($id) . '>'
			. '<span class="rl_tabs-link-inner nn_tabs-link-inner">' . $match['text'] . '</span>'
			. '</a>';

		if ($params->place_comments)
		{
			$html = Protect::wrapInCommentTags($html);
		}

		$string = RL_String::replaceOnce($match[0], $html, $string);
	}

	private static function findItemByMatch($id)
	{
		foreach (self::$allitems as $item)
		{
			if ( ! in_array($id, $item->matches))
			{
				continue;
			}

			return $item->id;
		}

		return false;
	}

	private static function getLinkAttributes($id)
	{
		return 'href="' . RL_Uri::get($id) . '"'
			. ' class="rl_tabs-link rl_tabs-link-' . $id . ' nn_tabs-link nn_tabs-link-' . $id . '"'
			. ' data-id="' . $id . '"';
	}

	private static function stringHasItem(&$string, $id)
	{
		return (strpos($string, 'data-toggle="tab" data-id="' . $id . '"') !== false);
	}

	private static function getNav(&$items)
	{
		$html = [];

		$ul_extra = '';

		// Nav for non-mobile view
		$html[] = '<!--googleoff: index-->';
		$html[] = '<a id="rl_tabs-scrollto_' . $items[0]->set . '" class="anchor rl_tabs-scroll nn_tabs-scroll"></a>';
		$html[] = '<ul class="nav nav-tabs" id="set-rl_tabs-' . $items[0]->set . '" role="tablist"' . $ul_extra . '>';
		foreach ($items as $item)
		{
			$href            = '#' . $item->id;
			$title           = $item->title_full;
			$link_attributes = ' id="tab-' . $item->id . '"'
				. ' data-toggle="tab" data-id="' . $item->id . '"'
				. ' role="tab" aria-controls="' . $item->id . '"'
				. ' aria-selected="' . ($item->open ? 'true' : 'false') . '"';

			$class = 'rl_tabs-toggle nn_tabs-toggle';

			// nav-link used for Boootstrap 4
			$class .= ' nav-link';


			$onclick = '';

			$heading_attributes = ' role="heading"';

			if ( ! empty($item->heading_attributes))
			{
				$heading_attributes .= ' ' . $item->heading_attributes;
			}

			if ($item->haslink)
			{
				if (RL_RegEx::match('<a [^>]*href="(.*?)"', $title, $match))
				{
					$href = $match[1];
				}

				// nav-link used for Boootstrap 4
				$class = 'rl_tabs-link nav-link';

				if (RL_RegEx::match('<a [^>]*class="(.*?)"', $title, $match))
				{
					$class = trim($class . ' ' . $match[1]);
				}

				$link_attributes = '';

				if (RL_RegEx::match('<a ([^>]*)', $title, $match))
				{
					$link_attributes = $match[1];
					$link_attributes = trim(RL_RegEx::replace('(href|class)=".*?"', '', $link_attributes));
				}

				if ( ! empty($item->link_attributes))
				{
					$link_attributes .= ' ' . $item->link_attributes;
				}

				$title = RL_RegEx::replace('<a .*?>(.*?)</a>', '\1', $title);
			}

			$html[] = '<li class="' . self::getItemClass($item) . '" ' . $heading_attributes . '>'
				. '<a href="' . $href . '" class="' . $class . '"' . $onclick . $link_attributes . '>'
				. '<span class="rl_tabs-toggle-inner nn_tabs-toggle-inner">'
				. $title
				. '</span>'
				. '</a>'
				. '</li>';
		}

		$html[] = '</ul>';
		$html[] = '<!--googleon: index-->';

		return implode("\n", $html);
	}


	private static function createId($alias)
	{
		$id = $alias;

		$i = 1;
		while (in_array($id, self::$ids))
		{
			$id = $alias . '-' . ++$i;
		}

		self::$ids[] = $id;

		return $id;
	}
}
