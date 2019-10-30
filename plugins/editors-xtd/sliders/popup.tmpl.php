<?php
/**
 * @package         Sliders
 * @version         7.7.8
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2019 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory as JFactory;
use Joomla\CMS\Form\Form as JForm;
use Joomla\CMS\HTML\HTMLHelper as JHtml;
use Joomla\CMS\Language\Text as JText;

$xmlfile = __DIR__ . '/fields.xml';
?>
<div class="reglab-overlay"></div>

<div class="header">
	<h1 class="page-title">
		<span class="icon-reglab icon-sliders"></span>
		<?php echo JText::_('SLIDERS'); ?>
	</h1>
</div>

<nav class="navbar">
	<div class="navbar-inner">
		<div class="container-fluid">
			<div class="btn-toolbar" id="toolbar">
				<div class="btn-wrapper" id="toolbar-apply">
					<button onclick="if(RegularLabsSlidersPopup.insertText()){window.parent.SqueezeBox.close();}" class="btn btn-small btn-success">
						<span class="icon-apply icon-white"></span> <?php echo JText::_('RL_INSERT') ?>
					</button>
				</div>
				<div class="btn-wrapper" id="toolbar-cancel">
					<button onclick="if(confirm('<?php echo JText::_('RL_ARE_YOU_SURE'); ?>')){window.parent.SqueezeBox.close();}" class="btn btn-small">
						<span class="icon-cancel "></span> <?php echo JText::_('JCANCEL') ?>
					</button>
				</div>

				<?php if (JFactory::getApplication()->isClient('administrator') && JFactory::getUser()->authorise('core.admin', 1)) : ?>
					<div class="btn-wrapper" id="toolbar-options">
						<button onclick="window.open('index.php?option=com_plugins&filter_folder=system&filter_search=<?php echo JText::_('SLIDERS') ?>');" class="btn btn-small">
							<span class="icon-options"></span> <?php echo JText::_('JOPTIONS') ?>
						</button>
					</div>
				<?php endif; ?>
			</div>
		</div>
	</div>
</nav>

<div class="container-fluid container-main">
	<form action="index.php" id="slidersForm" method="post">

		<div class="row-fluid">

			<div class="span8">
				<?php echo JHtml::_('bootstrap.startTabSet', 'mySliders', ['active' => 'slider_1']); ?>

				<?php for ($i = 1; $i <= $this->params->button_max_count; $i++) : ?>
					<?php
					$form = new JForm('slider', ['control' => 'slider_' . $i]);
					$form->loadFile($xmlfile, 1, '//config');

					$title = '<span class="slider_' . $i . '_open_icon icon-default hasTooltip"'
						. ' title="' . JText::_('SLD_DEFAULT') . '" style="display:none;"></span> '
						. JText::sprintf('SLD_SLIDER_NUMBER', $i);
					?>

					<?php echo JHtml::_('bootstrap.addTab', 'mySliders', 'slider_' . $i, $title); ?>

					<h1><?php echo $title; ?></h1>

					<div class="row-fluid">
						<div class="span8">
							<div class="form-inline form-inline-header">
								<div class="control-group">
									<div class="control-label">
										<label for="slider_<?php echo $i; ?>_title"><?php echo JText::_('JGLOBAL_TITLE'); ?></label>
									</div>
									<div class="controls">
										<input type="text" name="slider_<?php echo $i; ?>[title]" id="slider_<?php echo $i; ?>_title" value=""
										       class="input-xxlarge input-large-text" size="40">
									</div>
								</div>
							</div>

							<div class="control-group">
								<div class="controls">
									<em><?php echo JText::_('SLD_CONTENT_DESC'); ?></em>

									<div id="slider_<?php echo $i; ?>_content" style="display:none;" class="well well-small"></div>
								</div>
							</div>

							<?php echo $form->renderFieldset('slider_notice'); ?>
						</div>

						<div class="span4">
							<?php echo $form->renderFieldset('slider_params'); ?>
						</div>

					</div>

					<?php echo JHtml::_('bootstrap.endTab'); ?>
				<?php endfor; ?>

				<?php echo JHtml::_('bootstrap.endTabSet'); ?>
			</div>

			<div class="span4">
				<h3><?php echo JText::_('SLD_SET_SETTINGS'); ?></h3>

				<?php
				$form = new JForm('slider', ['control' => 'slider_1']);
				$form->loadFile($xmlfile, 1, '//config');
				echo $form->renderFieldset('params');
				?>
			</div>
		</div>
	</form>
</div>
