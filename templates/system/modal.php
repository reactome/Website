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

use Joomla\CMS\Factory as JFactory;
use RegularLabs\Library\ParametersNew as RL_Parameters;
use RegularLabs\Library\RegEx as RL_RegEx;

require_once JPATH_LIBRARIES . '/regularlabs/autoload.php';

?>
<?php if (JFactory::getApplication()->input->get('iframe')) : ?>
    <?php
    $this->language  = JFactory::getDocument()->language;
    $this->direction = JFactory::getDocument()->direction;
    ?>
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<?php echo $this->language; ?>" lang="<?php echo $this->language; ?>"
          dir="<?php echo $this->direction; ?>">
    <head>
        <jdoc:include type="head" />
    </head>
    <body class="contentpane modal">
    <jdoc:include type="message" />
    <jdoc:include type="component" />
    </body>
    </html>
<?php else: ?>
    <?php
    $config = RL_Parameters::getPlugin('modals');
    ?>
    <?php if ($config->load_head) : ?>
        <?php
        // Remove the extra loading of another jQuery file (already loaded in parent page)
        $headerdata = JFactory::getDocument()->getHeadData();

        foreach ($headerdata['scripts'] as $file => $type)
        {
            if ( ! RL_RegEx::match('/jquery(-(noconflict|migrate))?(\.min)?\.js', $file))
            {
                continue;
            }

            unset($headerdata['scripts'][$file]);
        }

        $headerdata = JFactory::getDocument()->setHeadData($headerdata);
        ?>
        <jdoc:include type="head" />
    <?php endif; ?>
    <jdoc:include type="message" />
    <jdoc:include type="component" />
<?php endif; ?>
