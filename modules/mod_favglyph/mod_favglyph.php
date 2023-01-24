<?php

/**
*   FavGlyph
*
*   Responsive and customizable Joomla!3 module
*
*   @version        2.2
*   @link           http://extensions.favthemes.com/favglyph
*   @author         FavThemes - http://www.favthemes.com
*   @copyright      Copyright (C) 2012-2018 FavThemes.com. All Rights Reserved.
*   @license        Licensed under GNU/GPLv3, see http://www.gnu.org/licenses/gpl-3.0.html
*/

// no direct access

defined('_JEXEC') or die;

$jquery_load                            = $params->get('jquery_load');
$layout_effect                          = $params->get('layout_effect');
$icon_border_radius                     = $params->get('icon_border_radius');
$icon_border_type                       = $params->get('icon_border_type');
$icon_border_width                      = $params->get('icon_border_width');
$title_google_font                      = $params->get('title_google_font');
$title_font_weight                      = $params->get('title_font_weight');
$title_font_style                       = $params->get('title_font_style');
$title_font_size                        = $params->get('title_font_size');
$title_margin                           = $params->get('title_margin');
$title_text_transform                   = $params->get('title_text_transform');
$description_text_font_size             = $params->get('description_text_font_size');

for ($j=1;$j<7;$j++) {

${'show_icon'.$j}                       = $params->get('show_icon'.$j);
${'icon_layout'.$j}                     = $params->get('icon_layout'.$j);
${'icon_name'.$j}                       = $params->get('icon_name'.$j);
${'icon_width'.$j}                      = $params->get('icon_width'.$j);
${'icon_color'.$j}                      = $params->get('icon_color'.$j);
${'icon_bg_color'.$j}                   = $params->get('icon_bg_color'.$j);
${'icon_border_color'.$j}               = $params->get('icon_border_color'.$j);
${'icon_link'.$j}                       = $params->get('icon_link'.$j);
${'icon_link_target'.$j}                = $params->get('icon_link_target'.$j);
${'icon_font_size'.$j}                  = $params->get('icon_font_size'.$j);
${'title_text'.$j}                      = $params->get('title_text'.$j);
${'title_color'.$j}                     = $params->get('title_color'.$j);
${'title_link'.$j}                      = $params->get('title_link'.$j);
${'title_link_target'.$j}               = $params->get('title_link_target'.$j);
${'description_width'.$j}               = $params->get('description_width'.$j);
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
  JHTML::stylesheet('modules/mod_favglyph/theme/bootstrap/favth-bootstrap.css');
  JHTML::script('modules/mod_favglyph/theme/bootstrap/favth-bootstrap.js');
}

// END Load Bootstrap

// Module CSS
JHTML::stylesheet('modules/mod_favglyph/theme/css/favglyph.css');
JHTML::stylesheet('//use.fontawesome.com/releases/v5.1.0/css/all.css');
// Google Font
/*JHTML::stylesheet('//fonts.googleapis.com/css?family='.str_replace(" ","+",$title_google_font).':'.$title_font_weight.str_replace("normal","",$title_font_style));*/

// Scripts
if ($load_vwchk) {
  JHTML::script('modules/mod_favglyph/theme/js/viewportchecker/viewportchecker.js');
}

?>

<?php if ($layout_effect != 'layout-effect-none') { ?>

  <script type="text/javascript">
    jQuery(document).ready(function() {
    jQuery('#favglyph-<?php echo $custom_id; ?> .layout-effect').addClass("favhide").viewportChecker({
      classToAdd: 'favshow <?php echo $layout_effect; ?>', // Class to add to the elements when they are visible
      offset: 100
      });
    });
  </script>

<?php } ?>

