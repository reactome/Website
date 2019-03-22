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

wfimport('editor.libraries.classes.editor');

wfimport('editor.libraries.classes.language');
wfimport('editor.libraries.classes.utility');
wfimport('editor.libraries.classes.token');
wfimport('editor.libraries.classes.document');
wfimport('editor.libraries.classes.view');
wfimport('editor.libraries.classes.tabs');
wfimport('editor.libraries.classes.request');

/**
 * JCE class.
 */
class WFEditorPlugin extends JObject
{
    // Editor Plugin instance
    private static $instance;

    // array of alerts
    private $_alerts = array();

    /**
     * Constructor activating the default information of the class.
     */
    public function __construct($config = array())
    {
        // Call parent
        parent::__construct();

        // get plugin name
        $plugin = JRequest::getCmd('plugin');

        // get name and caller from plugin name
        if (strpos($plugin, '.') !== false) {
            $parts = explode('.', $plugin);
            $plugin = $parts[0];
            $caller = $parts[1];
            // store caller
            if ($caller !== $plugin) {
                $this->set('caller', $caller);
            }
        }

        // set plugin name
        $this->set('name', $plugin);

        // load core language
        WFLanguage::load('com_jce', JPATH_ADMINISTRATOR);

        // load pro language
        if (WF_EDITOR_PRO) {
            WFLanguage::load('com_jce_pro', JPATH_SITE);
        }

        if (!array_key_exists('base_path', $config)) {
            $config['base_path'] = WF_EDITOR_PLUGINS.'/'.$plugin;
        }

        if (!defined('WF_EDITOR_PLUGIN')) {
            define('WF_EDITOR_PLUGIN', $config['base_path']);
        }

        if (!array_key_exists('view_path', $config)) {
            $config['view_path'] = WF_EDITOR_PLUGIN;
        }

        if (!array_key_exists('layout', $config)) {
            $config['layout'] = 'default';
        }

        if (!array_key_exists('template_path', $config)) {
            $config['template_path'] = WF_EDITOR_PLUGIN.'/tmpl';
        }

        $this->setProperties($config);
    }

    /**
     * Returns a reference to a editor object.
     *
     * This method must be invoked as:
     * 		<pre>  $browser =JCE::getInstance();</pre>
     *
     * @return JCE The editor object
     *
     * @since	1.5
     */
    public static function getInstance($config = array())
    {
        if (!isset(self::$instance)) {
            self::$instance = new self($config);
        }

        return self::$instance;
    }

    /**
     * Get plugin View.
     *
     * @return WFView
     */
    public function getView()
    {
        static $view;

        if (!is_object($view)) {
            // create plugin view
            $view = new WFView(array(
                'view_path' => $this->get('base_path'),
                'template_path' => $this->get('template_path'),
                'name' => $this->get('name'),
                'layout' => $this->get('layout'),
            ));
        }

        $view->assign('plugin', $this);

        return $view;
    }

    protected function getVersion()
    {
        $wf = WFEditor::getInstance();

        return $wf->getVersion();
    }

    protected function getProfile($plugin = '')
    {
        $wf = WFEditor::getInstance();

        return $wf->getProfile($plugin);
    }

    protected function getPluginVersion()
    {
        $manifest = WF_EDITOR_PLUGIN.'/'.$this->get('name').'.xml';

        $version = '';

        if (is_file($manifest)) {
            $version = md5_file($manifest);
        }

        return $version;
    }

