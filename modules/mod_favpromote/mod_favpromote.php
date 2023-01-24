<?php

/**
*   FavPromote
*
*   Responsive and customizable Joomla!3 module
*
*   @version        2.2
*   @link           http://extensions.favthemes.com/favpromote
*   @author         FavThemes - http://www.favthemes.com
*   @copyright      Copyright (C) 2012-2018 FavThemes.com. All Rights Reserved.
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

for ($j=1;$j<7;$j++) {

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

}

$custom_id = rand(10000,20000);

// Load Bootstrap

if ($jquery_load) {JHtml::_('jquery.framework'); }

// check if favth-bootstrap and viewport checker already loaded

$jhead = JFactory::getDocument();
$lscripts = $jhead->_scripts;

$load_favthb = true;
$load_vwchk = true;

foreach ($lscripts as $k => $v) {
  
  if (strpos($k, 'favth-bootstrap') !== false) { $load_favthb = false; }
  else if (strpos($k, 'viewportchecker.js') !== false) { $load_vwchk = false; }
  
}

// end check if favth-bootstrap and viewport checker already loaded

if ($load_favthb) {
  JHTML::stylesheet('modules/mod_favpromote/theme/bootstrap/favth-bootstrap.css');
  JHTML::script('modules/mod_favpromote/theme/bootstrap/favth-bootstrap.js');
}

// END Load Bootstrap

// Module CSS
JHTML::stylesheet('modules/mod_favpromote/theme/css/favpromote.css');
JHTML::stylesheet('//use.fontawesome.com/releases/v5.1.0/css/all.css');
// Google Font
/*JHTML::stylesheet('//fonts.googleapis.com/css?family='.str_replace(" ","+",$title_google_font).':'.$title_font_weight.str_replace("normal","",$title_font_style));*/

// Scripts
if ($load_vwchk) {
  JHTML::script('modules/mod_favpromote/theme/js/viewportchecker/viewportchecker.js');
}