<div id="favglyph-<?php echo $custom_id; ?>" class="row-fluid">

  <?php
  $col_class = '';
  $active_columns = array($show_icon1,$show_icon2,$show_icon3,$show_icon4,$show_icon5,$show_icon6);
  $columns_check = 0; foreach ($active_columns as $active_column) { if ($active_column == 1) { $columns_check++; } }

    if ($columns_check == 6) { $col_class = 'favth-col-lg-2 favth-col-md-4 favth-col-sm-6 favth-col-xs-6'; }
    else if ($columns_check == 5) { $col_class = 'favth-col-lg-2-4 favth-col-sm-4 favth-col-xs-6'; }
    else if ($columns_check == 4) { $col_class = 'favth-col-lg-3 favth-col-md-3 favth-col-sm-6 favth-col-xs-6'; }
    else if ($columns_check == 3) { $col_class = 'favth-col-lg-4 favth-col-md-4 favth-col-sm-4 favth-col-xs-6'; }
    else if ($columns_check == 2) { $col_class = 'favth-col-lg-6 favth-col-md-6 favth-col-sm-6 favth-col-xs-6'; }
    else if ($columns_check == 1) { $col_class = 'favth-col-lg-12 favth-col-md-12 favth-col-sm-12 favth-col-xs-12'; }

    for ($i=1;$i<7;$i++) {

    if ((${'show_icon'.$i}) !=0) { ?>

    <div id="favglyph-box<?php echo $i; ?>"
      class="<?php echo $col_class; ?> favglyph<?php echo $i; ?> layout-effect">

        <?php if(${'icon_layout'.$i} == 'top' || ${'icon_layout'.$i} == 'left') { ?>

          <div class="favglyph-icon-<?php echo ${'icon_layout'.$i}; ?> favth-clearfix" style="width: <?php echo ((${'icon_layout'.$i} == 'left') ? ${'icon_width'.$i}: ''); ?>;">
            <div id="favglyph-icon"
                  class="favglyph-icon"
                  style="background-color: #<?php echo ${'icon_bg_color'.$i}; ?>;
                      width: <?php echo ((${'icon_layout'.$i} == 'top') ? ${'icon_width'.$i}: '100%'); ?>;
                      border: <?php echo $icon_border_width; ?> <?php echo $icon_border_type; ?> #<?php echo ${'icon_border_color'.$i}; ?>;
                      -webkit-border-radius: <?php echo $icon_border_radius; ?>;
                      -moz-border-radius: <?php echo $icon_border_radius; ?>;
                      border-radius: <?php echo $icon_border_radius; ?>;">

              <?php // Do not receive link if the link setting is empty
              if(empty(${'icon_link'.$i})) { ?>

                  <i class="<?php echo ${'icon_name'.$i}; ?>"
                      style="color: #<?php echo ${'icon_color'.$i}; ?>;
                      font-size: <?php echo ${'icon_font_size'.$i}; ?>;">
                  </i>

              <?php } else { ?>

                <a href="<?php echo ${'icon_link'.$i}; ?>" target="_<?php echo ${'icon_link_target'.$i}; ?>">
                  <i class="<?php echo ${'icon_name'.$i}; ?>"
                      style="color: #<?php echo ${'icon_color'.$i}; ?>;
                      font-size: <?php echo ${'icon_font_size'.$i}; ?>;">
                  </i>
                </a>

              <?php } ?>

            </div>
          </div>

          <div class="favglyph-description-<?php echo ${'icon_layout'.$i}; ?> favth-clearfix" style="width: <?php echo ${'description_width'.$i}; ?>;">
            <h2 id="favglyph-description-title"
                style="font-family: <?php echo $title_google_font; ?>, sans-serif;
                font-weight: <?php echo $title_font_weight; ?>;
                font-style: <?php echo $title_font_style; ?>;
                font-size: <?php echo $title_font_size; ?>;
                margin: <?php echo $title_margin; ?>;
                text-transform: <?php echo $title_text_transform; ?>;">

              <?php // Do not receive link if the link setting is empty
              if(empty(${'title_link'.$i})) { ?>

                <?php echo ${'title_text'.$i}; ?>

              <?php } else { ?>

                <a href="<?php echo ${'title_link'.$i}; ?>" target="_<?php echo ${'title_link_target'.$i}; ?>"
                  style="color: #<?php echo ${'title_color'.$i}; ?>;">
                  <?php echo ${'title_text'.$i}; ?>
                </a>

              <?php } ?>

            </h2>
            <p id="favglyph-description-text"
              style="font-size: <?php echo $description_text_font_size; ?>;
                    color: #<?php echo ${'description_text_color'.$i}; ?>;">
              <?php echo ${'description_text'.$i}; ?>
            </p>
          </div>

        <?php } ?>

        <?php if(${'icon_layout'.$i} == 'bottom' || ${'icon_layout'.$i} == 'right') { ?>

          <div class="favglyph-description-<?php echo ${'icon_layout'.$i}; ?> favth-clearfix" style="width: <?php echo ${'description_width'.$i}; ?>;">
            <h2 id="favglyph-description-title"
                style="font-family: <?php echo $title_google_font; ?>, sans-serif;
                font-weight: <?php echo $title_font_weight; ?>;
                font-style: <?php echo $title_font_style; ?>;
                font-size: <?php echo $title_font_size; ?>;
                margin: <?php echo $title_margin; ?>;
                text-transform: <?php echo $title_text_transform; ?>;">

              <?php // Do not receive link if the link setting is empty
              if(empty(${'title_link'.$i})) { ?>

                <?php echo ${'title_text'.$i}; ?>

              <?php } else { ?>

                <a href="<?php echo ${'title_link'.$i}; ?>" target="_<?php echo ${'title_link_target'.$i}; ?>"
                  style="color: #<?php echo ${'title_color'.$i}; ?>;">
                  <?php echo ${'title_text'.$i}; ?>
                </a>

              <?php } ?>

            </h2>
            <p id="favglyph-description-text"
              style="font-size: <?php echo $description_text_font_size; ?>;
                    color: #<?php echo ${'description_text_color'.$i}; ?>;">
              <?php echo ${'description_text'.$i}; ?>
            </p>
          </div>

          <div class="favglyph-icon-<?php echo ${'icon_layout'.$i}; ?> favth-clearfix" style="width: <?php echo ((${'icon_layout'.$i} == 'right') ? ${'icon_width'.$i}: ''); ?>;">
            <div id="favglyph-icon"
                  class="favglyph-icon"
                  style="background-color: #<?php echo ${'icon_bg_color'.$i}; ?>;
                      width: <?php echo ((${'icon_layout'.$i} == 'bottom') ? ${'icon_width'.$i}: '100%'); ?>;
                      border: <?php echo $icon_border_width; ?> <?php echo $icon_border_type; ?> #<?php echo ${'icon_border_color'.$i}; ?>;
                      -webkit-border-radius: <?php echo $icon_border_radius; ?>;
                      -moz-border-radius: <?php echo $icon_border_radius; ?>;
                      border-radius: <?php echo $icon_border_radius; ?>;">

              <?php // Do not receive link if the link setting is empty
              if(empty(${'icon_link'.$i})) { ?>

                  <i class="<?php echo ${'icon_name'.$i}; ?>"
                      style="color: #<?php echo ${'icon_color'.$i}; ?>;
                      font-size: <?php echo ${'icon_font_size'.$i}; ?>;">
                  </i>

              <?php } else { ?>

                <a href="<?php echo ${'icon_link'.$i}; ?>" target="_<?php echo ${'icon_link_target'.$i}; ?>">
                  <i class="<?php echo ${'icon_name'.$i}; ?>"
                      style="color: #<?php echo ${'icon_color'.$i}; ?>;
                      font-size: <?php echo ${'icon_font_size'.$i}; ?>;">
                  </i>
                </a>

              <?php } ?>

            </div>
          </div>

        <?php } ?>

    </div>

  <?php } } ?>

</div>
