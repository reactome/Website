<?php

/**
 * @copyright     Copyright (c) 2009-2017 Ryan Demmer. All rights reserved
 * @license       GNU/GPL 2 or later - http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * JCE is free software. This version may have been modified pursuant
 * to the GNU General Public License, and as distributed it includes or
 * is derivative of works licensed under the GNU General Public License or
 * other free or open source software licenses
 */
defined('_WF_EXT') or die('RESTRICTED');

class JoomlalinksContent extends JObject
{
    public $_option = 'com_content';

    /**
     * Constructor activating the default information of the class.
     */
    public function __construct($options = array())
    {
    }

    /**
     * Returns a reference to a editor object.
     *
     * This method must be invoked as:
     *         <pre>  $browser =JContentEditor::getInstance();</pre>
     *
     * @return JCE The editor object
     *
     * @since    1.5
     */
    public static function getInstance()
    {
        static $instance;

        if (!is_object($instance)) {
            $instance = new self();
        }

        return $instance;
    }

    public function getOption()
    {
        return $this->_option;
    }

    public function getList()
    {
        $wf = WFEditorPlugin::getInstance();

        if ($wf->checkAccess('links.joomlalinks.content', 1)) {
            return '<li data-id="index.php?option=com_content" class="folder content nolink"><div class="uk-tree-row"><a href="#"><span class="uk-tree-icon"></span><span class="uk-tree-text">' . WFText::_('WF_LINKS_JOOMLALINKS_CONTENT') . '</span></a></div></li>';
        }
    }

