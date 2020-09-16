<?php

/**
 * @package        Direct Alias
 * @copyright      Copyright (C) 2009-2020 AlterBrains.com. All rights reserved.
 * @license        http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

use Joomla\CMS\Application\SiteApplication;
use Joomla\CMS\Form\Form;
use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Router\SiteRouter;
use Joomla\CMS\Uri\Uri;

defined('_JEXEC') or die('Restricted access');

/**
 * Class plgSystemDirectalias
 *
 * @since        1.0
 * @noinspection UnknownInspectionInspection
 * @noinspection PhpUnused
 */
class plgSystemDirectalias extends CMSPlugin
{
	/**
	 * @var SiteApplication
	 * @since 1.2.1
	 */
	protected $app;

	/**
	 * @var array
	 * @since 2.1.0
	 */
	public $short_ids = [];

	/**
	 * @param Form $form The form
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
	 * @since        1.0
	 * @noinspection UnknownInspectionInspection
	 * @noinspection PhpUnused
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
	 * Joomla4 requires parent_id=1 for top-level shorten URLs.
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

		// Just shorten all URLs.
		if ($this->params->get('shorten_all'))
		{
			foreach ($this->app->getMenu()->getMenu() as $item)
			{
				/** @noinspection PhpUndefinedFieldInspection */
				$item->_route = $item->route;
				$item->route  = $item->alias;
			}
		}
		// Or custom settings per menu item
		else
		{
			$direct_aliases = [];

			foreach ($this->app->getMenu()->getMenu() as $item)
			{
				/** @noinspection PhpUndefinedFieldInspection */
				$item->_route = $item->route;

				$absent_alias = $item->getParams()->get('absent_alias');
				$direct_alias = $item->getParams()->get('direct_alias');

				if ($absent_alias && $direct_alias)
				{
					$direct_aliases[$item->route] = '';

					$item->route       = $item->alias;
					$this->short_ids[] = $item->id;
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

					$item->route       = $item->alias;
					$this->short_ids[] = $item->id;
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

							if ($direct_aliases[$test_route] === '')
							{
								$this->short_ids[] = $item->id;
							}
							break;
						}
					}
				}
			}
		}

		// Decorate native SiteRouter::parseSefRoute() which uses parent_id=1 for top-level items.
		if (version_compare(JVERSION, '4.0', 'ge'))
		{
			$this->decorateJoomlaParseSefRoute();
		}
	}

	/**
	 * @since 2.1.0
	 */
	protected function decorateJoomlaParseSefRoute()
	{
		$router = SiteApplication::getRouter();

		$getDuringRules = (static function &($router) {
			return $router->rules['parse' . $router::PROCESS_DURING];
		})->bindTo(null, get_class($router));

		foreach ($getDuringRules($router) as &$callback)
		{
			if (is_array($callback)
				&& $callback[1] === 'parseSefRoute'
				&& is_object($callback[0])
				&& get_class($callback[0]) === SiteRouter::class
			)
			{
				/**
				 * @param SiteRouter $router
				 * @param Uri        $uri
				 *
				 * @since 2.1.0
				 */
				$callback = function (&$router, &$uri) {
					// Update all parent_id to 1 as required in Joomla 4
					if ($this->params->get('shorten_all'))
					{
						foreach ($this->app->getMenu()->getMenu() as $item)
						{
							/** @noinspection PhpUndefinedFieldInspection */
							$item->_parent_id = $item->parent_id;
							$item->parent_id  = 1;
						}
					}
					else
					{
						$items = $this->app->getMenu()->getMenu();

						foreach ($this->short_ids as $id)
						{
							$items[$id]->_parent_id = $items[$id]->parent_id;
							$items[$id]->parent_id  = 1;
						}
					}

					// Execute original parse rule.
					$router->parseSefRoute($router, $uri);

					// Restore parent_id
					if ($this->params->get('shorten_all'))
					{
						foreach ($this->app->getMenu()->getMenu() as $item)
						{
							/** @noinspection PhpUndefinedFieldInspection */
							$item->parent_id = $item->_parent_id;
						}
					}
					else
					{
						$items = $this->app->getMenu()->getMenu();

						foreach ($this->short_ids as $id)
						{
							$items[$id]->parent_id = $items[$id]->_parent_id;
						}
					}
				};

				break;
			}
		}
	}
}
