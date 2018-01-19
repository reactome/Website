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

class EasyJoomlaBackupViewEasyJoomlaBackup extends JViewLegacy
{
	protected $_state;

	function display($tpl = null)
	{
		JToolbarHelper::title(JText::_('COM_EASYJOOMLABACKUP')." - ".JText::_('COM_EASYJOOMLABACKUP_SUBMENU_ENTRIES'), 'easyjoomlabackup');

		if(JFactory::getUser()->authorise('easyjoomlabackup.fullbackup', 'com_easyjoomlabackup'))
		{
			JToolbarHelper::custom('fullbackup', 'new', 'new', JText::_('COM_EASYJOOMLABACKUP_FULLBACKUP'), false);
		}

		if(JFactory::getUser()->authorise('easyjoomlabackup.databasebackup', 'com_easyjoomlabackup'))
		{
			JToolbarHelper::custom('databasebackup', 'new', 'new', JText::_('COM_EASYJOOMLABACKUP_DATABASEBACKUP'), false);
		}

		if(JFactory::getUser()->authorise('easyjoomlabackup.filebackup', 'com_easyjoomlabackup'))
		{
			JToolbarHelper::custom('filebackup', 'new', 'new', JText::_('COM_EASYJOOMLABACKUP_FILEBACKUP'), false);
		}

		if(JFactory::getUser()->authorise('easyjoomlabackup.discover', 'com_easyjoomlabackup'))
		{
			JToolbarHelper::custom('discover', 'refresh', 'refresh', JText::_('COM_EASYJOOMLABACKUP_DISCOVER'), false);
		}

		if(JFactory::getUser()->authorise('core.delete', 'com_easyjoomlabackup'))
		{
			JToolbarHelper::deleteList();
		}

		if(JFactory::getUser()->authorise('core.admin', 'com_easyjoomlabackup'))
		{
			JToolbarHelper::preferences('com_easyjoomlabackup', '500');
		}

		$download_allowed = false;

		if(JFactory::getUser()->authorise('easyjoomlabackup.download', 'com_easyjoomlabackup'))
		{
			$download_allowed = true;
		}

		$items = $this->get('Data');
		$pagination = $this->get('Pagination');
		$this->state = $this->get('State');
		$this->plugin_state = $this->get('PluginStatus');

		$document = JFactory::getDocument();
		$document->addStyleSheet('components/com_easyjoomlabackup/css/easyjoomlabackup.css');

		$this->items = $items;
		$this->pagination = $pagination;
		$this->download_allowed = $download_allowed;

		// Check for database type
		$db_type = JFactory::getConfig()->get('dbtype');
		$this->db_type = $db_type;

		// Get donation code message
		require_once JPATH_COMPONENT.'/helpers/easyjoomlabackup.php';
		$donation_code_message = EasyJoomlaBackupHelper::getDonationCodeMessage();
		$this->donation_code_message = $donation_code_message;

		parent::display($tpl);
	}
}
