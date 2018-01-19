<?php
function get_references($file, $term=null, $metadata=null, $fd=false, $fp=false) {
    if(empty($metadata)){
        $metadata = get_svg_metadata($file);
    }

    if(empty($metadata)) {
    	return '<div class="no-information">
					<i class="fa fa-info" aria-hidden="true" title="No Information found"></i>
				</div>';
    }

    $highlight = $fd || $fp;
    $image = $highlight ? "fa-info-circle" : "fa-info";

     $desc = $metadata["description"];
     if ($fd) {
         $desc = highlight($desc, $term);
     }

     if ($fp) {
         $flag = "person:";
         $term_target = substr($term, strlen($flag), strlen($term));

         foreach ($metadata as $key => $val) {
            if (is_array($val)){
                foreach ($val as $key2 => $val2){
                    if(strpos(strtolower( (string) $val2) , strtolower($term_target)) !== false) {
                        $metadata[$key]["highlight"] = "term-highlight";
                    }
                }
            }
         }
     }

     return '<div class="information">'.
                '<a>
                    <i class="fa '.$image.'" aria-hidden="true"></i>
                 </a>'.
                '<div class="tooltip-information">'.
	                '<div class="description"><span>Description: </span><span>'. $desc .'</span></div>'.
	                '<br/>'.
	                '<div class="curator"><span>Curator: </span><a class="'. $metadata["curator"]["highlight"] .'" href="'. $metadata["curator"]["url"] .'" target="_blank">'. $metadata["curator"]["name"] .'</a></div>'.
	                '<div class="designer"><span>Designer: </span><a class="'. $metadata["designer"]["highlight"] .'" href="'. $metadata["designer"]["url"] .'" target="_blank">'. $metadata["designer"]["name"] .'</a></div>'.
	            '</div>'.
            '</div>';

}

function get_string_between($string, $start, $end){
    $string = ' ' . $string;
    $ini = strpos($string, $start);
    if ($ini == 0) return '';
    $ini += strlen($start);
    $len = strpos($string, $end, $ini) - $ini;
    return trim(substr($string, $ini, $len));
}

function get_svg_metadata($file){
    $file = str_replace(".svg", ".xml", $file);
    $orcid_url = "http://europepmc.org/search?query=AUTHORID:#ORCID#&sortby=Date";

    $str = file_get_contents($file);
    $xml = simplexml_load_string($str);

    $metadata = array();
    if ($xml->description) $metadata["description"] = (string) $xml->description[0];
    if ($xml->info) $metadata["info"] = (string) $xml->info[0];
    foreach ($xml->person as $person) {
        $orcid = (string) $person["orcid"];
        $url = (string) $person["url"];
        if (empty($url)){
            $url = empty($orcid) ? "" : str_replace("#ORCID#", $orcid, $orcid_url);
        }
        $metadata[(string) $person['role']] = array("name" => (string) $person, "orcid" => (string) $person["orcid"], "url" => $url );
    }

    return $metadata;
}

function highlight($text, $words) {
    $words = trim($words);
    $wordsArray = explode(' ', $words);
    $after = null;
    foreach($wordsArray as $word) {
       if(strlen(trim($word)) != 0) {
           $after = preg_replace("#".preg_quote($word)."#i", '<span class="term-highlight">\\0</span>', $text);
       }
    }
    return $after;
}

function svg_modal($id, $name, $svg_fullpath){
    $close = JUri::getInstance()->toString().'#/';
    return '<div id="'. $id .'" class="modal-dialog" style="display: none;"><div><a href="'.$close.'" title="Close" class="close">X</a><h3>'. $name .'</h3><img src="'. $svg_fullpath .'" /></div></div>';
}

function draw_search_bar($term) {
	$app  = JFactory::getApplication();
	$menu_alias = $app->getMenu()->getActive()->alias;

    return '<div class="ehld-search-bar">
				<div class="text-center">
	                <div class="nav-collapse-search search">
	                    <form action="./'.$menu_alias.'" method="GET" class="clean-form form-inline">
	                        <input id="mod-search-searchword" name="q" value="'.$term.'" maxlength="200" size="10" type="search"  class="inputbox search-query alt-searchbox" placeholder="e.g DNA, Microorganism, protein or person:jupe" onfocus="this.select();" autofocus>
	                        <button class="button btn btn-primary btn-info">Go!</button>
	                    </form>
	                </div>
	            </div>
	        </div>';
}

function get_info_div(){
	echo '<div class="info">Please refer to the <a href="icon-info">guidelines</a> for more information about the process of creating and sharing icons.</div>';
}

function get_collaboration_div() {
	echo '<div class="collaboration">' .
		'We would like to develop the Icon Library further as a community resource. ' .
		'If you use library elements, and design similar elements which are still missing, we would be very happy to incorporate them into the library, ' .
		'naming you as the author. <!-- Please refer to [ link to instructions on how to provide compatible library elements ] for details. --> ' .
		'Contact us at <a href="mailto:help@reactome.org?subject=EHLD Library">help@reactome.org</a>.' .
		'</div>';
}

function get_disclaimer_div() {
	echo '<div class="disclaimer">' .
		'The software and information contents are distributed under the terms of the ' .
		'<a href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>, ' .
		'which grants parties the non-exclusive right to use, distribute and create derivative works based on Reactome, provided that the ' .
		'software and information is correctly attributed to CSHL, OICR and EBI. Find more information about the license ' .
		'<a href="index.php?option=com_content&view=article&id=16">here</a>.' .
		'</div>';
}

?>
