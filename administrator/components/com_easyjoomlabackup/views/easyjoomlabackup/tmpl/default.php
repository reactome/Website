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
JHtml::_('bootstrap.tooltip');
JHtml::_('behavior.multiselect');
?>
	<form action="<?php echo JRoute::_('index.php?option=com_easyjoomlabackup'); ?>" method="post" name="adminForm"
	      id="adminForm">
		<div id="j-main-container">
			<div id="filter-bar" class="btn-toolbar">
				<div class="filter-search btn-group pull-left">
					<label for="filter_search" class="element-invisible">
						<?php echo JText::_('JSEARCH_FILTER'); ?>
					</label>
					<input type="text" name="filter_search" id="filter_search"
					       placeholder="<?php echo JText::_('JSEARCH_FILTER'); ?>"
					       value="<?php echo $this->escape($this->state->get('filter.search')); ?>" class="hasTooltip"
					       title="<?php echo JText::_('JSEARCH_FILTER'); ?>"/>
				</div>
				<div class="btn-group pull-left hidden-phone">
					<button type="submit" class="btn hasTooltip"
					        title="<?php echo JText::_('JSEARCH_FILTER_SUBMIT'); ?>">
						<i class="icon-search"></i>
					</button>
					<button type="button" class="btn hasTooltip" title="<?php echo JText::_('JSEARCH_FILTER_CLEAR'); ?>"
					        onclick="document.getElementById('filter_search').value = ''; this.form.submit();">
						<i class="icon-remove"></i>
					</button>
				</div>
				<div class="btn-group pull-right hidden-phone">
					<label for="limit" class="element-invisible">
						<?php echo JText::_('JFIELD_PLG_SEARCH_SEARCHLIMIT_DESC'); ?>
					</label>
					<?php echo $this->pagination->getLimitBox(); ?>
				</div>
			</div>
			<div class="clearfix"></div>
			<table id="articleList" class="table table-striped">
				<thead>
				<tr>
					<th width="20">
						<input type="checkbox" name="checkall-toggle" value=""
						       title="<?php echo JText::_('JGLOBAL_CHECK_ALL'); ?>" onclick="Joomla.checkAll(this)"/>
					</th>
					<th width="15%">
						<?php echo JText::_('COM_EASYJOOMLABACKUP_DATE'); ?>
					</th>
					<th width="35%">
						<?php echo JText::_('COM_EASYJOOMLABACKUP_COMMENT'); ?>
					</th>
					<th width="10%">
						<?php echo JText::_('COM_EASYJOOMLABACKUP_TYPE'); ?>
					</th>
					<th width="6%">
						<?php echo JText::_('COM_EASYJOOMLABACKUP_SIZE'); ?>
					</th>
					<th width="6%">
						<?php echo JText::_('COM_EASYJOOMLABACKUP_DURATION'); ?>
					</th>
					<th>
						<?php echo JText::_('COM_EASYJOOMLABACKUP_DOWNLOAD'); ?>
					</th>
				</tr>
				</thead>
				<tbody>
				<?php $k = 0; ?>
				<?php $n = count($this->items); ?>
				<?php for($i = 0; $i < $n; $i++) : ?>
					<?php $row = $this->items[$i]; ?>
					<?php $checked = JHtml::_('grid.id', $i, $row->id, false, 'id'); ?>
					<?php $download = JRoute::_('index.php?option=com_easyjoomlabackup&controller=createbackup&task=download&id='.$row->id); ?>
					<tr class="<?php echo 'row'.$k; ?>">
						<td>
							<?php echo $checked; ?>
						</td>
						<td class="small">
                            <span class="hasTooltip" title="<?php echo $row->date; ?>">
                                <?php echo JHtml::_('date', $row->date, JText::_('DATE_FORMAT_LC2')); ?>
                            </span>
						</td>
						<td class="small">
                            <span class="hasTooltip" title="<?php echo htmlspecialchars($row->comment); ?>">
                                <?php if(strlen($row->comment) > 200) : ?>
	                                <?php echo mb_substr($row->comment, 0, 200).'...'; ?>
                                <?php else : ?>
	                                <?php echo $row->comment; ?>
                                <?php endif; ?>
                            </span>
						</td>
						<td class="small">
                            <span class="hasTooltip" title="<?php echo htmlspecialchars($row->type); ?>">
                                <?php if($row->type == 'fullbackup') : ?>
	                                <?php echo JText::_('COM_EASYJOOMLABACKUP_FULLBACKUP'); ?>
                                <?php elseif($row->type == 'databasebackup') : ?>
	                                <?php echo JText::_('COM_EASYJOOMLABACKUP_DATABASEBACKUP'); ?>
                                <?php elseif($row->type == 'filebackup') : ?>
	                                <?php echo JText::_('COM_EASYJOOMLABACKUP_FILEBACKUP'); ?>
                                <?php elseif($row->type == 'discovered') : ?>
	                                <?php echo JText::_('COM_EASYJOOMLABACKUP_DISCOVERED_ARCHIVE'); ?>
                                <?php endif; ?>
                            </span>
						</td>
						<td class="small">
                            <span class="hasTooltip" title="<?php echo htmlspecialchars($row->size); ?>">
                                <?php if($row->size > 1048576) : ?>
	                                <?php echo number_format($row->size / 1048576, 2, ',', '.').' MB'; ?>
                                <?php else : ?>
	                                <?php echo number_format($row->size / 1024, 2, ',', '.').' KB'; ?>
                                <?php endif; ?>
                            </span>
						</td>
						<td class="small">
                            <span class="hasTooltip" title="<?php echo htmlspecialchars($row->duration); ?>">
                                <?php if($row->duration > 60) : ?>
	                                <?php echo floor($row->duration / 60).' m '.($row->duration % 60).' s'; ?>
                                <?php elseif($row->duration <= 60 AND $row->duration > 0) : ?>
	                                <?php echo $row->duration.' s'; ?>
                                <?php else : ?>
	                                <?php echo JText::_('COM_EASYJOOMLABACKUP_UNKNOWN'); ?>
                                <?php endif; ?>
                            </span>
						</td>
						<td class="small">
                            <span class="hasTooltip" title="<?php echo htmlspecialchars($row->name); ?>">
                                <?php if($this->download_allowed == true) : ?>
	                                <a href="<?php echo $download; ?>">
		                                <?php if(strlen($row->name) > 100) : ?>
			                                <?php echo substr($row->name, 0, 100).'...'; ?>
		                                <?php else : ?>
			                                <?php echo $row->name; ?>
		                                <?php endif; ?>
	                                </a>
                                <?php else : ?>
	                                <?php echo $row->name; ?>
                                <?php endif; ?>
                            </span>
						</td>
					</tr>
					<?php $k = 1 - $k; ?>
				<?php endfor; ?>
				</tbody>
				<tfoot>
				<tr>
					<td class="center" colspan="8">
						<p>
							<?php if(class_exists('ZipArchive')) : ?>
								<span class="text-success">
									<?php echo JText::_('COM_EASYJOOMLABACKUP_ZIPARCHIVE_ACTIVATED'); ?>
									<span class="icon-easyjoomlabackup-success"></span>
								</span>
							<?php else : ?>
								<span class="text-error">
									<?php echo JText::_('COM_EASYJOOMLABACKUP_ZIPARCHIVE_DEACTIVATED'); ?>
									<span class="icon-easyjoomlabackup-error"></span>
								</span>
							<?php endif; ?>
						</p>
						<p>
							<?php if($this->db_type == 'mysqli') : ?>
								<span class="text-success">
									<?php echo JText::_('COM_EASYJOOMLABACKUP_DBTYPE_MYSQLI'); ?>
									<span class="icon-easyjoomlabackup-success"></span>
								</span>
							<?php else : ?>
								<span class="text-error">
									<?php echo JText::_('COM_EASYJOOMLABACKUP_DBTYPE_NOT_MYSQLI'); ?>
									<span class="icon-easyjoomlabackup-error"></span>
								</span>
							<?php endif; ?>
						</p>
						<?php if(isset($this->plugin_state['enabled']) AND isset($this->plugin_state['url_settings'])) : ?>
							<p class="footer-tip">
								<?php if($this->plugin_state['enabled'] == true) : ?>
									<span class="text-success">
										<span class="icon-easyfrontendseo-success"></span>
										<?php echo JText::sprintf('COM_EASYJOOMLABACKUP_PLUGIN_ENABLED', $this->plugin_state['url_settings']); ?>
									</span>
								<?php else : ?>
									<span class="text-error">
										<span class="icon-easyfrontendseo-error"></span>
										<?php echo JText::sprintf('COM_EASYJOOMLABACKUP_PLUGIN_DISABLED', $this->plugin_state['url_settings']); ?>
									</span>
								<?php endif; ?>
							</p>
						<?php endif; ?>
					</td>
				</tr>
				</tfoot>
			</table>
			<input type="hidden" name="option" value="com_easyjoomlabackup"/>
			<input type="hidden" name="task" value=""/>
			<input type="hidden" name="boxchecked" value="0"/>
			<input type="hidden" name="controller" value="createbackup"/>
			<?php echo JHtml::_('form.token'); ?>
		</div>
	</form>
	<div style="text-align: center; margin-top: 10px;">
		<p><?php echo JText::sprintf('COM_EASYJOOMLABACKUP_VERSION', _EASYJOOMLABACKUP_VERSION) ?></p>
	</div>
<?php echo $this->donation_code_message; ?>