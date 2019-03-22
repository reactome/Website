<?php

/**
 * @copyright     Copyright (c) 2009-2019 Ryan Demmer. All rights reserved
 * @license       GNU/GPL 2 or later - http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * JCE is free software. This version may have been modified pursuant
 * to the GNU General Public License, and as distributed it includes or
 * is derivative of works licensed under the GNU General Public License or
 * other free or open source software licenses
 */
defined('_JEXEC') or die;

/**
 * Parameter base class.
 *
 * The WFElement is the base class for all WFElement types
 *
 * @since 2.2.5
 */
class WFElement extends JObject
{
    /**
     * Element name.
     *
     * This has to be set in the final
     * renderer classes.
     *
     * @var string
     */
    protected $_name = null;

    /**
     * Reference to the object that instantiated the element.
     *
     * @var object
     */
    protected $_parent = null;

    /**
     * Constructor.
     *
     * @param string $parent Element parent
     */
    public function __construct($parent = null)
    {
        $this->_parent = $parent;
    }

    /**
     * Get the element name.
     *
     * @return string type of the parameter
     */
    public function getName()
    {
        return $this->_name;
    }

    /**
     * Get the element paernt.
     *
     * @return object
     */
    public function getParent()
    {
        return $this->_parent;
    }

    /**
     * Method to render an xml element.
     *
     * @param string &$xmlElement  Name of the element
     * @param string $value        Value of the element
     * @param string $control_name Name of the control
     *
     * @return array Attributes of an element
     */
    public function render(&$xmlElement, $value, $control_name = 'params')
    {
        $name = (string) $xmlElement->attributes()->name;
        $label = (string) $xmlElement->attributes()->label;
        $description = (string) $xmlElement->attributes()->description;

        //make sure we have a valid label
        $label = $label ? $label : $name;

        $element = $this->fetchElement($name, $value, $xmlElement, $control_name);

        // fix for "<div class="controls">" added to radiolist in Joomla 3+
        if (!empty($element) && strpos($element, '<div class="controls">') !== 0) {
            $element = '<div class="controls">'.$element.'</div>';
        }

        $result = array(
            'label' => $this->fetchTooltip($label, $description, $xmlElement, $control_name, $name),
            'element' => $element,
        );

        return $result;
    }

    /**
     * Method to get a tool tip from an XML element.
     *
     * @param string      $label        Label attribute for the element
     * @param string      $description  Description attribute for the element
     * @param JXMLElement &$xmlElement  The element object
     * @param string      $control_name Control name
     * @param string      $name         Name attribut
     *
     * @return string
     */
    public function fetchTooltip($label, $description, &$xmlElement, $control_name = '', $name = '')
    {
        $id = preg_replace('#\W+#', '_', $control_name.$name);

        $output = '<label id="'.$id.'_lbl" for="'.$id.'" class="control-label'.($description ? ' wf-tooltip' : '').'"';
        $label = WFText::_($label);

        if ($description) {
            $description = WFText::_($description);

            if (strpos($description, '::') === false) {
                $title = $label.'::'.$description;
            } else {
                $title = $description;
            }

            $output .= ' title="'.$title.'"';
        }

        $output .= '>'.$label.'</label>';

        return $output;
    }

    /**
     * Fetch an element.
     *
     * @param string      $name         Name attribute of the element
     * @param string      $value        Value attribute of the element
     * @param JXMLElement &$xmlElement  Element object
     * @param string      $control_name Control name of the element
     */
    public function fetchElement($name, $value, &$xmlElement, $control_name)
    {
        return '';
    }
}
