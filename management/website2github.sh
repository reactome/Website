#!/usr/bin/env bash

############################################################
###################  Website To Github  ###################
############################################################

#-----------------------------------------------------------
#
# Website to Github
#
# 1. Website (static folder) automatic git commit/push
# 2. Dumping website database into a private folder
# 3. Dumping cleaned version of the website database into a public folder
#
# Guilherme Viteri  - gviteri@ebi.ac.uk
# December, 2017
#
#-----------------------------------------------------------

# ************************ IMPORTANT 1 ***************************
#   An original dump of the database SHOULD NEVER be published
#   nor in a public Repository neither in a Docker Container
# ****************************************************************

# ************************ IMPORTANT 2 ***************************
#   MySQL Database password is hardcoded in this file
#   Be aware of that if you are pushing it to a remote repository
# ****************************************************************

# ************************ IMPORTANT 3 ***************************
#   Script runs as sudo. Specific permissions have been added
#   to sudoers, so no password is asked when only 'gv*****'
#   runs as sudo. In a CLI execution sudo must be in.
# ****************************************************************

# This script expects 5 arguments in this order
# github_email
# database user
# database password
# Joomla super user_id
# email to

if [[ $# -ne 5  ]]; then
    echo "website2github expects 5 arguments <github email> <database user> <database password> <joomla user id> <your email>"
    exit;
fi

DIR="/usr/local/reactomes/Reactome/production/Website/static"
cd ${DIR}

PRIVATE_FOLDER="/usr/local/reactomes/Reactome/production/Website/private"

NOW=$(date +"%Y%m%d%H%M%S")
W2G_DIR="${PRIVATE_FOLDER}/logs"
mkdir -p -m 0775 ${W2G_DIR}
LOG="${W2G_DIR}/w2g"
LOGFILE="${LOG}_${NOW}.log"

exec > >(tee -i ${LOGFILE})
exec 2>&1

# Logs LRU
# Delete old logs. Only 5 are kept
LRU=$(ls -t ${LOG}* 2>/dev/null | sed -e '1,4d')
for LOG_TO_DEL in ${LRU}; do
    rm ${LOG_TO_DEL};
done;

LOCAL_REPO="/usr/local/reactomes/Reactome/production/Website/static"

GITHUB_USER="reactomebot"
GITHUB_EMAIL=$1

GIT=`which git`
COMMIT_TIMESTAMP=`date +'%Y-%m-%d %H:%M:%S %Z'`

MYSQL=`which mysql`
MYSQL_DUMP=`which mysqldump`
DBNAME="website"
TEMP_DBNAME="temp_website" # must not be the same as $DBNAME
DBUSER=$2
DBPASSWD=$3
PRIVATE_DB_FILE="${PRIVATE_FOLDER}/database/joomla_website.sql"
PUBLIC_DB_FILE="${LOCAL_REPO}/database/joomla_website_public.sql"
SUPER_USER_ID=$4
TO=$5

send_error_mail () {
    sleep 15s
    set_owner
    SUBJECT="[Website2Github] Website repository synchronisation has FAILED"
    BODY=`cat ${LOGFILE}`
    FROM="Website2GitHub<w2g-noreply@reactome.org>"
    echo -e "Subject:${SUBJECT}\n${BODY}" | sendmail -f "${FROM}" -t "${TO}"
    exit
}

set_owner () {
    sudo -S chown -R www-data:reactome ${LOCAL_REPO} &>/dev/null
    sudo -S chown -R www-data:reactome $(dirname "${PRIVATE_DB_FILE}") &>/dev/null
    sudo -S chown -R $(logname)":reactome" ${W2G_DIR} &>/dev/null
}

# Only proceed if we have a valid repo.
if [[ ! -d ${LOCAL_REPO}/.git ]]; then
  echo "${LOCAL_REPO} is not a valid git repo! Aborting..."
  send_error_mail
fi

export MYSQL_PWD=${DBPASSWD}
mkdir -p -m 0775 $(dirname "${PRIVATE_DB_FILE}")
mkdir -p -m 0775 $(dirname "${PUBLIC_DB_FILE}")

# DUMP FROM RELEASE
echo "Dumping Joomla MySQL database [$DBNAME]"
${MYSQL_DUMP} --skip-dump-date -u ${DBUSER} ${DBNAME} > ${PRIVATE_DB_FILE}
OUT=$?
if [[ "$OUT" -ne 0 ]] || [[ ! -s ${PRIVATE_DB_FILE} ]]; then
    echo "[ERROR] Could not DUMP Joomla Database from Reactome Release"
    send_error_mail
fi

echo "Creating temporary database [${TEMP_DBNAME}]"
CREATE_TEMP_DB="CREATE DATABASE IF NOT EXISTS ${TEMP_DBNAME} DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;"
${MYSQL} -u ${DBUSER} -e "${CREATE_TEMP_DB}"
OUT=$?
if [[ "$OUT" -ne 0 ]]; then
    echo "[ERROR] Could not temporary create database [${TEMP_DBNAME}]"
    send_error_mail
fi

echo "Importing into database [$TEMP_DBNAME]"
${MYSQL} -u ${DBUSER} ${TEMP_DBNAME} < ${PRIVATE_DB_FILE}
OUT=$?
if [[ "$OUT" -ne 0 ]]; then
    echo "[ERROR] Could not IMPORT file [$PRIVATE_DB_FILE] to the database [$TEMP_DBNAME]"
    send_error_mail
fi

# DO NOT CHANGE IT.
ADMIN_PASSWD="\$2y\$10\$suDIc1tF2MApag9nthYrOez4G9mMDT.ushhi6CeEspDp5aKQjLnlC"
USERS_PASSWD="\$2y\$10\$V.KRp85mMReYkTQlk45.o.fcIzBS/FAorz8cEsIJTSM6yLjM6jhnS"

echo "Cleaning up sensitive information in the temp database before dumping it...."

SQL_CL_USERS="UPDATE rlp_users SET username = concat('unknown',id), name = concat('Name',' ',id), email = concat('invalid',id,'@nodomain.com'), requireReset = 0, resetCount = 0, params = '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"helpsite\":\"\",\"timezone\":\"\"}', registerDate='2017-01-01 09:00:00', lastvisitDate='2017-01-01 10:00:00', lastResetTime='2017-01-01 00:00:00', password = '${USERS_PASSWD}' WHERE id <> ${SUPER_USER_ID};"
SQL_CL_ADMIN="UPDATE rlp_users SET username = 'admin', name = 'Joomla Admin', email = 'change-me@nodomain.com', requireReset = 0, resetCount = 0, params = '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"helpsite\":\"\",\"timezone\":\"\"}', registerDate='2017-01-01 09:00:00', lastvisitDate='2017-01-01 10:00:00', lastResetTime='2017-01-01 00:00:00', password = '${ADMIN_PASSWD}' WHERE id = ${SUPER_USER_ID};"
SQL_DELETE_GROUPS="DELETE FROM rlp_user_usergroup_map WHERE user_id <> ${SUPER_USER_ID} AND group_id <> 2;"
SQL_DELETE_EJBBKP="DELETE FROM rlp_easyjoomlabackup;"
SQL_SET_AI_EJBBKP="SET sql_mode = '';ALTER TABLE rlp_easyjoomlabackup AUTO_INCREMENT = 1;"
SQL_DELETE_SESSIONS="DELETE FROM rlp_session;"
SQL_UPDT_ARTICLE="UPDATE rlp_content SET hits=0,checked_out=0,checked_out_time='1000-01-01 00:00:00',version=1, created_by='${SUPER_USER_ID}',modified_by='${SUPER_USER_ID}',created='2017-01-01 09:00:00',modified='2017-01-01 09:00:00';"
SQL_UPDT_SITE_LAST_CHECK="UPDATE rlp_update_sites SET last_check_timestamp=null;"
SQL_DELETE_UPDATES="DELETE FROM rlp_updates;"
SQL_SET_AI_UPDATES="SET sql_mode = '';ALTER TABLE rlp_updates AUTO_INCREMENT = 1;"
SQL_UPDT_TAGS="UPDATE rlp_tags SET hits=0,checked_out=0,checked_out_time='1000-01-01 00:00:00';"
SQL_DEL_UCM_CONTENT="DELETE FROM rlp_ucm_content;"
SQL_SET_AI_UCM_CONTENT="SET sql_mode = '';ALTER TABLE rlp_ucm_content AUTO_INCREMENT = 1;"
SQL_DEL_UCM_HISTORY="DELETE FROM rlp_ucm_history;"
SQL_SET_AI_UCM_HISTORY="SET sql_mode = '';ALTER TABLE rlp_ucm_history AUTO_INCREMENT = 1;"
SQL_UPDT_CONTENTITEM_TAG_MAP="SET sql_mode = '';UPDATE rlp_contentitem_tag_map SET tag_date='1000-01-01 00:00:00';"
SQL_CLEAN_WHAT_IS_NOT_PUBLIC="UPDATE rlp_content SET introtext='' WHERE access <> 1;"
SQL_NORMALISE_MODULES="UPDATE rlp_content SET checked_out=0,checked_out_time='1000-01-01 00:00:00';"
SQL_EJB_CLEAN_TOKEN="UPDATE rlp_extensions SET params='{\"token\":\"\",\"type\":\"1\",\"donation_code\":\"\"}' WHERE extension_id = 10209;"
SQL_REMOVE_BANNER="UPDATE rlp_modules SET published=0,publish_up='1000-01-01 00:00:00',publish_down='1000-01-01 00:00:00',content='' WHERE id = 581;"
SQL_DEL_USER_KEYS="DELETE FROM rlp_user_keys;"
SQL_DEL_POST_INSTALL_MSG="DELETE FROM rlp_postinstall_messages;"
SQL_SET_AI_PIM="SET sql_mode = '';ALTER TABLE rlp_postinstall_messages AUTO_INCREMENT = 1;"
SQL_DEL_MSG="DELETE FROM rlp_messages;"
SQL_SET_AI_MSG="SET sql_mode = '';ALTER TABLE rlp_messages AUTO_INCREMENT = 1;"
SQL_DEL_ACT_LOGS="DELETE FROM rlp_action_logs;"
SQL_SET_AI_ACT_LOGS="SET sql_mode = '';ALTER TABLE rlp_action_logs AUTO_INCREMENT = 1;"
SQL_DEL_PVT_REQS="DELETE FROM rlp_privacy_requests;"
SQL_SET_AI_PVT_REQS="SET sql_mode = '';ALTER TABLE rlp_privacy_requests AUTO_INCREMENT = 1;"

# security check, must never have, it is here just in case
if [[ ${DBNAME} == ${TEMP_DBNAME} ]]; then
    echo "DB and TEMP DB are the same. A clean up is done directly in TEMP, having the same as DB a disaster will happen."
    send_error_mail
fi

# THE ORDER MATTERS !!
declare -a SQL_COMMANDS
SQL_COMMANDS+=( "${SQL_CL_USERS}" )
SQL_COMMANDS+=( "${SQL_CL_ADMIN}" )
SQL_COMMANDS+=( "${SQL_DELETE_GROUPS}" )
SQL_COMMANDS+=( "${SQL_DELETE_EJBBKP}" )
SQL_COMMANDS+=( "${SQL_SET_AI_EJBBKP}" )
SQL_COMMANDS+=( "${SQL_DELETE_SESSIONS}" )
SQL_COMMANDS+=( "${SQL_UPDT_ARTICLE}" )
SQL_COMMANDS+=( "${SQL_UPDT_SITE_LAST_CHECK}" )
SQL_COMMANDS+=( "${SQL_DELETE_UPDATES}" )
SQL_COMMANDS+=( "${SQL_SET_AI_UPDATES}" )
SQL_COMMANDS+=( "${SQL_UPDT_TAGS}" )
SQL_COMMANDS+=( "${SQL_DEL_UCM_CONTENT}" )
SQL_COMMANDS+=( "${SQL_SET_AI_UCM_CONTENT}" )
SQL_COMMANDS+=( "${SQL_DEL_UCM_HISTORY}" )
SQL_COMMANDS+=( "${SQL_SET_AI_UCM_HISTORY}" )
SQL_COMMANDS+=( "${SQL_UPDT_CONTENTITEM_TAG_MAP}" )
SQL_COMMANDS+=( "${SQL_CLEAN_WHAT_IS_NOT_PUBLIC}" )
SQL_COMMANDS+=( "${SQL_NORMALISE_MODULES}" )
SQL_COMMANDS+=( "${SQL_EJB_CLEAN_TOKEN}" )
SQL_COMMANDS+=( "${SQL_REMOVE_BANNER}" )
SQL_COMMANDS+=( "${SQL_DEL_USER_KEYS}" )
SQL_COMMANDS+=( "${SQL_DEL_POST_INSTALL_MSG}" )
SQL_COMMANDS+=( "${SQL_SET_AI_PIM}" )
SQL_COMMANDS+=( "${SQL_DEL_MSG}" )
SQL_COMMANDS+=( "${SQL_SET_AI_MSG}" )
SQL_COMMANDS+=( "${SQL_DEL_ACT_LOGS}" )
SQL_COMMANDS+=( "${SQL_SET_AI_ACT_LOGS}" )
SQL_COMMANDS+=( "${SQL_DEL_PVT_REQS}" )
SQL_COMMANDS+=( "${SQL_SET_AI_PVT_REQS}" )

for key in "${!SQL_COMMANDS[@]}"
do
    SQL=${SQL_COMMANDS[${key}]}
    echo "  ${key})" ${SQL_COMMANDS[${key}]} | cut -c1-50
    ${MYSQL} -u ${DBUSER} ${TEMP_DBNAME} -e "${SQL}"
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        echo "[ERROR] Could not run [${SQL}]"
        send_error_mail
    fi
done

echo "Dumping CLEANED Joomla MySQL database - [$TEMP_DBNAME]"
${MYSQL_DUMP} --skip-dump-date -u ${DBUSER} ${TEMP_DBNAME} > ${PUBLIC_DB_FILE}
OUT=$?
if [[ "$OUT" -ne 0 ]] || [[ ! -s ${PUBLIC_DB_FILE} ]]; then
    echo "[ERROR] Could not DUMP public Joomla Database"
    send_error_mail
fi

echo "Dropping temporary database - [$TEMP_DBNAME]"
SQL_DROP_TEMP_DB="DROP DATABASE ${TEMP_DBNAME};"
${MYSQL} -u ${DBUSER} -e "${SQL_DROP_TEMP_DB}";
OUT=$?
if [[ "$OUT" -ne 0 ]]; then
    echo "[ERROR] Could not DROP temporary database ${TEMP_DBNAME}"
    send_error_mail
fi

sed -i -e "s/Database: ${TEMP_DBNAME}/Database: ${DBNAME}/" ${PUBLIC_DB_FILE}

echo "Updating GitHub..."
echo "Performing git add"
${GIT} -C ${LOCAL_REPO} add .
OUT=$?
if [[ "$OUT" -ne 0 ]]; then
    echo "[ERROR] git add failed"
    send_error_mail
fi

echo "Performing git commit"
${GIT} -C ${LOCAL_REPO} diff-index --quiet HEAD || ${GIT} -C ${LOCAL_REPO} commit -a --author="${GITHUB_USER} <${GITHUB_EMAIL}>" -m "website2github.sh automated commit on ${COMMIT_TIMESTAMP}"
OUT=$?
if [[ "$OUT" -ne 0 ]]; then
    echo "[ERROR] git commit failed"
    send_error_mail
fi

# temporary as the script is in my home and we are running the script as sudo...
# this is done so the repo can find the key and not ask for password.
echo "Performing git push"
${GIT} -C ${LOCAL_REPO} push
OUT=$?
if [[ "$OUT" -ne 0 ]]; then
    echo "[ERROR] git push failed"
    send_error_mail
fi

echo "All done! Thanks"
