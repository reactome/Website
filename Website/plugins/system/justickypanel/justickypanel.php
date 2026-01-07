<?php
/**
 * ------------------------------------------------------------------------
 * JU Sticky Panel Plugin for Joomla 2.5, 3.x
 * ------------------------------------------------------------------------
 * Copyright (C) 2010-2013 JoomUltra. All Rights Reserved.
 * @license - GNU/GPL, http://www.gnu.org/licenses/gpl.html
 * Author: JoomUltra Co., Ltd
 * Websites: http://www.joomultra.com
 * ------------------------------------------------------------------------
 */

// No direct access.
defined('_JEXEC') or die();

if(!defined('DS')){
	define('DS', DIRECTORY_SEPARATOR);
}

/**
 * JUBlockIP Plugin
 *
 * @package		Joomla
 * @subpackage	System
 * @since 		2.5
 */

class plgSystemjustickypanel extends JPlugin
{
	/**
	 * Constructor
	 *
	 * @access      protected
	 * @param       object  $subject The object to observe
	 * @param       array   $config  An array that holds the plugin configuration
	 * @since       1.5
	 */
    function __construct(&$subject, $config)
    {
        parent::__construct($subject, $config);
    }
	
	/*
	* Check if jQurey is loaded or not
	*/
	protected function checkjQuery()
	{
		$body = JResponse::getBody();
		$regex= '#\<script.* src="([\/\\a-zA-Z0-9_:\.-]*)jquery([0-9\.-]|core|min|pack)*?.js".*\>\<\/script\>#m';
		preg_match($regex, $body, $matches);
		if (empty($matches)) return false;
		else return true;
	}
	
	/**
	* @since	1.6
	*/
    public function onAfterRender()
    {

	}
	
	public function onAfterRoute()
	{
		$runplugin = true;
		
		//Don't run plugin in backend
		$app = JFactory::getApplication();
		if ($app->isAdmin()) {
			$runplugin = false;
		}
		
		//Only run plugin in html mode
		$document = JFactory::getDocument();
		if ($document->getType() !== 'html' && $document->getType() !== 'feed') {
			$runplugin = false;
		}
		
		// enable plugin on the listed pages
		$enabledpage = false;
		$enablepaths = trim((string) $this->params->get('enablepaths'));
		if ($enablepaths) {
			$paths = array_map('trim', (array) explode("\n", $enablepaths));
			$current_uri_string = JURI::getInstance()->toString();
			
			foreach ($paths as $regex_pattern) {
				//preg_quote and remove ending slash of JURI::root()
				$root_path = preg_quote(preg_replace('#\/$#', '', JURI::root()), '/');
				$regex_pattern = "#".str_replace("[root]", $root_path, $regex_pattern)."#i";
				preg_match($regex_pattern, $current_uri_string, $matches);
				if (count($matches)) {
					$enabledpage = true;
					break;
				}
			}
		}
		
		// disable plugin in the listed pages, if the page is not in list of enabled pages
		$disablepaths = trim((string) $this->params->get('disablepaths'));
		$disabledpage = false;
		if (!$enabledpage && $disablepaths) {
			$paths = array_map('trim', (array) explode("\n", $disablepaths));
			$current_uri_string = JURI::getInstance()->toString();
			
			foreach ($paths as $regex_pattern) {
				//preg_quote and remove ending slash of JURI::root()
				$root_path = preg_quote(preg_replace('#\/$#', '', JURI::root()), '/');
				$regex_pattern = "#".str_replace("[root]", $root_path, $regex_pattern)."#i";
				preg_match($regex_pattern, $current_uri_string, $matches);
				if (count($matches)) {
					$disabledpage = true;
					break;
				}
			}
		}
		
		//Force run tab in enabled pages
		if(!$enabledpage && $disabledpage) {
			$runplugin = false;
		}
		
		//Don't runplugin, retun false;
		if(!$runplugin) {
			return false;
		}
		
		
		//Load jQuery
		if( $this->params->get('loadjquery', '2')==1 || ($this->params->get('loadjquery', '2')==2 && !self::checkjQuery()) ) {
			if($this->params->get('loadjqueryfrom', '1')==1) { $js_files[] = JURI::root(true)."/plugins/system/justickypanel/assets/js/jquery.min.js"; }
			else if($this->params->get('loadjqueryfrom', '1')==2) { $js_files[] = "http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"; }
		}
		$document->addScript(JURI::Root(true) . '/plugins/system/justickypanel/assets/js/jquery.stickyPanel.min.js');
		$document->addStyleSheet(JURI::Root(true) . '/plugins/system/justickypanel/assets/css/style.css');
		
		$sticky_param = array();
		
		$sticky_param['topPadding'] = $this->params->get('topPadding', 0);
		$sticky_param['afterDetachCSSClass'] = '"' . $this->params->get('afterDetachCSSClass', 'detached') . '"';
		$sticky_param['savePanelSpace'] = $this->params->get('savePanelSpace', 'true');
		$sticky_param['onDetached'] = $this->params->get('onDetached', 'null');
		$sticky_param['onReAttached'] = $this->params->get('onReAttached', 'null');
		$sticky_param['parentSelector'] = '"' . $this->params->get('parentSelector', '') . '"';
		
		$toc_js_param = array();
		foreach($sticky_param AS $key=>$value) {
			$sticky_js_param[] = $key . ': ' . $value;
		}

		$sticky_js_param_str = implode(', ', $sticky_js_param);
		
		
		$javascript = 'jQuery(document).ready(function($){
			$("' . $this->params->get('selectors', '.sticky') . '").stickyPanel({' . $sticky_js_param_str . '});
		});';
		
		$document->addScriptDeclaration($javascript);
	}
}
