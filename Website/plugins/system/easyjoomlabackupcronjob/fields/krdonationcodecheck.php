<?php

/**
 * @copyright
 * @package     Field - Donation Code Check
 * @author      Viktor Vogel <admin@kubik-rubik.de>
 * @version     Joomla! 3 - 3.3.1 - 2020-05-22
 * @link        https://kubik-rubik.de/
 *
 * @license     GNU/GPL
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
defined('JPATH_PLATFORM') || die('Restricted access');

use Joomla\CMS\{Form\FormField, Factory, Uri\Uri, Language\Text, User\UserHelper, Http\HttpFactory};
use Joomla\Registry\Registry;

/**
 * Form Field class for Kubik-Rubik Joomla! Extensions.
 * Provides a donation code check.
 */
class JFormFieldKrDonationCodeCheck extends FormField
{
    protected $type = 'krDonationCodeCheck';
    protected $validationDomain = 'https://check.kubik-rubik.de';
    protected $validationDomainFallBack = 'http://check.kubik-rubik.eu';

    /**
     * @return mixed|string
     */
    protected function getInput()
    {
        $fieldSet = $this->form->getFieldset();
        $donationCode = '';

        if (empty($this->group)) {
            $donationCode = $fieldSet['jform_donation_code']->value;
        } elseif ($this->group == 'params') {
            $donationCode = $fieldSet['jform_params_donation_code']->value;
        }

        $session = Factory::getSession();
        $fieldValueSession = $session->get('field_value', '', 'krdonationcodecheck');
        $fieldValueHeadSession = $session->get('field_value_head', '', 'krdonationcodecheck');
        $donationCodeSession = $session->get('donation_code', '', 'krdonationcodecheck');

        if ($fieldValueSession === 1 && ($donationCode === $donationCodeSession)) {
            $fieldValue = '';

            if ($this->id == 'jform_params_donation' || $this->id == 'jform_donation') {
                $fieldValue .= '<div class="' . $this->randomClassName($session, 'success') . '">' . Text::_('KR_DONATION_CODE_CHECK_SUCCESS') . '</div>';
                $this->setHeadDataSession($session);
            }

            return $fieldValue;
        } elseif (!empty($fieldValueSession) && !empty($fieldValueHeadSession) && ($donationCode == $donationCodeSession)) {
            $this->addHeadData($fieldValueHeadSession);

            return $fieldValueSession;
        }

        $session->clear('field_value', 'krdonationcodecheck');
        $session->clear('field_value_head', 'krdonationcodecheck');
        $session->clear('donation_code', 'krdonationcodecheck');

        $host = Uri::getInstance()->getHost();
        $session->set('donation_code', $donationCode, 'krdonationcodecheck');

        if ($host == 'localhost') {
            $fieldValue = '<div class="' . $this->randomClassName($session) . '">' . Text::_('KR_DONATION_CODE_CHECK_DEFAULT_LOCALHOST') . '</div>';

            if (!empty($donationCode)) {
                $fieldValue .= '<div class="' . $this->randomClassName($session, 'warning') . '">' . Text::_('KR_DONATION_CODE_CHECK_ERROR_LOCALHOST') . '</div>';
            }

            $session->set('field_value', $fieldValue, 'krdonationcodecheck');
            $this->setHeadDataSession($session);

            return $fieldValue;
        }

        $donationCodeCheck = $this->getDonationCodeStatus($host, $donationCode);

        if ($donationCodeCheck !== 1) {
            $fieldValue = '<div class="' . $this->randomClassName($session) . '">' . Text::sprintf('KR_DONATION_CODE_CHECK_DEFAULT', $host) . '</div>';

            if ($donationCodeCheck === -1) {
                $fieldValue .= '<div class="' . $this->randomClassName($session, 'warning') . '">' . Text::_('KR_DONATION_CODE_CHECK_ERROR_SERVER') . '</div>';
            }

            if ($donationCodeCheck === -2) {
                $fieldValue .= '<div class="' . $this->randomClassName($session, 'warning') . '">' . Text::_('KR_DONATION_CODE_CHECK_ERROR') . '</div>';
            }

            $session->set('field_value', $fieldValue, 'krdonationcodecheck');
            $this->setHeadDataSession($session);

            return $fieldValue;
        }

        $fieldValue = '';

        if ($this->id == 'jform_params_donation' || $this->id == 'jform_donation') {
            $fieldValue .= '<div class="' . $this->randomClassName($session, 'success') . '">' . Text::_('KR_DONATION_CODE_CHECK_SUCCESS') . '</div>';
        }

        $session->set('field_value', 1, 'krdonationcodecheck');
        $this->setHeadDataSession($session);

        return $fieldValue;
    }

