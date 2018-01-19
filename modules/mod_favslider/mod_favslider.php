<?php

/**
*   FavSlider
*
*   Responsive and customizable Joomla!3 module
*
*   @version        2.1
*   @link           http://extensions.favthemes.com/favslider
*   @author         FavThemes - http://www.favthemes.com
*   @copyright      Copyright (C) 2012-2017 FavThemes.com. All Rights Reserved.
*   @license        Licensed under GNU/GPLv3, see http://www.gnu.org/licenses/gpl-3.0.html
*/

// no direct access

defined('_JEXEC') or die;

$rows_arrays = array();

$jquery_load                            = $params->get('jquery_load');
$carousel_autorun                       = $params->get('carousel_autorun');
$cycling_speed                          = $params->get('cycling_speed');

$show_title                             = $params->get('show_title');
$show_description                       = $params->get('show_description');

$caption_color                          = $params->get('caption_color');
$show_caption_effect                    = $params->get('show_caption_effect');

$title_color                            = $params->get('title_color');
$title_font_size                        = $params->get('title_font_size');
$title_line_height                      = $params->get('title_line_height');
$title_font_weight                      = $params->get('title_font_weight');
$title_margin                           = $params->get('title_margin');

$description_text_color                 = $params->get('description_text_color');
$description_text_font_size             = $params->get('description_text_font_size');
$description_text_line_height           = $params->get('description_text_line_height');
$description_text_margin                = $params->get('description_text_margin');

$show_mobile_title                      = $params->get('show_mobile_title');
$show_mobile_description                = $params->get('show_mobile_description');
$caption_hide                           = $params->get('caption_hide');

$show_arrows                            = $params->get('show_arrows');
$arrows_color                           = $params->get('arrows_color');
$arrows_bg_color                        = $params->get('arrows_bg_color');
$arrows_border_radius                   = $params->get('arrows_border_radius');

$show_indicators                        = $params->get('show_indicators');
$indicators_color                       = $params->get('indicators_color');
$indicators_active_color                = $params->get('indicators_active_color');

$custom_id = rand(10000,20000);

for ($j=1;$j<11;$j++) {

    ${'show_slide'.$j}                      = $params->get('show_slide'.$j);

    ${'upload_image'.$j}                    = $params->get('upload_image'.$j);
    ${'image_alt'.$j}                       = $params->get('image_alt'.$j);
    ${'image_link'.$j}                      = $params->get('image_link'.$j);
    ${'image_link_target'.$j}               = $params->get('image_link_target'.$j);

    ${'title_text'.$j}                      = $params->get('title_text'.$j);
    ${'description_text'.$j}                = $params->get('description_text'.$j);

    if (${'show_slide'.$j} == 1) {
      $rows_arrays[] =  array($j);
    }

}

// Load Bootstrap

if ($jquery_load) {JHtml::_('jquery.framework'); }

// check if favth-bootstrap already loaded
$jhead = JFactory::getDocument();
$lscripts = $jhead->_scripts;
$load_favthb = true;
foreach ($lscripts as $k => $v) { if (strpos($k, 'favth-bootstrap') !== false) { $load_favthb = false; break; } }
// end check if favth-bootstrap already loaded

if ($load_favthb) {
  JHTML::stylesheet('modules/mod_favslider/theme/bootstrap/favth-bootstrap.css');
  JHTML::script('modules/mod_favslider/theme/bootstrap/favth-bootstrap.js');
}

// END Load Bootstrap

// Module CSS
JHTML::stylesheet('modules/mod_favslider/theme/css/favslider.css');
JHTML::stylesheet('//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');

// Scripts
JHTML::script('modules/mod_favslider/theme/js/viewportchecker/viewportchecker.js');

?>

  <script type="text/javascript">

    jQuery(document).ready(function() {

      jQuery('#favslider-container-<?php echo $custom_id; ?> .favslider-caption-effect').addClass("favhide").viewportCheckerfavslider({
        classToAdd: 'favshow <?php echo (($show_caption_effect == 0) ? 'favslider-caption-effect-none' : 'favslider-caption-effect'); ?>', // Class to add to the elements when they are visible
        offset: 0,
      });

    });

  </script>

  <style type="text/css">

    #favslider-container-<?php echo $custom_id; ?> .favth-carousel-indicators li.favth-active {
      background-color: #<?php echo $indicators_active_color; ?>;
    }
    <?php if($show_title == 0 && $show_description == 0) : ?>
      #favslider-container-<?php echo $custom_id; ?> .favslider-carousel .favth-carousel-caption {
        display: none;
      }
    <?php endif; ?>
    /* hide caption on mobile */
    @media (max-width: 767px) {

      <?php if($show_mobile_title == 0) : ?>
        #favslider-container-<?php echo $custom_id; ?> .favslider-caption-title {
          display: none;
        }
      <?php endif; ?>
      <?php if($show_mobile_description == 0) : ?>
        #favslider-container-<?php echo $custom_id; ?> .favslider-caption-description {
          display: none;
        }
      <?php endif; ?>
      <?php if($show_mobile_title == 0 && $show_mobile_description == 0) : ?>
        #favslider-container-<?php echo $custom_id; ?> .favslider-carousel .favth-carousel-caption {
          display: none;
        }
      <?php endif; ?>

    }
    @media (max-width: <?php echo $caption_hide; ?>) {
      #favslider-container-<?php echo $custom_id; ?> .favslider-carousel .favth-carousel-caption {
        display: none;
      }
    }

  </style>

