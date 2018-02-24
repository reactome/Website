<?php
/**
 * @package         Regular Labs Library
 * @version         18.2.13418
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2018 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

namespace RegularLabs\Library\Condition;

defined('_JEXEC') or die;

use JFactory;
use JFile;
use JModelLegacy;
use RegularLabs\Library\RegEx;

/**
 * Class Php
 * @package RegularLabs\Library\Condition
 */
class Php
	extends \RegularLabs\Library\Condition
{
	public function pass()
	{
		if ( ! is_array($this->selection))
		{
			$this->selection = [$this->selection];
		}

		$pass = false;
		foreach ($this->selection as $php)
		{
			// replace \n with newline and other fix stuff
			$php = str_replace('\|', '|', $php);
			$php = RegEx::replace('(?<!\\\)\\\n', "\n", $php);
			$php = trim(str_replace('[:REGEX_ENTER:]', '\n', $php));

			if ($php == '')
			{
				$pass = true;
				break;
			}

			ob_start();
			$pass = (bool) $this->execute($php, $this->article);
			ob_end_clean();

			if ($pass)
			{
				break;
			}
		}

		return $this->_($pass);
	}

	private function getArticleById($id = 0)
	{
		if ( ! $id)
		{
			return null;
		}

		if ( ! class_exists('ContentModelArticle'))
		{
			require_once JPATH_SITE . '/components/com_content/models/article.php';
		}

		$model = JModelLegacy::getInstance('article', 'contentModel');

		if ( ! method_exists($model, 'getItem'))
		{
			return null;
		}

		return $model->getItem($this->request->id);
	}

	public function execute($string = '', $article = null)
	{
		$function_name = 'regularlabs_php_' . md5($string);

		if (function_exists($function_name))
		{
			return $function_name();
		}

		$contents = $this->generateFileContents($function_name, $string);

		$folder    = JFactory::getConfig()->get('tmp_path', JPATH_ROOT . '/tmp');
		$temp_file = $folder . '/' . $function_name;

		JFile::write($temp_file, $contents);

		include_once $temp_file;

		if ( ! defined('JDEBUG') || ! JDEBUG)
		{
			@chmod($temp_file, 0777);
			@unlink($temp_file);
		}

		if ( ! function_exists($function_name))
		{
			// Something went wrong!
			return true;
		}

		if ( ! $article && strpos($string, '$article') !== false)
		{
			$article = null;
			if ($this->request->option == 'com_content' && $this->request->view == 'article')
			{
				$article = $this->getArticleById($this->request->id);
			}
		}

		return $function_name($article);
	}

	private function generateFileContents($function_name = 'rl_function', $string = '')
	{
		$init_variables = $this->getVarInits();

		$contents = [
			'<?php',
			'defined(\'_JEXEC\') or die;',
			'function ' . $function_name . '($article){',
			implode("\n", $init_variables),
			$string,
			';return true;',
			';}',
		];

		$contents = implode("\n", $contents);

		// Remove Zero Width spaces / (non-)joiners
		$contents = str_replace(
			[
				"\xE2\x80\x8B",
				"\xE2\x80\x8C",
				"\xE2\x80\x8D",
			],
			'',
			$contents
		);

		return $contents;
	}

	private function getVarInits()
	{
		return [
			'$app = $mainframe = JFactory::getApplication();',
			'$document = $doc = JFactory::getDocument();',
			'$database = $db = JFactory::getDbo();',
			'$user = JFactory::getUser();',
			'$Itemid = $app->input->getInt(\'Itemid\');',
		];
	}
}
