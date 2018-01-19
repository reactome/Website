<?php

/**
*   FavEffects
*
*   Responsive and customizable Joomla!3 module
*
*   @version        1.8
*   @link           http://extensions.favthemes.com/faveffects
*   @author         FavThemes - http://www.favthemes.com
*   @copyright      Copyright (C) 2012-2017 FavThemes.com. All Rights Reserved.
*   @license        Licensed under GNU/GPLv3, see http://www.gnu.org/licenses/gpl-3.0.html
*/

// no direct access

defined('_JEXEC') or die;

$jquery_load                            = $params->get('jquery_load');
$layout_effect                          = $params->get('layout_effect');
$icon_width                             = $params->get('icon_width');
$icon_border_radius                     = $params->get('icon_border_radius');
$icon_border_type                       = $params->get('icon_border_type');
$icon_border_width                      = $params->get('icon_border_width');
$title_google_font                      = $params->get('title_google_font');
$title_font_weight                      = $params->get('title_font_weight');
$title_font_style                       = $params->get('title_font_style');
$title_font_size                        = $params->get('title_font_size');

for ($j=1;$j<7;$j++) {

${'show_icon'.$j}                       = $params->get('show_icon'.$j);
${'icon_effect'.$j}                     = $params->get('icon_effect'.$j);
${'icon_name'.$j}                       = $params->get('icon_name'.$j);
${'icon_color'.$j}                      = $params->get('icon_color'.$j);
${'icon_bg_color'.$j}                   = $params->get('icon_bg_color'.$j);
${'icon_link'.$j}                       = $params->get('icon_link'.$j);
${'icon_link_target'.$j}                = $params->get('icon_link_target'.$j);
${'icon_font_size'.$j}                  = $params->get('icon_font_size'.$j);
${'icon_border_color'.$j}               = $params->get('icon_border_color'.$j);
${'title_text'.$j}                      = $params->get('title_text'.$j);
${'title_color'.$j}                     = $params->get('title_color'.$j);
${'show_title_link'.$j}                 = $params->get('show_title_link'.$j);
${'title_link'.$j}                      = $params->get('title_link'.$j);

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
  JHTML::stylesheet('modules/mod_faveffects/theme/bootstrap/favth-bootstrap.css');
  JHTML::script('modules/mod_faveffects/theme/bootstrap/favth-bootstrap.js');
}

// END Load Bootstrap

// Module CSS
JHTML::stylesheet('modules/mod_faveffects/theme/css/faveffects.css');
JHTML::stylesheet('//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
// Google Font
JHTML::stylesheet('//fonts.googleapis.com/css?family='.str_replace(" ","+",$title_google_font).':'.$title_font_weight.str_replace("normal","",$title_font_style));

// Scripts
JHTML::script('modules/mod_faveffects/theme/js/viewportchecker/viewportchecker.js');

?>

<?php if ($layout_effect != 'layout-effect-none') { ?>

  <script type="text/javascript">
    jQuery(document).ready(function() {
    jQuery('#faveffects-<?php echo $custom_id; ?> .layout-effect').addClass("favhide").viewportChecker({
      classToAdd: 'favshow <?php echo $layout_effect; ?>', // Class to add to the elements when they are visible
      offset: 100
      });
    });
  </script>

<?php } ?>

<div id="faveffects-<?php echo $custom_id; ?>" class="favth-row">

  <?php
  $col_class = '';
  $active_columns = array($show_icon1,$show_icon2,$show_icon3,$show_icon4,$show_icon5,$show_icon6);
  $columns_check = 0; foreach ($active_columns as $active_column) { if ($active_column == 1) { $columns_check++; } }

    if ($columns_check == 6) { $col_class = 'favth-col-lg-2 favth-col-md-2 favth-col-sm-4 favth-col-xs-6'; }
    else if ($columns_check == 5) { $col_class = 'favth-col-lg-2-4 favth-col-sm-4 favth-col-xs-6'; }
    else if ($columns_check == 4) { $col_class = 'favth-col-lg-3 favth-col-md-3 favth-col-sm-3 favth-col-xs-6'; }
    else if ($columns_check == 3) { $col_class = 'favth-col-lg-4 favth-col-md-4 favth-col-sm-4 favth-col-xs-6'; }
    else if ($columns_check == 2) { $col_class = 'favth-col-lg-6 favth-col-md-6 favth-col-sm-6 favth-col-xs-6'; }
    else if ($columns_check == 1) { $col_class = 'favth-col-lg-12 favth-col-md-12 favth-col-sm-12 favth-col-xs-12'; }

    for ($i=1;$i<7;$i++) {

    if ((${'show_icon'.$i}) !=0) { ?>

    <div id="faveffects-box<?php echo $i; ?>"
      class="<?php echo $col_class; ?> faveffects<?php echo $i; ?> layout-effect">

        <div id="faveffects-icon<?php echo $i; ?>"
          class="faveffects-<?php echo ${'icon_effect'.$i}; ?>"
          style="background-color: #<?php echo ${'icon_bg_color'.$i}; ?>;
                  width: <?php echo $icon_width; ?>;
                  border: <?php echo $icon_border_width; ?> <?php echo $icon_border_type; ?> #<?php echo ${'icon_border_color'.$i}; ?>;
                  -webkit-border-radius: <?php echo $icon_border_radius; ?>;
                  -moz-border-radius: <?php echo $icon_border_radius; ?>;
                  border-radius: <?php echo $icon_border_radius; ?>;">

              <?php // Do not receive link if the link setting is empty
              if(empty(${'icon_link'.$i})) { ?>

                <i class="fa <?php echo ${'icon_name'.$i}; ?>"
                    style="color: #<?php echo ${'icon_color'.$i}; ?>;
                          font-size: <?php echo ${'icon_font_size'.$i}; ?>;">
                </i>

              <?php } else { ?>

                <a href="<?php echo ${'icon_link'.$i}; ?>" target="_<?php echo ${'icon_link_target'.$i}; ?>">
                  <i class="fa <?php echo ${'icon_name'.$i}; ?>"
                      style="color: #<?php echo ${'icon_color'.$i}; ?>;
                            font-size: <?php echo ${'icon_font_size'.$i}; ?>;">
                  </i>
                </a>

              <?php } ?>

        </div>

        <p id="faveffects-title<?php echo $i; ?>"
            style="color: #<?php echo ${'title_color'.$i}; ?>;
                  font-family: <?php echo $title_google_font; ?>;
                  font-weight: <?php echo $title_font_weight; ?>;
                  font-style: <?php echo $title_font_style; ?>;
                  font-size: <?php echo $title_font_size; ?>;">

          <?php if (${'show_title_link'.$i} == 1) { ?>

            <a href="<?php echo ${'title_link'.$i}; ?>" target="_<?php echo ${'icon_link_target'.$i}; ?>"
              style="color: #<?php echo ${'title_color'.$i}; ?>;">

          <?php } ?>

              <?php echo ${'title_text'.$i}; ?>

          <?php if (${'show_title_link'.$i} == 1) { ?>

            </a>

          <?php } ?>

        </p>

    </div>

  <?php } } ?>

</div>
