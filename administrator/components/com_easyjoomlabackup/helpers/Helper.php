<?php

/**
 * @copyright
 * @package    Easy Joomla Backup - EJB for Joomal! 3.x
 * @author     Viktor Vogel <admin@kubik-rubik.de>
<<<<<<< HEAD
 * @version    3.4.1.0-FREE - 2021-09-09
=======
 * @version    3.4.0.0-FREE - 2021-08-02
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
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

namespace EasyJoomlaBackup;

\defined('_JEXEC') || die('Restricted access');

use Exception;
use Joomla\CMS\{Factory, Component\ComponentHelper, Session\Session, Uri\Uri, Language\Text, User\UserHelper, Http\HttpFactory};
use Joomla\Registry\Registry;

/**
 * Class Helper
 *
 * @package EasyJoomlaBackup
 * @since   3.0.0-FREE
<<<<<<< HEAD
 * @version 3.4.1.0-FREE
=======
 * @version 3.4.0.0-FREE
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
 */
class Helper
{
    /**
     * @var string BACKUP_TYPE_DATABASE
     * @since 3.0.0-FREE
     */
    public const BACKUP_TYPE_DATABASE = 'databasebackup';

    /**
     * @var string BACKUP_TYPE_FILE
     * @since 3.0.0-FREE
     */
    public const BACKUP_TYPE_FILE = 'filebackup';

    /**
     * @var string BACKUP_TYPE_FULL
     * @since 3.0.0-FREE
     */
    public const BACKUP_TYPE_FULL = 'fullbackup';

    /**
     * @var string EASYJOOMLABACKUP_VERSION
<<<<<<< HEAD
     * @since 3.4.1.0-FREE
     */
    public const EASYJOOMLABACKUP_VERSION = '3.4.1.0-FREE';
=======
     * @since 3.4.0.0-FREE
     */
    public const EASYJOOMLABACKUP_VERSION = '3.4.0.0-FREE';
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090

    /**
     * @var string MESSAGE_TYPE_ERROR
     * @since 3.0.0-FREE
     */
    public const MESSAGE_TYPE_ERROR = 'error';

    /**
     * @var string MESSAGE_TYPE_MESSAGE
     * @since 3.0.0-FREE
     */
    public const MESSAGE_TYPE_MESSAGE = 'message';

    /**
     * @var string MESSAGE_TYPE_NOTICE
     * @since 3.0.0-FREE
     */
    public const MESSAGE_TYPE_NOTICE = 'notice';

    /**
     * @var string MESSAGE_TYPE_WARNING
     * @since 3.0.0-FREE
     */
    public const MESSAGE_TYPE_WARNING = 'warning';

    /**
     * @var string $sessionName
     * @since 3.0.0-FREE
     */
    protected static $sessionName = 'messageQueue';

    /**
     * @var string $sessionNamespace
     * @since 3.0.0-FREE
     */
    protected static $sessionNamespace = 'EasyJoomlaBackup';

    /**
     * Adds a message to the message queue
     *
     * @param string $message
     * @param string $type
     *
     * @since   3.0.0-FREE
     * @version 3.4.0.0-FREE
     */
    public static function addMessage(string $message, string $type = self::MESSAGE_TYPE_MESSAGE): void
    {
        $messageQueue = Factory::getSession()->get(self::$sessionName, [], self::$sessionNamespace);
        $messageQueue[] = ['message' => $message, 'type' => $type];
        Factory::getSession()->set(self::$sessionName, $messageQueue, self::$sessionNamespace);
    }

    /**
     * Adds message from the message queue to the system message queue
     *
     * @throws Exception
     * @since   3.0.0-FREE
     * @version 3.4.0.0-FREE
     */
    public static function showMessages(): void
    {
        $messageQueue = self::getMessages();

        if (!empty($messageQueue)) {
            foreach ($messageQueue as $message) {
                Factory::getApplication()->enqueueMessage($message['message'], $message['type']);
            }
        }
    }

