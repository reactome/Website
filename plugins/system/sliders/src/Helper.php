<?php
/**
 * @package         Sliders
 * @version         7.7.8
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2019 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Plugin\System\Sliders;

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;
use RegularLabs\Library\Article as RL_Article;
use RegularLabs\Library\Document as RL_Document;
use RegularLabs\Library\Html as RL_Html;

/**
 * Plugin that replaces stuff
 */
class Helper
{
	public function onContentPrepare($context, &$article, &$params)
	{
		$area    = isset($article->created_by) ? 'article' : 'other';
		$context = (($params instanceof \JRegistry) && $params->get('rl_search')) ? 'com_search.' . $params->get('readmore_limit') : $context;

		RL_Article::process($article, $context, $this, 'replaceTags', [$area, $context]);
	}

	public function onAfterDispatch()
	{
		Document::addHeadStuff();

		if ( ! $buffer = RL_Document::getBuffer())
		{
			return;
		}

		if ( ! Replace::replaceTags($buffer, 'component'))
		{
			return;
		}

		RL_Document::setBuffer($buffer);
	}

	public function onAfterRender()
	{
		$html = JFactory::getApplication()->getBody();

		if ($html == '')
		{
			return;
		}

		$params = Params::get();
		list($tag_start, $tag_end) = Params::getTagCharacters();

		if (
			strpos($html, $tag_start . $params->tag_open) === false
			&& strpos($html, 'rl_sliders-scrollto') === false
		)
		{
			Document::removeHeadStuff($html);

			Clean::cleanLeftoverJunk($html);

			JFactory::getApplication()->setBody($html);

			return;
		}

		// only do stuff in body
		list($pre, $body, $post) = RL_Html::getBody($html);
		Replace::replaceTags($body, 'body');
		$html = $pre . $body . $post;

		Clean::cleanLeftoverJunk($html);

		JFactory::getApplication()->setBody($html);
	}

	public function replaceTags(&$string, $area = 'article', $context = '')
	{
		Replace::replaceTags($string, $area, $context);
	}
}
