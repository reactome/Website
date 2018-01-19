<?php

/**
*   FavImageHover
*
*   Responsive and customizable Joomla!3 module
*
*   @version        1.9
*   @link           http://extensions.favthemes.com/favimagehover
*   @author         FavThemes - http://www.favthemes.com
*   @copyright      Copyright (C) 2012-2016 FavThemes.com. All Rights Reserved.
*   @license        Licensed under GNU/GPLv3, see http://www.gnu.org/licenses/gpl-3.0.html
*/

// no direct access

defined('_JEXEC') or die;

$jquery_load                            = $params->get('jquery_load');
$layout_effect                          = $params->get('layout_effect');
$image_border_radius                    = $params->get('image_border_radius');

$title_google_font                      = $params->get('title_google_font');
$title_font_weight                      = $params->get('title_font_weight');
$title_font_style                       = $params->get('title_font_style');
$title_padding                          = $params->get('title_padding');
$title_font_size                        = $params->get('title_font_size');
$title_line_height                      = $params->get('title_line_height');
$title_text_align                       = $params->get('title_text_align');
$title_icon_vertical_align              = $params->get('title_icon_vertical_align');

$description_font_size                  = $params->get('description_font_size');
$description_line_height                = $params->get('description_line_height');
$description_text_align                 = $params->get('description_text_align');

$readmore_padding                       = $params->get('readmore_padding');
$readmore_border_radius                 = $params->get('readmore_border_radius');

for ($j=1;$j<7;$j++) {

${'show_image'.$j}                      = $params->get('show_image'.$j);
${'upload_image'.$j}                    = $params->get('upload_image'.$j);
${'image_alt'.$j}                       = $params->get('image_alt'.$j);
${'title_text'.$j}                      = $params->get('title_text'.$j);
${'title_color'.$j}                     = $params->get('title_color'.$j);
${'title_bg_color'.$j}                  = $params->get('title_bg_color'.$j);
${'title_icon'.$j}                      = $params->get('title_icon'.$j);
${'description_text'.$j}                = $params->get('description_text'.$j);
${'description_text_color'.$j}          = $params->get('description_text_color'.$j);
${'readmore_text'.$j}                   = $params->get('readmore_text'.$j);
${'readmore_color'.$j}                  = $params->get('readmore_color'.$j);
${'readmore_bg_color'.$j}               = $params->get('readmore_bg_color'.$j);
${'readmore_link'.$j}                   = $params->get('readmore_link'.$j);
${'readmore_target'.$j}                 = $params->get('readmore_target'.$j);

}

$custom_id = rand(10000,20000);

