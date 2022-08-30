<?php

/**
 * @copyright   Copyright (C) 2015 Ryan Demmer. All rights reserved
 * @copyright   Copyright (C) 2005 - 2014 Open Source Matters, Inc. All rights reserved
 * @license     GNU General Public License version 2 or later
 */
defined('JPATH_BASE') or die;

/**
 * JCE.
 *
 * @since       2.5.5
 */
class PlgSystemJce extends JPlugin
{
    public function onPlgSystemJceContentPrepareForm($form, $data)
    {
        return $this->onContentPrepareForm($form, $data);
    }

<<<<<<< HEAD
    private function getMediaRedirectUrl()
=======
    private function redirectMedia()
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
    {
        $app = JFactory::getApplication();

        require_once JPATH_ADMINISTRATOR . '/components/com_jce/helpers/browser.php';

<<<<<<< HEAD
        $id = $app->input->get('fieldid', '');
        $mediatype = $app->input->getVar('mediatype', $app->input->getVar('view', 'images'));
        $context = $app->input->getVar('context', '');

        $options = WFBrowserHelper::getMediaFieldOptions(array(
            'element'   => $id,
            'converted' => true,
            'mediatype' => $mediatype,
            'context'   => $context
        ));

        if (empty($options['url'])) {
            return false;
        }

        return $options['url'];
    }

