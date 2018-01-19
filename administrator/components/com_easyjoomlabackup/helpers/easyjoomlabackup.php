<?php
/**
 * @package    EJB - Easy Joomla Backup for Joomal! 3.x
 * @author     Viktor Vogel <admin@kubik-rubik.de>
 * @version    3.2.5 - 2017-10-09
 * @link       https://joomla-extensions.kubik-rubik.de/ejb-easy-joomla-backup
 *
 * @license    GNU/GPL
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
defined('_JEXEC') or die('Restricted access');

use Joomla\Registry\Registry;

class EasyJoomlaBackupHelper
{
	/**
	 * Checks whether the donation code was entered and if the code is correct.
	 * The code is taken from the main Kubik-Rubik Donation Code Check field.
	 *
	 * @return string
	 */
	public static function getDonationCodeMessage()
	{
		$params = JComponentHelper::getParams('com_easyjoomlabackup');
		$donation_code = $params->get('donation_code');

		$session = JFactory::getSession();
		$field_value_session = $session->get('field_value', null, 'krdonationcodecheck_footer');
		$field_value_head_session = $session->get('field_value_head', null, 'krdonationcodecheck_footer');
		$donation_code_session = $session->get('donation_code', null, 'krdonationcodecheck_footer');

		if($field_value_session === 1 AND ($donation_code === $donation_code_session))
		{
			return '';
		}
		elseif(!empty($field_value_session) AND !empty($field_value_head_session) AND ($donation_code == $donation_code_session))
		{
			EasyJoomlaBackupHelper::addHeadData($field_value_head_session);

			return $field_value_session;
		}

		$host = JUri::getInstance()->getHost();

		$field_value = '';
		$donation_code_check = false;

		if($host == 'localhost')
		{
			$field_value = '<div class="'.EasyJoomlaBackupHelper::randomClassName($session).'">'.JTEXT::_('KR_DONATION_CODE_CHECK_DEFAULT_LOCALHOST').'</div>';

			if(!empty($donation_code))
			{
				$field_value .= '<div style="text-align: center; border: 1px solid #F2DB82; border-radius: 2px; padding: 5px; background-color: #F7EECA; font-size: 120%; margin: 10px 0;">'.JTEXT::_('KR_DONATION_CODE_CHECK_ERROR_LOCALHOST').'</div>';
			}
		}
		else
		{
			$donation_code_check = EasyJoomlaBackupHelper::getDonationCodeStatus($host, $donation_code);

			if($donation_code_check !== 1)
			{
				$field_value = '<div class="'.EasyJoomlaBackupHelper::randomClassName($session).'">'.JTEXT::sprintf('KR_DONATION_CODE_CHECK_DEFAULT', $host).'</div>';

				if($donation_code_check === -1)
				{
					$field_value .= '<div style="text-align: center; border: 1px solid #F2DB82; border-radius: 2px; padding: 5px; background-color: #F7EECA; font-size: 120%; margin: 10px 0;">'.JTEXT::_('KR_DONATION_CODE_CHECK_ERROR_SERVER').'</div>';
				}

				if($donation_code_check === -2)
				{
					$field_value .= '<div style="text-align: center; border: 1px solid #F2DB82; border-radius: 2px; padding: 5px; background-color: #F7EECA; font-size: 120%; margin: 10px 0;">'.JTEXT::_('KR_DONATION_CODE_CHECK_ERROR').'</div>';
				}
			}
		}

		if($donation_code_check === 1)
		{
			$session->set('field_value', 1, 'krdonationcodecheck_footer');
		}
		else
		{
			$session->set('field_value', $field_value, 'krdonationcodecheck_footer');
		}

		$session->set('donation_code', $donation_code, 'krdonationcodecheck_footer');

		return $field_value;
	}

	/**
	 * Gets the status of the entered donation code from the donation code script
	 *
	 * @param string $host
	 * @param string $donation_code
	 *
	 * @return int
	 */
	private static function getDonationCodeStatus($host, $donation_code)
	{
		$donation_code_check = 0;

		if(JHttpFactory::getAvailableDriver(new Registry) == false)
		{
			return -2;
		}

		if(!empty($host) AND !empty($donation_code))
		{
			// First try it with the main validation server and with HTTPS
			$url_check = 'https://check.kubik-rubik.de/donationcode/validation.php?key='.rawurlencode($donation_code).'&host='.rawurlencode($host);

			try
			{
				$donation_code_request = JHttpFactory::getHttp()->get($url_check);
			}
			catch(Exception $e)
			{
				// Try it with the fall back server and without HTTPS
				$url_check_fallback = 'http://check.kubik-rubik.eu/donationcode/validation.php?key='.rawurlencode($donation_code).'&host='.rawurlencode($host);

				try
				{
					$donation_code_request = JHttpFactory::getHttp()->get($url_check_fallback);
				}
				catch(Exception $e)
				{
					return -1;
				}
			}

			if(!empty($donation_code_request->body))
			{
				if(preg_match('@(error|access denied)@i', $donation_code_request->body))
				{
					return -1;
				}

				$donation_code_check = (int)$donation_code_request->body;
			}
		}

		return $donation_code_check;
	}

	/**
	 * Creates a valid, random name for the class selector
	 *
	 * @param $session
	 *
	 * @return string
	 */
	private static function randomClassName($session)
	{
		$characters = range('a', 'z');
		$class_name = $characters[mt_rand(0, count($characters) - 1)];
		$class_name_length = mt_rand(6, 12);
		$class_name .= @JUserHelper::genRandomPassword($class_name_length);

		$head_data = '<style type="text/css">div.'.$class_name.'{text-align: center; border: 1px solid #DD87A2; border-radius: 2px; padding: 5px; background-color: #F9CAD9; font-size: 120%; margin: 10px 0;}</style>';

		EasyJoomlaBackupHelper::addHeadData($head_data);
		$session->set('field_value_head', $head_data, 'krdonationcodecheck_footer');

		return $class_name;
	}

	/**
	 * Adds the style definition to the head of the HTML page
	 *
	 * @staticvar boolean $data_loaded
	 *
	 * @param string $data
	 */
	private static function addHeadData($data)
	{
		static $data_loaded = false;

		if(empty($data_loaded))
		{
			$document = JFactory::getDocument();
			$document->addCustomTag($data);

			$data_loaded = true;
		}
	}
}
