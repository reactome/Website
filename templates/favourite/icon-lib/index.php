<?php

defined('_JEXEC') or die;

// Path where the css, php and images reside.
$icon_lib_dir = $this->baseurl . '/templates/' . $this->template . '/icon-lib';

// Library path, where svg, xml, png reside.
$ehld_main_folder = "ehld-icons";
$ehld_os_dir = JPATH_BASE . '/' . $ehld_main_folder . '/lib/';      // to scan the directory in the OS
$ehld_rel_dir = $this->baseurl . '/' . $ehld_main_folder . '/lib/'; // to access the files when navigating through the pages

$current_url       = JUri::current();

require_once( dirname(__FILE__) . '/common.php' );

?>

<link href="<?php echo $icon_lib_dir;?>/lib.css?v=3" rel="stylesheet" type="text/css">
<script src="<?php echo $icon_lib_dir;?>/lib.js?v=3"></script>

<?php

$param        = "f";
$arg          = $_GET[$param];
$dir          = $ehld_os_dir . $arg;
$file_display = array( 'svg' );
$folder       = ucfirst(strtolower(str_replace('_', ' ', $arg)));

if (file_exists($dir) == false && !is_null($arg)) {
    echo '<div>
             <a class="icons-lib-home"><div class=""><i class="icon-home"></i>Library home</div></a>
             <h4>
            <div class="folder-not-found">Directory \''. $folder .'\' not found!</div>
            </h4>
          </div>';
} else {
    if (!$folder) {
        echo '<div class="intro-message text-justify">
                <h3>
                    <!-- Library with all the different components used to generate the Reactome Enhanced High Level Diagrams (EHLD) -->
                    Library of icons for Reactome Enhanced High Level Diagrams (EHLD)
                </h3>
              </div>
              <div class="intro-explanation">
                <h4>
                    The icons are organised in different folders based on their types:
                </h4>
              </div>';
    } else {
        echo '<div class="ehld-breadcrumb">
                        <a class="icons-lib-home"><i class="icon-home"></i>Library home</a> > '. $folder .'
                 </div>
                 <div class="ehld-result-title">
                    <h3>
                        <i class="fa fa-folder"></i>'. $folder .' <span>('. count_svg_files($dir) .' components)</span> 
                    </h3>
                 </div>';
    }


    // Drawing the search bar on top, always. Check common.php.
	echo draw_search_bar($term);

    $dir_contents = scandir($dir);

    // Add in the array_diff everything that should be removed before applying Bootstrap Scaffolding.
	$clean_dir_contents = array_merge(array_diff($dir_contents, [".", "..", "logo.svg", "logo.emf", "logo.png", "index.html", "release_joomla.sh", "release_wordpress.sh"]));
	$total_size = 0;
    $content = $clean_dir_contents;
    if (!is_null($arg)){
	    $content = JFolder::files($dir, '.svg');
    }

    // Sorting ignoring case
	natcasesort($content);

    // Split the array in chunks of 4. Bootstrap Scaffolding 12 Columns -> 12 / 4 = 3. It means we should use span3 as CSS class
    echo '<div class="favth-col-lg-12 favth-col-md-12 favth-col-sm-12 favth-col-xs-12">';
    $modals = null;
    foreach ($content as $file) {
        $file_type = strtolower(end(explode('.', $file)));
        if (!is_dir($dir . $file)) {
            $link = $dir . '/' . $file;
            $svg_path = $ehld_rel_dir . $arg . '/'. $file;
            $name = str_replace('_', ' ', preg_replace('/\\.[^.\\s]{3,4}$/', '', $file));

            echo '<div class="favth-col-lg-3 favth-col-md-4 favth-col-sm-4 favth-col-xs-12">
                    <div class="svg-component">
                        <a href="'. JUri::getInstance()->toString().'#'.$file .'">
                            <img src="'. $svg_path . '" alt="'. $name . '" />
                        </a>
                        <div class="svg-label">
                            <span class="text-lg-overflow"><a href="'. JUri::getInstance()->toString().'#'.$file .'">'. $name .'</a></span>
                        </div>
                        <div class="favth-col-lg-12 favth-col-md-12 favth-col-sm-12 favth-col-xs-12 extras ">
                                <div class="favth-col-lg-6 favth-col-md-6 favth-col-sm-12 favth-col-xs-12">
                                    '.get_references($link).'
                                </div>
                                <div class="favth-col-lg-6 favth-col-md-6 favth-col-sm-12 favth-col-xs-12" >
                                    <div class="download">
                                        <a><i class="fa fa-download" aria-hidden="true"></i></a>
                                        <div class="tooltip-formats">
                                            <p><a href="'. JUri::current().'?d='. $arg . '/'. urlencode($file) .'">SVG</a></p>
                                            <p><a href="'. JUri::current().'?d='. $arg . '/'. str_replace(".svg", ".emf", urlencode($file)) .'">EMF</a></p>
                                            <p><a href="'. JUri::current().'?d='. $arg . '/'. str_replace(".svg", ".png", urlencode($file)) .'">PNG</a></p>
                                        </div>
                                    </div> <!-- close div:download -->
                                </div>
                        </div> <!-- close div:extras -->
                    </div>
                  </div>'; // close div:svg_component
            $modals .= svg_modal($file, $name, $svg_path);
        } else  {
            $name = ucfirst(strtolower(str_replace('_', ' ', $file)));
            $size = count_svg_files($dir . $file);
            $total_size += $size;
            echo '<div class="favth-col-lg-3 favth-col-md-4 favth-col-sm-4 favth-col-xs-12 favth-text-center">
                    <div class="folder">
                        <a href="'.$current_url.'?'. $param .'='. $file .'">
                            <i class="fa fa-folder" aria-hidden="true"></i>
                            <div class="folder-label">'. $name .'</div><div class="folder-size">('. $size .' components)</div>
                        </a>
                    </div>
                  </div>';
        }

    }
    echo '</div>';
    echo $modals;
	?>

    <?php
    if($total_size > 0){
       echo '<div class="download-lib"><a><i class="fa fa-download" aria-hidden="true"></i>Download all library components</a>'.
            '<div class="tooltip-download-lib">'.
                '<a href="./'. $ehld_main_folder .'/icon-lib-svg.tgz">Download all SVG components</a><br/>'.
                '<a href="./'. $ehld_main_folder .'/icon-lib-emf.tgz">Download all EMF components</a><br/>'.
                '<a href="./'. $ehld_main_folder .'/icon-lib-png.tgz">Download all PNG components</a>'.
            '</div>'.
            '</div>';
       echo '<div class="total-size">Icon library contains: <b>'. $total_size .'</b> components</div>';
    }
}

function count_svg_files($dir){
    return count(glob($dir.'/*.svg'));
}

?>

<div style="clear:both;"></div>

<?php
get_info_div();
get_collaboration_div();
get_disclaimer_div();
?>

