<?php
/**
 * @package         Modals
 * @version         9.12.0
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            http://www.regularlabs.com
 * @copyright       Copyright © 2018 Regular Labs All Rights Reserved
 * @license         http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

defined('_JEXEC') or die;

$xmlfile = __DIR__ . '/fields.xml';

$form = new JForm('modal');
$form->loadFile($xmlfile, 1, '//config');

?>
<div class="reglab-overlay"></div>

<?php include 'layouts/nav.php'; ?>
<?php include 'layouts/header.php'; ?>

<div class="container-fluid container-main">
	<form action="index.php" id="modalsForm" method="post">
		<input type="hidden" name="type" id="type" value="url">

		<div class="form-inline form-inline-header">
			<?php echo $form->renderFieldset('text'); ?>
		</div>

		<div class="row">

			<div class="span8">
				<?php
				$tabs = [
					'url'     => ['RL_URL', 'link'],
					'image'   => ['RL_IMAGE', 'image'],
					'gallery' => ['RL_GALLERY', 'images'],
					'video'   => ['RL_VIDEO', 'video-2'],
					'article' => ['RL_ARTICLE', 'file-2'],
					'content' => ['RL_CONTENT', 'paragraph-justify'],
				];

				echo JHtml::_('bootstrap.startTabSet', 'myTab', ['active' => 'tab-url']);

				foreach ($tabs as $id => $data)
				{
					echo JHtml::_('bootstrap.addTab', 'myTab', 'tab-' . $id,
						'<span class="icon-' . $data[1] . '"></span> ' . JText::_($data[0])
					);
					echo $form->renderFieldset($id);
					echo JHtml::_('bootstrap.endTab');
				}

				echo JHtml::_('bootstrap.endTabSet');

				?>
			</div>

			<div class="span4">
				<?php echo $form->renderFieldset('settings'); ?>
			</div>
		</div>

		<div class="alert alert-warning">
			<?php
			echo JText::sprintf(
				'MDL_MORE_SETTINGS',
				'<a href="https://www.regularlabs.com/extensions/modals/tutorial" target="_blank">',
				'</a>'
			);
			?>
		</div>

	</form>
</div>
