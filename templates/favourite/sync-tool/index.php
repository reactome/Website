<?php

defined('_JEXEC') or die;

$lastexecname = '.last_execution';

if(isset($_POST["action"])) {
	if (htmlspecialchars($_POST["action"]) === "sync") {
		$env            = htmlspecialchars($_POST["env"]);
		$passphrase     = htmlspecialchars($_POST["passphrase"]);
		$osuser         = htmlspecialchars($_POST["osuser"]);
		$ospasswd       = htmlspecialchars($_POST["ospasswd"]);
		$dbuser         = htmlspecialchars($_POST["dbuser"]);
		$dbpasswd       = htmlspecialchars($_POST["dbpasswd"]);

		$start = (float) array_sum(explode(' ', microtime()));

		# note that shell_exec() does not grab STDERR, so use "2>&1" to redirect it to STDOUT and catch it.
		$output = shell_exec('sudo ' . getcwd() . '/scripts/joomla_migration.sh ' .
			'env=' . $env . ' ' .
			'osuser=' . $osuser . ' ' .
			'passphrase=' . $passphrase . ' ' .
			'ospasswd=' . $ospasswd . ' ' .
			'dbuser=' . $dbuser . ' ' .
			'dbpasswd=' . $dbpasswd . ' ' .
			'joomlauser=' . $user->username . ' ' .
			'external=php ' .
			'2>&1 & '
		);


		$config = JFactory::getConfig();
		$offset = $config->get('offset');
		date_default_timezone_set($offset);
		$filename = getcwd() . '/scripts/' . $lastexecname . '_' . $env .'.txt';
		file_put_contents($filename, "[" . $env . "] Last execution performed at " . date("Y-m-d") . " at " . date("h:i:sa") . " by " . $user->username);

		$end = (float) array_sum(explode(' ', microtime()));

		$output .= "\nProcessing time: " . sprintf("%.4f", ($end - $start)) . " seconds.";

		$servername = ($env == "PROD") ? "reactome.org" : "dev.reactome.org";

		$mailer =& JFactory::getMailer();

		//add the sender Information.
		$sender = array("no-reply@reactome.org", "Reactome Website");
		$mailer->setSender($sender);

		# retrieve email address
		$recipient_ids = array(158, 159); # user id (in Joomla)

		$db     = JFactory::getDBO();
		$query  = $db->getQuery(true);
		$query->select('email');
		$query->from('#__users');
		$query->where('id IN (' . implode(',', $recipient_ids) . ')');
		$db->setQuery($query);
		$rows   = $db->loadRowList();

//        foreach($rows as $email) {
//            $mailer->addRecipient($email);
//        }
//
//        //add the subject
//        $date = new DateTime();
//        $mailer->setSubject('[Joomla Update] '. $user->username . ' is synchronising to ' .$servername. ' (' . $date->getTimestamp() . ')');
//
//        //add body
//        $mailer->setBody($output);
//
//        $send =& $mailer->Send();
//        if ($send !== true)	{
//            echo '<script>console.log(' . $send->message . ')</script>';
//        }
	}
}

?>

