<?php

/**
 * @copyright
 * @package    Easybook Reloaded - EBR for Joomla! 3.x
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

use JLoader;

/**
 * Class Autoload
 *
 * @package EasyJoomlaBackup
 * @since   3.3.1-FREE
 * @version 3.4.0.0-FREE
 */
class Autoload
{
    /**
     * @var string PATH_EASYJOOMLABACKUP_ADMINISTRATOR
     * @since 3.3.1-FREE
     */
    public const PATH_EASYJOOMLABACKUP_ADMINISTRATOR = JPATH_ADMINISTRATOR . '/components/com_easyjoomlabackup';

    /**
     * @since   3.3.1-FREE
     * @version 3.4.0.0-FREE
     */
    public static function init(): void
    {
        JLoader::registerNamespace('EasyJoomlaBackup', self::PATH_EASYJOOMLABACKUP_ADMINISTRATOR . '/helpers', false, false, 'psr4');
    }
}

Autoload::init();
