#!/bin/bash

######################## IMPORTANT #########################
###### PLEASE MAKE SURE FILES ARE OWNED BY www-data ########
############################################################

#-----------------------------------------------------------
# Script that migrates Joomla database and/or files.
#  - From Release to Dev
#  - From Release to Prod
#
# Few things to take into account during the db migration
#   - Articles hits MUST to be kept, to achieve this a tmp file is created prior to db import phase and loaded later on
#   - Recover from backup function MUST NOT import the database from releaseserver, otherwise article hits are going to be lost up, specially when updating production
#   - Files used in this script are kept in $_PWD
#   - Current DB backup are kept under LRU of 5 (sed -e '1,5d')
#   - Logs are kept
#
# Guilherme Viteri  - gviteri@ebi.ac.uk
#
#-----------------------------------------------------------

# Script must be in the static folder because we want this file to be in the GitHub repo. However the files created
# during execution have to be in different directory, I'd say, same level as static folder, that's why we 'go back' two directories

# Go to the directory where the script resides. It ensures we can execute from anywhere and cd .. will work
DIR="/usr/local/reactomes/Reactome/production/Website"
cd $DIR;

_JOOMLA_STATIC=${DIR}'/static'
_SYNCDIR=${DIR}'/sync'
NOW=$(date +"%Y%m%d%H%M%S")
LOG="${_SYNCDIR}/logfile"
LOGFILE="${LOG}_${NOW}.txt"

exec > >(tee -i ${LOGFILE})
exec 2>&1

# Logs LRU
# Delete old backups. Only 5 are kept
LRU=$(ls -t $LOG* 2>/dev/null | sed -e '1,5d')
for LOG_TO_DEL in ${LRU}; do
    rm ${LOG_TO_DEL};
done;

SERVER=""

MYSQL_HOME="/usr/bin"
DEFAULT_DBNAME="website";

# Do not change this values
DEV_SERVER="dev"
RELEASE_SERVER="release"
PRD1_SERVER="prd1"
DBPORT=3306;

# Written in the "source" server
DUMP_SQL_FILE="${_SYNCDIR}/dump_from_release.sql"
DEST_BACKUP_DB="${_SYNCDIR}/current_db_bkp.sql"

# Written in the "destination" server
# Better to keep in tmp, mysql user does not have permission where www-data rules and can't write remotely
TMP_ARTICLE_HITS="/tmp/articles_hits_${NOW}.csv"

BKP_TABLE="rlp_easyjoomlabackup"
TMP_TABLE="x4u_article_hits_tmp"
ARTICLES_TABLE="rlp_content"

PRIVATE_KEY="/home/shared/.ssh/shared.pem"

usage () {
    if [ "$EXTERNAL" == "php" ]; then
        echo  "Missing mandatory parameters"
    else
        _SCRIPT=$(basename "$0")
        echo "Usage: ./$_SCRIPT"
        echo '           method=<ALL|DB|FILES>'
        echo '           env=<DEV|PROD>'
        echo '           srcosuser=<Source OS User> [Required when method is ALL or FILES]'
        echo '           srcospasswd=<Source OS Password> [Required when method is ALL or FILES]'
        echo '           osuser=<Destination OS User> [Required when method is ALL or FILES]'
        echo '           ospasswd=<Destination OS Password> [Required when method is ALL or FILES]'
        echo '           privatekey=<Destination OS Password> [Required when method is ALL or FILES]'
        echo '           dbuser=<DB User> [Required when method is ALL or DB]'
        echo '           dbpasswd=<DB Password> [Required when method is ALL or DB]'
        echo '           dbname=[<DB Name: DEFAULT website>]'
        echo '           dbport=[<DB Port: Default 3306>]'
  fi

  exit
}

recover_from_backup () {
    echo "Recovering database using the backup [$DEST_BACKUP_DB]"

    # Exporting MySQL password so we don't print it in the command line.
    export MYSQL_PWD=${DBPASSWD}

    ${MYSQL_HOME}/mysql -u ${DBUSER}  ${DBNAME} < ${DEST_BACKUP_DB}
    OUT=$?
    if [ "$OUT" -ne 0 ]; then
        echo "[ERROR] Could not IMPORT file [$DEST_BACKUP_DB] to the database [$DBNAME]"
        exit
    fi
}

