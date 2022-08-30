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
defined('_JEXEC') || die('Restricted access');

use Joomla\CMS\{Factory, Language\Text, Filesystem\File};

if (!Factory::getUser()->authorise('core.manage', 'com_easyjoomlabackup')) {
    throw new Exception(Text::_('JERROR_ALERTNOAUTHOR'), 404);
}

require_once JPATH_COMPONENT . '/controller.php';
require_once JPATH_COMPONENT . '/helpers/Autoload.php';

$controller = Factory::getApplication()->input->getWord('controller', '');

if ($controller !== '') {
    $pathController = JPATH_COMPONENT . '/controllers/' . $controller . '.php';

    if (File::exists($pathController)) {
        require_once $pathController;
    }
}

$className = 'EasyJoomlaBackupController' . $controller;
$controller = new $className();
$controller->execute(Factory::getApplication()->input->get('task', ''));
$controller->redirect();
