<?php
/**
 * @package         Regular Labs Library
 * @version         19.9.9950
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2019 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Library;

use FieldsHelper;
use Joomla\CMS\Date\Date as JDate;
use Joomla\CMS\Factory as JFactory;
use RegularLabs\Library\Parameters as RL_Parameters;
use RegularLabs\Plugin\System\ArticlesAnywhere\Replace as AA_Replace;

defined('_JEXEC') or die;

/**
 * Class ConditionContent
 * @package RegularLabs\Library
 */
trait ConditionContent
{
	public function passContentId()
	{
		if (empty($this->selection))
		{
			return null;
		}

		return in_array($this->request->id, $this->selection);
	}

	public function passFeatured()
	{
		return $this->passBoolean('featured');
	}

	public function passBoolean($field = 'featured')
	{
		if ( ! isset($this->params->{$field}) || $this->params->{$field} == '')
		{
			return null;
		}

		$item = $this->getItem($field);

		if ( ! isset($item->{$field}))
		{
			return false;
		}

		return $this->params->{$field} == $item->{$field};
	}

	public function passContentKeyword($fields = ['title', 'introtext', 'fulltext'], $text = '')
	{
		if (empty($this->params->content_keywords))
		{
			return null;
		}

		if ( ! $text)
		{
			$item = $this->getItem($fields);

			foreach ($fields as $field)
			{
				if ( ! isset($item->{$field}))
				{
					return false;
				}

				$text = trim($text . ' ' . $item->{$field});
			}
		}

		if (empty($text))
		{
			return false;
		}

		$this->params->content_keywords = $this->makeArray($this->params->content_keywords);

		foreach ($this->params->content_keywords as $keyword)
		{
			if ( ! RegEx::match('\b' . RegEx::quote($keyword) . '\b', $text))
			{
				continue;
			}

			return true;
		}

		return false;
	}

	public function passMetaKeyword($field = 'metakey', $keywords = '')
	{
		if (empty($this->params->meta_keywords))
		{
			return null;
		}

		if ( ! $keywords)
		{
			$item = $this->getItem($field);

			if ( ! isset($item->metakey) || empty($item->metakey))
			{
				return false;
			}

			$keywords = $item->metakey;
		}

		if (empty($keywords))
		{
			return false;
		}

		if (is_string($keywords))
		{
			$keywords = str_replace(' ', ',', $keywords);
		}

		$keywords = $this->makeArray($keywords);

		$this->params->meta_keywords = $this->makeArray($this->params->meta_keywords);

		foreach ($this->params->meta_keywords as $keyword)
		{
			if ( ! $keyword || ! in_array(trim($keyword), $keywords))
			{
				continue;
			}

			return true;
		}

		return false;
	}

	public function passAuthor($field = 'created_by', $author = '')
	{
		if (empty($this->params->authors))
		{
			return null;
		}

		if ( ! $author)
		{
			$item = $this->getItem($field);

			if ( ! isset($item->{$field}))
			{
				return false;
			}

			$author = $item->{$field};
		}

		if (empty($author))
		{
			return false;
		}

		$this->params->authors = $this->makeArray($this->params->authors);

		if (in_array('current', $this->params->authors) && JFactory::getUser()->id)
		{
			$this->params->authors[] = JFactory::getUser()->id;
		}

		return in_array($author, $this->params->authors);
	}

	public function passDate()
	{
		if (empty($this->params->date))
		{
			return null;
		}

		$field = $this->params->date;

		$item = $this->getItem($field);

		if ( ! isset($item->{$field}))
		{
			return false;
		}

		$date = $this->getDateString($item->{$field});

		switch ($this->params->date_comparison)
		{
			case 'before':
				if ($this->params->date_type == 'now')
				{
					return $date < $this->getNow();
				}

				return $date < $this->getDateString($this->params->date_date);

			case 'after':
				if ($this->params->date_type == 'now')
				{
					return $date > $this->getNow();
				}

				return $date >= $this->getDateString($this->params->date_date);

			case 'between':
				$from = (int) $this->params->date_from ? $this->getDateString($this->params->date_from) : false;
				$to   = (int) $this->params->date_to ? $this->getDateString($this->params->date_to) : false;

				return ( ! $from || $date > $from)
					&& ( ! $to || $date < $to);

			default:
				return false;
		}
	}

