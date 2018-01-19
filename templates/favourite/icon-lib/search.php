<?php

defined('_JEXEC') or die;

$base_dir          = dirname(__FILE__);

require_once( $base_dir . '/common.php' );

// Path where the css, php and images reside.
$icon_lib_rel_dir = $this->baseurl . '/templates/' . $this->template . '/icon-lib';

// Library path, where svg, xml, png reside.
$ehld_main_folder = "ehld-icons";
$ehld_os_dir = JPATH_BASE . '/' . $ehld_main_folder . '/lib/'; // to scan the directory in the OS
$ehld_rel_dir = $this->baseurl . '/' . $ehld_main_folder . '/lib/'; // to access the files when navigating thru the pages

?>

<link href="<?php echo $icon_lib_rel_dir;?>/lib.css?v=3" rel="stylesheet" type="text/css">
<script src="<?php echo $icon_lib_rel_dir;?>/lib.js?v=3"></script>

<?php
$param        = "q";
$file_display = array( 'svg' );
$term         = trim($_GET[$param]);
$results = search($term, $ehld_os_dir, $ehld_rel_dir);
$result_size = sizeof($results["svgs"]);
if($result_size > 0) {
    echo ' <div class="ehld-breadcrumb">
                <a class="icons-lib-home"><i class="icon-home"></i>Library home</a> > Search Library > '.$term .'
           </div>
           <div class="ehld-result-title">
               <h3>
                   <i class="fa fa-file-text-o"></i>Results for "<b>'. $term .'</b>"<span class="current-folder-size"> ('. $result_size .' components)</span>
               </h3>
           </div>';
} else {
    echo '<div class="ehld-breadcrumb">
             <a class="icons-lib-home"><i class="icon-home"></i>Library home</a> > Search Library > '.$term .'
          </div>
          <h3>
              No results found for "<b>'. $term .'</b>"
          </h3>';
}

// Add the search bar
echo draw_search_bar($term);

// Split the array in chunks of 4. Bootstrap Scaffolding 12 Columns -> 12 / 4 = 3. It means we should use span3 as CSS class
echo '<div class="favth-col-lg-12 favth-col-md-12 favth-col-sm-12 favth-col-xs-12">'; // Start row
foreach($results["svgs"] as $result) {
    echo $result;
}
echo '</div>';

// print div modals
echo $results["modals"];

function search($term, $ehld_os_dir, $ehld_rel_dir) {
    $rtn = array();

    // Scan folder and remove some undesirable items in the folder.
	$folders = array_merge(array_diff(scandir($ehld_os_dir), [".", "..", "logo.svg", "logo.emf", "logo.png", "index.html"]));
	$term_target = strtolower($term);

	$modals = null;
    foreach ($folders as $folder) {
        $svg_files = JFolder::files($ehld_os_dir . $folder, '.svg');
        natcasesort($svg_files);
        foreach ($svg_files as $svg_file){
            $name = str_replace('_', ' ', preg_replace('/\\.[^.\\s]{3,4}$/', '', $svg_file));
            $svg_fullpath = $ehld_rel_dir . $folder . '/' . $svg_file;
            $svg_metadata = get_svg_metadata($ehld_os_dir . $folder . '/' . $svg_file);
            $fd = search_description($term_target, $svg_metadata);
            $fp = search_person($term_target, $svg_metadata);

            if (matchesInMetadata($name, $term_target, $fd, $fp)){
                 $name = str_replace('_', ' ', preg_replace('/\\.[^.\\s]{3,4}$/', '', $svg_file));
                 $name_highlighted = str_replace($term, '<span class="term-highlight">'.$term.'</span>', $name);
                 $location = ucfirst(str_replace('_', ' ', $folder));
                 array_push($rtn,
                       '<div class="favth-col-lg-3 favth-col-md-4 favth-col-sm-4 favth-col-xs-12">
                            <div class="svg-component search-result">
                                <a href="'. JUri::getInstance()->toString().'#'.$svg_file .'">
                                    <img src="'. $svg_fullpath . '" alt="'. $name . '" />
                                    <div class="svg_label">'. $name_highlighted .'</div>
                                </a>
                                <div class="favth-col-lg-12 favth-col-md-12 favth-col-sm-12 favth-col-xs-12 extras">
                                    <div class="favth-col-lg-12 favth-col-md-12 favth-col-sm-12 favth-col-xs-12 search-folder">
                                        <a href="'. JUri::current() .'?f='. $folder .'">['. $location . ']</a>
                                    </div>
                                    <div class="favth-col-lg-6 favth-col-md-12 favth-col-sm-12 favth-col-xs-12">
                                        '.get_references($svg_fullpath, $term, $svg_metadata, $fd, $fp).'
                                    </div>
                                    <div class="favth-col-lg-6 favth-col-md-12 favth-col-sm-12 favth-col-xs-12">
                                        <div class="download">
                                            <a><i class="fa fa-download" aria-hidden="true"></i></a>
                                            <div class="tooltip-formats">
                                                <p><a href="'. JUri::current().'?d='. $folder . '/'. urlencode($svg_file) .'">SVG</a></p>
                                                <p><a href="'. JUri::current().'?d='. $folder . '/'. str_replace(".svg", ".emf", urlencode($svg_file)) .'">EMF</a></p>
                                                <p><a href="'. JUri::current().'?d='. $folder . '/'. str_replace(".svg", ".png", urlencode($svg_file)) .'">PNG</a></p>
                                            </div> <!-- close div:tooltip_formats --> 
                                        </div> <!-- close div:download -->
                                    </div> <!-- close div:span -->
                                </div> <!-- close div:extras -->
                            </div> <!-- close div:svg_component -->
                        </div> <!-- close div:favth -->'
                 );
                 $modals .= svg_modal($svg_file, $name, $svg_fullpath);
            }
        }
    }

    // Return an array containing the icons that matched the search and the modals to be added at end
    // otherwise it breaks the layout.
    return array("svgs" => $rtn,
                 "modals"  => $modals);
}

function matchesInMetadata($name, $term, $fd, $fp) {
    /* matches the filename */
    return (strpos(strtolower($name), $term) !== false) || $fd || $fp; 
}

function search_description($term, $svg_metadata) {
    foreach ($svg_metadata as $key => $value) {
        if ($key == "description") {
            if(strpos(strtolower( (string) $value) , $term) !== false) return true;
        }
    }
    return false;
}

/**
 * Search person needs the flag "person:" at the begining of the searched term.
 * If the flag is present, then it checks both the name and the identifier in
 * the "metadata" included in the SVG.
 *
 * @returns True if the content of the term after the flag is a substring in any of the metadata fields
 * @since 1.0
 */
function search_person($term, $svg_metadata){
    $flag = "person:";
    if(substr($term, 0, strlen($flag)) !== $flag) return false;
    $term_target = substr($term, strlen($flag), strlen($term));

    foreach ($svg_metadata as $key => $val) {
        if (is_array($val)){
            foreach ($val as $key2 => $val2){
                if(strpos(strtolower( (string) $val2) , $term_target) !== false) return true;
            }
        }
    }
    return false;
}
?>

<div style="clear:both;"></div>

<?php
get_info_div();
get_collaboration_div();
get_disclaimer_div();
?>
