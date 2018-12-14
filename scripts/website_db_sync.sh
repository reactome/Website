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
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd $DIR;

NOW=$(date +"%Y%m%d%H%M%S")

MYSQL_HOME="/usr/bin"
DEFAULT_DBNAME="website";
DBPORT=3306;

# Written in the "source" server
DUMP_SQL_FILE="/tmp/dump_from_release.sql"
DEST_BACKUP_DB="/tmp/current_db_bkp.sql"

# Written in the "destination" server
# Better to keep in tmp, mysql user does not have permission where www-data rules and can't write remotely
TMP_ARTICLE_HITS="/var/lib/mysql-files/articles_hits_${NOW}.csv"

BKP_TABLE="rlp_easyjoomlabackup"
TMP_TABLE="x4u_article_hits_tmp"
ARTICLES_TABLE="rlp_content"

usage () {
   _SCRIPT=$(basename "$0")
   echo "Usage: ./$_SCRIPT"
   echo '           dbuser=<DB User> [Required when method is ALL or DB]'
   echo '           dbpasswd=<DB Password> [Required when method is ALL or DB]'
   echo '           dbname=[<DB Name: DEFAULT website>]'
   echo '           dbport=[<DB Port: Default 3306>]'

   exit
}

db_sync () {
    # Exporting MySQL password so we don't print it in the command line.
    export MYSQL_PWD=${DBPASSWD}

    echo "Backing up the Database [$DEFAULT_DBNAME] in the Destination"
    ${MYSQL_HOME}/mysqldump -u ${DBUSER} ${DEFAULT_DBNAME} > ${DEST_BACKUP_DB}
    OUT=$?
    if [ "$OUT" -ne 0 ] || [ ! -s ${DEST_BACKUP_DB} ]; then
        echo "[ERROR] Could not BACKUP the current database [$DEST_BACKUP_DB]"
        exit
    fi

    echo "Saving the Article Hits of the current database into CSV file"
    SAVE_ARTICLE_HITS="SELECT id, hits FROM $ARTICLES_TABLE INTO OUTFILE '$TMP_ARTICLE_HITS' FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n';"
    ${MYSQL_HOME}/mysql -u ${DBUSER} ${DBNAME} -e "$SAVE_ARTICLE_HITS";
    OUT=$?
    if [ "$OUT" -ne 0 ]; then
        echo "[ERROR] Could not EXPORT Article Hits [$TMP_ARTICLE_HITS] from current database [$DBNAME]"
        exit
    fi

    echo "Importing database [$DBNAME]"
    ${MYSQL_HOME}/mysql -u ${DBUSER} ${DBNAME} < ${DUMP_SQL_FILE}
    OUT=$?
    if [ "$OUT" -ne 0 ]; then
        echo "[ERROR] Could not IMPORT file [$DUMP_SQL_FILE] to the database [$DBNAME] "
        exit
    fi

    echo "Preparing the Article Hits in the new Database"
    echo "Dropping temporary table if it exists"
    # Can't use temporary table command because we are not running them under the same db connection
    DROP_TEMP_TABLE="DROP TABLE IF EXISTS $TMP_TABLE;"
    ${MYSQL_HOME}/mysql -u ${DBUSER} ${DBNAME} -e "$DROP_TEMP_TABLE"
    OUT=$?
    if [ "$OUT" -ne 0 ]; then
        echo "[ERROR] Could not DROP temporary table [$TMP_TABLE] from current database [$DBNAME]"
        exit
    fi

    echo "Creating temporary table"
    CREATE_TEMP_TABLE="CREATE TABLE $TMP_TABLE (article_id int(10), article_hits int (10));"
    ${MYSQL_HOME}/mysql -u ${DBUSER} ${DBNAME} -e "$CREATE_TEMP_TABLE"
    OUT=$?
    if [ "$OUT" -ne 0 ]; then
        echo "[ERROR] Could not CREATE temporary table [$TMP_TABLE] from current database [$DBNAME]"
        exit
    fi

    echo "Loading the articles into temporary table"
    IMPORT_ARTICLES="LOAD DATA INFILE '$TMP_ARTICLE_HITS' INTO TABLE $TMP_TABLE FIELDS OPTIONALLY ENCLOSED BY '\"' TERMINATED BY ',' (article_id, article_hits);"
    ${MYSQL_HOME}/mysql -u ${DBUSER} ${DBNAME} -e "$IMPORT_ARTICLES"
    OUT=$?
    if [ "$OUT" -ne 0 ]; then
        echo "[ERROR] Could not LOAD [$TMP_ARTICLE_HITS] file int temporary table [$TMP_TABLE] from current database [$DBNAME]"
        exit
    fi

    echo "Updating Articles Hits based on the values in the temporary table"
    UPDATE_ARTICLES="UPDATE $ARTICLES_TABLE INNER JOIN $TMP_TABLE on $TMP_TABLE.article_id = $ARTICLES_TABLE.id SET $ARTICLES_TABLE.hits = $TMP_TABLE.article_hits;"
    ${MYSQL_HOME}/mysql -u ${DBUSER} ${DBNAME} -e "$UPDATE_ARTICLES"
    OUT=$?
    if [ "$OUT" -ne 0 ]; then
        echo "[ERROR] Could not UPDATE article hits in [$ARTICLES_TABLE]"
        exit
    fi

    echo "Dropping temporary table"
    DROP_TEMP_TABLE="DROP TABLE $TMP_TABLE;"
    ${MYSQL_HOME}/mysql -u ${DBUSER} ${DBNAME} -e "$DROP_TEMP_TABLE"
    OUT=$?
    if [ "$OUT" -ne 0 ]; then
        echo "[WARN] Could not DROP temporary table [$TMP_TABLE]"
    fi

    echo "Cleaning up Easy Joomla Backup table"
    DEL_EJB_TABLE="DELETE FROM $BKP_TABLE;"
    ${MYSQL_HOME}/mysql -u ${DBUSER} ${DBNAME} -e "$DEL_EJB_TABLE"
    OUT=$?
    if [ "$OUT" -ne 0 ]; then
        echo "[WARN] Could not DELETE rows from table [$BKP_TABLE]"
    fi

    echo "Removing Staff Login form"
    UPDT_MENU_STAFF="UPDATE rlp_menu set published = 0 where id = 284;" # staff entry
    ${MYSQL_HOME}/mysql -u ${DBUSER} ${DBNAME} -e "$UPDT_MENU_STAFF"
    OUT=$?
    if [ "$OUT" -ne 0 ]; then
        echo "[WARN] Could not REMOVE Reactome Staff Login form"
    fi

    echo "Database synchronisation has finished!";
}

# Check arguments
for ARGUMENT in "$@"
do
    KEY=$(echo $ARGUMENT | cut -f1 -d=)
    VALUE=$(echo $ARGUMENT | cut -f2 -d=)

    case "$KEY" in
            dbuser)         DBUSER=${VALUE} ;;
            dbpasswd)       DBPASSWD=${VALUE} ;;
            dbname)         DBNAME=${VALUE} ;;
            dbport)         DBPORT=${VALUE} ;;
            external)       EXTERNAL=${VALUE} ;;
            joomlauser)     JOOMLAUSER=${VALUE} ;;
            *)
    esac
done

if [ "$DBNAME" = "" ]
then
    DBNAME=${DEFAULT_DBNAME}
fi

echo "Database: [$DBNAME]"

db_sync
