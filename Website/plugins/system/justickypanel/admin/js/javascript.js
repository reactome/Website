/**
 * ------------------------------------------------------------------------
 * JU Backend Toolkit for Joomla 2.5/3.x
 * ------------------------------------------------------------------------
 * Copyright (C) 2010-2013 JoomUltra. All Rights Reserved.
 * @license - GNU/GPL, http://www.gnu.org/licenses/gpl.html
 * Author: JoomUltra Co., Ltd
 * Websites: http://www.joomultra.com
 * ------------------------------------------------------------------------
 */
 
JU_jQuery(document).ready(function($){
	//JU Group
	$(".jugroup").jugroup();
	
	//JU Filter
	$(".jufilter").jufilter();
	
	//Fix margin of jugallery and julayoutsettings for J3.x
	$(".control-group .controls .jugallery-holder").closest(".controls").css({margin: '0'});
	$(".control-group .controls .julayoutsettings").closest(".controls").css({margin: '0'});
});
