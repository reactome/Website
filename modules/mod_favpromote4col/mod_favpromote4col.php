<?php

/**
 *   FavPromote
 *
 *   Responsive and customizable Joomla!3 module
 *
 *   @version        2.1
 *   @link           http://extensions.favthemes.com/favpromote
 *   @author         FavThemes - http://www.favthemes.com
 *   @copyright      Copyright (C) 2012-2017 FavThemes.com. All Rights Reserved.
 *   @license        Licensed under GNU/GPLv3, see http://www.gnu.org/licenses/gpl-3.0.html
 */

// no direct access

defined('_JEXEC') or die;

$jquery_load                            = $params->get('jquery_load');
$layout_effect                          = $params->get('layout_effect');

$title_google_font                      = $params->get('title_google_font');
$title_font_weight                      = $params->get('title_font_weight');
$title_font_style                       = $params->get('title_font_style');
$title_padding                          = $params->get('title_padding');
$title_font_size                        = $params->get('title_font_size');
$title_line_height                      = $params->get('title_line_height');
$title_text_align                       = $params->get('title_text_align');
$title_icon_font_size                   = $params->get('title_icon_font_size');
$title_icon_vertical_align              = $params->get('title_icon_vertical_align');

$description_text_font_size             = $params->get('description_text_font_size');
$description_text_line_height           = $params->get('description_text_line_height');
$description_text_align                 = $params->get('description_text_align');

for ($j=1;$j<21;$j++) {

	${'show_column'.$j}                     = $params->get('show_column'.$j);
	${'column_border_color'.$j}             = $params->get('column_border_color'.$j);
	${'column_border_radius'.$j}            = $params->get('column_border_radius'.$j);
	${'upload_image'.$j}                    = $params->get('upload_image'.$j);
	${'image_link'.$j}                      = $params->get('image_link'.$j);
	${'image_link_target'.$j}               = $params->get('image_target'.$j);
	${'image_alt'.$j}                       = $params->get('image_alt'.$j);
	${'title_text'.$j}                      = $params->get('title_text'.$j);
	${'title_color'.$j}                     = $params->get('title_color'.$j);
	${'title_bg_color'.$j}                  = $params->get('title_bg_color'.$j);
	${'title_link'.$j}                      = $params->get('title_link'.$j);
	${'title_link_target'.$j}               = $params->get('title_link_target'.$j);
	${'title_icon'.$j}                      = $params->get('title_icon'.$j);
	${'description_text'.$j}                = $params->get('description_text'.$j);
	${'description_text_color'.$j}          = $params->get('description_text_color'.$j);
	${'widget_text'.$j}                     = $params->get('widget_text'.$j);
	${'order'.$j}                           = $params->get('order'.$j);

}

$custom_id = rand(10000,20000);

// Load Bootstrap

if ($jquery_load) {JHtml::_('jquery.framework'); }

// check if favth-bootstrap already loaded
$jhead = JFactory::getDocument();
$lscripts = $jhead->_scripts;
$load_favthb = true;
foreach ($lscripts as $k => $v) { if (strpos($k, 'favth-bootstrap') !== false) { $load_favthb = false; break; } }
// end check if favth-bootstrap already loaded

if ($load_favthb) {
	JHTML::stylesheet('modules/mod_favpromote4col/theme/bootstrap/favth-bootstrap.css');
	JHTML::script('modules/mod_favpromote4col/theme/bootstrap/favth-bootstrap.js');
}

// END Load Bootstrap

