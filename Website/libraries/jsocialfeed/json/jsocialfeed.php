<?php defined('_JEXEC') or die('Restricted access');

/**
 * @author     Garda Informatica <info@gardainformatica.it>
 * @copyright  Copyright (C) 2014 Garda Informatica. All rights reserved.
 * @license    http://www.gnu.org/licenses/gpl-3.0.html  GNU General Public License version 3
 * @package    JSocialFeed Joomla Extension
 * @link       http://www.gardainformatica.it
 */

/*

This file is part of "JSocialFeed Joomla Extension".

"JSocialFeed Joomla Extension" is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

"JSocialFeed Joomla Extension" is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with "JSocialFeed Joomla Extension".  If not, see <http://www.gnu.org/licenses/>.

*/

jimport( 'joomla.http.factory' );
jimport( 'joomla.http.http' );
jimport( 'joomla.http.response' );

function gi_escape_html($value){
	//<div>...ESCAPE UNTRUSTED DATA BEFORE PUTTING HERE...</div>
	$quote_style = ENT_QUOTES;
	if (version_compare(PHP_VERSION, '5.4') >= 0) {
		$quote_style = ENT_QUOTES | ENT_SUBSTITUTE;
	}	
	return htmlspecialchars($value,$quote_style,'UTF-8');
}
function gi_undo_escape_html($value){
	$quote_style = ENT_QUOTES;
	return html_entity_decode($value,$quote_style,'UTF-8');
}


$jlang = JFactory::getLanguage();
$jlang->load('jsocialfeed', JPATH_LIBRARIES.'/jsocialfeed', 'en-GB', true);
$jlang->load('jsocialfeed', JPATH_LIBRARIES.'/jsocialfeed', $jlang->getDefault(), true);
$jlang->load('jsocialfeed', JPATH_LIBRARIES.'/jsocialfeed', null, true);

$jlang->load("com_content");

$params=$this->Params;

$helper=new ModJSocialFeedHelper();
$helper->CacheLifetime = $params->get("feed_cache_lifetime", 60) * 60;  // Converte da minuti in secondi

list($items,$messages) = $helper->getList($params);

$options = new stdClass();
$options->mode=$params->get("scroll", 'vertical');

$li_class=array();

$li_class[]='jsf-news-entry';
//solo se vertical
if ($options->mode=='vertical'){
	$options->minSlides=max(intval($params->get("vertical_num_slides",1)),1);
	if ($options->minSlides>1){
		$li_class[]='jsf-dashed';
	}
}


$html=array();
	foreach($items as $post){
		if (!empty($li_class)){
			$html[]='<li class="'.implode(' ',$li_class).'">';
		}else{
			$html[]='<li>';
		}
		if ($params->get("hide_thumb", 0)!=1){
			if (!empty($post['actor_image_url'])){
				$html[]='<img class="jsf-thumb" src="'.gi_escape_html($post['actor_image_url']).'" alt="'.gi_escape_html($post['actor_display_name']).'" />';
			}
		}
		
		if ($params->get("hide_title", 0)!=1 || $params->get("hide_date", 0)!=1 || $params->get("hide_likes", 0)!=1 || $params->get("hide_comments", 0)!=1 || $params->get("hide_reshares", 0)!=1 ){
			
			$html[]='<div class="jsf-title">';
			if ($params->get("hide_title", 0)!=1){
				if (!empty($post['actor_display_name'])){
					$html[]='<a class="jsf-title-link" href="'.gi_escape_html($post['url']).'" target="_blank">'.gi_escape_html($post['actor_display_name']).'</a>';
				}
			}
			if ($params->get("hide_date", 0)!=1){
				$html[]='<span class="jsf-date"><i class="jsficon-clock"></i> '.gi_escape_html($post['date']).'</span>';
			}
			if ($params->get("hide_likes", 0)!=1){
				if ($post['plusoners_totalItems']>0){
					$html[]='<span class="jsf-plusoners"><i class="jsficon-thumbs-up"></i> '.gi_escape_html($post['plusoners_totalItems']).'</span>';
				}
			}
			if ($params->get("hide_comments", 0)!=1){
				if ($post['replies_totalItems']>0){
					$html[]='<span class="jsf-replies"><i class="jsficon-bubbles"></i> '.gi_escape_html($post['replies_totalItems']).'</span>';
				}
			}
			if ($params->get("hide_reshares", 0)!=1){
				if ($post['resharers_totalItems']>0){
					$html[]='<span class="jsf-resharers"><i class="jsficon-share"></i> '.gi_escape_html($post['resharers_totalItems']).'</span>';
				}
			}
			$html[]='</div>';
		}
		
		if ($params->get("show_rss_atom_channel", 0)==1 && !empty($post['channel_title']) && !empty($post['channel_link'])){
			$html[]='<div class="jsf-channel">';
			$html[]='<a class="jsf-channel-link" href="'.gi_escape_html($post['channel_link']).'" target="_blank">'.gi_escape_html($post['channel_title']).'</a>';
			$html[]='</div>';
		}		
		
		if ($params->get("hide_title", 0)==1 || $params->get("hide_description", 0)!=1){
			$readmore='';
			if ($params->get("hide_title", 0)==1){
				$readmore.='<a class="jsf-readmore" href="'.gi_escape_html($post['url']).'" target="_blank">';
				$readmore.=JText::_('COM_CONTENT_READ_MORE_TITLE');
				$readmore.='</a>';
			}
			$html[]='<div class="jsf-content">'.$post['title'].' '.$readmore.'</div>'."\n";
		}
		$html[]='<div class="jsf-clearboth"></div>';
		$html[]='</li>';
	}
