<?php defined('_JEXEC') or die('Restricted access');

/**
 * @author     Garda Informatica <info@gardainformatica.it>
 * @copyright  Copyright (C) 2014 Garda Informatica. All rights reserved.
 * @license    http://www.gnu.org/licenses/gpl-3.0.html  GNU General Public License version 3
 * @package    JSocialFeed Joomla Extension
 * @link       http://www.gardainformatica.it
 */

/*

This file is part of "JSocialFeed Joomla Extension".

"JSocialFeed Joomla Extension" is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

"JSocialFeed Joomla Extension" is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with "JSocialFeed Joomla Extension".  If not, see <http://www.gnu.org/licenses/>.

*/

$owner = JRequest::getVar("mod_owner", "", "GET");
$id = intval(JRequest::getVar("mod_id", 0, "GET"));
JFactory::getLanguage()->load("jsocialfeed", JPATH_LIBRARIES . "/jsocialfeed");

$params=$this->Params;
?>

function jsf_init_<?php echo $owner; ?>_<?php echo $id; ?>()
{
	if (jsf_data_<?php echo $owner; ?>_<?php echo $id; ?>.messages){
		for (var i=0;i<jsf_data_<?php echo $owner; ?>_<?php echo $id; ?>.messages.length;i++){
			var msg_map=jsf_data_<?php echo $owner; ?>_<?php echo $id; ?>.messages[i];
			var div_alert=jQuery('<div class="alert"></div>').text(msg_map['msg']);
			jQuery('#jsocialfeed-<?php echo $owner; ?>-<?php echo $id; ?>').before(div_alert);
		}
	}

	if (!jsf_data_<?php echo $owner; ?>_<?php echo $id; ?>.html.length)
	{
		return;
	}
	
<?php
$options = new stdClass();
$options->captions=false;
$options->mode=$params->get("scroll", 'horizontal');
$options->easing=$params->get("easing", 'linear');
if (in_array($options->easing,array('linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'))){
	$options->useCSS=true;
}else{
	$options->useCSS=false;
}

$options->adaptiveHeight=$params->get("adaptive_height", 1)==1;
$options->autoHover=true;
$options->auto=true;
$options->pause=max(floatval($params->get("pause", 2))*1000,100);
$options->pager=false;
$options->stopAuto=false;

//solo se vertical
if ($options->mode=='vertical'){
	$options->minSlides=max(intval($params->get("vertical_num_slides",1)),1);
	$options->moveSlides=max(intval($params->get("vertical_move_slides",1)),1);
	$options->moveSlides=min($options->moveSlides,$options->minSlides);
	$options->maxSlides=$options->minSlides;
}

?>
	
	jQuery( document ).ready(function($) {
		jQuery('#jsocialfeed-loading-<?php echo $owner; ?>-<?php echo $id; ?>').remove();
		jQuery('#jsocialfeed-<?php echo $owner; ?>-<?php echo $id; ?>').append(jsf_data_<?php echo $owner; ?>_<?php echo $id; ?>.html);
		jQuery('#jsocialfeed-<?php echo $owner; ?>-<?php echo $id; ?>').bxSlider(<?php echo json_encode($options); ?>);
		//jQuery('#jsocialfeed-<?php echo $owner; ?>-<?php echo $id; ?>').removeClass('jsf-displaynone');
	});
	
}