files_sync () {
    RSYNC_ARGS="-rogtO"
    if [ "$DRYRUN" == "Y" ]; then
        # -n to enable dry-run and -v verbose
        RSYNC_ARGS="${RSYNC_ARGS} --dry-run"
        DRMSG=" - DRY-RUN";
        echo "####### DRY-RUN ENABLED #######"
    fi

    # make sure files have set user and group before moving them (SOURCE)
    echo "Updating file's owner in the source server [${RELEASE_SERVER}] before synchronisation"
    echo ${SRCOSPASSWD} | sudo -S chown -R www-data:reactome ${_JOOMLA_STATIC} &> /dev/null
    OUT=$?
    if [ "$OUT" -ne 0 ]; then
        echo "[ERROR] Couldn't normalise the owner (www-data:reactome) of the static folder ${_JOOMLA_STATIC} in the Source server"
        exit
    fi

    # make sure files have set user and group in the Destination
    echo "Updating file's owner in the destination server [${SERVER}] before synchronisation"
    sshpass -P passphrase -f <(printf '%s\n' ${OSPASSWD}) ssh -i ${PRIVATE_KEY} -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${OSUSER}@${SERVER} "${_JOOMLA_STATIC}/scripts/website_chown.sh  &> /dev/null"
    OUT=$?
    if [ "$OUT" -ne 0 ]; then
        echo "[ERROR] Couldn't normalise the owner (www-data:reactome) of the static folder ${_JOOMLA_STATIC} in the Destination server"
        exit
    fi

    # save security copy of the files
    # TODO save security copy of the files

    # Check if sshpass is required. Program required to input the passwd into the rsync.
    # Not available for MacOS. To test locally, just run normal rsync and use the sshpasswordless.
    echo "File sync has started. Check rsync report for details"

    echo "======= RSYNC REPORT ${DRMSG} ======="
    sshpass -P passphrase -f <(printf '%s\n' ${OSPASSWD})  rsync ${RSYNC_ARGS} -e 'ssh -i '${PRIVATE_KEY}' -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null' -i --links --delete --ignore-errors --exclude-from=${_JOOMLA_STATIC}/scripts/.rsync_excludes.txt ${_JOOMLA_STATIC}/ ${OSUSER}@${SERVER}:${_JOOMLA_STATIC} #2> /dev/null
    OUT=$?
    if [ "$OUT" -ne 0 ]; then
        echo "[ERROR] Rsync didn't executed properly. Check system output and address it manually. Re-run once the issue is sorted."
        exit
    fi
    echo "===================================="

    echo $"Files synchronisation has finished!"
}

db_sync () {
     sshpass -P passphrase -f <(printf '%s\n' ${OSPASSWD})  ssh -i ${PRIVATE_KEY} -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${OSUSER}@${SERVER} "${_JOOMLA_STATIC}/scripts/website_db_sync.sh dbuser=${DBUSER} dbpasswd=${DBPASSWD}"
}

# Check arguments
for ARGUMENT in "$@"
do
    KEY=$(echo $ARGUMENT | cut -f1 -d=)
    VALUE=$(echo $ARGUMENT | cut -f2 -d=)

    case "$KEY" in
            env)            ENV=${VALUE} ;;
            method)         METHOD=${VALUE} ;;
            srcosuser)      SRCOSUSER=${VALUE} ;;
            srcospasswd)    SRCOSPASSWD=${VALUE} ;;
            osuser)         OSUSER=${VALUE} ;;
            ospasswd)       OSPASSWD=${VALUE} ;;
            dbuser)         DBUSER=${VALUE} ;;
            dbpasswd)       DBPASSWD=${VALUE} ;;
            dbname)         DBNAME=${VALUE} ;;
            dbport)         DBPORT=${VALUE} ;;
            privatekey)     PRIVATE_KEY=${VALUE} ;;
            external)       EXTERNAL=${VALUE} ;;
            joomlauser)     JOOMLAUSER=${VALUE} ;;
            dryrun)         DRYRUN=${VALUE} ;;
            *)
    esac
done

if [ "$METHOD" = "" ]; then
    echo "Missing execution method [ALL|DB|FILES]"
    usage
fi

if  [ "$ENV" = "" ]; then
    echo "Missing environment method [DEV|PROD]"
    usage
fi

if [ "$METHOD" == "ALL" ]; then
    if  [ "$DBUSER" = "" ] || [ "$DBPASSWD" = "" ] ||
        [ "$SRCOSUSER" = "" ] || [ "$SRCOSPASSWD" = "" ] ||
        [ "$OSUSER" = "" ] || [ "$OSPASSWD" = "" ]; then
        echo "Missing OS Credentials and/or DB Credentials"
        usage
    fi
elif [ "$METHOD" == "DB" ]; then
    if [ "$DBUSER" = "" ] || [ "$DBPASSWD" = "" ]; then
        echo "Missing DB Credentials"
        usage
    fi
elif [ "$METHOD" == "FILES" ]; then # it is files, but just to list all the options
    if [ "$SRCOSUSER" = "" ] || [ "$SRCOSPASSWD" = "" ] ||
       [ "$OSUSER" = "" ] || [ "$OSPASSWD" = "" ]; then
        echo "Missing OS Credentials"
        usage
    fi
else
    echo "Invalid synchronisation method [ALL|DB|FILES]"
    usage
fi

if [ "$DBNAME" = "" ]
then
    DBNAME=${DEFAULT_DBNAME}
fi

if [ "${ENV}" == "PROD" ]
then
    SERVER=${PRD1_SERVER}
elif [ "${ENV}" == "DEV" ]
then
    SERVER=${DEV_SERVER}
else
    echo $"Invalid environment. Please provide DEV or PROD"
    exit;
fi

shopt -s nocasematch
if [ "$EXTERNAL" != "php" ]
then
    echo "Looks like script is being executed via command line"
    if [ "$DBNAME" != "website" ]
    then
        echo "Oh! And you are updating another database ..."
        read -p "CAREFUL: Updating a different database might be dangerous. Are you sure you want to update [$DBNAME] in [$SERVER]? " -n 1 -r
        if [[ ! "$REPLY" =~ ^[Yy]$ ]]
        then
            echo $"Bye!";
            exit;
        fi
    fi
else
    echo "Script is being executed via Synchronization Tool."

    # Running the script using the Web Interface, there's no way to change the database. It is always the default.
    DBNAME=${DEFAULT_DBNAME};

    echo "Synchronization started by [$JOOMLAUSER]"
fi

echo "Server: [$SERVER]"
echo "Database: [$DBNAME]"

# Define which sync method to call.
if [ "$METHOD" == "ALL" ]; then
    echo $""
    echo "Method: [DB and Files sync]"
    db_sync
    files_sync
else
    echo "[ERROR] Execution method is invalid"
fi