$source = '"html":' . json_encode(implode("\n",$html));
if (!empty($messages)){
	$source .= ',"messages":' . json_encode($messages);
}
echo $source;


require_once(JPATH_ROOT . '/' . "libraries" . '/' . "jsocialfeed" . '/' . "language" . '/' . "jsocialfeed.inc");

class ModJSocialFeedHelper
{



	public function getList(&$params)
	{
		$rss_atom_urls=array();
		$twitter_users=array();
		$google_users=array();
		$facebook_pages=array();
	
		$thumb_width=intval($params->get('rss_atom_thumb_width',50));
		$thumb_height=intval($params->get('rss_atom_thumb_height',50));
		$thumb_width=$thumb_width==0?50:$thumb_width;
		$thumb_height=$thumb_height==0?50:$thumb_height;
	
		for ($i=1;$i<=10;$i++){
			$rss_atom_url=trim($params->get('rss_atom_url'.$i,''));
			$rss_atom_channel_title=trim($params->get('rss_atom_channel_title'.$i,''));
			$rss_atom_channel_link=trim($params->get('rss_atom_channel_link'.$i,''));
			if (!empty($rss_atom_url)){
				$rss_atom_urls[]=array('url'=>$rss_atom_url,'channel_title'=>$rss_atom_channel_title,'channel_link'=>$rss_atom_channel_link);
			}
		}

		for ($i=1;$i<=10;$i++){
			$google_user_id=trim($params->get('google_user_id'.$i,''));
			if (!empty($google_user_id)){
				$google_users[]=$google_user_id;
			}
		}
		for ($i=1;$i<=10;$i++){
			$twitter_user_name=trim($params->get('twitter_user_name'.$i,''));
			if (!empty($twitter_user_name)){
				$twitter_users[]=$twitter_user_name;
			}
		}
		for ($i=1;$i<=10;$i++){
			$facebook_page_id=trim($params->get('facebook_page_id'.$i,''));
			if (!empty($facebook_page_id)){
				$facebook_pages[]=$facebook_page_id;
			}
		}

		$num_items_per_feed=max(intval($params->get('num_items_per_feed',5)),1);
		
		$items=array();
		foreach ($rss_atom_urls as $feed_url){
			$itms=$this->getRSSAtomFeed($feed_url,$num_items_per_feed,$thumb_width,$thumb_height);
			if (!empty($itms)){
				$items=array_merge($items,$itms);
			}
		}
		
		$google_key=trim($params->get('google_api_key',''));
		if (!empty($google_key)){
			foreach ($google_users as $google_user_id){
				$itms=$this->getGooglePlusFeed($google_user_id,$num_items_per_feed,$google_key);
				if (!empty($itms)){
					$items=array_merge($items,$itms);
				}
			}
		}

		$twitter_key=trim($params->get('twitter_consumer_key',''));
		$twitter_secret=trim($params->get('twitter_consumer_secret',''));
		if (!empty($twitter_key) && !empty($twitter_secret)){
			foreach ($twitter_users as $twitter_user_name){
				$itms=$this->getTwitterFeed($twitter_user_name,$num_items_per_feed,$twitter_key,$twitter_secret);
				if (!empty($itms)){
					$items=array_merge($items,$itms);
				}
			}
		}
		
		
		$facebook_app_id=trim($params->get('facebook_app_id',''));
		$facebook_app_secret=trim($params->get('facebook_app_secret',''));
		if (!empty($facebook_app_id) && !empty($facebook_app_secret)){
			foreach ($facebook_pages as $facebook_page_id){
				$itms=$this->getFacebookFeed($facebook_page_id,$num_items_per_feed,$facebook_app_id,$facebook_app_secret,$thumb_width,$thumb_height);
				if (!empty($itms)){
					$items=array_merge($items,$itms);
				}
			}
		}
		
		
		$title_max_length=intval($params->get('title_max_length',60));
		$description_max_length=intval($params->get('description_max_length',140));
		if ($title_max_length>0){
			foreach ($items as &$post){
				if (mb_strlen($post['actor_display_name'])>$title_max_length){
					if ($title_max_length>3){
						$post['actor_display_name']=mb_substr($post['actor_display_name'],0,$title_max_length-3).'...';
					}else{
						$post['actor_display_name']='...';
					}
				}
			}
			unset($post);
		}
		
		$this->html_tags_whitelist=array('BODY');
		$wl_tags=explode(',',mb_strtoupper($params->get('html_tags_whitelist','span, a, strong')));
		foreach ($wl_tags as $tag){
			$tag=trim($tag);
			if (in_array($tag,$this->html_tags)){//se è un tag html
				if (!in_array($tag,$this->html_tags_whitelist)){//e non è già presente tra i tag whitelist
					$this->html_tags_whitelist[]=$tag;//allora lo aggiongo
				}
			}
		}
		
		foreach ($items as &$post){
			$riga=$this->produciRigaTabellaArticolo($post['title'],$description_max_length);
			$post['title']=$riga['description'];
		}
		unset($post);
		
		$feed_order_by=$params->get('feed_order_by','datedesc');
		if ($feed_order_by=='item'){
			//normal
		}else if ($feed_order_by=='reversed'){
			$items=array_reverse($items);
		}else if ($feed_order_by=='random'){
			shuffle($items);
		}else if ($feed_order_by=='dateasc'){
			usort($items, array("ModJSocialFeedHelper", "cmp_items_dateasc"));
		}else{ //datedesc
			usort($items, array("ModJSocialFeedHelper", "cmp_items_datedesc"));
		}


		foreach ($items as &$post){
			$post['date']=$this->getTime($post['updated']);
		}
		unset($post);

		return array($items,$this->messages);
	}
    public static function cmp_items_datedesc($a, $b)
    {
        if ($a['updated'] == $b['updated']) {
            return 0;
        }
        return ($a['updated'] < $b['updated']) ? +1 : -1;
    }	
    public static function cmp_items_dateasc($a, $b)
    {
        if ($a['updated'] == $b['updated']) {
            return 0;
        }
        return ($a['updated'] > $b['updated']) ? +1 : -1;
    }	
	private function enqueueMessage($msg,$type){
		$this->messages[]=array('msg'=>$msg,'type'=>$type);
	}
	
	
	public function getRSSAtomFeed($feed_url,$count,$thumb_width,$thumb_height){
		//$feed_url==array('url'=>$rss_atom_url,'channel_title'=>$rss_atom_channel_title,'channel_link'=>$rss_atom_channel_link)
		$posts=$this->getPosts(array('rss',mb_substr($feed_url['url'],12),$count,$thumb_width,$thumb_height));
		if ($posts!==FALSE){
			if (!empty($feed_url['channel_title']) && !empty($feed_url['channel_link'])){
				foreach ($posts as &$p){
					$p['channel_title']=$feed_url['channel_title'];
					$p['channel_link']=$feed_url['channel_link'];
				}
				unset($p);
			}
		
			return $posts;
		}
		if(version_compare(JVERSION, '3.0', 'ge')){
			$opts = array(
			  'http'=>array(
				'user_agent'=>'JSocialFeed'
			  )
			);

			$context = stream_context_create($opts);
			libxml_set_streams_context($context);

			

			$parsed_url = parse_url(trim($feed_url['url']));
			$domain_parts = explode('.', $parsed_url['host']);

			
			try
			{
				jimport('joomla.feed.factory');
				$feed   = new JFeedFactory;
				$doc = $feed->getFeed($feed_url['url']);
			}
			catch (Exception $e)
			{
				$this->enqueueMessage('Feed error: '.$e->getCode().' '.$e->getFile().' '.$e->getLine().' '.$e->getMessage(), 'error');
				return false;
			}

			if (empty($doc))
			{
				$this->enqueueMessage('Feed error: empty', 'error');
				return false;
			}
			
			$channel_title=$feed_url['channel_title'];
			$channel_link=$feed_url['channel_link'];
			if (empty($channel_title)){
				$channel_title=$doc->title;
			}
			if (empty($channel_link)){
				$channel_link=$doc->uri;
			}
			if (empty($channel_link) && $doc->link!==null  ){
				$channel_link=$doc->link->uri;
			}
			if (empty($channel_link) && $doc->image!==null ){
				$channel_link=$doc->image->link;
			}
			
			
			$posts=array();
			for ($i = 0; $i < $count; $i++){
				if (!$doc->offsetExists($i))
				{
					break;
				}
				$uri = (!empty($doc[$i]->uri) || !is_null($doc[$i]->uri)) ? $doc[$i]->uri : $doc[$i]->guid;
				$text = !empty($doc[$i]->content) ||  !is_null($doc[$i]->content) ? $doc[$i]->content : $doc[$i]->description;
			
				//$iUrl	= $doc[$i]->image;
				$post=array();
				$imageurl='';
				if (is_array($doc[$i]->links)){
					foreach ($doc[$i]->links as $link){
						if ($link->type=='image/jpeg'){
							$imageurl=$link->uri;
							break;
						}
					}
				}
				$riga=$this->getPrimaImmagine($feed_url['url'],$text,$imageurl,$thumb_width,$thumb_height);
				$post['title']=$text;
				$post['updated']=strtotime($doc[$i]->updatedDate->toISO8601());
				$post['url']=$uri;
				$post['actor_image_url']=$riga['imgsrc'];
				$post['actor_display_name']=$doc[$i]->title;
				$post['actor_url']=$feed_url['url'];
				$post['content']=$text;
				$post['replies_totalItems']=0;
				$post['plusoners_totalItems']=0;
				$post['resharers_totalItems']=0;

				$post['channel_title']=$channel_title;
				$post['channel_link']=$channel_link;
				
				//$post['actor_display_name']=gi_undo_escape_html($post['actor_display_name']);
				
				$posts[]=$post;
				
				
			}
		}else{
			//Joomla 2.5
			
			$rssDoc = JFactory::getFeedParser($feed_url['url'],0);
			if ($rssDoc==false){
				$this->enqueueMessage('RSS/Atom Feed error', 'error');
				return false;
			}

			$feed = new stdclass();

			// channel header and link
			$feed->title = $rssDoc->get_title();
			$feed->link = $rssDoc->get_link();
			$feed->description = $rssDoc->get_description();

			// channel image if exists
			$feed->image->url = $rssDoc->get_image_url();
			$feed->image->title = $rssDoc->get_image_title();

			
			$channel_title=$feed_url['channel_title'];
			$channel_link=$feed_url['channel_link'];
			if (empty($channel_title)){
				$channel_title=$feed->title;
			}
			if (empty($channel_link)){
				$channel_link=$feed->link;
			}
			
			
			// items
			$items = $rssDoc->get_items();
			// feed elements
			$posts=array();
			for ($i = 0; $i < $count; $i++){
				if (empty($items[$i]))
				{
					break;
				}
			
			
				$uri = $items[$i]->get_link();
				$text = $items[$i]->get_description();
			
				$post=array();
				$imageurl='';
				if ($enclosure = $items[$i]->get_enclosure())
				{
					$imageurl=$enclosure->get_link();
				}				
				
				$riga=$this->getPrimaImmagine($feed_url['url'],$text,$imageurl,$thumb_width,$thumb_height);
				$post['title']=$text;
				$post['updated']=$items[$i]->get_date('U');
				$post['url']=$uri;
				$post['actor_image_url']=$riga['imgsrc'];
				$post['actor_display_name']=$items[$i]->get_title();
				$post['actor_url']=$feed_url['url'];
				$post['content']=$text;
				$post['replies_totalItems']=0;
				$post['plusoners_totalItems']=0;
				$post['resharers_totalItems']=0;
				
				$post['channel_title']=$channel_title;
				$post['channel_link']=$channel_link;
				
				$post['actor_display_name']=gi_undo_escape_html($post['actor_display_name']);
				
				$posts[]=$post;
				
				
			}		
		
		}
		$this->savePosts($posts,array('rss',mb_substr($feed_url['url'],12),$count,$thumb_width,$thumb_height));
		return $posts;
	}
	
