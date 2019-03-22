<?php

/**
 * @copyright 	Copyright (c) 2009-2019 Ryan Demmer. All rights reserved
 * @license   	GNU/GPL 2 or later - http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * JCE is free software. This version may have been modified pursuant
 * to the GNU General Public License, and as distributed it includes or
 * is derivative of works licensed under the GNU General Public License or
 * other free or open source software licenses
 */
defined('_JEXEC') or die('RESTRICTED');
?>
<div id="editor_params" class="tab-content">
    <?php foreach ($this->profile->editor_groups as $group) :
      if ($this->profile->editor_params->getNumParams($group) === 0) :
        continue;
      endif;
      ?>
      <div id="tabs-editor-<?php echo $group ?>" class="tab-pane">
        <?php echo $this->profile->editor_params->render('params[editor]', $group); ?>
      </div>
    <?php endforeach; ?>
</div>
