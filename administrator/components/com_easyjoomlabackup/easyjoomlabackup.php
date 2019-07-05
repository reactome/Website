<?php
/**
 * @package    EJB - Easy Joomla Backup for Joomal! 3.x
 * @author     Viktor Vogel <admin@kubik-rubik.de>
 * @version    3.2.6 - 2019-06-30
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
define('_EASYJOOMLABACKUP_VERSION', '3.2.6');

if (!JFactory::getUser()->authorise('core.manage', 'com_easyjoomlabackup')) {
    throw new Exception(JText::_('JERROR_ALERTNOAUTHOR'), 404);
}

require_once JPATH_COMPONENT . '/controller.php';

if ($controller = JFactory::getApplication()->input->getWord('controller', '')) {
    $pathController = JPATH_COMPONENT . '/controllers/' . $controller . '.php';

    if (file_exists($pathController)) {
        require_once $pathController;
    }
}

$className = 'EasyJoomlaBackupController' . $controller;
$controller = new $className();
$controller->execute(JFactory::getApplication()->input->get('task', ''));
$controller->redirect();
