<?php
/**
 * @package         Regular Labs Library
 * @version         19.10.11711
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2019 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

use Joomla\CMS\Layout\FileLayout;

defined('_JEXEC') or die;

if ( ! is_file(JPATH_LIBRARIES . '/regularlabs/autoload.php'))
{
	return;
}

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';
require_once JPATH_LIBRARIES . '/joomla/form/fields/subform.php';

class JFormFieldRL_Subform extends \JFormFieldSubform
{

	public function __construct($form = null)
	{

		parent::__construct($form);
	}

	protected function getLayoutPaths()
	{
		$paths = parent::getLayoutPaths();
		$paths[] = JPATH_LIBRARIES . '/regularlabs/layouts';

		return $paths;
	}
}