    private function redirectMedia()
    {
        $url = $this->getMediaRedirectUrl();

        if ($url) {
            JFactory::getApplication()->redirect($url);
=======
        $id = $app->input->get('fieldid');
        $mediatype = $app->input->getVar('mediatype', $app->input->getVar('view', 'images'));

        $options = WFBrowserHelper::getMediaFieldOptions(array(
            'element' => $id,
            'converted' => true,
            'mediatype' => $mediatype,
        ));

        if (!empty($options['url'])) {
            $app->redirect($options['url']);
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
        }
    }

    private function isEditorEnabled()
    {
<<<<<<< HEAD
        return JPluginHelper::isEnabled('editors', 'jce');
    }

    private function canRedirectMedia()
    {
        $app = JFactory::getApplication();
        $params = JComponentHelper::getParams('com_jce');

        // must have fieldid
        if (!$app->input->get('fieldid')) {
            return false;
        }

        // jce converted mediafield
        if ($app->input->getCmd('option') == 'com_jce' && $app->input->getCmd('task') == 'mediafield.display') {
            return true;
        }

        if ((bool) $params->get('replace_media_manager', 1) == true) {
            // flexi-content mediafield
            if ($app->input->getCmd('option') == 'com_media' && $app->input->getCmd('asset') == 'com_flexicontent') {
                return true;
            }
        }

        return false;
=======
        $config = JFactory::getConfig();
        $user = JFactory::getUser();

        if (!JPluginHelper::getPlugin('editors', 'jce')) {
            return false;
        }

        if ($user->getParam('editor', $config->get('editor')) !== 'jce') {
            return false;
        }

        return true;
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
    }

    public function onAfterRoute()
    {
<<<<<<< HEAD
        if ($this->canRedirectMedia() && $this->isEditorEnabled()) {
            // redirect to file browser
            $this->redirectMedia();
=======
        $app = JFactory::getApplication();

        if ($app->input->getCmd('option') == 'com_jce' && $app->input->getCmd('task') == 'mediafield.display' && $app->input->get('fieldid')) {
            
            if ($this->isEditorEnabled()) {
                $params = JComponentHelper::getParams('com_jce');

                if ((bool) $params->get('replace_media_manager', 1) == true) {
                    // redirect to file browser
                    $this->redirectMedia();
                }
            }
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
        }
    }

    public function onAfterDispatch()
    {
        $app = JFactory::getApplication();

        // only in "site"
        if ($app->getClientId() !== 0) {
            return;
        }

        $document = JFactory::getDocument();

        // only if enabled
        if ((int) $this->params->get('column_styles', 1)) {
            $hash = md5_file(__DIR__ . '/css/content.css');
            $document->addStyleSheet(JURI::root(true) . '/plugins/system/jce/css/content.css?' . $hash);
        }
    }

    public function onWfContentPreview($context, &$article, &$params, $page)
    {
        $article->text = '<style type="text/css">@import url("' . JURI::root(true) . '/plugins/system/jce/css/content.css");</style>' . $article->text;
    }

    /**
     * adds additional fields to the user editing form.
     *
     * @param JForm $form The form to be altered
     * @param mixed $data The associated data for the form
     *
     * @return bool
     *
     * @since   2.5.20
     */
    public function onContentPrepareForm($form, $data)
    {
        $app = JFactory::getApplication();

        $version = new JVersion();

        // Joomla 3.9 or later...
        if (!$version->isCompatible('3.9')) {
            return true;
        }

        if (!($form instanceof JForm)) {
            $this->_subject->setError('JERROR_NOT_A_FORM');
            return false;
        }

        $params = JComponentHelper::getParams('com_jce');

<<<<<<< HEAD
        // editor not enabled
        if (false == $this->isEditorEnabled()) {
            return true;
        }

        // File Browser not enabled
        if (false == $this->getMediaRedirectUrl()) {
=======
        // get form name.
        $name = $form->getName();

        if (!$version->isCompatible('3.6')) {
            $valid = array(
                'com_content.article',
                'com_categories.categorycom_content',
                'com_templates.style',
                'com_tags.tag',
                'com_banners.banner',
                'com_contact.contact',
                'com_newsfeeds.newsfeed',
            );

            // only allow some forms, see - https://github.com/joomla/joomla-cms/pull/8657
            if (!in_array($name, $valid)) {
                return true;
            }
        }

        // editor not enabled
        if (!$this->isEditorEnabled()) {
            return true;
        }

        // media replacement disabled
        if ((bool) $params->get('replace_media_manager', 1) === false) {
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
            return true;
        }

        $hasMedia = false;
        $fields = $form->getFieldset();

        foreach ($fields as $field) {
            if (method_exists($field, 'getAttribute') === false) {
                continue;
            }

            $name = $field->getAttribute('name');

            // avoid processing twice
<<<<<<< HEAD
            if ($form->getFieldAttribute($name, 'class') && strpos($form->getFieldAttribute($name, 'class'), 'wf-media-input') !== false) {
=======
            if (strpos($form->getFieldAttribute($name, 'class'), 'wf-media-input') !== false) {
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
                continue;
            }

            $type = $field->getAttribute('type');

<<<<<<< HEAD
            if ($type) {
                // joomla media field and flexi-content converted media field
                if (strtolower($type) === 'media' || strtolower($type) === 'fcmedia') {

                    // media replacement disabled, skip...
                    if ((bool) $params->get('replace_media_manager', 1) === false) {
                        continue;
                    }

                    $group = (string) $field->group;
                    $form->setFieldAttribute($name, 'type', 'mediajce', $group);
                    $form->setFieldAttribute($name, 'converted', '1', $group);
                    $hasMedia = true;
                }

                // jce media field
                if (strtolower($type) === 'mediajce') {
                    $hasMedia = true;
                }
=======
            if (strtolower($type) === 'media') {

                $group = (string) $field->group;
                $form->setFieldAttribute($name, 'type', 'mediajce', $group);
                $form->setFieldAttribute($name, 'converted', '1', $group);
                $hasMedia = true;
            }

            if (strtolower($type) === 'mediajce') {
                $hasMedia = true;
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
            }
        }

        // form has a converted media field
        if ($hasMedia) {
<<<<<<< HEAD
            if ((bool) $params->get('replace_media_manager', 1)) {
                $option     = $app->input->getCmd('option'); 
                $component  = JComponentHelper::getComponent($option);                
                JFactory::getDocument()->addScriptOptions('plg_system_jce', array('replace_media' => true, 'context' => $component->id), true);
            }

=======
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
            $form->addFieldPath(JPATH_PLUGINS . '/system/jce/fields');

            // Include jQuery
            JHtml::_('jquery.framework');

            $document = JFactory::getDocument();
            $document->addScript(JURI::root(true) . '/plugins/system/jce/js/media.js', array('version' => 'auto'));
            $document->addStyleSheet(JURI::root(true) . '/plugins/system/jce/css/media.css', array('version' => 'auto'));
        }

        return true;
    }

    public function onBeforeWfEditorLoad()
    {
        $items = glob(__DIR__ . '/templates/*.php');

        $app = JFactory::getApplication();

        if (method_exists($app, 'getDispatcher')) {
            $dispatcher = JFactory::getApplication()->getDispatcher();
        } else {
            $dispatcher = JEventDispatcher::getInstance();
        }

        foreach($items as $item) {
            $name = basename($item, '.php');

            $className = 'WfTemplate' . ucfirst($name);

            require_once($item);

			if (class_exists($className)) {
                // Instantiate and register the event
				$plugin = new $className($dispatcher);

				if ($plugin instanceof \Joomla\CMS\Extension\PluginInterface) {
                    $plugin->registerListeners();
				}
            }
        }
    }
}