    public function getLinks($args)
    {
        $wf = WFEditorPlugin::getInstance();

        require_once JPATH_SITE . '/components/com_content/helpers/route.php';

        $items = array();
        $view = isset($args->view) ? $args->view : '';

        $language = '';

        switch ($view) {
            // get top-level sections / categories
            default:
                $sections = self::_getSection();

                foreach ($sections as $section) {
                    $url = '';

                    // Joomla! 1.5
                    if (method_exists('ContentHelperRoute', 'getSectionRoute')) {
                        $id = ContentHelperRoute::getSectionRoute($section->id);
                        $view = 'section';
                    } else {
                        if (isset($section->language)) {
                            $language = $category->language;
                        }

                        $id = ContentHelperRoute::getCategoryRoute($section->slug, $language);
                        $view = 'category';
                    }

                    if (strpos($id, 'index.php?Itemid=') !== false) {
                        $url = self::_getMenuLink($id);
                        $id = 'index.php?option=com_content&view=' . $view . '&id=' . $section->id;
                    }

                    $items[] = array(
                        'url' => self::route($url),
                        'id' => $id,
                        'name' => $section->title,
                        'class' => 'folder content',
                    );
                }
                // Check Static/Uncategorized permissions
                if (!defined('JPATH_PLATFORM') && $wf->checkAccess('static', 1)) {
                    $items[] = array(
                        'id' => 'option=com_content&amp;view=uncategorized',
                        'name' => WFText::_('WF_LINKS_JOOMLALINKS_UNCATEGORIZED'),
                        'class' => 'folder content nolink',
                    );
                }
                break;
            // get categories in section or sub-categories (Joomla! 1.6+)
            case 'section':
                $articles = array();

                // Joomla! 1.5
                if (method_exists('ContentHelperRoute', 'getSectionRoute')) {
                    $categories = WFLinkBrowser::getCategory($args->id, 'com_content');
                } else {
                    $categories = WFLinkBrowser::getCategory('com_content', $args->id);

                    // get any articles in this category (in Joomla! 1.6+ a category can contain sub-categories and articles)
                    $articles = self::_getArticles($args->id);
                }

                foreach ($categories as $category) {
                    $url = '';

                    if (isset($category->language)) {
                        $language = $category->language;
                    }

                    $id = ContentHelperRoute::getCategoryRoute($category->id, $args->id, $language);

                    if (strpos($id, 'index.php?Itemid=') !== false) {
                        $url = self::_getMenuLink($id);
                        $id = 'index.php?option=com_content&view=category&id=' . $category->id;
                    }

                    $items[] = array(
                        'url' => self::route($url),
                        'id' => $id,
                        'name' => $category->title . ' / ' . $category->alias,
                        'class' => 'folder content',
                    );
                }

                if (!empty($articles)) {
                    // output article links
                    foreach ($articles as $article) {
                        // Joomla! 1.5
                        if (isset($article->sectionid)) {
                            $id = ContentHelperRoute::getArticleRoute($article->slug, $article->catslug, $article->sectionid);
                        } else {
                            if (isset($article->language)) {
                                $language = $article->language;
                            }

                            $id = ContentHelperRoute::getArticleRoute($article->slug, $article->catslug, $language);
                        }

                        $id = self::route($id);

                        $items[] = array(
                            'id' => $id,
                            'name' => $article->title . ' / ' . $article->alias,
                            'class' => 'file',
                        );

                        $anchors = self::getAnchors($article->content);

                        foreach ($anchors as $anchor) {
                            $items[] = array(
                                'id' => $id . '#' . $anchor,
                                'name' => '#' . $anchor,
                                'class' => 'file anchor',
                            );
                        }
                    }
                }

                break;
            // get articles and / or sub-categories
            case 'category':
                // get any articles in this category (in Joomla! 1.6+ a category can contain sub-categories and articles)
                $articles = self::_getArticles($args->id);

                if (defined('JPATH_PLATFORM')) {
                    // get sub-categories
                    $categories = WFLinkBrowser::getCategory('com_content', $args->id);

                    if (count($categories)) {
                        foreach ($categories as $category) {
                            // check for sub-categories
                            $sub = WFLinkBrowser::getCategory('com_content', $category->id);

                            // language
                            if (isset($category->language)) {
                                $language = $category->language;
                            }

                            $url = '';
                            $id = ContentHelperRoute::getCategoryRoute($category->id, $language);

                            // get sub-categories
                            if (count($sub)) {
                                $url = $id;
                                $id = 'index.php?option=com_content&view=section&id=' . $category->id;
                                // no sub-categories, get articles for category
                            } else {
                                // no com_content, might be link like index.php?ItemId=1
                                if (strpos($id, 'index.php?Itemid=') !== false) {
                                    $url = $id; //$id;
                                    $id = 'index.php?option=com_content&view=category&id=' . $category->id;
                                }
                            }

                            if (strpos($url, 'index.php?Itemid=') !== false) {
                                $url = self::_getMenuLink($url);
                            }

                            $items[] = array(
                                'url' => self::route($url),
                                'id' => $id,
                                'name' => $category->title . ' / ' . $category->alias,
                                'class' => 'folder content',
                            );
                        }
                    }
                }

                // output article links
                foreach ($articles as $article) {
                    // Joomla! 1.5
                    if (isset($article->sectionid)) {
                        $id = ContentHelperRoute::getArticleRoute($article->slug, $article->catslug, $article->sectionid);
                    } else {
                        // language
                        if (isset($article->language)) {
                            $language = $article->language;
                        }

                        $id = ContentHelperRoute::getArticleRoute($article->slug, $article->catslug, $language);
                    }

                    $id = self::route($id);

                    $items[] = array(
                        'id' => $id,
                        'name' => $article->title . ' / ' . $article->alias,
                        'class' => 'file' . ($article->state ? '' : ' unpublished uk-text-muted'),
                    );

                    $anchors = self::getAnchors($article->content);

                    foreach ($anchors as $anchor) {
                        $items[] = array(
                            'id' => $id . '#' . $anchor,
                            'name' => '#' . $anchor,
                            'class' => 'file anchor',
                        );
                    }
                }

                break;
            case 'uncategorized':
                $statics = self::_getUncategorized();
                foreach ($statics as $static) {
                    // language
                    if (isset($static->language)) {
                        $language = $static->language;
                    }

                    $id = ContentHelperRoute::getArticleRoute($static->id, 0, $language);

                    $id = self::route($id);

                    $items[] = array(
                        'id' => $id,
                        'name' => $static->title . ' / ' . $static->alias,
                        'class' => 'file' . ($article->state ? '' : ' unpublished uk-text-muted'),
                    );

                    $anchors = self::getAnchors($statics->content);

                    foreach ($anchors as $anchor) {
                        $items[] = array(
                            'id' => $id . '#' . $anchor,
                            'name' => '#' . $anchor,
                            'class' => 'file anchor',
                        );
                    }
                }
                break;
        }

        return $items;
    }

    private function _getMenuLink($url)
    {
        $wf = WFEditorPlugin::getInstance();

        // resolve the url from the menu link
        if ($wf->getParam('links.joomlalinks.article_resolve_alias', 1) == 1) {
            // get itemid
            preg_match('#Itemid=([\d]+)#', $url, $matches);
            // get link from menu
            if (count($matches) > 1) {
                $menu = JTable::getInstance('menu');
                $menu->load($matches[1]);

                if ($menu->link) {
                    return $menu->link . '&Itemid=' . $menu->id;
                }
            }
        }

        return $url;
    }

    private function _getSection()
    {
        $db = JFactory::getDBO();
        $user = JFactory::getUser();

        $isSuperUser = JUserHelper::checkSuperUserInUsers(array($user->id));

        if (method_exists('JUser', 'getAuthorisedViewLevels')) {
            return WFLinkBrowser::getCategory('com_content');
        } else {

            $query = 'SELECT id, title, alias, access'
                . ' FROM #__sections'
                . ' WHERE published = 1';

            if ($user->get('gid') != 25) {
                $query .= ' AND access <= ' . (int) $user->get('aid');
            }

            $query .= ' ORDER BY title';

            $db->setQuery($query);

            return $db->loadObjectList();
        }
    }