    /**
     * Gets messages from the message queue
     *
     * @return array
     * @since 3.0.0-FREE
     */
    public static function getMessages(): array
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
     * @since 3.0.0-FREE
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
        } elseif (!empty($fieldValueSession) && !empty($fieldValueHeadSession) && ($donationCode === $donationCodeSession)) {
            self::addHeadData($fieldValueHeadSession);

            return $fieldValueSession;
        }

        $fieldValue = '';
        $donationCodeCheck = false;
        $host = Uri::getInstance()->getHost();

        if ($host === 'localhost') {
            $fieldValue = '<div class="' . self::randomClassName($session) . '">' . Text::_('KR_DONATION_CODE_CHECK_DEFAULT_LOCALHOST') . '</div>';

            if (!empty($donationCode)) {
                $fieldValue .= '<div style="text-align: center; border: 1px solid #F2DB82; border-radius: 2px; padding: 5px; background-color: #F7EECA; font-size: 120%; margin: 10px 0;">' . Text::_('KR_DONATION_CODE_CHECK_ERROR_LOCALHOST') . '</div>';
            }
        } else {
            $donationCodeCheck = self::getDonationCodeStatus($host, $donationCode);

            if ($donationCodeCheck !== 1) {
                $fieldValue = '<div class="' . self::randomClassName($session) . '">' . Text::sprintf('KR_DONATION_CODE_CHECK_DEFAULT', $host) . '</div>';

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
     * @staticvar bool $data_loaded
     *
     * @param string $data
     *
     * @since     3.0.0-FREE
     * @version   3.4.0.0-FREE
     */
    private static function addHeadData(string $data): void
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
     * @throws Exception
     * @since   3.0.0-FREE
     * @version 3.4.0.0-FREE
     */
    private static function randomClassName(Session $session): string
    {
        $characters = range('a', 'z');
        $className = $characters[random_int(0, \count($characters) - 1)];
        $classNameLength = random_int(6, 12);
        $className .= UserHelper::genRandomPassword($classNameLength);

        $headData = '<style type="text/css">div.' . $className . '{text-align: center; border: 1px solid #DD87A2; border-radius: 2px; padding: 5px; background-color: #F9CAD9; font-size: 120%; margin: 10px 0;}</style>';

        self::addHeadData($headData);
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
     * @since   3.0.0-FREE
     * @version 3.4.0.0-FREE
     */
    private static function getDonationCodeStatus(string $host, string $donationCode): int
    {
        $donationCodeCheck = 0;

        if (HttpFactory::getAvailableDriver(new Registry()) === false) {
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

                $donationCodeCheck = (int)$donationCodeRequest->body;
            }
        }

        return $donationCodeCheck;
    }

    /**
     * Gets the footer link with the version number
     *
     * @return string
     * @since 3.4.0.0-FREE
     */
    public static function getFooter(): string
    {
        return '<div style="text-align: center; margin-top: 10px;"><p>' . Text::sprintf('COM_EASYJOOMLABACKUP_VERSION', self::EASYJOOMLABACKUP_VERSION) . '</p></div>';
    }
<<<<<<< HEAD

    /**
     * Removes a trailing comma from a string
     *
     * @param string $string
     *
     * @return string
     * @since 3.4.1.0-FREE
     */
    public static function removeTrailingComma(string $string): string
    {
        if (substr($string, -1) === ',') {
            $string = substr($string, 0, -1);
        }

        return $string;
    }

    /**
     * Gets the database dump header information
     *
     * @return string
     * @since 3.4.1.0-FREE
     */
    public static function getDatabaseDumpHeader(): string
    {
        $data = '-- Easy Joomla Backup for Joomla! - SQL Dump' . "\n";
        $data .= '-- Author: Viktor Vogel' . "\n";
        $data .= '-- Project: Kubik-Rubik Joomla! Extensions' . "\n";
        $data .= '-- Project page: https://kubik-rubik.de/ejb-easy-joomla-backup' . "\n";
        $data .= '-- License: GNU/GPL - https://www.gnu.org/licenses/gpl.html' . "\n\n";

        return $data;
    }
=======
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
}
