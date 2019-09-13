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

use JFile;
use Joomla\CMS\Application\CMSApplication;
use Joomla\CMS\Factory as JFactory;
use Joomla\CMS\Version;

class Code
{
	public static function run($src_string, &$src_variables, $tmp_path = '')
	{
		if ( ! is_string($src_string) || $src_string == '')
		{
			return '';
		}

		$src_pre_variables = array_keys(get_defined_vars());

		ob_start();
		$src_post_variables = self::execute($src_string, $src_variables, $tmp_path);
		$src_output         = ob_get_contents();
		ob_end_clean();

		if ( ! is_array($src_post_variables))
		{
			return $src_output;
		}

		$src_diff_variables = array_diff(array_keys($src_post_variables), $src_pre_variables);

		foreach ($src_diff_variables as $src_diff_key)
		{
			if (in_array($src_diff_key, ['Itemid', 'mainframe', 'app', 'document', 'doc', 'database', 'db', 'user'])
				|| substr($src_diff_key, 0, 4) == 'src_'
			)
			{
				continue;
			}

			$src_variables[$src_diff_key] = $src_post_variables[$src_diff_key];
		}

		return $src_output;
	}

	private static function execute($string = '', $src_variables, $tmp_path = '')
	{
		$function_name = 'sourcerer_php_' . md5($string);

		if (function_exists($function_name))
		{
			return $function_name($src_variables);
		}

		$contents = self::generateFileContents($function_name, $string);

		$tmp_path  = $tmp_path ? $tmp_path : JFactory::getConfig()->get('tmp_path', JPATH_ROOT . '/tmp');
		$temp_file = $tmp_path . '/' . $function_name;

		JFile::write($temp_file, $contents);

		include_once $temp_file;

		if ( ! defined('JDEBUG') || ! JDEBUG)
		{
			JFile::delete($temp_file);
		}

		if ( ! function_exists($function_name))
		{
			// Something went wrong!
			return [];
		}

		return $function_name($src_variables);
	}

	private static function generateFileContents($function_name = 'src_function', $string = '')
	{
		$init = self::getVarInits();

		$init[] =
			'if (is_array($src_variables)) {'
			. 'foreach ($src_variables as $src_key => $src_value) {'
			. '${$src_key} = $src_value;'
			. '}'
			. '}';

		$contents = [
			'<?php',
			'defined(\'_JEXEC\') or die;',
			'function ' . $function_name . '($src_variables){',
			implode("\n", $init),
			$string . ';',
			'return get_defined_vars();',
			';}',
		];

		return implode("\n", $contents);
	}

	private static function getVarInits()
	{
		return [
			'$app = $mainframe = RegularLabs\Plugin\System\Sourcerer\Code::getApplication();',
			'$document = $doc = RegularLabs\Plugin\System\Sourcerer\Code::getDocument();',
			'$database = $db = JFactory::getDbo();',
			'$user = JFactory::getUser();',
			'$Itemid = $app->input->getInt(\'Itemid\');',
		];
	}

	public static function getApplication()
	{
		if (JFactory::getApplication()->input->get('option') != 'com_finder')
		{
			return JFactory::getApplication();
		}

		return CMSApplication::getInstance('site');
	}

	public static function getDocument()
	{
		if (JFactory::getApplication()->input->get('option') != 'com_finder')
		{
			return JFactory::getDocument();
		}

		$lang    = JFactory::getLanguage();
		$version = new Version;

		$attributes = [
			'charset'      => 'utf-8',
			'lineend'      => 'unix',
			'tab'          => "\t",
			'language'     => $lang->getTag(),
			'direction'    => $lang->isRtl() ? 'rtl' : 'ltr',
			'mediaversion' => $version->getMediaVersion(),
		];

		return \JDocument::getInstance('html', $attributes);
	}
}