    public function execute()
    {
        WFToken::checkToken() or die('Access to this resource is restricted');

        // process requests if any - method will end here
        WFRequest::getInstance()->process();

        $wf = WFEditor::getInstance();

        $version = $this->getVersion();
        $name = $this->getName();

        // process javascript languages
        if (JRequest::getWord('task') == 'loadlanguages') {
            wfimport('admin.classes.language');

            $parser = new WFLanguageParser(array(
              'plugins' => array('core' => array($name), 'external' => array()),
              'sections' => array('dlg', $name.'_dlg', 'colorpicker'),
              'mode' => 'plugin',
            ));

            $data = $parser->load();
            $parser->output($data);
        }

        // set default plugin version
        $plugin_version = $this->getPluginVersion();

        // add plugin version
        if ($plugin_version && $plugin_version != $version) {
            $version .= $plugin_version;
        }

        // create the document
        $document = WFDocument::getInstance(array(
            'version' => $version,
            'title' => WFText::_('WF_'.strtoupper($this->getName().'_TITLE')),
            'name' => $name,
            'language' => WFLanguage::getTag(),
            'direction' => WFLanguage::getDir(),
            'compress_javascript' => $this->getParam('editor.compress_javascript', 0),
            'compress_css' => $this->getParam('editor.compress_css', 0),
        ));

        // set standalone mode
        $document->set('standalone', JRequest::getInt('standalone', 0));

        // create display
        $this->display();

        // ini language
        $document->addScript(array('index.php?option=com_jce&view=editor&'.$document->getQueryString(array('task' => 'loadlanguages', 'lang' => WFLanguage::getCode()))), 'joomla');

        // pack assets if required
        $document->pack(true, $this->getParam('editor.compress_gzip', 0));

        // get the view
        $view = $this->getView();

        // set body output
        $document->setBody($view->loadTemplate());

        // render document
        $document->render();
    }

    /**
     * Display plugin.
     */
    public function display()
    {
        jimport('joomla.filesystem.folder');
        $document = WFDocument::getInstance();

        if ($document->get('standalone') === 0) {
            $document->addScript(array('tiny_mce_popup'), 'tiny_mce');
        }

        $document->addScript(array('jquery.min'), 'jquery');

        $document->addScript(array('jquery-ui.min'), 'jquery');

        $document->addScript(array('plugin.min.js'));
        $document->addStyleSheet(array('plugin.min.css'), 'libraries');

        // add custom plugin.css if exists
        if (is_file(JPATH_SITE.'/media/jce/css/plugin.css')) {
            $document->addStyleSheet(array('media/jce/css/plugin.css'), 'joomla');
        }
    }

    /**
     * Return the plugin name.
     *
     * @return string
     */
    public function getName()
    {
        return $this->get('name');
    }

    /**
     * Get default values for a plugin.
     * Key / Value pairs will be retrieved from the profile or plugin manifest.
     *
     * @param array $defaults
     *
     * @return array
     */
    public function getDefaults($defaults = array())
    {
        $name = $this->getName();
        $caller = $this->get('caller');

        if ($caller) {
            $name = $caller;
        }

        // get manifest path
        $manifest = WF_EDITOR_PLUGIN.'/'.$name.'.xml';

        // get parameter defaults
        if (is_file($manifest)) {
            $params = $this->getParams(array(
                'key' => $name,
                'path' => $manifest,
            ));

            return array_merge($defaults, (array) $params->getAll('defaults'));
        }

        return $defaults;
    }

    /**
     * Check the user is in an authorized group
     * Check the users group is authorized to use the plugin.
     *
     * @return bool
     */
    public function checkPlugin($plugin = null)
    {
        if ($plugin) {
            // check existence of plugin directory
            if (is_dir(WF_EDITOR_PLUGINS.'/'.$plugin)) {
                // get profile
                $profile = $this->getProfile($plugin);
                // check for valid object and profile id
                return is_object($profile) && isset($profile->id);
            }
        }

        return false;
    }

    /**
     * Add an alert array to the stack.
     *
     * @param object $class Alert classname
     * @param object $title Alert title
     * @param object $text  Alert text
     */
    protected function addAlert($class = 'info', $title = '', $text = '')
    {
        $alerts = $this->getAlerts();

        $alerts[] = array(
            'class' => $class,
            'title' => $title,
            'text' => $text,
        );

        $this->set('_alerts', $alerts);
    }

    /**
     * Get current alerts.
     *
     * @return array Alerts
     */
    private function getAlerts()
    {
        return $this->get('_alerts');
    }

