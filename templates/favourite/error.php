<?php
defined('_JEXEC') or die;
$path         = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
$template_cgi = "template-cgi";
$protocol     = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS']!='off') ? 'https://' : 'http://';
$url          = $protocol . $_SERVER['SERVER_NAME'] . ':' . $_SERVER['SERVER_PORT'] . $path . '/' . $template_cgi;
$content      = file_get_contents($url);
$pieces = explode("<!-- template-placeholder -->", $content);
echo $pieces[0]; // header
?>
<div class="favth-container">
    <div class="favth-row">
        <div class="favth-col-lg-12 favth-col-md-12 favth-col-sm-12 favth-col-xs-12">
            <h2>The requested page can't be found.</h2>
            <hr />
            <p>If difficulties persist, please contact the <a href="mailto:help@reactome.org">help@reactome.org</a> report the error below.</p>
            <p><span class="favth-label favth-label-default"><?php echo $this->error->getCode(); ?></span>Page not Found!</p>
            <br>
            <a href="<?php echo $this->baseurl; ?>/" class="btn"><span class="icon-home"></span>Home Page</a>
        </div>
    </div>
</div>
<?php
echo $pieces[1]; //footer
?>
