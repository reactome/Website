<?php
/**
 * @package    Easy Joomla Backup - EJB for Joomal! 3.x
 * @author     Viktor Vogel <admin@kubik-rubik.de>
 * @version    3.3.0-FREE - 2020-01-03
 * @link       https://kubik-rubik.de/ejb-easy-joomla-backup
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
defined('_JEXEC') || die('Restricted access');

use Joomla\CMS\{Factory, Component\ComponentHelper, Session\Session, Uri\Uri, Language\Text, User\UserHelper, Http\HttpFactory};
use Joomla\Registry\Registry;

class EasyJoomlaBackupHelper
{
    const BACKUP_TYPE_DATABASE = 'databasebackup';
    const BACKUP_TYPE_FILE = 'filebackup';
    const BACKUP_TYPE_FULL = 'fullbackup';

    const MESSAGE_TYPE_MESSAGE = 'message';
    const MESSAGE_TYPE_NOTICE = 'notice';
    const MESSAGE_TYPE_WARNING = 'warning';
    const MESSAGE_TYPE_ERROR = 'error';

    protected static $sessionName = 'messageQueue';
    protected static $sessionNamespace = 'EasyJoomlaBackup';

    /**
     * Adds a message to the EJB message queue
     *
     * @param string $message
     * @param string $type
     */
    public static function addMessage(string $message, string $type = self::MESSAGE_TYPE_MESSAGE)
    {
        $messageQueue = Factory::getSession()->get(self::$sessionName, [], self::$sessionNamespace);
        $messageQueue[] = ['message' => $message, 'type' => $type];
        Factory::getSession()->set(self::$sessionName, $messageQueue, self::$sessionNamespace);
    }

    /**
     * Adds message from the EJB message queue to the system message queue
     */
    public static function showMessages()
    {
        $messageQueue = self::getMessages();

        if (!empty($messageQueue)) {
            foreach ($messageQueue as $message) {
                Factory::getApplication()->enqueueMessage($message['message'], $message['type']);
            }
        }
    }

    /**
     * Gets messages from the EJB message queue
     *
     * @return mixed
     */
    public static function getMessages()
    {
        $messageQueue = Factory::getSession()->get(self::$sessionName, [], self::$sessionNamespace);
        Factory::getSession()->clear(self::$sessionName, self::$sessionNamespace);

        return $messageQueue;
    }

    /**
     * Checks whether the donation code was entered and if the code is correct.
     * The code is taken from the main Kubik-Rubik Donation Code Check field.
     *
     * @return string
     */
    public static function getDonationCodeMessage(): string
    {
        $params = ComponentHelper::getParams('com_easyjoomlabackup');
        $donationCode = $params->get('donation_code', '');

        $session = Factory::getSession();
        $fieldValueSession = $session->get('field_value', null, 'krdonationcodecheck_footer');
        $fieldValueHeadSession = $session->get('field_value_head', null, 'krdonationcodecheck_footer');
        $donationCodeSession = $session->get('donation_code', null, 'krdonationcodecheck_footer');

        if ($fieldValueSession === 1 && ($donationCode === $donationCodeSession)) {
            return '';
        } elseif (!empty($fieldValueSession) && !empty($fieldValueHeadSession) && ($donationCode == $donationCodeSession)) {
            EasyJoomlaBackupHelper::addHeadData($fieldValueHeadSession);

            return $fieldValueSession;
        }

        $fieldValue = '';
        $donationCodeCheck = false;
        $host = Uri::getInstance()->getHost();

        if ($host == 'localhost') {
            $fieldValue = '<div class="' . EasyJoomlaBackupHelper::randomClassName($session) . '">' . Text::_('KR_DONATION_CODE_CHECK_DEFAULT_LOCALHOST') . '</div>';

            if (!empty($donationCode)) {
                $fieldValue .= '<div style="text-align: center; border: 1px solid #F2DB82; border-radius: 2px; padding: 5px; background-color: #F7EECA; font-size: 120%; margin: 10px 0;">' . Text::_('KR_DONATION_CODE_CHECK_ERROR_LOCALHOST') . '</div>';
            }
        } else {
            $donationCodeCheck = EasyJoomlaBackupHelper::getDonationCodeStatus($host, $donationCode);

            if ($donationCodeCheck !== 1) {
                $fieldValue = '<div class="' . EasyJoomlaBackupHelper::randomClassName($session) . '">' . Text::sprintf('KR_DONATION_CODE_CHECK_DEFAULT', $host) . '</div>';

                if ($donationCodeCheck === -1) {
                    $fieldValue .= '<div style="text-align: center; border: 1px solid #F2DB82; border-radius: 2px; padding: 5px; background-color: #F7EECA; font-size: 120%; margin: 10px 0;">' . Text::_('KR_DONATION_CODE_CHECK_ERROR_SERVER') . '</div>';
                }

                if ($donationCodeCheck === -2) {
                    $fieldValue .= '<div style="text-align: center; border: 1px solid #F2DB82; border-radius: 2px; padding: 5px; background-color: #F7EECA; font-size: 120%; margin: 10px 0;">' . Text::_('KR_DONATION_CODE_CHECK_ERROR') . '</div>';
                }
            }
        }

        if ($donationCodeCheck === 1) {
            $session->set('field_value', 1, 'krdonationcodecheck_footer');
        } else {
            $session->set('field_value', $fieldValue, 'krdonationcodecheck_footer');
        }

        $session->set('donation_code', $donationCode, 'krdonationcodecheck_footer');

        return $fieldValue;
    }

    /**
     * Adds the style definition to the head of the HTML page
     *
     * @staticvar boolean $data_loaded
     *
     * @param string $data
     */
    private static function addHeadData(string $data)
    {
        static $dataLoaded = false;

        if (empty($dataLoaded)) {
            $document = Factory::getDocument();
            $document->addCustomTag($data);

            $dataLoaded = true;
        }
    }

    /**
     * Creates a valid, random name for the class selector
     *
     * @param Session $session
     *
     * @return string
     */
    private static function randomClassName(Session $session): string
    {
        $characters = range('a', 'z');
        $className = $characters[mt_rand(0, count($characters) - 1)];
        $classNameLength = mt_rand(6, 12);
        $className .= UserHelper::genRandomPassword($classNameLength);

        $headData = '<style type="text/css">div.' . $className . '{text-align: center; border: 1px solid #DD87A2; border-radius: 2px; padding: 5px; background-color: #F9CAD9; font-size: 120%; margin: 10px 0;}</style>';

        EasyJoomlaBackupHelper::addHeadData($headData);
        $session->set('field_value_head', $headData, 'krdonationcodecheck_footer');

        return $className;
    }

    /**
     * Gets the status of the entered donation code from the donation code script
     *
     * @param string $host
     * @param string $donationCode
     *
     * @return int
     */
    private static function getDonationCodeStatus(string $host, string $donationCode): int
    {
        $donationCodeCheck = 0;

        if (HttpFactory::getAvailableDriver(new Registry) == false) {
            return -2;
        }

        if (!empty($host) && !empty($donationCode)) {
            // First try it with the main validation server and with HTTPS
            $urlCheck = 'https://check.kubik-rubik.de/donationcode/validation.php?key=' . rawurlencode($donationCode) . '&host=' . rawurlencode($host);

            try {
                $donationCodeRequest = HttpFactory::getHttp()->get($urlCheck);
            } catch (Exception $e) {
                // Try it with the fall back server and without HTTPS
                $urlCheckFallback = 'http://check.kubik-rubik.eu/donationcode/validation.php?key=' . rawurlencode($donationCode) . '&host=' . rawurlencode($host);

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

                $donationCodeCheck = (int) $donationCodeRequest->body;
            }
        }

        return $donationCodeCheck;
    }
}
