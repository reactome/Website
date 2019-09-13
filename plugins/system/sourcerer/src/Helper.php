<?php
/**
 * @package         Sourcerer
 * @version         8.2.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2019 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Plugin\System\Sourcerer;

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;
use RegularLabs\Library\Document as RL_Document;
use RegularLabs\Library\Html as RL_Html;
use RegularLabs\Library\Protect as RL_Protect;

/**
 * Plugin that replaces stuff
 */
class Helper
{
	public function onContentPrepare($context, &$article)
	{
		$params = Params::get();

		$area = isset($article->created_by) ? 'articles' : 'other';

		$remove = $params->remove_from_search
			&& in_array($context, ['com_search.search', 'com_search.search.article', 'com_finder.indexer']);


		if (isset($article->description))
		{
			Replace::replace($article->description, $area, $article, $remove);
		}

		if (isset($article->title))
		{
			Replace::replace($article->title, $area, $article, $remove);
		}

		// Don't handle article texts in category list view
		if (RL_Document::isCategoryList($context))
		{
			return;
		}

		if (isset($article->text))
		{
			Replace::replace($article->text, $area, $article, $remove);

			// Don't also do stuff on introtext/fulltext if text is set
			return;
		}

		if (isset($article->introtext))
		{
			Replace::replace($article->introtext, $area, $article, $remove);
		}

		if (isset($article->fulltext))
		{
			Replace::replace($article->fulltext, $area, $article, $remove);
		}
	}

	public function onAfterDispatch()
	{
		if ( ! RL_Document::isHtml() || ! $buffer = RL_Document::getBuffer())
		{
			return;
		}

		$buffer = Area::tag($buffer, 'component');

		RL_Document::setBuffer($buffer);
	}

	public function onAfterRender()
	{
		// only in html, pdfs, ajax/raw and feeds
		if ( ! in_array(JFactory::getDocument()->getType(), ['html', 'pdf', 'ajax', 'raw']) && ! RL_Document::isFeed())
		{
			return;
		}

		$html = JFactory::getApplication()->getBody();

		if ($html == '')
		{
			return;
		}

		$params = Params::get();

		list($pre, $body, $post) = RL_Html::getBody($html);

		Protect::_($body);
		Replace::replaceInTheRest($body);

		Clean::cleanLeftoverJunk($body);
		RL_Protect::unprotect($body);

		$params->enable_in_head
			? Replace::replace($pre, 'head')
			: Clean::cleanTagsFromHead($pre);

		$html = $pre . $body . $post;

		JFactory::getApplication()->setBody($html);
	}
}
