<?php
/**
 * @package         Modals
 * @version         12.6.1
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            https://regularlabs.com
 * @copyright       Copyright © 2023 Regular Labs All Rights Reserved
 * @license         GNU General Public License version 2 or later
 */

defined('_JEXEC') or die;

use Joomla\CMS\Form\Form as JForm;
use Joomla\CMS\HTML\HTMLHelper as JHtml;
use Joomla\CMS\Language\Text as JText;

$xmlfile = __DIR__ . '/fields.xml';

$form = new JForm('modal');
$form->loadFile($xmlfile, 1, '//config');

?>
<div class="reglab-overlay"></div>

<?php include 'layouts/header.php'; ?>
<?php include 'layouts/nav.php'; ?>

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
                    'content' => ['RL_CONTENT', 'paragraph-justify'],
                    'article' => ['RL_ARTICLE', 'file-2'],
                    'image'   => ['RL_IMAGE', 'image'],
                    'gallery' => ['RL_GALLERY', 'images'],
                    'video'   => ['RL_VIDEO', 'video-2'],
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
                '<a href="https://regularlabs.com/modals" target="_blank">',
                '</a>'
            );
            ?>
        </div>

    </form>
</div>