// Module CSS
JHTML::stylesheet('modules/mod_favpromote4col/theme/css/favpromote4col.css');
JHTML::stylesheet('//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
// Google Font
JHTML::stylesheet('//fonts.googleapis.com/css?family='.str_replace(" ","+",$title_google_font).':'.$title_font_weight.str_replace("normal","",$title_font_style));

// Scripts
JHTML::script('modules/mod_favpromote4col/theme/js/viewportchecker/viewportchecker.js');

?>

<style type="text/css">

    .favpromote4col1-<?php echo $custom_id; ?>:hover { background-color: #<?php echo $title_bg_color1; ?>; }
    .favpromote4col2-<?php echo $custom_id; ?>:hover { background-color: #<?php echo $title_bg_color2; ?>; }
    .favpromote4col3-<?php echo $custom_id; ?>:hover { background-color: #<?php echo $title_bg_color3; ?>; }
    .favpromote4col4-<?php echo $custom_id; ?>:hover { background-color: #<?php echo $title_bg_color4; ?>; }
    .favpromote4col5-<?php echo $custom_id; ?>:hover { background-color: #<?php echo $title_bg_color5; ?>; }
    .favpromote4col6-<?php echo $custom_id; ?>:hover { background-color: #<?php echo $title_bg_color6; ?>; }

</style>

<?php if ($layout_effect != 'layout-effect-none') { ?>

    <script type="text/javascript">
        jQuery(document).ready(function() {
            jQuery('#favpromote-<?php echo $custom_id; ?> .layout-effect').addClass("favhide").viewportChecker({
                classToAdd: 'favshow <?php echo $layout_effect; ?>', // Class to add to the elements when they are visible
                offset: 100
            });
        });
    </script>

<?php } ?>

<div id="favpromote4col-<?php echo $custom_id; ?>" class="favth-row">

	<?php
	$col_class = '';
	$active_columns = array($show_column1,$show_column2,$show_column3,$show_column4,$show_column5,$show_column6);
	$columns_check = 0; foreach ($active_columns as $active_column) { if ($active_column == 1) { $columns_check++; } }

	if ($columns_check == 6) { $col_class = 'favth-col-lg-2 favth-col-md-4 favth-col-sm-6 favth-col-xs-12'; }
	else if ($columns_check == 5) { $col_class = 'favth-col-lg-2-4 favth-col-md-4 favth-col-sm-6 favth-col-xs-12'; }
	else if ($columns_check <= 4) { $col_class = 'favth-col-lg-3 favth-col-md-3 favth-col-sm-6 favth-col-xs-12'; }
	//else if ($columns_check == 3) { $col_class = 'favth-col-lg-4 favth-col-md-4 favth-col-sm-4 favth-col-xs-12'; }
	//else if ($columns_check == 2) { $col_class = 'favth-col-lg-6 favth-col-md-6 favth-col-sm-6 favth-col-xs-12'; }
	//else if ($columns_check == 1) { $col_class = 'favth-col-lg-12 favth-col-md-12 favth-col-sm-12 favth-col-xs-12'; }

	$col_class = 'favth-col-lg-3 favth-col-md-3 favth-col-sm-6 favth-col-xs-12';

	$seq = array();
	for ($i=1;$i<21;$i++) {
		$seq[] = ${'order'.$i};
	}
	ksort($seq);

	for ($i=0;$i<20;$i++) {
		$newi = $seq[$i];

		if ((${'show_column'.$newi}) !=0) {   ?>

            <div class="favpromote4col <?php echo $col_class; ?>">

                <div id="favpromote4col-box<?php echo $newi; ?>"
                     class="favpromote4col<?php echo $newi; ?>-<?php echo $custom_id; ?> layout-effect"
                     style="border: 1px solid #<?php echo ${'column_border_color'.$newi}; ?>;
                             -webkit-border-radius: <?php echo ${'column_border_radius'.$newi}; ?>;
                             -moz-border-radius: <?php echo ${'column_border_radius'.$newi}; ?>;
                             border-radius: <?php echo ${'column_border_radius'.$newi}; ?>;">

                    <div id="favpromote4col-image<?php echo $newi; ?>"
                         style="height:100%; text-align: center;">

						<?php // Do not receive link if the link setting is empty
						if(empty(${'image_link'.$newi})) { ?>

							<?php if (${'upload_image'.$newi}) { ?>
                                <img src="<?php echo ${'upload_image'.$newi}; ?>"
                                     alt="<?php echo ${'image_alt'.$newi}; ?>"/>
							<?php } else { ?>
                                <img src="modules/mod_favpromote4col/demo/demo-image<?php echo $newi; ?>.jpg"
                                     alt="<?php echo ${'image_alt'.$newi}; ?>" />
							<?php } ?>

						<?php } else { ?>

                            <a href="<?php echo ${'image_link'.$newi}; ?>" target="_<?php echo ${'image_link_target'.$newi}; ?>" >

								<?php if (${'upload_image'.$newi}) { ?>
                                    <img src="<?php echo ${'upload_image'.$newi}; ?>"
                                         alt="<?php echo ${'image_alt'.$newi}; ?>"/>
								<?php } else { ?>
                                    <img src="modules/mod_favpromote4col/demo/demo-image<?php echo $newi; ?>.jpg"
                                         alt="<?php echo ${'image_alt'.$newi}; ?>" />
								<?php } ?>

                            </a>

						<?php } ?>

                    </div>

                    <p id="favpromote4col-text<?php echo $newi; ?>"
                       style=" height: 150px;
                               overflow:auto;
                               color: #<?php echo ${'description_text_color'.$newi}; ?>;
                               font-size: <?php echo $description_text_font_size; ?>;
                               line-height: <?php echo $description_text_line_height; ?>;
                               text-align: <?php echo $description_text_align; ?>;">
						<?php echo ${'description_text'.$newi}; ?>
                    </p>

                    <p id="favpromote4col-widget<?php echo $newi; ?>"
                       style=" margin-top: 15px;
                               color: #<?php echo ${'description_text_color'.$newi}; ?>;
                               font-size: <?php echo $description_text_font_size; ?>;
                               line-height: <?php echo $description_text_line_height; ?>;
                               text-align: <?php echo $description_text_align; ?>;">
						<?php echo ${'widget_text'.$newi}; ?>
                    </p>

                    <h4 id="favpromote4col-title<?php echo $newi; ?>"
                        style="color: #<?php echo ${'title_color'.$newi}; ?>;
                                background-color: #<?php echo ${'title_bg_color'.$newi}; ?>;
                                font-family: <?php echo $title_google_font; ?>;
                                font-weight: <?php echo $title_font_weight; ?>;
                                font-style: <?php echo $title_font_style; ?>;
                                padding: <?php echo $title_padding; ?>;
                                font-size: <?php echo $title_font_size; ?>;
                                line-height: <?php echo $title_line_height; ?>;
                                text-align: <?php echo $title_text_align; ?>;
                                margin-bottom:0;">
                        <i class="fa <?php echo ${'title_icon'.$newi}; ?>"
                           style="color: #<?php echo ${'title_color'.$newi}; ?>;
                                   font-size: <?php echo $title_icon_font_size; ?>;
                                   vertical-align: <?php echo $title_icon_vertical_align; ?>;
                                   padding-right: 0.4em;"></i>

						<?php // Do not receive link if the link setting is empty
						if(empty(${'title_link'.$newi})) { ?>

							<?php echo ${'title_text'.$newi}; ?>

						<?php } else { ?>

                            <a href="<?php echo ${'title_link'.$newi}; ?>" target="_<?php echo ${'title_link_target'.$newi}; ?>"
                               style="color: #<?php echo ${'title_color'.$newi}; ?>;">

								<?php echo ${'title_text'.$newi}; ?>

                            </a>

						<?php } ?>

                    </h4>

                </div>

            </div>

		<?php } } ?>

</div>
