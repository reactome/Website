<?php
/**
* @package		Direct Alias
* @copyright	Copyright (C) 2009-2016 AlterBrains.com. All rights reserved.
* @license		http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
*/

defined('_JEXEC') or die('Restricted access'); 

class plgSystemDirectalias extends JPlugin
{
	public function onContentPrepareForm($form, $data)
	{
		if ($this->params->get('shorten_all'))
		{
			return true;
		}

		if (!$form instanceof JForm)
		{
			$this->_subject->setError('JERROR_NOT_A_FORM');
			return false;
		}
		
		if ($form->getName() != 'com_menus.item')
		{
			return true;
		}
		
		$this->loadLanguage();
		
		JForm::addFieldPath(__DIR__);
		$form->setFieldAttribute('alias', 'type', 'directaliasfield');

		$form->load('<?xml version="1.0" encoding="utf-8"?>
			<form>
				<fields name="params">
					<fieldset name="menu-options">
						<field name="direct_alias" type="hidden" />
						<field name="absent_alias" type="hidden" />
					</fieldset>
				</fields>
			</form>', false);

		// Display real switchers in Falang
		if (JFactory::getApplication()->input->get('option') == 'com_falang')
		{
			$form->load('<?xml version="1.0" encoding="utf-8"?>
				<form>
					<fields name="params">
						<fieldset name="menu-options">
							<field name="direct_alias" type="radio" class="btn-group btn-group-yesno" default="0" label="PLG_SYSTEM_FIELD_DIRECT_ALIAS_MODE" description="PLG_SYSTEM_DIRECT_ALIAS_DIRECT_TIP_DESC">
								<option value="1">PLG_SYSTEM_DIRECT_ALIAS_DIRECT</option>
								<option value="0">PLG_SYSTEM_DIRECT_ALIAS_RELATIVE</option>
							</field>
							<field name="absent_alias" type="radio" class="btn-group btn-group-yesno" default="0" label="PLG_SYSTEM_FIELD_ABSENT_ALIAS_MODE" description="PLG_SYSTEM_DIRECT_ALIAS_ABSENT_TIP_DESC">
								<option value="1">PLG_SYSTEM_DIRECT_ALIAS_ABSENT</option>
								<option value="0">PLG_SYSTEM_DIRECT_ALIAS_PRESENT</option>
							</field>
						</fieldset>
					</fields>
				</form>', false);
		}
	}
	
	public function onAfterInitialise()
	{
		$app = JFactory::getApplication();
		
		if ($app->isAdmin())
		{
			return;
		}

		// Falang overloads menu items via own router's parse rule, so we need to update routes after its rule but now now.
		if (class_exists('plgSystemFalangdriver'))
		{
			$app->getRouter()->attachParseRule(array($this, 'updateDirectRoutes'));
		}
		else
		{
			$this->updateDirectRoutes();
		}
	}
	
	public function updateDirectRoutes()
	{
		$menu = JFactory::getApplication()->getMenu();
		
		// I hate Joomla sometimes... smbd is crazy on privates
		$rProperty = new ReflectionProperty($menu, '_items');
		$rProperty->setAccessible(true);
		$items = $rProperty->getValue($menu);

		$direct_aliases = array();
		
		$shorten_all = $this->params->get('shorten_all');
		
		foreach($items as &$item)
		{
			// Remember original route.
			$item->original_route = $item->route;
			
			// Just shorten all URLs.
			if ($shorten_all)
			{
				$item->route = $item->alias;
			}
			// Or custom settings per menu item
			else
			{
				if ($item->params->get('absent_alias') && $item->params->get('direct_alias'))
				{
					$direct_aliases[$item->route] = '';
	
					$item->route = $item->alias;
				}
				// Remove alias for all children
				elseif ($item->params->get('absent_alias'))
				{
					if (!isset($direct_aliases[$item->route]))
					{
						$direct_aliases[$item->route] = trim(dirname($item->route), './');
					}
				}
				
				// Own direct alias
				// Remove parent alias
				elseif ($item->params->get('direct_alias'))
				{
					$direct_aliases[$item->route] = $item->alias;
					
					$item->route = $item->alias;
				}
				// Remove parent alias of parents with direct aliases
				elseif ($item->level > 1 && !empty($direct_aliases))
				{
					$test_route = $item->route;
					
					while($test_route = substr($test_route, 0, strrpos($test_route, '/')))
					{
						if (isset($direct_aliases[$test_route]))
						{
							$item->route = trim($direct_aliases[$test_route] . '/' . substr($item->route, strlen($test_route)+1), '/');
							break;
						}
					}
				}
			}
		}
	}
}