    private function _getArticles($id)
    {
        $db = JFactory::getDBO();
        $user = JFactory::getUser();
        $wf = WFEditorPlugin::getInstance();

        $query = $db->getQuery(true);
        $version = new JVersion();

        $language = $version->isCompatible('3.0') ? ', a.language' : '';
        $case = '';

        if ($wf->getParam('links.joomlalinks.article_alias', 1) == 1) {
            if (is_object($query)) {
                //sqlsrv changes
                $case_when1 = ' CASE WHEN ';
                $case_when1 .= $query->charLength('a.alias', '!=', '0');
                $case_when1 .= ' THEN ';
                $a_id = $query->castAsChar('a.id');
                $case_when1 .= $query->concatenate(array($a_id, 'a.alias'), ':');
                $case_when1 .= ' ELSE ';
                $case_when1 .= $a_id . ' END as slug';

                $case_when2 = ' CASE WHEN ';
                $case_when2 .= $query->charLength('b.alias', '!=', '0');
                $case_when2 .= ' THEN ';
                $c_id = $query->castAsChar('b.id');
                $case_when2 .= $query->concatenate(array($c_id, 'b.alias'), ':');
                $case_when2 .= ' ELSE ';
                $case_when2 .= $c_id . ' END as catslug';
            } else {
                $case_when1 = ' CASE WHEN CHAR_LENGTH(a.alias) THEN CONCAT_WS(":", a.id, a.alias) ELSE a.id END as slug';
                $case_when2 = ' CASE WHEN CHAR_LENGTH(b.alias) THEN CONCAT_WS(":", b.id, b.alias) ELSE b.id END as catslug';
            }

            $case = ',' . $case_when1 . ',' . $case_when2;
        }

        if (is_object($query)) {
            $groups = implode(',', $user->getAuthorisedViewLevels());

            $query->select('a.id AS slug, b.id AS catslug, a.alias, a.state, a.title AS title, a.access, ' . $query->concatenate(array('a.introtext', 'a.fulltext')) . ' AS content' . $language . $case);
            $query->from('#__content AS a');
            $query->innerJoin('#__categories AS b ON b.id = ' . (int) $id);
            
            $query->where('a.state = 1');

            if ($wf->getParam('links.joomlalinks.article_unpublished', 0) == 1) {
                $query->orWhere('a.state = 0');
            }

            $query->andWhere('a.catid = ' . (int) $id);

            if (!$user->authorise('core.admin')) {
                $query->andWhere('a.access IN (' . $groups . ')');
                $query->andWhere('b.access IN (' . $groups . ')');
            }

            $query->order('a.title');
        } else {
            $query = 'SELECT a.id AS slug, b.id AS catslug, a.alias, a.state, a.title AS title, u.id AS sectionid, a.access, a.introtext, a.fulltext' . $case
            . ' FROM #__content AS a'
            . ' INNER JOIN #__categories AS b ON b.id = ' . (int) $id
            . ' INNER JOIN #__sections AS u ON u.id = a.sectionid'
            . ' WHERE a.catid = ' . (int) $id;

            if ($wf->getParam('links.joomlalinks.article_unpublished', 0) == 1) {
                $query .= ' (AND a.state = 1 OR a.state = 0)';
            } else {
                $query .= ' AND a.state = 1';
            }

            if ($user->get('gid') != 25) {
                $query .= ' AND a.access <= ' . (int) $user->get('aid');
            }

            $query .= ' ORDER BY a.title';
        }

        $db->setQuery($query, 0);

        return $db->loadObjectList();
    }

    private function _getUncategorized()
    {
        $db = JFactory::getDBO();
        $user = JFactory::getUser();

        $version = new JVersion();
        $language = $version->isCompatible('3.0') ? ', language' : '';

        $query = 'SELECT id, title, alias, access, state, introtext AS content' . $language
            . ' FROM #__content'
            . ' WHERE sectionid = 0'
            . ' AND catid = 0';

            if ($wf->getParam('links.joomlalinks.article_unpublished', 0) == 1) {
                $query .= ' (AND state = 1 OR state = 0)';
            } else {
                $query .= ' AND state = 1';
            }

            if ($user->get('gid') != 25) {
                $query .= ' AND access <= ' . (int) $user->get('aid');
            }

            $query .= ' ORDER BY title';

        $db->setQuery($query, 0);

        return $db->loadObjectList();
    }

    private function getItemId($url)
    {
    }

    private static function getAnchors($content)
    {
        preg_match_all('#<a([^>]+)(name|id)="([a-z]+[\w\-\:\.]*)"([^>]*)>#i', $content, $matches, PREG_SET_ORDER);

        $anchors = array();

        if (!empty($matches)) {
            foreach ($matches as $match) {
                if (strpos($match[0], 'href') === false) {
                    $anchors[] = $match[3];
                }
            }
        }

        return $anchors;
    }

    private static function route($url)
    {
        $wf = WFEditorPlugin::getInstance();

        if ($wf->getParam('links.joomlalinks.sef_url', 0)) {
            $url = WFLinkExtension::route($url);
        }

        return $url;
    }
}
