<?php
/**
 * @package     Joomla.Libraries
 * @subpackage  Less
 *
<<<<<<< HEAD
 * @copyright   (C) 2014 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright   Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('JPATH_PLATFORM') or die;

/**
 * Formatter ruleset for Joomla formatted CSS generated via LESS
 *
 * @package     Joomla.Libraries
 * @subpackage  Less
 * @since       3.4
 * @deprecated  4.0  without replacement
 */
class JLessFormatterJoomla extends lessc_formatter_classic
{
	public $disableSingle = true;

	public $breakSelectors = true;

	public $assignSeparator = ': ';

	public $selectorSeparator = ',';

	public $indentChar = "\t";
}
