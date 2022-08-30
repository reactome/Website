<?php
/**
 * @package         Sliders
<<<<<<< HEAD
 * @version         8.2.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://regularlabs.com
 * @copyright       Copyright © 2022 Regular Labs All Rights Reserved
=======
 * @version         8.1.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://regularlabs.com
 * @copyright       Copyright © 2021 Regular Labs All Rights Reserved
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;
use Joomla\CMS\Language\Text as JText;
use RegularLabs\Library\Document as RL_Document;
use RegularLabs\Library\Extension as RL_Extension;
use RegularLabs\Library\Html as RL_Html;
use RegularLabs\Library\Language as RL_Language;
use RegularLabs\Library\Protect as RL_Protect;
use RegularLabs\Library\SystemPlugin as RL_SystemPlugin;
use RegularLabs\Plugin\System\Sliders\Document;
use RegularLabs\Plugin\System\Sliders\Params;
use RegularLabs\Plugin\System\Sliders\Protect;
use RegularLabs\Plugin\System\Sliders\Replace;

// Do not instantiate plugin on install pages
// to prevent installation/update breaking because of potential breaking changes
$input = JFactory::getApplication()->input;
if (in_array($input->get('option'), ['com_installer', 'com_regularlabsmanager']) && $input->get('action') != '')
{
	return;
}

if ( ! is_file(__DIR__ . '/vendor/autoload.php'))
{
	return;
}

require_once __DIR__ . '/vendor/autoload.php';

if ( ! is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php')
	|| ! is_file(JPATH_LIBRARIES . '/regularlabs/src/SystemPlugin.php')
)
{
	JFactory::getLanguage()->load('plg_system_sliders', __DIR__);
	JFactory::getApplication()->enqueueMessage(
		JText::sprintf('SLD_EXTENSION_CAN_NOT_FUNCTION', JText::_('SLIDERS'))
		. ' ' . JText::_('SLD_REGULAR_LABS_LIBRARY_NOT_INSTALLED'),
		'error'
	);

	return;
}

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';

if ( ! RL_Document::isJoomlaVersion(3, 'SLIDERS'))
{
	RL_Extension::disable('sliders', 'plugin');

<<<<<<< HEAD
	RL_Document::adminError(
		JText::sprintf('RL_PLUGIN_HAS_BEEN_DISABLED', JText::_('SLIDERS'))
	);

	return;
}

=======
	RL_Language::load('plg_system_regularlabs');

	JFactory::getApplication()->enqueueMessage(
		JText::sprintf('RL_PLUGIN_HAS_BEEN_DISABLED', JText::_('SLIDERS')),
		'error'
	);

	return;
}

>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
if (true)
{
	class PlgSystemSliders extends RL_SystemPlugin
	{
		public $_lang_prefix           = 'SLD';
		public $_has_tags              = true;
		public $_disable_on_components = true;
		public $_jversion              = 3;

		public function processArticle(&$string, $area = 'article', $context = '', $article = null, $page = 0)
		{
			Replace::replaceTags($string, $area, $context);
		}

		protected function loadStylesAndScripts(&$buffer)
		{
			Document::loadStylesAndScripts();
		}

		protected function changeDocumentBuffer(&$buffer)
		{
			return Replace::replaceTags($buffer, 'component');
		}

		protected function changeFinalHtmlOutput(&$html)
		{
			$params = Params::get();
			[$tag_start, $tag_end] = Params::getTagCharacters();

			if (
				strpos($html, $tag_start . $params->tag_open) === false
				&& strpos($html, 'rl_sliders-scrollto') === false
			)
			{
				Document::removeHeadStuff($html);

				return true;
			}

			// only do stuff in body
			[$pre, $body, $post] = RL_Html::getBody($html);
			Replace::replaceTags($body, 'body');
			$html = $pre . $body . $post;

			return true;
		}

		protected function cleanFinalHtmlOutput(&$html)
		{
			$params = Params::get();

			Protect::unprotectTags($html);

			RL_Protect::removeFromHtmlTagContent($html, Params::getTags(true));
			RL_Protect::removeInlineComments($html, 'Sliders');

			if ( ! $params->place_comments)
			{
				RL_Protect::removeCommentTags($html, 'Sliders');
			}
		}
	}
}