    /**
     * Creates random classes for the div containers
     *
     * @param object $session
     * @param string $type
     *
     * @return string
     */
    private function randomClassName(object $session, $type = 'error'): string
    {
        $fieldValueHeadSession = $session->get('field_value_head', '', 'krdonationcodecheck');

        $characters = range('a', 'z');
        $className = $characters[mt_rand(0, count($characters) - 1)];
        $classNameLength = mt_rand(6, 12);
        $className .= UserHelper::genRandomPassword($classNameLength);

        $headData = '<style type="text/css">div.' . $className . '{border-radius: 2px; padding: 5px; font-size: 120%; margin: 4px 0 4px;';

        if ($type == 'error') {
            $headData .= ' border: 1px solid #DD87A2; background-color: #F9CAD9;';
        } elseif ($type == 'success') {
            $headData .= ' border: 1px solid #73F26F; background-color: #CBF7CA;';
        } elseif ($type == 'warning') {
            $headData .= ' border: 1px solid #F2DB82; background-color: #F7EECA;';
        }

        $headData .= '} @media(min-width:482px){div.' . $className . '{margin: 4px 0 4px -180px;}}</style>';

        $session->set('field_value_head', $fieldValueHeadSession . $headData, 'krdonationcodecheck');

        return $className;
    }

    /**
     * Sets the CSS instructions (stored in the session) to the head
     *
     * @param object $session
     */
    private function setHeadDataSession(object $session)
    {
        // Set the style data to the head of the page
        $fieldValueHeadSession = $session->get('field_value_head', '', 'krdonationcodecheck');

        if (!empty($fieldValueHeadSession)) {
            $this->addHeadData($fieldValueHeadSession);
        }
    }

    /**
     * Add the style data to the head
     *
     * @param string $data
     */
    private function addHeadData(string $data)
    {
        static $dataLoaded = false;

        if (empty($dataLoaded)) {
            $document = Factory::getDocument();
            $document->addCustomTag($data);

            $dataLoaded = true;
        }
    }

    /**
     * Check the entered donation code with the validation script that is located on a main and a fall back server
     *
     * @param string $host
     * @param string $donationCode
     *
     * @return int|string
     */
    private function getDonationCodeStatus(string $host, string $donationCode)
    {
        $donationCodeCheck = 0;

        if (HttpFactory::getAvailableDriver(new Registry) == false) {
            return -2;
        }

        if (!empty($host) && !empty($donationCode)) {
            // First try it with the main validation server and with HTTPS
            $urlCheck = $this->validationDomain . '/donationcode/validation.php?key=' . rawurlencode($donationCode) . '&host=' . rawurlencode($host);

            try {
                $donationCodeRequest = HttpFactory::getHttp()->get($urlCheck);
            } catch (Exception $e) {
                // Try it with the fall back server and without HTTPS
                $urlCheckFallback = $this->validationDomainFallBack . '/donationcode/validation.php?key=' . rawurlencode($donationCode) . '&host=' . rawurlencode($host);

                try {
                    $donationCodeRequest = HttpFactory::getHttp()->get($urlCheckFallback);
                } catch (Exception $e) {
                    return -1;
                }
            }

            if (!empty($donationCodeRequest->body)) {
                if (preg_match('@(error|access denied)@i', $donationCodeRequest->body)) {
                    return -1;
                }

                $donationCodeCheck = (int)$donationCodeRequest->body;
            }
        }

        return $donationCodeCheck;
    }

    /**
     * @return string
     */
    protected function getLabel()
    {
        return '';
    }
}