    /**
     * Convert a url to path.
     *
     * @param	string 	The url to convert
     *
     * @return string Full path to file
     */
    public function urlToPath($url)
    {
        $document = WFDocument::getInstance();

        return $document->urlToPath($url);
    }

    /**
     * Returns an image url.
     *
     * @param	string 	The file to load including path and extension eg: libaries.image.gif
     *
     * @return string Image url
     */
    public function image($image, $root = 'libraries')
    {
        $document = WFDocument::getInstance();

        return $document->image($image, $root);
    }

    /**
     * Load & Call an extension.
     *
     * @param array $config
     *
     * @return array
     */
    protected function loadExtensions($type, $extension = null, $config = array())
    {
        return WFExtension::loadExtensions($type, $extension, $config);
    }

    /**
     * Compile plugin settings from defaults and alerts.
     *
     * @param array $settings
     *
     * @return array
     */
    public function getSettings($settings = array())
    {
        $default = array(
            'alerts' => $this->getAlerts(),
            'defaults' => $this->getDefaults(),
        );

        $settings = array_merge($default, $settings);

        return $settings;
    }

    public function getParams($options = array())
    {
        $wf = WFEditor::getInstance();

        return $wf->getParams($options);
    }

    /**
     * Get a parameter by key.
     *
     * @param string $key        Parameter key eg: editor.width
     * @param mixed  $fallback   Fallback value
     * @param mixed  $default    Default value
     * @param string $type       Variable type eg: string, boolean, integer, array
     * @param bool   $allowempty
     *
     * @return mixed
     */
    public function getParam($key, $fallback = '', $default = '', $type = 'string', $allowempty = true)
    {
        // get plugin name
        $name = $this->getName();
        // get caller if any
        $caller = $this->get('caller');

        // get all keys
        $keys = explode('.', $key);
        $wf = WFEditor::getInstance();

        // root key set
        if ($keys[0] === 'editor' || $keys[0] === $name || $keys[0] === $caller) {
            return $wf->getParam($key, $fallback, $default, $type, $allowempty);
            // no root key set, treat as shared param
        } else {
            // get fallback param from editor key
            $fallback = $wf->getParam('editor.'.$key, $fallback, $default, $type, $allowempty);

            if ($caller) {
                // get fallback from plugin (with editor parameter as fallback)
                $fallback = $wf->getParam($name.'.'.$key, $fallback, $default, $type, $allowempty);
                $name = $caller;
            }

            // return parameter
            return $wf->getParam($name.'.'.$key, $fallback, $default, $type, $allowempty);
        }
    }

    /**
     * Named wrapper to check access to a feature.
     *
     * @param string	The feature to check, eg: upload
     * @param mixed		The defalt value
     *
     * @return bool
     */
    public function checkAccess($option, $default = 0)
    {
        return (bool) $this->getParam($option, $default);
    }

    /**
     * Wrapper for oEmbed Request.
     *
     * @param $name Provider name
     * @param $url Resource URL
     *
     * @return object
     */
    public function oEmbedWrapper($name, $url)
    {
        $data = '';
        $endpoint = '';

        $providers = json_decode(file_get_contents(WF_EDITOR_LIBRARIES.'/oembed.json'));
        $supported = array('youtube', 'vimeo', 'dailymotion', 'vine', 'instagram');

        if (!empty($providers)) {
            // find the correct provider
            foreach ($providers as $provider) {
                if ($name === strtolower($provider->provider_name) && in_array($supported, $name)) {
                    $endpoint = $provider->endpoints[0]->url;
                }
            }

            if ($endpoint) {
                // only json is supported
                $endpoint = str_replace('{format}', 'json', $endpoint);

                // only https
                $endpoint = str_replace('http://', 'https://', $endpoint);

                if (strpos($endpoint, '?') === false) {
                    $endpoint .= '?url=';
                } else {
                    $endpoint .= '&url=';
                }

                $data = @file_get_contents($endpoint.rawurlencode(rawurldecode($url)));
            }
        }

        $data = is_string($data) ? json_decode($data) : $data;

        return $data;
    }
}
