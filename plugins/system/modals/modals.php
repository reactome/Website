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

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;
use Joomla\CMS\Language\Text as JText;
use RegularLabs\Library\Document as RL_Document;
use RegularLabs\Library\Extension as RL_Extension;
use RegularLabs\Library\Html as RL_Html;
use RegularLabs\Library\Language as RL_Language;
use RegularLabs\Library\Plugin as RL_Plugin;
use RegularLabs\Plugin\System\Modals\Clean;
use RegularLabs\Plugin\System\Modals\Document;
use RegularLabs\Plugin\System\Modals\Replace;

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

if ( ! is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
	JFactory::getLanguage()->load('plg_system_modals', __DIR__);
	JFactory::getApplication()->enqueueMessage(
		JText::sprintf('MDL_EXTENSION_CAN_NOT_FUNCTION', JText::_('MODALS'))
		. ' ' . JText::_('MDL_REGULAR_LABS_LIBRARY_NOT_INSTALLED'),
		'error'
	);

	return;
}

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';

if (! RL_Document::isJoomlaVersion(3, 'MODALS'))
{
	RL_Extension::disable('modals', 'plugin');

	RL_Language::load('plg_system_regularlabs');

	JFactory::getApplication()->enqueueMessage(
		JText::sprintf('RL_PLUGIN_HAS_BEEN_DISABLED', JText::_('MODALS')),
		'error'
	);

	return;
}

if (true)
{
	class PlgSystemModals extends RL_Plugin
	{
		public $_lang_prefix           = 'MDL';
		public $_has_tags              = true;
		public $_disable_on_components = true;
		public $_jversion        = 3;

		public function processArticle(&$string, $area = 'article', $context = '', $article = null, $page = 0)
		{
			Replace::replaceTags($string, $area, $context);
		}

		protected function loadStylesAndScripts(&$buffer)
		{
			Document::addHeadStuff();
		}

		protected function changeDocumentBuffer(&$buffer)
		{
			if (JFactory::getApplication()->input->getInt('ml', 0) && ! JFactory::getApplication()->input->getInt('fullpage', 0))
			{
				Document::setTemplate();
			}

			return Replace::replaceTags($buffer, 'component');
		}

		protected function changeFinalHtmlOutput(&$html)
		{
			// only do stuff in body
			list($pre, $body, $post) = RL_Html::getBody($html);
			Replace::replaceTags($body, 'body');

			Clean::cleanFinalHtmlOutput($pre);
			Clean::cleanFinalHtmlOutput($post);

			$html = $pre . $body . $post;

			Document::removeHeadStuff($html);

			return true;
		}
	}
}

