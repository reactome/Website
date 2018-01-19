<?php

function generate_video_iframe($video_id,$type = 'video') {

	$video_iframe = '';

	$video_type = (ctype_digit($video_id)) ? 'vimeo' : 'youtube';

	if ($type == 'video') {

	if ($video_type == 'vimeo') {

		$video_iframe .= '<iframe src="https://player.vimeo.com/video/'.$video_id.'" width="853" height="480" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';

	} else if ($video_type == 'youtube') {

		$video_iframe .= '<iframe width="853" height="480" src="https://www.youtube.com/embed/'.$video_id.'" frameborder="0" allowfullscreen></iframe>';

	}

	} elseif ($type == 'videothumb') {

		if ($video_type == 'youtube') {

			$video_iframe .= '<img src="http://img.youtube.com/vi/'.$video_id.'/mqdefault.jpg" />';

		} else if ($video_type == 'vimeo') {

			$vimeocurl = curl_init('http://vimeo.com/api/v2/video/'.$video_id.'.json');
			curl_setopt($vimeocurl,CURLOPT_RETURNTRANSFER, TRUE);
			$vimeojson = curl_exec($vimeocurl);
			curl_close($vimeocurl);
 
			$vimeojsonresponse = json_decode($vimeojson,true);

			$vimeothumburl = $vimeojsonresponse[0]['thumbnail_large'];

			$video_iframe .= '<img src="'.$vimeothumburl.'" />';

		}

	} elseif ($type == 'videothumburl') {

		if ($video_type == 'youtube') {

			$video_iframe .= 'http://img.youtube.com/vi/'.$video_id.'/mqdefault.jpg';

		} else if ($video_type == 'vimeo') {

			$vimeocurl = curl_init('http://vimeo.com/api/v2/video/'.$video_id.'.json');
			curl_setopt($vimeocurl,CURLOPT_RETURNTRANSFER, TRUE);
			$vimeojson = curl_exec($vimeocurl);
			curl_close($vimeocurl);
 
			$vimeojsonresponse = json_decode($vimeojson,true);

			$vimeothumburl = $vimeojsonresponse[0]['thumbnail_large'];

			$video_iframe .= $vimeothumburl;

		}

	}

	return $video_iframe;
}

?>