	public function getGooglePlusFeed($google_user_id,$count,$key){
		$posts=$this->getPosts(array('google',$google_user_id,$count),array($key));
		if ($posts!==FALSE){
			return $posts;
		}
	
		$posts=array();
		$url = "https://www.googleapis.com/plus/v1/people/" . $google_user_id. "/activities/public?maxResults=" . $count . "&key=" . $key;

		if(version_compare(JVERSION, '3.0', 'ge')){
			$http = JHttpFactory::getHttp();
		}else{
			jimport( 'joomla.client.http' );
			$http = new JHttp();
		}
        $resp = $http->get($url);
		
		//$http->code==404
		if (substr($resp->code,0,1)==4){
			$google_msgs=json_decode($resp->body,true);
			$msg_errore_google='';
			if (is_array($google_msgs) && isset($google_msgs['error']) && isset($google_msgs['error']['message'])){
				$msg_errore_google=$google_msgs['error']['message'];
			}
			$this->enqueueMessage('Google+: verify google credentials: '.$msg_errore_google, 'error');
			return false;
		}
		if ($resp->code=="200"){
			$feed=json_decode($resp->body,true);
			foreach ($feed['items'] as $item){
				$post=array();
				
				$post['title']=$item['object']['content'];
				$post['updated']=strtotime($item['updated']);
				$post['url']=$item['url'];
				$post['actor_image_url']=$item['actor']['image']['url'];
				$post['actor_display_name']=$item['actor']['displayName'];
				$post['actor_url']=$item['actor']['url'];
				$post['content']=$item['object']['content'];
				$post['replies_totalItems']=$item['object']['replies']['totalItems'];
				$post['plusoners_totalItems']=$item['object']['plusoners']['totalItems'];
				$post['resharers_totalItems']=$item['object']['resharers']['totalItems'];
				
				$posts[]=$post;
			}
		}
		$this->savePosts($posts,array('google',$google_user_id,$count),array($key));
		return $posts;
	}
	