?>

  <style type="text/css">

    .favpromote1-<?php echo $custom_id; ?>:hover { background-color: #<?php echo $title_bg_color1; ?>; }
    .favpromote2-<?php echo $custom_id; ?>:hover { background-color: #<?php echo $title_bg_color2; ?>; }
    .favpromote3-<?php echo $custom_id; ?>:hover { background-color: #<?php echo $title_bg_color3; ?>; }
    .favpromote4-<?php echo $custom_id; ?>:hover { background-color: #<?php echo $title_bg_color4; ?>; }
    .favpromote5-<?php echo $custom_id; ?>:hover { background-color: #<?php echo $title_bg_color5; ?>; }
    .favpromote6-<?php echo $custom_id; ?>:hover { background-color: #<?php echo $title_bg_color6; ?>; }

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

<div id="favpromote-<?php echo $custom_id; ?>" class="favth-row">

  <?php
  $col_class = '';
  $active_columns = array($show_column1,$show_column2,$show_column3,$show_column4,$show_column5,$show_column6);
  $columns_check = 0; foreach ($active_columns as $active_column) { if ($active_column == 1) { $columns_check++; } }

    if ($columns_check == 6) { $col_class = 'favth-col-lg-2 favth-col-md-4 favth-col-sm-6 favth-col-xs-12'; }
    else if ($columns_check == 5) { $col_class = 'favth-col-lg-2-4 favth-col-md-4 favth-col-sm-6 favth-col-xs-12'; }
    else if ($columns_check == 4) { $col_class = 'favth-col-lg-3 favth-col-md-3 favth-col-sm-6 favth-col-xs-12'; }
    else if ($columns_check == 3) { $col_class = 'favth-col-lg-4 favth-col-md-4 favth-col-sm-4 favth-col-xs-12'; }
    else if ($columns_check == 2) { $col_class = 'favth-col-lg-6 favth-col-md-6 favth-col-sm-6 favth-col-xs-12'; }
    else if ($columns_check == 1) { $col_class = 'favth-col-lg-12 favth-col-md-12 favth-col-sm-12 favth-col-xs-12'; }

    for ($i=1;$i<7;$i++) {

    if ((${'show_column'.$i}) !=0) { ?>

    <div class="favpromote <?php echo $col_class; ?>">

      <div id="favpromote-box<?php echo $i; ?>"
        class="favpromote<?php echo $i; ?>-<?php echo $custom_id; ?> layout-effect"
        style="border: 1px solid #<?php echo ${'column_border_color'.$i}; ?>;
        -webkit-border-radius: <?php echo ${'column_border_radius'.$i}; ?>;
        -moz-border-radius: <?php echo ${'column_border_radius'.$i}; ?>;
        border-radius: <?php echo ${'column_border_radius'.$i}; ?>;">

        <div id="favpromote-image<?php echo $i; ?>"
              style="height:100%; text-align: center;">

          <?php // Do not receive link if the link setting is empty
          if(empty(${'image_link'.$i})) { ?>

            <?php if (${'upload_image'.$i}) { ?>
              <img src="<?php echo ${'upload_image'.$i}; ?>"
              alt="<?php echo ${'image_alt'.$i}; ?>"/>
            <?php } else { ?>
              <img src="modules/mod_favpromote/demo/demo-image<?php echo $i; ?>.jpg"
              alt="<?php echo ${'image_alt'.$i}; ?>" />
            <?php } ?>

          <?php } else { ?>

            <a href="<?php echo ${'image_link'.$i}; ?>" target="_<?php echo ${'image_link_target'.$i}; ?>" >

            <?php if (${'upload_image'.$i}) { ?>
              <img src="<?php echo ${'upload_image'.$i}; ?>"
              alt="<?php echo ${'image_alt'.$i}; ?>"/>
            <?php } else { ?>
              <img src="modules/mod_favpromote/demo/demo-image<?php echo $i; ?>.jpg"
              alt="<?php echo ${'image_alt'.$i}; ?>" />
            <?php } ?>

            </a>

          <?php } ?>

        </div>

        <p id="favpromote-text<?php echo $i; ?>"
          style="color: #<?php echo ${'description_text_color'.$i}; ?>;
                font-size: <?php echo $description_text_font_size; ?>;
                line-height: <?php echo $description_text_line_height; ?>;
                text-align: <?php echo $description_text_align; ?>;">
                  <?php echo ${'description_text'.$i}; ?>
        </p>

        <h4 id="favpromote-title<?php echo $i; ?>"
            style="color: #<?php echo ${'title_color'.$i}; ?>;
                background-color: #<?php echo ${'title_bg_color'.$i}; ?>;
                font-family: <?php echo $title_google_font; ?>;
                font-weight: <?php echo $title_font_weight; ?>;
                font-style: <?php echo $title_font_style; ?>;
                padding: <?php echo $title_padding; ?>;
                font-size: <?php echo $title_font_size; ?>;
                line-height: <?php echo $title_line_height; ?>;
                text-align: <?php echo $title_text_align; ?>;
                margin-bottom:0;">
            <i class="<?php echo ${'title_icon'.$i}; ?>"
              style="color: #<?php echo ${'title_color'.$i}; ?>;
                    font-size: <?php echo $title_icon_font_size; ?>;
                    vertical-align: <?php echo $title_icon_vertical_align; ?>;
                    padding-right: 0.4em;"></i>

          <?php // Do not receive link if the link setting is empty
          if(empty(${'title_link'.$i})) { ?>

            <?php echo ${'title_text'.$i}; ?>

          <?php } else { ?>

            <a href="<?php echo ${'title_link'.$i}; ?>" target="_<?php echo ${'title_link_target'.$i}; ?>"
                    style="color: #<?php echo ${'title_color'.$i}; ?>;">

              <?php echo ${'title_text'.$i}; ?>

            </a>

          <?php } ?>

        </h4>

      </div>

    </div>

  <?php } } ?>

</div>
