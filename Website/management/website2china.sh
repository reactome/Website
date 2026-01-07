#!/usr/bin/env bash

############################################################
###################  Website To China  ###################
############################################################

#-----------------------------------------------------------
#
# Website to China
#
# 1. Website (static folder) automatic git commit/push
# 2. Dumping cleaned version of the website database into a public folder
#
# Guilherme Viteri  - gviteri@ebi.ac.uk
# March, 2018
#
#-----------------------------------------------------------

# ************************ IMPORTANT 1 ***************************
#   An original dump of the database SHOULD NEVER be published
#   nor in a public Repository neither in a Docker Container
# ****************************************************************

# Don't need to execute as sudo

if [[ $# -ne 3  ]]; then
    echo "website2china expects 3 arguments <database user> <database password> <joomla super user id>"
    exit;
fi

PRIVATE_FOLDER="/usr/local/reactomes/Reactome/production/Website/private"
LOCAL_REPO="/usr/local/reactomes/Reactome/production/Website/static"

MYSQL=`which mysql`
MYSQL_DUMP=`which mysqldump`
DBNAME="website"
TEMP_DBNAME="temp_website" # must not be the same as $DBNAME
DBUSER=$1
DBPASSWD=$2
PRIVATE_DB_FILE="/tmp/joomla_website.sql"
PUBLIC_DB_FILE="/tmp/joomla_website_china.sql"
SUPER_USER_ID=$3

export MYSQL_PWD=${DBPASSWD}

# DUMP FROM RELEASE
echo "Dumping Joomla MySQL database [$DBNAME]"
${MYSQL_DUMP} --skip-dump-date -u ${DBUSER} ${DBNAME} > ${PRIVATE_DB_FILE}
OUT=$?
if [[ "$OUT" -ne 0 ]]; then
    echo "[ERROR] Could not DUMP Joomla Database from Reactome Release"
fi

echo "Creating temporary database [${TEMP_DBNAME}]"
CREATE_TEMP_DB="CREATE DATABASE IF NOT EXISTS ${TEMP_DBNAME} DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;"
${MYSQL} -u ${DBUSER} -e "${CREATE_TEMP_DB}"
OUT=$?
if [[ "$OUT" -ne 0 ]]; then
    echo "[ERROR] Could not temporary create database [${TEMP_DBNAME}]"
fi

echo "Importing into database [$TEMP_DBNAME]"
${MYSQL} -u ${DBUSER} ${TEMP_DBNAME} < ${PRIVATE_DB_FILE}
OUT=$?
if [[ "$OUT" -ne 0 ]]; then
    echo "[ERROR] Could not IMPORT file [$PRIVATE_DB_FILE] to the database [$TEMP_DBNAME]"
fi

# DO NOT CHANGE IT.
ADMIN_PASSWD="nothinghere"
USERS_PASSWD="nothinghere"

echo "Cleaning up sensitive information in the temp database before dumping it...."

# ALL USERS ARE BLOCKED
SQL_CL_USERS="SET sql_mode = '';UPDATE rlp_users SET username = concat('guest',id), name = concat('Name',' ',id), email = concat('invalid',id,'@nodomain.com'), requireReset = 0, resetCount = 0, block = 1, params = '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"helpsite\":\"\",\"timezone\":\"\"}', registerDate='2017-01-01 09:00:00', lastvisitDate='2017-01-01 10:00:00', lastResetTime='0000-00-00 00:00:00', password = '${USERS_PASSWD}' WHERE id <> ${SUPER_USER_ID};"

# ADMIN ACCOUNT
SQL_CL_ADMIN="SET sql_mode = '';UPDATE rlp_users SET username = 'admin', name = 'Joomla Admin', email = 'change-me@nodomain.com', requireReset = 0, resetCount = 0, params = '{\"admin_style\":\"\",\"admin_language\":\"\",\"language\":\"\",\"editor\":\"\",\"helpsite\":\"\",\"timezone\":\"\"}', registerDate='2017-01-01 09:00:00', lastvisitDate='2017-01-01 10:00:00', lastResetTime='0000-00-00 00:00:00', password = '${ADMIN_PASSWD}' WHERE id = ${SUPER_USER_ID};"
SQL_DELETE_GROUPS="DELETE FROM rlp_user_usergroup_map WHERE user_id <> ${SUPER_USER_ID} AND group_id <> 2;"
SQL_DELETE_EJBBKP="DELETE FROM rlp_easyjoomlabackup;"
SQL_SET_AI_EJBBKP="SET sql_mode = '';ALTER TABLE rlp_easyjoomlabackup AUTO_INCREMENT = 1;"
SQL_DELETE_SESSIONS="DELETE FROM rlp_session;"
SQL_UPDT_ARTICLE="SET sql_mode = '';UPDATE rlp_content SET hits=0,checked_out=0,checked_out_time='0000-00-00 00:00:00',version=1, created_by='${SUPER_USER_ID}',modified_by='${SUPER_USER_ID}',created='2017-01-01 09:00:00',modified='2017-01-01 09:00:00' WHERE catid <> 26;" # not in news category
SQL_UPDT_SITE_LAST_CHECK="SET sql_mode = '';UPDATE rlp_update_sites SET last_check_timestamp='0000-00-00 00:00:00';"
SQL_DELETE_UPDATES="DELETE FROM rlp_updates;"
SQL_SET_AI_UPDATES="SET sql_mode = '';ALTER TABLE rlp_updates AUTO_INCREMENT = 1;"
SQL_UPDT_TAGS="SET sql_mode = '';UPDATE rlp_tags SET hits=0,checked_out=0,checked_out_time='0000-00-00 00:00:00';"
SQL_DEL_UCM_CONTENT="DELETE FROM rlp_ucm_content;"
SQL_SET_AI_UCM_CONTENT="SET sql_mode = '';ALTER TABLE rlp_ucm_content AUTO_INCREMENT = 1;"
SQL_DEL_UCM_HISTORY="DELETE FROM rlp_ucm_history;"
SQL_SET_AI_UCM_HISTORY="SET sql_mode = '';ALTER TABLE rlp_ucm_history AUTO_INCREMENT = 1;"
SQL_UPDT_CONTENTITEM_TAG_MAP="SET sql_mode = '';UPDATE rlp_contentitem_tag_map SET tag_date='0000-00-00 00:00:00';"
SQL_CLEAN_WHAT_IS_NOT_PUBLIC="UPDATE rlp_content SET introtext='' WHERE access <> 1;"
SQL_NORMALISE_MODULES="SET sql_mode = '';UPDATE rlp_content SET checked_out=0,checked_out_time='0000-00-00 00:00:00';"
SQL_EJB_CLEAN_TOKEN="UPDATE rlp_extensions SET params='{\"token\":\"\",\"type\":\"1\",\"donation_code\":\"\"}' WHERE extension_id = 10209;"
SQL_REMOVE_BANNER="SET sql_mode = '';UPDATE rlp_modules SET published=0,publish_up='0000-00-00 00:00:00',publish_down='0000-00-00 00:00:00',content='' WHERE id = 581;"
SQL_DEL_USER_KEYS="DELETE FROM rlp_user_keys;"
SQL_DEL_POST_INSTALL_MSG="DELETE FROM rlp_postinstall_messages;"
SQL_SET_AI_PIM="SET sql_mode = '';ALTER TABLE rlp_postinstall_messages AUTO_INCREMENT = 1;"
SQL_DEL_MSG="DELETE FROM rlp_messages;"
SQL_SET_AI_MSG="SET sql_mode = '';ALTER TABLE rlp_messages AUTO_INCREMENT = 1;"
SQL_REMOVE_TWEETS="UPDATE rlp_modules SET published=0 WHERE id = 496;"
SQL_REMOVE_WHYREACTOME="UPDATE rlp_modules SET published=0 WHERE id = 505;"
SQL_ADD_CHINA_WHYREACTOME="UPDATE rlp_modules SET published=1 WHERE id = 582;"
SQL_REMOVE_STAFF_MENU="UPDATE rlp_menu SET published=0 WHERE id = 284;"
SQL_DEL_ACT_LOGS="DELETE FROM rlp_action_logs;"
SQL_SET_AI_ACT_LOGS="SET sql_mode = '';ALTER TABLE rlp_action_logs AUTO_INCREMENT = 1;"
SQL_DEL_PVT_REQS="DELETE FROM rlp_privacy_requests;"
SQL_SET_AI_PVT_REQS="SET sql_mode = '';ALTER TABLE rlp_privacy_requests AUTO_INCREMENT = 1;"

# security check, must never have, it is here just in case
if [[ ${DBNAME} == ${TEMP_DBNAME} ]]; then
    echo "DB and TEMP DB are the same. A clean up is done directly in TEMP, having the same as DB a disaster will happen."
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
SQL_COMMANDS+=( "${SQL_REMOVE_TWEETS}" )
SQL_COMMANDS+=( "${SQL_REMOVE_WHYREACTOME}" )
SQL_COMMANDS+=( "${SQL_ADD_CHINA_WHYREACTOME}" )
SQL_COMMANDS+=( "${SQL_REMOVE_STAFF_MENU}" )

for key in "${!SQL_COMMANDS[@]}"
do
    SQL=${SQL_COMMANDS[${key}]}
    echo "  ${key})" ${SQL_COMMANDS[${key}]} | cut -c1-50
    ${MYSQL} -u ${DBUSER} ${TEMP_DBNAME} -e "${SQL}"
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        echo "[ERROR] Could not run [${SQL}]"
        exit;
    fi
done

echo "Dumping CLEANED Joomla MySQL database - [$TEMP_DBNAME]"
${MYSQL_DUMP} --skip-dump-date -u ${DBUSER} ${TEMP_DBNAME} > ${PUBLIC_DB_FILE}
OUT=$?
if [[ "$OUT" -ne 0 ]] || [[ ! -s ${PUBLIC_DB_FILE} ]]; then
    echo "[ERROR] Could not DUMP public Joomla Database"
fi

echo "Dropping temporary database - [$TEMP_DBNAME]"
SQL_DROP_TEMP_DB="DROP DATABASE ${TEMP_DBNAME};"
${MYSQL} -u ${DBUSER} -e "${SQL_DROP_TEMP_DB}";
OUT=$?
if [[ "$OUT" -ne 0 ]]; then
    echo "[ERROR] Could not DROP temporary database ${TEMP_DBNAME}"
fi

rm ${PRIVATE_DB_FILE}

echo "Your database dump to be used in China is ready [${PUBLIC_DB_FILE}]"
echo "All done! Thanks"