	public function getTwitterFeed($twitter_user_name,$count,$key,$secret){
		$posts=$this->getPosts(array('twitter',$twitter_user_name,$count),array($key,$secret));
		if ($posts!==FALSE){
			return $posts;
		}
		$tweets = array();
		require_once dirname(__FILE__).'/lib/twitteroauth/twitteroauth.php';
		require_once dirname(__FILE__).'/lib/twitter-text/Autolink.php';
		require_once dirname(__FILE__).'/lib/twitter-text/Extractor.php';
		require_once dirname(__FILE__).'/lib/twitter-text/HitHighlighter.php';

		$twitterConnection = new TwitterOAuth(
			$key, // API key
			$secret, // API secret
			'', // Access token
			''	// Access token secret
		);

		$twitterData = $twitterConnection->get(
			'statuses/user_timeline',
			array(
				'screen_name' => $twitter_user_name,
				'count' => $count,
			)
		);

		if (isset($twitterData->errors)){
			foreach ($twitterData->errors as $err){
				if ($err->code==215){
					//Bad Authentication data
					$this->enqueueMessage('Twitter: '.$err->message, 'error');
					return false;
				}
			}
		
			//error_log(var_export($twitterData->errors,true));
		}else if (!is_array($twitterData)){
				$this->enqueueMessage('Twitter: connection problems', 'error');
				return false;
		}else{
			
			foreach($twitterData as $tweet) {
				$post=array();
				$post['title']=Twitter_Autolink::create($tweet->text)->setNoFollow(false)->addLinks();
				$post['updated']=strtotime($tweet->created_at);
				$post['url']="http://twitter.com/".$tweet->user->screen_name."/status/".$tweet->id_str;
				$post['actor_image_url']=$tweet->user->profile_image_url_https;
				$post['actor_display_name']=$tweet->user->name;
				$post['actor_url']="http://twitter.com/".$tweet->user->screen_name;
				$post['content']=Twitter_Autolink::create($tweet->text)->setNoFollow(false)->addLinks();
				$post['replies_totalItems']=0;
				$post['plusoners_totalItems']=$tweet->favorite_count;
				$post['resharers_totalItems']=$tweet->retweet_count;

				$tweets[] = $post;
			}
		}
		$this->savePosts($tweets,array('twitter',$twitter_user_name,$count),array($key,$secret));
		return $tweets;
	}
	