<form method="post" id="sync-form">
    <div class="alert alert-info margin0 bottom">
        <span><i class="fa fa-info-circle"></i> This tool synchronizes <strong>Joomla Content</strong> to the specified environment</span>
    </div>
    <input id="action" type="hidden" name="action" value="sync" />

    <div class="favth-form-group" id="env-div">
        <label for="env" style="display: block;">Environment:</label>
        <select class="form-control" id="env" name="env" aria-describedby="prod-msg" style="display: block;" required>
            <option value="">Select environment</option>
            <option value="DEV" >Development</option>
            <option value="PROD">Production*</option>
        </select>
        <small id="prod-msg" class="form-text text-muted">
            *Be careful when selecting production.
        </small>
    </div>

    <div class="favth-col-lg-4 favth-col-md-4 favth-col-sm-12 favth-col-xs-12 padding0 hidden">
        <fieldset id="src-server" class="sync-tool-fs">
            <legend>Release Server Credentials</legend>
            <div class="favth-form-group">
                <label for="osuser"  style="display: block;">Your OS user:</label>
                <input type="text" class="favth-form-control" id="osuser" name="osuser" style="display: block; width: 247px;" placeholder="Enter the user">
            </div>

            <div class="favth-form-group">
                <label for="ospasswd" style="display: block;">Your OS password:</label>
                <input type="password" class="favth-form-control" id="ospasswd" name="ospasswd" style="width: 247px;" placeholder="Enter the password">
            </div>

            <div class="favth-form-group">
                <label for="passphrase" style="display: block;">Key Passphrase:</label>
                <input type="password" class="favth-form-control" id="passphrase" name="passphrase" style="width: 247px;" placeholder="Enter the key passphrase">
            </div>
        </fieldset>
    </div>

    <div class="favth-col-lg-3 favth-col-md-4 favth-col-sm-12 favth-col-xs-12 hidden">
        <fieldset id="database" class="sync-tool-fs">
            <legend>Database</legend>
            <div class="favth-form-group">
                <label for="dbuser"  style="display: block;">DB User:</label>
                <input type="text" class="favth-form-control" id="dbuser" name="dbuser" style="width: 247px;" placeholder="Enter the database user" >
            </div>

            <div class="favth-form-group">
                <label for="dbpasswd" style="display: block;">DB Password:</label>
                <input type="password" class="favth-form-control" id="dbpasswd" name="dbpasswd" style="width: 247px;" placeholder="Enter the database password" >
            </div>
        </fieldset>

        <button id="sync-btn" type="submit" class="btn btn-primary">Run</button>
    </div>



	<?php
	if ( $user->id == 158 || $user->id == 159 ) {
		$lastexecp = fopen(getcwd() . '/scripts/' . $lastexecname . '_PROD.txt', "rw");
		echo '<div class="favth-col-lg-12 favth-col-md-12 favth-col-sm-12 favth-col-xs-12"><p class="text-right margin0" style="color:gray;"><small>' . fgets($lastexecp) . '</small></p></div>';
		fclose($lastexecp);

		$lastexecd = fopen(getcwd() . '/scripts/' . $lastexecname . '_DEV.txt', "rw");
		echo '<div class="favth-col-lg-12 favth-col-md-12 favth-col-sm-12 favth-col-xs-12"><p class="text-right margin0"  style="color:gray;"><small>' . fgets($lastexecd) . '</small></p></div>';
		fclose($lastexecd);
	}
	?>

    <div class="favth-col-lg-12 favth-col-md-12 favth-col-sm-12 favth-col-xs-12">
        <div class="wait-msg hidden alert alert-info margin0 top">Your request is being processed. Please do not click anywhere either close the browser.</div>
    </div>

	<?php
	if ($output != '') {
		echo "<div class='favth-col-lg-12 favth-col-md-12 favth-col-sm-12 favth-col-xs-12'><div class='summary favth-clearfix'><h3>Execution summary:</h3><div style='max-height: 450px; overflow: auto;'><pre class='output'>" . htmlspecialchars($output) . "</pre></div></div></div>";
	}
	?>
</form>

<script>
    jQuery(document).ready(function() {
        var env         = jQuery("#env");

        var srcserver   = jQuery('#src-server');
        var database    = jQuery('#database');
        var syncbtn     = jQuery("#sync-btn");

        env.change(function () {
            var value       = this.value;
            var passphrase  = jQuery("#passphrase");
            var osuser      = jQuery("#osuser");
            var ospasswd    = jQuery("#ospasswd");
            var dbuser      = jQuery("#dbuser");
            var dbpasswd    = jQuery("#dbpasswd");
            var serverlabel = jQuery("#server-label");

            // database.addClass("hidden");
            // srcserver.addClass("hidden");
            // syncbtn.addClass("hidden");

            jQuery(".showing").each(function() {
                jQuery(this).addClass("hidden");
                jQuery(this).removeClass("showing");
            });

            passphrase.removeAttr("required");
            osuser.removeAttr("required");
            ospasswd.removeAttr("required");
            dbuser.removeAttr("required");
            dbpasswd.removeAttr("required");

            // clean up
            passphrase.val("");
            osuser.val("");
            ospasswd.val("");
            dbuser.val("");
            dbpasswd.val("");
            serverlabel.text("");
            jQuery(".summary").text("");

            // srcserver.removeClass("hidden");
            // database.removeClass("hidden");
            // syncbtn.removeClass("hidden");
            jQuery(".hidden").each(function() {
                jQuery(this).removeClass("hidden");
                jQuery(this).addClass("showing");
            });


            passphrase.attr("required", "true");
            osuser.attr("required", "true");
            ospasswd.attr("required", "true");
            dbuser.attr("required", "true");
            dbpasswd.attr("required", "true");

            var hostname = (value === "PROD") ? "reactome.org" : "dev.reactome.org";
            if (value === "PROD") {
                alert('Production has been selected. Have you updated \'development\' ?');
                srcserver.addClass("sync-tool-prod");
                database.addClass("sync-tool-prod");
            } else {
                srcserver.removeClass("sync-tool-prod");
                database.removeClass("sync-tool-prod");
            }
            serverlabel.text("Your account in " + hostname);
        });

        var form = jQuery("#sync-form");
        form.submit(function () {
            jQuery.ajax({
                type: "POST",
                url: "./index.php",
                data: form.serialize(),
                beforeSend: function () {
                    syncbtn.text("Running...");
                    syncbtn.attr("disabled", true);
                    syncbtn.blur();

                    jQuery('.wait-msg').removeClass('hidden');
                    jQuery('.summary').html("");
                }
            });
        });
    });
</script>