// Load Bootstrap
JHtml::_('bootstrap.framework');
JHTML::stylesheet('media/jui/css/bootstrap.min.css');
JHTML::stylesheet('media/jui/css/bootstrap-responsive.css');
// Module CSS
JHTML::stylesheet('modules/mod_favimagehover/theme/css/favimagehover.css');
JHTML::stylesheet('//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
// Google Font
JHTML::stylesheet('//fonts.googleapis.com/css?family='.str_replace(" ","+",$title_google_font).':'.$title_font_weight.str_replace("normal","",$title_font_style));

// Scripts
if ($jquery_load) {JHtml::_('jquery.framework'); }
JHTML::script('modules/mod_favimagehover/theme/js/viewportchecker/viewportchecker.js');

?>

<?php if ($layout_effect != 'layout-effect-none') { ?>

  <script type="text/javascript">
    jQuery(document).ready(function() {
    jQuery('#favimagehover-<?php echo $custom_id; ?> .layout-effect').addClass("favhide").viewportChecker({
      classToAdd: 'favshow <?php echo $layout_effect; ?>', // Class to add to the elements when they are visible
      offset: 100
      });
    });
  </script>

<?php } ?>

<div id="favimagehover-<?php echo $custom_id; ?>" class="row-fluid">

  <?php
  $span_class = '';
  $active_columns = array($show_image1,$show_image2,$show_image3,$show_image4,$show_image5,$show_image6);
  $columns_check = 0; foreach ($active_columns as $active_column) { if ($active_column == 1) { $columns_check++; } }

    if ($columns_check > 0) { $span_class = 'span'.(str_replace(".","-",12/$columns_check)); }

    for ($i=1;$i<7;$i++) {

    if ((${'show_image'.$i}) !=0) { ?>

    <div id="favimagehover-box<?php echo $i; ?>"
      class="<?php echo $span_class; ?> favimagehover<?php echo $i; ?> layout-effect"
      style="-webkit-border-radius: <?php echo $image_border_radius; ?>;
            -moz-border-radius: <?php echo $image_border_radius; ?>;
            border-radius: <?php echo $image_border_radius; ?>;">

      <div id="favimagehover-image-container<?php echo $i; ?>">

        <div id="favimagehover-image<?php echo $i; ?>"
             style="height:100%;">

            <?php if (${'upload_image'.$i}) { ?>
              <img src="<?php echo ${'upload_image'.$i}; ?>"
                  alt="<?php echo ${'image_alt'.$i}; ?>"/>
            <?php } else { ?>
              <img src="modules/mod_favimagehover/demo/demo-image<?php echo $i; ?>.jpg"
                  alt="<?php echo ${'image_alt'.$i}; ?>"/>
            <?php } ?>

        </div>

        <div id="favimagehover-overlay<?php echo $i; ?>">

          <p id="favimagehover-description<?php echo $i; ?>"
          style="color: #<?php echo ${'description_text_color'.$i}; ?>;
                font-size: <?php echo $description_font_size; ?>;
                line-height: <?php echo $description_line_height; ?>;
                text-align: <?php echo $description_text_align; ?>;">

            <?php echo ${'description_text'.$i}; ?>

          </p>

          <div id="favimagehover-readmore<?php echo $i; ?>"
               class="favimagehover-readmore"
               style="text-align: <?php echo $description_text_align; ?>;">

            <a class="btn"
              href="<?php echo ${'readmore_link'.$i}; ?>"
              target="_<?php echo ${'readmore_target'.$i}; ?>"
              style="color: #<?php echo ${'readmore_color'.$i}; ?>;
                    background-color: #<?php echo ${'readmore_bg_color'.$i}; ?>;
                    padding: <?php echo $readmore_padding; ?>;
                    -webkit-border-radius: <?php echo $readmore_border_radius; ?>;
                    -moz-border-radius: <?php echo $readmore_border_radius; ?>;
                    border-radius: <?php echo $readmore_border_radius; ?>;
                    margin: 0; ">

              <i class="fa fa-arrow-right"
                 style="font-size: <?php echo $description_font_size; ?>; padding-right: 0.4em;"></i>

              <?php echo ${'readmore_text'.$i}; ?>

            </a>

          </div>

        </div>

      </div>

      <h4 id="favimagehover-title<?php echo $i; ?>"
      style="color: #<?php echo ${'title_color'.$i}; ?>;
            background-color: #<?php echo ${'title_bg_color'.$i}; ?>;
            font-family: <?php echo $title_google_font; ?>;
            font-weight: <?php echo $title_font_weight; ?>;
            font-style: <?php echo $title_font_style; ?>;
            padding: <?php echo $title_padding; ?>;
            font-size: <?php echo $title_font_size; ?>;
            line-height: <?php echo $title_line_height; ?>;
            text-align: <?php echo $title_text_align; ?>;
            margin-bottom: 0;">

        <i class="fa <?php echo ${'title_icon'.$i}; ?>"
           style="color: #<?php echo ${'title_color'.$i}; ?>;
                 font-size: <?php echo $title_font_size; ?>;
                 vertical-align: <?php echo $title_icon_vertical_align; ?>">
        </i>

        <?php echo ${'title_text'.$i}; ?>

      </h4>

    </div>

  <?php } } ?>

</div>
