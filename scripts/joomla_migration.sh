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
cd ${DIR};

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
    rm -f ${LOG_TO_DEL};
done;

DEST_SERVER=""

MYSQL_DUMP=`which mysqldump`
DEFAULT_DBNAME="website";

# Do not change this values
DEV_SERVER="dev.reactome.org"
RELEASE_SERVER="release.reactome.org"
PRD1_SERVER="reactome.org"

SYNC_SCRIPTS_HOME="${_JOOMLA_STATIC}/scripts";
SYNC_TOOL="${SYNC_SCRIPTS_HOME}/sync_tool.sh";
SYNC_CHOWN="${SYNC_SCRIPTS_HOME}/website_chown.sh";


OWNER="www-data:reactome"

# Written in the "source" server
DUMP_SQL_FILE="/tmp/dump_from_release.sql"

PRIVATE_KEY="/home/shared/.ssh/shared.pem"
PASSPHRASE=""

usage () {
    if [[ "$EXTERNAL" == "php" ]]; then
        echo  "Missing mandatory parameters"
    else
        _SCRIPT=$(basename "$0")
        echo "Usage: ./$_SCRIPT"
        echo '           env=<DEV|PROD>'
        echo '           privatekey=<Certificate PEM> [Default: ' ${PRIVATE_KEY} ']'
        echo '           passphrase=<Certificate Passphrase>'
        echo '           osuser=<Your OS User>'
        echo '           ospasswd=<Your OS Password>'
        echo '           dbuser=<DB User>'
        echo '           dbpasswd=<DB Password>'
        echo '           dbname=[<DB Name: DEFAULT website>]'
  fi

  exit
}

sshpass_exists () {
    # Check if sshpass is required. Program required to input the passwd into the rsync.
    hash sshpass 2>/dev/null || { echo >&2 "sshpass is required. Please install it in this server. sudo apt-get install sshpass"; exit 1; }
}

normalise_owner_and_permissions () {
    SERVER="${RELEASE_SERVER}.reactome.org"
    # make sure files have set user and group before moving them (SOURCE)
    echo "Updating file's owner in the source server [${RELEASE_SERVER}] before synchronisation."

    sshpass -p ${SRCOSPASSWD} sudo -S -u ${SRCOSUSER} sudo chown -R ${OWNER} ${_JOOMLA_STATIC}
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        echo "[ERROR] Couldn't normalise the owner (${OWNER}) of the static folder ${_JOOMLA_STATIC} in the Source server [${SERVER}]"
        exit
    fi
}

normalise_owner_permissions_and_flags_remote () {
    # sync the chown script to make the destination has the latest version.
    sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) scp -i ${PRIVATE_KEY} ${SYNC_CHOWN} ${DEST_SERVER}:${SYNC_CHOWN}

#    sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) ssh -i ${PRIVATE_KEY} -qn -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${DEST_SERVER} "${SYNC_TOOL} OWNERANDPERMWEBSITE"
    sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) ssh -i ${PRIVATE_KEY} -qn -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${DEST_SERVER} "${SYNC_CHOWN}"
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        echo "[ERROR] Couldn't normalise the owner (${OWNER}) of the static folder ${_JOOMLA_STATIC} in the Destination server [${DEST_SERVER}]"
        exit
    fi
}

# Credentials in for the source (mainly release) is needed in the website update phase.
validate_source_credentials () {
    SERVER="${RELEASE_SERVER}.reactome.org"
    echo $""
    echo "Validating [${SERVER}] credentials..."

    sshpass -p ${SRCOSPASSWD} sudo -S -u ${SRCOSUSER} sudo ls &> /dev/null
    local OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        echo "[ERROR] Can't connect to SOURCE server [${SERVER}]. Please type a valid OS user [${SRCOSUSER}] and password"
        exit
    fi
}