<div id="favslider-container-<?php echo $custom_id; ?>" class="favth-row favslider" >

    <div id="favslider-carousel-<?php echo $custom_id; ?>" class="favslider-carousel favth-carousel favth-slide" data-ride="favth-carousel" data-interval="<?php echo (($carousel_autorun == 0) ? 'false': $cycling_speed); ?>">

      <!-- Wrapper for slides -->
      <div id="favslider-slides" class="favth-carousel-inner" role="listbox">

        <?php $l = 1; foreach ($rows_arrays as $k => $v) {

            $order = $k+1;
            $col_class = 'favth-col-lg-12 favth-col-md-12 favth-col-sm-12 favth-col-xs-12';

        ?>

            <div class="favth-item<?php echo (($order == 1) ? ' favth-active favth-clearfix': ''); ?>" data-order="<?php echo $order; ?>">

              <?php // output content
              foreach ($v as $i) {
              ?>

              <div class="<?php echo $col_class; ?> favslider<?php echo $i; ?> favth-clearfix">

                <div class="favslider">

                  <div class="favslider-images">

                    <?php if (${'upload_image'.$i}) { ?>

                      <?php // Do not receive link if the link setting is empty
                        if(empty(${'image_link'.$i})) { ?>

                          <img src="<?php echo ${'upload_image'.$i}; ?>"
                            alt="<?php echo ${'image_alt'.$i}; ?>"/>

                        <?php } else { ?>

                          <a href="<?php echo ${'image_link'.$i}; ?>" target="_<?php echo ${'image_link_target'.$i}; ?>" >

                            <img src="<?php echo ${'upload_image'.$i}; ?>"
                              alt="<?php echo ${'image_alt'.$i}; ?>"/>

                          </a>

                        <?php } ?>

                    <?php } else { // Demo images

                        if ($l > 5) { $l = 1; }
                        $image_src = 'demo-image'.$l.'.jpg';

                    ?>

                        <?php // Do not receive link if the link setting is empty
                        if(empty(${'image_link'.$i})) { ?>

                          <img src="modules/mod_favslider/demo/<?php echo $image_src; ?>"
                              alt="<?php echo ${'image_alt'.$i}; ?>" />

                        <?php } else { ?>

                          <a href="<?php echo ${'image_link'.$i}; ?>" target="_<?php echo ${'image_link_target'.$i}; ?>" >

                            <img src="modules/mod_favslider/demo/<?php echo $image_src; ?>"
                                alt="<?php echo ${'image_alt'.$i}; ?>" />

                          </a>

                        <?php } ?>

                    <?php } ?>

                  </div>

                  <div class="favslider-caption favslider-caption-effect <?php echo $caption_color; ?>">

                    <div class="favth-carousel-caption">

                      <?php if ($show_title == 1) { ?>

                        <h3 id="favslider-caption-title<?php echo $i; ?>" class="favslider-caption-title"
                            style="color: #<?php echo $title_color; ?>;
                                font-size: <?php echo $title_font_size; ?>;
                                line-height: <?php echo $title_line_height; ?>;
                                margin: <?php echo $title_margin; ?> !important;">

                              <?php echo ${'title_text'.$i}; ?>

                        </h3>

                      <?php } ?>

                      <?php if ($show_description == 1) { ?>

                        <p class="favslider-caption-description"
                        style="color: #<?php echo $description_text_color; ?>;
                          font-size: <?php echo $description_text_font_size; ?>;
                          line-height: <?php echo $description_text_line_height; ?>;
                          margin: <?php echo $description_text_margin; ?> !important;">

                          <?php echo ${'description_text'.$i}; ?>

                        </p>

                      <?php } ?>

                    </div>

                  </div>

                </div>

              </div>

              <?php $l++; } // end output content
              ?>

            </div>

        <?php } ?>

      </div>

      <!-- Controls -->
      <?php if ($show_arrows == 1) { ?>

        <div id="favslider-arrows">

          <a class="favth-left favth-carousel-control" href="#favslider-carousel-<?php echo $custom_id; ?>"
              role="button"
              data-slide="prev">
            <i class="fa fa-angle-left" aria-hidden="true"
              style="color: #<?php echo $arrows_color; ?>;
                    background-color: #<?php echo $arrows_bg_color; ?>;
                    -webkit-border-radius: <?php echo $arrows_border_radius; ?>;
                    -moz-border-radius: <?php echo $arrows_border_radius; ?>;
                    border-radius: <?php echo $arrows_border_radius; ?>"></i>
            <span class="favth-sr-only">Previous</span>
          </a>
          <a class="favth-right favth-carousel-control" href="#favslider-carousel-<?php echo $custom_id; ?>"
              role="button"
              data-slide="next">
            <i class="fa fa-angle-right" aria-hidden="true"
              style="color: #<?php echo $arrows_color; ?>;
                    background-color: #<?php echo $arrows_bg_color; ?>;
                    -webkit-border-radius: <?php echo $arrows_border_radius; ?>;
                    -moz-border-radius: <?php echo $arrows_border_radius; ?>;
                    border-radius: <?php echo $arrows_border_radius; ?>"></i>
            <span class="favth-sr-only">Next</span>
          </a>

        </div>

      <?php } ?>

      <!-- Indicators -->
      <?php if ($show_indicators == 1) { ?>

        <div id="favslider-indicators" class="favth-clearfix">

          <ol class="favth-carousel-indicators">

            <?php $l = 1; foreach ($rows_arrays as $k => $v) { ?>

              <li data-target="#favslider-carousel-<?php echo $custom_id; ?>" favth-data-slide-to="<?php echo $k; ?>" class="<?php echo (($k == 0) ? 'favth-active': ''); ?> <?php echo $indicators_color; ?>"></li>

            <?php } ?>

          </ol>

        </div>

      <?php } ?>

    </div>

</div>