	public function getFacebookFeed($facebook_page_id,$count,$key,$secret,$thumb_width,$thumb_height){
		$posts=$this->getPosts(array('facebook',$facebook_page_id,$count,$thumb_width,$thumb_height),array($key,$secret));
		if ($posts!==FALSE){
			return $posts;
		}
		$posts = array();
		
		//retrive posts
		$url="https://graph.facebook.com/v2.5/".$facebook_page_id."/feed?".http_build_query(array("fields"=>"from,updated_time,message,story,name,caption,description,link,picture,comments,likes,shares","limit"=>$count,"access_token"=>$key."|".$secret));
		
		
		$ch = curl_init();
		
		curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.130 Safari/537.36');
		curl_setopt($ch, CURLOPT_HEADER, false);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_TIMEOUT, 20);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);		
		
		curl_setopt($ch, CURLOPT_URL, "https://graph.facebook.com/v2.5/".$facebook_page_id."?".http_build_query(array("fields"=>"link,cover","access_token"=>$key."|".$secret)));
		$data_page=curl_exec($ch);
		
		curl_setopt($ch, CURLOPT_URL, "https://graph.facebook.com/v2.5/".$facebook_page_id."/picture?".http_build_query(array("redirect"=>"0","type"=>"normal","width"=>$thumb_width,"height"=>$thumb_height,"access_token"=>$key."|".$secret)));
		$data_picture=curl_exec($ch);
		
		curl_setopt($ch, CURLOPT_URL, $url);
		$data=curl_exec($ch);
		
		curl_close($ch);
		
		if ($data_page===FALSE){
			$this->enqueueMessage('Facebook Page:'.$facebook_page_id.': connection problem', 'error');
			return false;
		}		
		$json_page=json_decode($data_page,true);
		
		if ($json_page===FALSE){
			$this->enqueueMessage('Facebook Page:'.$facebook_page_id.': decode problem', 'error');
			return false;
		}
		if (isset($json_page['error'])){
			$this->enqueueMessage('Facebook Page:'.$facebook_page_id.': '.$json_page['error']['message'], 'error');
			return false;
		}
		if (!isset($json_page['link'])){
			//$this->enqueueMessage('Facebook Page:'.$facebook_page_id.': no link', 'error');
			//return false;
		}
		
		
		if ($data_picture===FALSE){
			$this->enqueueMessage('Facebook Picture:'.$facebook_page_id.': connection problem', 'error');
			return false;
		}		
		$json_picture=json_decode($data_picture,true);
		if ($json_picture===FALSE){
			$this->enqueueMessage('Facebook Picture:'.$facebook_page_id.': decode problem', 'error');
			return false;
		}
		if (isset($json_picture['error'])){
			$this->enqueueMessage('Facebook Picture:'.$facebook_page_id.': '.$json_picture['error']['message'], 'error');
			return false;
		}
		if (!isset($json_picture['data'])){
			$json_picture['data']=array();
			//$this->enqueueMessage('Facebook Picture:'.$facebook_page_id.': no data', 'error');
			//return false;
		}
		
		
		if ($data===FALSE){
			$this->enqueueMessage('Facebook Posts:'.$facebook_page_id.': connection problem', 'error');
			return false;
		}
		$json=json_decode($data,true);
		if ($json===FALSE){
			$this->enqueueMessage('Facebook Posts:'.$facebook_page_id.': decode problem', 'error');
			return false;
		}
		if (isset($json['error'])){
			$this->enqueueMessage('Facebook Posts:'.$facebook_page_id.': '.$json['error']['message'], 'error');
			return false;
		}
		if (!isset($json['data'])){
			$this->enqueueMessage('Facebook Posts:'.$facebook_page_id.': no data', 'error');
			return false;
		}
		if (!isset($json_picture['data']['url'])){
			$json_picture['data']['url']='';
		}
		foreach ($json['data'] as $r){
			$post=array();
			
			if (!isset($r['from'])){
				$r['from']=array();
			}
			if (!isset($r['from']['name'])){
				$r['from']['name']='';
			}
			if (!isset($r['updated_time'])){
				$r['updated_time']='';
			}
			
			$post['title']=$r['from']['name'];
			
			if (!empty($r['message'])){
				$post['title']=$r['message'];
			}
			if (!empty($r['story'])){
				$post['title'].="\n".$r['story'];
			}
			if (!empty($r['name'])){
				$post['title'].="\n".$r['name'];
			}
			if (!empty($r['caption'])){
				$post['title'].="\n".$r['caption'];
			}
			if (!empty($r['description'])){
				$post['title'].="\n".$r['description'];
			}
			$post['title']=str_replace("\n\n","\n",$post['title']);
			$post['title']=str_replace("\n\n","\n",$post['title']);
			$post['title']=str_replace("\n\n","\n",$post['title']);
			$post['title']=str_replace("\n\n","\n",$post['title']);
			$post['title']=str_replace("\n\n","\n",$post['title']);
			
			$post['title']=gi_escape_html(trim($post['title']));
			
			$post['updated']=strtotime($r['updated_time']);
			$post['url']='#';
			if (isset($json_page['link'])){
				$post['url']=$json_page['link'];
			}
			if (isset($r['link'])){
				$post['url']=$r['link'];
			}
			
			$post['actor_image_url']=$json_picture['data']['url'];
			if (empty($post['actor_image_url']) && isset($json_page['cover']) && !empty($json_page['cover']['source'])){
				$post['actor_image_url']=$json_page['cover']['source'];
			}
			if (empty($post['actor_image_url']) && !empty($r['picture'])){
				$post['actor_image_url']=$r['picture'];
			}
			
			$post['actor_display_name']=$r['from']['name'];
			$post['actor_url']='#';
			if (isset($json_page['link'])){
				$post['actor_url']=$json_page['link'];
			}
			
			$post['content']=$post['title'];
			
			$post['replies_totalItems']=0;
			$post['plusoners_totalItems']=0;
			$post['resharers_totalItems']=0;
			
			
			
			if (isset($r['comments'])){
				$post['replies_totalItems']=count($r['comments']['data']);
			}
			if (isset($r['likes'])){
				$post['plusoners_totalItems']=count($r['likes']['data']);
			}
			if (isset($r['shares'])){
				$post['resharers_totalItems']=$r['shares']['count'];
			}
			
			$posts[]=$post;
		}
		
		
		$this->savePosts($posts,array('facebook',$facebook_page_id,$count,$thumb_width,$thumb_height),array($key,$secret));
		return $posts;
		
	}


	private function getHash($public_array,$pivate_array=array()){
		$parts=array();
		$parts[]=preg_replace('/[^a-zA-Z0-9]/', '', '1.5.4');//versione JSocialFeed
		foreach($public_array as $p){
			$parts[]=substr(preg_replace('/[^a-zA-Z0-9-]/', '_', $p),0,4);
		}
		$parts[]=substr(md5(implode('',array_merge($public_array,$pivate_array))),0,10);
		$hash=implode('-',$parts);
		return $hash;
	}
	
	private function savePosts($posts,$public_array,$pivate_array=array()){
		$cachefile=$this->cachedir . "/" .$this->getHash($public_array,$pivate_array);
		file_put_contents($cachefile, gzdeflate(json_encode($posts)));
	}
	private function getPosts($public_array,$pivate_array=array()){
		$cachefile=$this->cachedir . "/" .$this->getHash($public_array,$pivate_array);
		if (!file_exists($cachefile)){
			return false;
		}

		$age = time() - filemtime($cachefile);
		$lt=$this->CacheLifetime;
		
		if ($age < $lt){
			$posts=json_decode(gzinflate(file_get_contents($cachefile)),true);
			return $posts;
		}
		return FALSE;
	}

	
	// parse time in a twitter style
	private function getTime($date)
	{
		$timediff = time() - $date;
		if($timediff < 1)
			return '0s';
		else if($timediff < 60)
			return $timediff . 's';
		else if($timediff < 3600)
			return intval(date('i', $timediff)) . 'm';
		else if($timediff < 86400)
			return round($timediff/60/60) . 'h';
		else
			return JHTML::_('date', $date, 'M d');
	}
	
	protected $cachedir;
	protected $urlcachedir;
	protected $lastTextNode;
	public $CacheLifetime;
	protected $messages;

	public function __construct()
	{
		$this->cachedir = JPATH_ROOT . "/cache/" . get_class($this);
		$this->urlcachedir=	JURI::base( true )."/cache/" . get_class($this);
		file_exists($this->cachedir) or mkdir($this->cachedir);
		$this->lastTextNode=null;
		$this->messages=array();
		$this->html_tags_whitelist=array('BODY','SPAN','A','STRONG');
		
		$this->html_tags=array("A", "ABBR", "ACRONYM", "ADDRESS", "APPLET", "AREA", "ARTICLE", "ASIDE", "AUDIO", "B", "BASE", "BASEFONT", "BDI", "BDO", "BIG", "BLOCKQUOTE", "BODY", "BR", "BUTTON", "CANVAS", "CAPTION", "CENTER", "CITE", "CODE", "COL", "COLGROUP", "DATALIST", "DD", "DEL", "DETAILS", "DFN", "DIALOG", "DIR", "DIV", "DL", "DT", "EM", "EMBED", "FIELDSET", "FIGCAPTION", "FIGURE", "FONT", "FOOTER", "FORM", "FRAME", "FRAMESET", "HEAD", "HEADER", "H1", "H2", "H3", "H4", "H5", "H6", "HR", "HTML", "I", "IFRAME", "IMG", "INPUT", "INS", "KBD", "KEYGEN", "LABEL", "LEGEND", "LI", "LINK", "MAIN", "MAP", "MARK", "MENU", "MENUITEM", "META", "METER", "NAV", "NOFRAMES", "NOSCRIPT", "OBJECT", "OL", "OPTGROUP", "OPTION", "OUTPUT", "P", "PARAM", "PRE", "PROGRESS", "Q", "RP", "RT", "RUBY", "S", "SAMP", "SCRIPT", "SECTION", "SELECT", "SMALL", "SOURCE", "SPAN", "STRIKE", "STRONG", "STYLE", "SUB", "SUMMARY", "SUP", "TABLE", "TBODY", "TD", "TEXTAREA", "TFOOT", "TH", "THEAD", "TIME", "TITLE", "TR", "TRACK", "TT", "U", "UL", "VAR", "VIDEO", "WBR");
		
	}
	
	private function getPrimaImmagine($feed_url,$descrizioneIn,$imgsrc,$w,$h){
		$url_miniatura='';
		$imgalt='';

		if (empty($imgsrc)){
			//Fix utf-8 encoding.
			$html='<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8"></head><body>'.$descrizioneIn.'</body></html>';

			$dom = new DOMDocument();
			libxml_use_internal_errors(true);
			if ($dom->loadHTML($html)) {
				$imgNode=$dom->getElementsByTagName('img')->item(0);
				
				
				if ($imgNode!==NULL && $imgNode->hasAttributes()){
					$srcAttrib=$imgNode->attributes->getNamedItem("src");
					if ($srcAttrib!==NULL){
						if (substr($srcAttrib->nodeValue,0,4)!='http' && !empty($feed_url)){
							$parti=explode('?',$feed_url);
							$imgsrc=rtrim($parti[0],'/').'/'.$srcAttrib->nodeValue;
						}else{
							$imgsrc=$srcAttrib->nodeValue;
						}
					}
					$altAttrib=$imgNode->attributes->getNamedItem("alt");
					if ($altAttrib!==NULL){
						$imgalt=$altAttrib->nodeValue;
					}
				}
			}
		}
		if (substr($imgsrc,0,4)=='http' && filter_var($imgsrc, FILTER_VALIDATE_URL, FILTER_FLAG_HOST_REQUIRED)){//se è una url valida
			$md5=substr(md5($imgsrc),0,6);//per tenere solo i primi 4 caratteri dell'hash
			$info=pathinfo(parse_url($imgsrc,PHP_URL_PATH));
			$w_x_h=$w.'x'.$h;
			$filename=$info['filename'];
			$filename=preg_replace('/[^a-zA-Z0-9-]/', '_', $filename);
			
			$nome_miniatura="${filename}-${w_x_h}-${md5}.png";//nome della miniatura
			$file_miniatura=$this->cachedir.'/'.$nome_miniatura;
			
			if (!is_file($file_miniatura)){
				$this->creaMiniatura($imgsrc,$file_miniatura,$w,$h);
			}
			//se c'è ed è riuscito a crearlo allora lo ritorno
			if (is_file($file_miniatura)){
				$url_miniatura=$this->urlcachedir.'/'.$nome_miniatura;
			}

		}
		
		return array('imgsrc'=>$url_miniatura,'imgalt'=>$imgalt);
	}	
	
	private function produciRigaTabellaArticolo($descrizioneIn,$maxlength){
		$outdescription='';

		//Fix utf-8 encoding.
		$html='<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8"></head><body>'.$descrizioneIn.'</body></html>';

		$dom = new DOMDocument();
		libxml_use_internal_errors(true);
		if ($dom->loadHTML($html)) {
			
			$this->lastTextNode=null;
			
			if ($maxlength>0){
				$this->recursiveTruncateHtmlLength($dom->getElementsByTagName('body')->item(0),$maxlength);
				if ($this->lastTextNode!==null){
					$this->lastTextNode->parentNode->appendChild(new DOMText('...'));
				}
			}

			$this->recursiveCleanHtml($dom->getElementsByTagName('body')->item(0));
			
			$descrizione='';
			foreach ($dom->getElementsByTagName('body')->item(0)->childNodes as $node){
				$descrizione.=$dom->saveXML($node,LIBXML_NOEMPTYTAG);//saveHTML(node) solo da PHP 5.3.6
			}
			
			$outdescription=$descrizione;
		}else{//fallback se c'è qualche problema
			$descrizioneIn=strip_tags($descrizioneIn);
			if ($maxlength>0){
				if (mb_strlen($descrizioneIn)>$maxlength){
					$descrizioneIn=mb_substr($descrizioneIn,0,$maxlength).'...';
				}
			}
			$outdescription=$descrizioneIn;
		}
		
		return array('description'=>$outdescription);
	}
	private function creaMiniatura($src_immagine,$file_miniatura,$w,$h){
		//dowload dell'immagine
		$ch = curl_init();
		
		curl_setopt($ch, CURLOPT_URL, $src_immagine);
		curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.130 Safari/537.36');
		//curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		//curl_setopt($ch, CURLOPT_MAXREDIRS, 5);
		curl_setopt($ch, CURLOPT_HEADER, false);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_TIMEOUT, 3);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);		
		
		$data=curl_exec($ch);
		
		curl_close($ch);
		
		//resize
		if ($data!==FALSE){
			$inImg=@imagecreatefromstring($data);
			if ($inImg===FALSE){
				return false;
			}
			
			//resamplig dell'immagine
			$width = $w;
			$height = $h;
		
			$width_orig=imagesx($inImg);
			$height_orig=imagesy($inImg);
			if ($width_orig<1 || $height_orig<1){
				return false;
			}
			
			
			//se tengo ferma la width:height=width_orig:height_orig
			
			$wo_cropped=intval($width*$height_orig/$height);
			$ho_cropped=$height_orig;
			if ($wo_cropped>$width_orig){
				$wo_cropped=$width_orig;
				$ho_cropped=intval($height*$width_orig/$width);
			}
			
			$ratio_orig = $width_orig/$height_orig;
		
		
			$imageResized = imagecreatetruecolor($width, $height);
			imagefill($imageResized,0,0,imagecolorallocate($imageResized, 255, 255, 255));
			imagecopyresampled($imageResized, $inImg, 0, 0, intval(($width_orig-$wo_cropped)/2), 0, $width, $height, $wo_cropped, $ho_cropped);
			
			//if (!imagejpeg ( $imageResized, $file_miniatura, 80 )){
			//	return false;
			//}
			if (!imagepng ( $imageResized, $file_miniatura, 9 )){//massima compressione
				return false;
			}
			return true;
		}
		return false;
	}
		
	private function safeEscape($str) {
		return htmlentities($str, ENT_QUOTES, 'UTF-8');
	}
	
	private function recursiveCleanHtml($node){
		if ($node instanceof DOMComment) {
			return;
		}
		
		if ($node instanceof DOMDocumentType) {
			return;
		}
		
		if ($node instanceof DOMText) {
			return;
		}
		if ($node->hasAttributes()){
			$attrs_to_remove=array('class','id','style','title','tabindex');
			foreach($attrs_to_remove as $attr){
				if ($node->hasAttribute($attr)){
					$node->removeAttribute($attr);
				}
			}
		}
		

		if ($node->hasChildNodes()){
			$node_name=strtoupper($node->nodeName);
			if ($node_name=='A'){
				$node->setAttribute("target", "_blank");
			}
		
		
			$nextn=$node->childNodes->item(0);
			while ($nextn!==null){
				$n=$nextn;
				$nextn=$n->nextSibling;
				if ($n instanceof DOMComment) {
					continue;
				}
				
				if ($n instanceof DOMDocumentType) {
					continue;
				}
				
				if ($n instanceof DOMText) {
					continue;
				}
				
				$node_name=strtoupper($n->nodeName);
				if (!in_array($node_name,$this->html_tags_whitelist)){
					
					$fratello=$n->nextSibling;
					$parent=$n->parentNode;
					
					//add space
					$space=$n->ownerDocument->createTextNode(" ");
					if ($fratello===null){
						$parent->appendChild($space);
					}else{
						$parent->insertBefore($space,$fratello);
					}
					$fratello=$n->nextSibling;
					
					if ($n->hasChildNodes()){
							$nextchild=$n->childNodes->item(0);
							while ($nextchild!==null){
								$c=$nextchild;
								$nextchild=$c->nextSibling;
								$n->removeChild($c);
								
								if ($fratello===null){
									$parent->appendChild($c);
								}else{
									$parent->insertBefore($c,$fratello);
								}
								
							}
					}
					$nextn=$n->nextSibling;
					$parent->removeChild($n);
				}
			}
		}

		
		if ($node->hasChildNodes()){
			$nextn=$node->childNodes->item(0);
			while ($nextn!==null){
				$n=$nextn;
				$this->recursiveCleanHtml($n);
				$nextn=$n->nextSibling;
			}
		}
	}	
	
	private function recursiveTruncateHtmlLength($node,$length){
		if ($node instanceof DOMComment) {
			return $length;
		}
		
		if ($node instanceof DOMDocumentType) {
			return $length;
		}
		
		if ($node instanceof DOMText) {
			$textLen=mb_strlen($node->wholeText,'UTF-8');
			//echo "length: $length : ".$node->wholeText. " : ".$textLen."\n";
			if ($textLen>$length){
				$node->splitText($length);
				$length=0;
			}else{
				$length-=$textLen;
			}
			
			$this->lastTextNode=$node;
			return $length;
		}
		
		if ($node->hasChildNodes()){
			$nextn=$node->childNodes->item(0);
			while ($nextn!==null){
				$n=$nextn;
				if ($length>0){
					$length=$this->recursiveTruncateHtmlLength($n,$length);//può dividere il nodo
					$nextn=$n->nextSibling;
				}else{
					$length=-1;//aggiungo i puntini
					$nextn=$n->nextSibling;
					$node->removeChild($n);
				}
			}
		}
		return $length;
	}
	
}