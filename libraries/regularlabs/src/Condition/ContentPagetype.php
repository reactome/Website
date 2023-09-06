<?php
/**
 * @package         Regular Labs Library
 * @version         23.9.3039
 * 
 * @author          Peter van Westen <info@regularlabs.com>
 * @link            https://regularlabs.com
 * @copyright       Copyright © 2023 Regular Labs All Rights Reserved
 * @license         GNU General Public License version 2 or later
 */

namespace RegularLabs\Library\Condition;

defined('_JEXEC') or die;

/**
 * Class ContentPagetype
 *
 * @package RegularLabs\Library\Condition
 */
class ContentPagetype extends Content
{
    public function pass()
    {
        $components = ['com_content', 'com_contentsubmit'];

        if ( ! in_array($this->request->option, $components))
        {
            return $this->_(false);
        }

        if ($this->request->view == 'category' && $this->request->layout == 'blog')
        {
            $view = 'categoryblog';
        }
        else
        {
            $view = $this->request->view;
        }

        return $this->passSimple($view);
    }
}