	public function passField()
	{
		if (empty($this->params->fields))
		{
			return null;
		}

		$item = $this->getItem();

		if ( ! isset($item->id))
		{
			return false;
		}

		$fields         = $this->params->fields;
		$article_fields = FieldsHelper::getFields('com_content.article', $item, true);

		$passes = [];

		foreach ($fields as $i => $field)
		{
			foreach ($article_fields as $article_field)
			{
				if ($article_field->name != $field->field)
				{
					continue;
				}

				$comparison = ! empty($field->field_comparison) ? $field->field_comparison : 'equals';

				if ( ! self::passComparison($field->field_value, $article_field->rawvalue, $comparison))
				{
					return false;
				}

				$passes[] = $i;
			}
		}

		return count((array) $fields) == count($passes);
	}

	private static function passComparison($needle, $haystack, $comparison = 'equals')
	{
		$haystack = ArrayHelper::toArray($haystack);

		if (empty($haystack))
		{
			return false;
		}

		// For list values
		if (count($haystack) > 1)
		{
			switch ($comparison)
			{
				case 'contains':
					$needle = ArrayHelper::toArray($needle);
					sort($needle);

					$intersect = array_intersect($needle, $haystack);

					return $needle == $intersect;

				case 'contains_one':
					return ArrayHelper::find($needle, $haystack);

				case 'equals':
				default:
					$needle = ArrayHelper::toArray($needle);
					sort($needle);
					sort($haystack);

					return $needle == $haystack;
			}
		}

		$haystack = $haystack[0];

		if ($comparison == 'regex')
		{
			return RegEx::match($needle, $haystack);
		}

		// What's the use case? Not sure yet :)
		$needle = self::runThroughArticlesAnywhere($needle);

		// Convert dynamic date values i, like date('yesterday')
		$needle = self::valueToDateString($needle);

		// make the needle and haystack lowercase, so comparisons are case insensitive
		$needle = StringHelper::strtolower($needle);
		$haystack = StringHelper::strtolower($haystack);

		switch ($comparison)
		{
			case 'contains':
			case 'contains_one':
				return strpos($haystack, $needle) !== false;

			case 'begins_with':
				$length = strlen($needle);

				return substr($haystack, 0, $length) === $needle;

			case 'ends_with':
				$length = strlen($needle);

				if ($length == 0)
				{
					return true;
				}

				return substr($haystack, -$length) === $needle;

			case 'less_than':
				return $haystack <= $needle;

			case 'greater_than':
				return $haystack >= $needle;

			case 'equals':
			default:
				return $needle == $haystack;
		}
	}

	private static function valueToDateString($value, $apply_offset = true)
	{
		if (in_array($value, [
			'now()',
			'JFactory::getDate()',
		]))
		{
			if ( ! $apply_offset)
			{
				return date('Y-m-d H:i:s', strtotime('now'));
			}

			$date = new JDate('now', JFactory::getConfig()->get('offset', 'UTC'));

			return $date->format('Y-m-d H:i:s');
		}

		$regex = '^date\(\s*'
			. '(?:\'(?<datetime>.*?)\')?'
			. '(?:\\\\?,\s*\'(?<format>.*?)\')?'
			. '\s*\)$';

		if ( ! RegEx::match($regex, $value, $match))
		{
			return $value;
		}

		$datetime = ! empty($match['datetime']) ? $match['datetime'] : 'now';
		$format   = ! empty($match['format']) ? $match['format'] : '';

		if (empty($format))
		{
			$time   = date('His', strtotime($datetime));
			$format = (int) $time ? 'Y-m-d H:i:s' : 'Y-m-d';
		}

		if ( ! $apply_offset)
		{
			return date($format, strtotime($datetime));
		}

		$date = new JDate(strtotime($datetime), JFactory::getConfig()->get('offset', 'UTC'));

		return $date->format($format);
	}

	public static function runThroughArticlesAnywhere($string)
	{
		$articlesanywhere_params = RL_Parameters::getInstance()->getPluginParams('articlesanywhere');

		if (empty($articlesanywhere_params) || ! isset($articlesanywhere_params->article_tag) || ! isset($articlesanywhere_params->articles_tag))
		{
			return $string;
		}

		AA_Replace::replaceTags($string);

		return $string;
	}

	abstract public function getItem($fields = []);
}