files () {
    # Normalise directories before synchronising
    normalise_owner_and_permissions
    normalise_owner_permissions_and_flags_remote

    RSYNC_ARGS="-rogtO"

    echo "File sync has started. Check rsync report for details"

    echo "======= RSYNC REPORT ======="
    sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) rsync ${RSYNC_ARGS} -e 'ssh -i '${PRIVATE_KEY}' -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null' -i --links --delete --ignore-errors --exclude-from=${_JOOMLA_STATIC}/scripts/.rsync_excludes.txt ${_JOOMLA_STATIC}/ ${DEST_SERVER}:${_JOOMLA_STATIC} #2> /dev/null
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        echo "[ERROR] Rsync didn't executed properly. Check system output and address it manually. Re-run once the issue is sorted."
        exit
    fi
    echo "===================================="

    # folders permissions are not copied even though the flag is present. To prevent problems folders will be flagged as chmod:775 after execution
    normalise_owner_permissions_and_flags_remote

    echo $"Files synchronisation has finished!"
}

database () {
    export MYSQL_PWD=${DBPASSWD}

    # Dump database in RELEASE (localhost)
    ${MYSQL_DUMP} -u ${DBUSER} ${DBNAME} > ${DUMP_SQL_FILE}

    # Transfer dump file to DESTINATION_SERVER
    sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) scp -i ${PRIVATE_KEY} ${DUMP_SQL_FILE} ${DEST_SERVER}:${DUMP_SQL_FILE}

    # Call website_db_sync in the remote server
    sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) ssh -i ${PRIVATE_KEY} -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${DEST_SERVER} "${_JOOMLA_STATIC}/scripts/website_db_sync.sh dbuser=${DBUSER} dbpasswd=${DBPASSWD}"
}

# Check arguments
for ARGUMENT in "$@"
do
    KEY=$(echo ${ARGUMENT} | cut -f1 -d=)
    VALUE=$(echo ${ARGUMENT} | cut -f2 -d=)

    case "$KEY" in
            env)            ENV=${VALUE} ;;
            privatekey)     PRIVATE_KEY=${VALUE} ;;
            passphrase)     PASSPHRASE=${VALUE} ;;
            osuser)         SRCOSUSER=${VALUE} ;;
            ospasswd)       SRCOSPASSWD=${VALUE} ;;
            dbuser)         DBUSER=${VALUE} ;;
            dbpasswd)       DBPASSWD=${VALUE} ;;
            dbname)         DBNAME=${VALUE} ;;
            external)       EXTERNAL=${VALUE} ;;
            joomlauser)     JOOMLAUSER=${VALUE} ;;
            *)
    esac
done

if  [[ "$ENV" = "" ]]; then
    echo "Missing environment method [DEV|PROD]"
    usage
fi

if [[ "$SRCOSUSER"  = "" ]] || [[ "$SRCOSPASSWD" = "" ]]; then
    echo "Missing OS Credentials"
    usage
fi

if  [[ "$DBUSER" = "" ]] || [[ "$DBPASSWD" = "" ]] || [[ "$PASSPHRASE" = "" ]]; then
    echo "Missing Key/Passphrase Key and/or DB Credentials"
    usage
fi

if [[ "$DBNAME" = "" ]]
then
    DBNAME=${DEFAULT_DBNAME}
fi

if [[ "${ENV}" == "PROD" ]]
then
    DEST_SERVER=${PRD1_SERVER}
elif [[ "${ENV}" == "DEV" ]]
then
    DEST_SERVER=${DEV_SERVER}
else
    echo $"Invalid environment. Please provide DEV or PROD"
    exit;
fi

shopt -s nocasematch
if [[ "$EXTERNAL" != "php" ]]
then
    echo "Looks like script is being executed via command line"
    if [[ "$DBNAME" != "website" ]]
    then
        echo "Oh! And you are updating another database ..."
        read -p "CAREFUL: Updating a different database might be dangerous. Are you sure you want to update [$DBNAME] in [$DEST_SERVER]? " -n 1 -r
        if [[ ! "$REPLY" =~ ^[Yy]$ ]]
        then
            echo $"Bye!";
            exit;
        fi
    fi
else
    # Running the script using the Web Interface, there's no way to change the database. It is always the default.
    DBNAME=${DEFAULT_DBNAME};

    echo "Script is being executed via Synchronization Tool."
    echo "Synchronization started by [$JOOMLAUSER]"
fi

echo "Server: [$DEST_SERVER], using key [$PRIVATE_KEY]"
echo "Database: [$DBNAME]"

echo $""

sshpass_exists

validate_source_credentials

# FILES FIRST to make sure the scripts are up to date
files

database

