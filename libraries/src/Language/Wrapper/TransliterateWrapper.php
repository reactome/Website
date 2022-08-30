<?php
/**
 * Joomla! Content Management System
 *
<<<<<<< HEAD
 * @copyright  (C) 2014 Open Source Matters, Inc. <https://www.joomla.org>
=======
 * @copyright  Copyright (C) 2005 - 2020 Open Source Matters, Inc. All rights reserved.
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 * @license    GNU General Public License version 2 or later; see LICENSE.txt
 */

namespace Joomla\CMS\Language\Wrapper;

defined('JPATH_PLATFORM') or die;

use Joomla\CMS\Language\Transliterate;

/**
 * Wrapper class for Transliterate
 *
 * @since       3.4
 * @deprecated  4.0  Use `Joomla\CMS\Language\Transliterate` directly
 */
class TransliterateWrapper
{
	/**
	 * Helper wrapper method for utf8_latin_to_ascii
	 *
	 * @param   string   $string  String to transliterate.
	 * @param   integer  $case    Optionally specify upper or lower case. Default to null.
	 *
	 * @return  string  Transliterated string.
	 *
	 * @see     Transliterate::utf8_latin_to_ascii()
	 * @since   3.4
	 * @deprecated  4.0  Use `Joomla\CMS\Language\Transliterate` directly
	 */
	public function utf8_latin_to_ascii($string, $case = 0)
	{
		return Transliterate::utf8_latin_to_ascii($string, $case);
	}
}
