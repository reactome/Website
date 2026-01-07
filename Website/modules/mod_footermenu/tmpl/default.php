<?php
/**
 * @package		Footer Menu for Joomla! 3.0+
 * @subpackage	mod_footermenu
 * @copyright	Copyright (C) 2013-2015 KMO Design Pty Ltd. All rights reserved.
 * @license     GNU/GPLv3 http://www.gnu.org/licenses/gpl-3.0.html
 */

// No direct access.
defined('_JEXEC') or die;

// Note. It is important to remove spaces between elements.
?>
<div class="menu<?php echo $class_sfx; if($useDefault) { echo ' footer-sitemap-menu'; }?>"<?php
	$tag = '';
	if ($params->get('tag_id')!=NULL) {
		$tag = $params->get('tag_id').'';
		echo ' id="'.$tag.'"';
	}
?>> 
<?php
$level = 0;

foreach ($list as $i => &$item) :
	if($i % $columns == 0) {
		echo '<ul>';
	}

	$class = 'item-'.$item->id;
	if ($item->id == $active_id) {
		$class .= ' current';
	}

	if (in_array($item->id, $path)) {
		$class .= ' active';
	}
	elseif ($item->type == 'alias') {
		$aliasToId = $item->params->get('aliasoptions');
		if (count($path) > 0 && $aliasToId == $path[count($path)-1]) {
			$class .= ' active';
		}
		elseif (in_array($aliasToId, $path)) {
			$class .= ' alias-parent-active';
		}
	}

	$class .= ' level'.$level;

	if ($item->deeper) {
		$class .= ' deeper';
	}

	if ($item->parent) {
		$class .= ' parent';
	}

	if (!empty($class)) {
		$class = ' class="'.trim($class) .'"';
	}

	echo '<li'.$class.'>';

	// Render the menu item.
	switch ($item->type) :
		case 'separator':
		case 'url':
		case 'component':
			require JModuleHelper::getLayoutPath('mod_footermenu', 'default_'.$item->type);
			break;

		default:
			require JModuleHelper::getLayoutPath('mod_footermenu', 'default_url');
			break;
	endswitch;


	// The next item is deeper.
	if ($item->deeper) {
		$level += 1;
	}
	// The next item is shallower.
	elseif ($item->shallower) {
		$level -= $item->level_diff;
	}
	elseif ($item->parent) {
		$level == 0;
	}

	echo '</li>';

	if((($i + 1) % $columns == 0) || ($i == count($list) - 1)) {
		echo '</ul>';
	}

endforeach;
?></div>
