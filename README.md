[<img src=https://user-images.githubusercontent.com/6883670/31999264-976dfb86-b98a-11e7-9432-0316345a72ea.png height=75 />](https://reactome.org)

# Website

## Introduction
We’ve launched our new website fully responsive and based in Joomla CMS! The new website has been designed to provide the ultimate user-friendly experience with improved navigation and functionality throughout.
In this repository, we're going to describe how to install and configure this website in your local environment with docker.

<img width="521" alt="responsive_reactome" src="https://user-images.githubusercontent.com/6883670/35038860-051fcdfa-fb74-11e7-99ee-9ce5114b5989.png" style="align: center;">

## Pre-requirements

#### Local Environments
  Any software bundle
  1. Docker 28.1.1

* Instructions will be given on Unix-based OS

## Getting started

1. Clone this repository and navigate to Website folder

```console
git clone https://github.com/reactome/Website.git
```
:warning: For security and privacy issues our Joomla Website Database and Joomla configuration.php are not available for public use. Please use the given configuration.php provided below and a clean database could be found in database/joomla_website_public.sql. Do not use this database in a production/public environment.

```

## Setting up configuration.php

```configuration.php``` is located in <XAMPP_HOME>/htdocs/Website/configuration.php. Due to privacy issues you won't find this file and you may need to create it manually.

```console
$> cd <XAMPP_HOME>/htdocs/Website/
$> vi configuration.php
```
...and copy and paste the content below

```php
<?php
class JConfig {
  public $offline = '0';
  public $offline_message = 'This site is down for maintenance.<br />Please check back again soon.';
  public $display_offline_message = '1';
  public $offline_image = '';
  public $sitename = 'Reactome Pathway Database';
  public $editor = 'jce';
  public $captcha = '0';
  public $list_limit = '20';
  public $access = '1';
  public $debug = '0';
  public $debug_lang = '0';
  public $dbtype = 'mysqli';
  public $host = 'localhost';
  public $user = 'root';
  public $password = 'root';
  public $db = 'website';
  public $dbprefix = 'rlp_';
  public $live_site = '';
  public $secret = 'joomla_secret';
  public $gzip = '0';
  public $error_reporting = 'default';
  public $helpurl = 'https://help.joomla.org/proxy?keyref=Help{major}{minor}:{keyref}&lang={langcode}';
  public $ftp_host = '';
  public $ftp_port = '';
  public $ftp_user = '';
  public $ftp_pass = '';
  public $ftp_root = '';
  public $ftp_enable = '0';
  public $offset = 'America/Toronto';
  public $mailonline = '1';
  public $mailer = 'mail';
  public $mailfrom = 'yourmail@yourdomain.com';
  public $fromname = 'Reactome';
  public $sendmail = '/usr/sbin/sendmail';
  public $smtpauth = '0';
  public $smtpuser = '';
  public $smtppass = '';
  public $smtphost = 'localhost';
  public $smtpsecure = 'none';
  public $smtpport = '25';
  public $caching = '0';
  public $cache_handler = 'file';
  public $cachetime = '15';
  public $cache_platformprefix = '0';
  public $MetaDesc = 'Reactome is pathway database which provides intuitive bioinformatics tools for the visualisation, interpretation and analysis of pathway knowledge.';
  public $MetaKeys = 'pathway,reactions,graph,bioinformatics';
  public $MetaTitle = '1';
  public $MetaAuthor = '0';
  public $MetaVersion = '0';
  public $robots = '';
  public $sef = '1';
  public $sef_rewrite = '1';
  public $sef_suffix = '0';
  public $unicodeslugs = '0';
  public $feed_limit = '10';
  public $feed_email = 'none';
  public $log_path = '<XAMPP_HOME>/htdocs/Website/administrator/logs';
  public $tmp_path = '<XAMPP_HOME>/htdocs/Website/tmp';
  public $lifetime = '45';
  public $session_handler = 'database';
  public $memcache_persist = '1';
  public $memcache_compress = '0';
  public $memcache_server_host = 'localhost';
  public $memcache_server_port = '11211';
  public $memcached_persist = '1';
  public $memcached_compress = '0';
  public $memcached_server_host = 'localhost';
  public $memcached_server_port = '11211';
  public $redis_persist = '1';
  public $redis_server_host = 'localhost';
  public $redis_server_port = '6379';
  public $redis_server_auth = '';
  public $redis_server_db = '0';
  public $proxy_enable = '0';
  public $proxy_host = '';
  public $proxy_port = '';
  public $proxy_user = '';
  public $proxy_pass = '';
  public $massmailoff = '0';
  public $MetaRights = '';
  public $sitename_pagetitles = '2';
  public $force_ssl = '0';
  public $session_memcache_server_host = 'localhost';
  public $session_memcache_server_port = '11211';
  public $session_memcached_server_host = 'localhost';
  public $session_memcached_server_port = '11211';
  public $frontediting = '1';
  public $cookie_domain = '';
  public $cookie_path = '';
  public $asset_id = '1';
  public $replyto = '';
  public $replytoname = '';
  public $shared_session = '0';
  public $session_redis_server_host = 'localhost';
  public $session_redis_server_port = '6379';
  public $show_notice_mod = '0';
  public $ga_tracking_code = 'UA-1';
}
```

...set your database credentials and/or database name, if needed

```console
public $user = 'root';
public $password = 'root';
public $db = 'website';
```

...set administrator mail address

```console
public $mailfrom = 'yourmail@yourdomain.com';
```

...set <XAMPP_HOME> for the log_path and tmp_path. In general, it is the absolute path where the Website resides.

```console
public $log_path = '<XAMPP_HOME>/htdocs/Website/administrator/logs';
public $tmp_path = '<XAMPP_HOME>/htdocs/Website/tmp';
```

...last, once everything is set, please change the ```configuration.php``` file permissions
```console
# file has to be read-only
chmod 444 configuration.php
```

More detailed explanation of every variable in this configuration file can be found [here](https://unihost.com/help/joomla-configuration-php-file/)

:warning: If you need to edit it, make a backup copy. And do not change default values, unless you know what you are doing.

## Setting up .htaccess

In our live website, we force all the requests to be over SSL connection (https) and this configuration is done in the ```<XAMPP_HOME>/htdocs/Website/.htaccess```. To disable SSL, please follow these steps:

```console
cd <XAMPP_HOME>/htdocs/Website
vi .htaccess
```

and comment out the following line

```console
# RewriteRule (.*) https://%{HTTP_HOST}%{REQUEST_URI} [R=301,NC,L]
```

## Starting up the local environment

1. docker compose build --no-cache
2. docker compose up

## Testing the Website

Each software bundle starts using a different port, e.g XAMPP uses port 80 and MAMP uses port 8888 by default

Accessing ```http://localhost/Website``` you should see
![Reactome Website](https://user-images.githubusercontent.com/6883670/35101682-4d891a9e-fc58-11e7-89da-06cac5628ac0.png)

## Available accounts

In order to access [Administrator area](http://localhost/Website/administrator) an account is need to log in.

```console
user:     admin
password: Not2$hare
```

Also, front-end editing is available in the [Staff area](http://localhost/Website/administrator), again, username, emails and passwords were removed.

```console
user:     unknown162
password: @Dock3r999
```