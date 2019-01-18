<?php
/**
 * @package        Direct Alias
 * @copyright      Copyright (C) 2009-2017 AlterBrains.com. All rights reserved.
 * @license        http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

use Joomla\CMS\Application\SiteApplication;
use Joomla\CMS\Form\Form;
use Joomla\CMS\Plugin\CMSPlugin;

defined('_JEXEC') or die('Restricted access');

/**
 * Class plgSystemDirectalias
 *
 * @since 1.0
 */
class plgSystemDirectalias extends CMSPlugin
{
	/**
	 * @var SiteApplication
	 * @since 1.2.1
	 */
	protected $app;

	/**
	 * @param   Form $form The form
	 *
	 * @return  boolean
	 *
	 * @since   1.0
	 */
	public function onContentPrepareForm($form)
	{
		if ($this->params->get('shorten_all'))
		{
			return true;
		}

		if ($form->getName() !== 'com_menus.item')
		{
			return true;
		}

		$this->loadLanguage();

		Form::addFieldPath(__DIR__);

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
		if ($this->app->input->get('option') === 'com_falang')
		{
			$form->load('<?xml version="1.0" encoding="utf-8"?>
				<form>
					<fields name="params">
						<fieldset name="menu-options">
							<!--suppress HtmlUnknownAttribute -->
							<field name="direct_alias" type="radio" class="btn-group btn-group-yesno" default="0" label="PLG_SYSTEM_FIELD_DIRECT_ALIAS_MODE" description="PLG_SYSTEM_DIRECT_ALIAS_DIRECT_TIP_DESC">
								<option value="1">PLG_SYSTEM_DIRECT_ALIAS_DIRECT</option>
								<option value="0">PLG_SYSTEM_DIRECT_ALIAS_RELATIVE</option>
							</field>
							<!--suppress HtmlUnknownAttribute -->
							<field name="absent_alias" type="radio" class="btn-group btn-group-yesno" default="0" label="PLG_SYSTEM_FIELD_ABSENT_ALIAS_MODE" description="PLG_SYSTEM_DIRECT_ALIAS_ABSENT_TIP_DESC">
								<option value="1">PLG_SYSTEM_DIRECT_ALIAS_ABSENT</option>
								<option value="0">PLG_SYSTEM_DIRECT_ALIAS_PRESENT</option>
							</field>
						</fieldset>
					</fields>
				</form>', false);
		}

		return true;
	}

	/**
	 * @since 1.0
	 */
	public function onAfterInitialise()
	{
		if ($this->app->isClient('administrator'))
		{
			return;
		}

		// Falang overloads menu items via own router's parse rule, so we need to update routes after its rule but now now.
		if (class_exists('plgSystemFalangdriver'))
		{
			/** @noinspection NullPointerExceptionInspection */
			/** @noinspection PhpUndefinedMethodInspection */
			SiteApplication::getRouter()->attachParseRule([
				$this,
				'updateDirectRoutes',
			]);
		}
		else
		{
			$this->updateDirectRoutes();
		}
	}

	/**
	 * @since 1.0
	 */
	public function updateDirectRoutes()
	{
		// Execute only once since method can be attached as parse rule and executed multiple times.
		static $updated;
		if ($updated)
		{
			return;
		}
		$updated = true;

		/** @var \Joomla\CMS\Menu\SiteMenu $menu */
		$menu = $this->app->getMenu();

		// Get items.
		/** @noinspection PhpUnhandledExceptionInspection */
		/** @var \ReflectionProperty $rProperty */
		$items = $this->getMenuItems($menu, $rProperty);

		$direct_aliases = [];

		$shorten_all = $this->params->get('shorten_all');

		/** @var stdClass[] $items */
		foreach ($items as &$item)
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
				$absent_alias = $item->params->get('absent_alias');
				$direct_alias = $item->params->get('direct_alias');

				if ($absent_alias && $direct_alias)
				{
					$direct_aliases[$item->route] = '';

					$item->route = $item->alias;
				}
				// Remove alias for all children
				elseif ($absent_alias)
				{
					if (!isset($direct_aliases[$item->route]))
					{
						$direct_aliases[$item->route] = trim(dirname($item->route), './');
					}
				}

				// Own direct alias
				// Remove parent alias
				elseif ($direct_alias)
				{
					$direct_aliases[$item->route] = $item->alias;

					$item->route = $item->alias;
				}
				// Remove parent alias of parents with direct aliases
				elseif ($item->level > 1 && !empty($direct_aliases))
				{
					$test_route = $item->route;

					while ($test_route = substr($test_route, 0, strrpos($test_route, '/')))
					{
						if (isset($direct_aliases[$test_route]))
						{
							$item->route = trim($direct_aliases[$test_route] . '/' . substr($item->route, strlen($test_route) + 1), '/');
							break;
						}
					}
				}
			}
		}
	}

	/**
	 * @param \Joomla\CMS\Menu\SiteMenu $menu
	 * @param \ReflectionProperty       $rProperty
	 *
	 * @return array
	 * @throws \ReflectionException
	 * @since 2.0
	 */
	protected function getMenuItems($menu, &$rProperty = null)
	{
		/** @noinspection PhpUnhandledExceptionInspection */
		$rProperty = new ReflectionProperty($menu, version_compare(JVERSION, '4.0', 'l') ? '_items' : 'items');
		$rProperty->setAccessible(true);

		return $rProperty->getValue($menu);
	}
}
