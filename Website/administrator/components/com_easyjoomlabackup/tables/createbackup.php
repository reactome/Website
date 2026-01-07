<?php

/**
 * @copyright
 * @package    Easy Joomla Backup - EJB for Joomal! 3.x
 * @author     Viktor Vogel <admin@kubik-rubik.de>
 * @version    3.4.1.0-FREE - 2021-09-09
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

use Joomla\CMS\Table\Table;

/**
 * Class EasyJoomlaBackupTableCreatebackup
 *
 * @since 3.0.0-FREE
 */
class EasyJoomlaBackupTableCreatebackup extends Table
{
    /**
     * EasyJoomlaBackupTableCreatebackup constructor.
     *
     * @param JDatabaseDriver $db
     *
     * @since   3.0.0-FREE
     * @version 3.4.0.0-FREE
     */
    public function __construct(JDatabaseDriver $db)
    {
        parent::__construct('#__easyjoomlabackup', 'id', $db);
    }
}
