<?php
/**
 * @package     Joomla.Site
 * @subpackage  mod_pro_twitter_widget
 *
 * @copyright   Copyright (C) 2016 - All rights reserved by HIGHSCHOOLDIPLOMAONLINEFAST.COM
 * @license     GNU General Public License version 2 or later
 */

        defined('_JEXEC') or die;
		$document = JFactory::getDocument();
		$backgroundColor = $params->get('backgroundColors');

		$style = "";
		$style .= "
					.twitter-timeline {
						background:$backgroundColor;
						border-color:none;
						
		               }

				";
		$document->addStyleDeclaration($style);

					  $test='';  
				      $headers="noheader"; 
					  $footers="nofooter"; 
					  $scrollbars="noscrollbar";
					  $borders="noborders";
					  $bg="transparent";
					  $header=$params->get('header');
					  $footer=$params->get('footer');
					  $scrollbar=$params->get('scrollbar');
					  $border=$params->get('border');
					  $tranparent=$params->get('tranparent');
					  $background=$params->get('backgroundColor');
					  $width =$params->get("width");
					  $height=$params->get("height");
					  $name=$params->get("twitter_name");
					  $id=$params->get("twitter_id");
					  $scheme=$params->get('color_scheme')=='0';	
?> 

   <div class="mod_my_twitter <?php echo $moduleclass_sfx;?>">   <!-- container div start -->
	   <a class="twitter-timeline" 
	   <?php echo $scheme ?  "data-theme='light'" : "data-theme='dark'" ?>
       data-link-color="<?php echo $background ;?>" width="<?php echo $width;?>" 
       height="<?php echo $height;?>"
       href="https://twitter.com/<?php echo $name;?>" 
       data-widget-id="<?php echo $id;?>" 
                
				 <?php
					  $head = ($header=='false' ? $headers : $test);
					  $foot = ($footer=='false' ? $footers : $test);
					  $scroll = ($scrollbar=='false' ? $scrollbars : $test);
					  $bord = ($border=='false' ? $borders : $test);
					  $trans = ($tranparent=='true' ? $bg : $test);
		          ?>
                  data-chrome="<?php echo $head;?> 
                               <?php echo $foot;?> 
                               <?php echo $scroll;?> 
                               <?php echo $bord;?> 
                               <?php echo $trans;?>">
        </a>
   </div>	<!--end container div -->
	
  <script>
  !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
  </script>
			

      