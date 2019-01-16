#!/bin/bash

########################################################################################################################
#################################################  PASS TO PRODUCTION  #################################################
########################################################################################################################

#-----------------------------------------------------------------------------------------------------------------------
#
# Pass Reactome from Release to Production / Development
#
# First Run: 'move_data_over' - Download folder and others will be copied in background and an email will be sent once
# finished/
# Second Run: 'do_release' - Proxy Pass, stop services, update links, website, solr, neo4j, clean up folders start
# services, remove Proxy Pass
#
# Start point: check function 'move_data_over' and 'do_release'.
# Folders and files are deleted in 'folders_to_clean_up' function
# Permissions are adjusted in 'adjust_folders_owners_and_permissions'
#
# Created by Guilherme Viteri  - gviteri@ebi.ac.uk
# December, 2017
#
# Update by Guilherme Viteri  - gviteri@ebi.ac.uk
# January, 2017
#
#----------------------------------------------------------------------------------------------------------------------

if [[ $(id -u) -ne 0 ]] ; then echo "Please run as sudo." ; exit 1 ; fi

DIR="/usr/local/reactomes/Reactome/production/Website/scripts"
cd ${DIR};

NOW=$(date +"%Y%m%d%H%M%S")
P2P_DIR="./pass2prod"
mkdir -p -m 0775 ${P2P_DIR}
sudo chown -R $(logname)":reactome" ${P2P_DIR}
LOG="${P2P_DIR}/pass2production"
LOGFILE="${LOG}_${NOW}.log"

exec > >(tee -i ${LOGFILE})
exec 2>&1

# Logs LRU
# Delete old logs. Only 5 are kept
LRU=$(ls -t ${LOG}* 2>/dev/null | sed -e '1,5d')
for LOG_TO_DEL in ${LRU}; do
    rm -f ${LOG_TO_DEL};
done;

print_help () {
    echo $""
    echo "###########################################################################"
    echo "########################## Pass to Production #############################"
    echo "###########################################################################"
    echo $""
    echo "This script is meant to be run in two steps. Run as sudo"
    echo " >1st. Call using the flag 'move_data_over' - All necessary data will be transferred"
    echo "    e.g sudo ./$(basename "$0") release_version=XX destination_server=DEV email_me=gui@ebi.ac.uk move_data_over"
    echo " >2nd. Call 'do_release'"
    echo "    e.g sudo ./$(basename "$0") release_version=XX destination_server=DEV email_me=gui@ebi.ac.uk do_release"
    echo $""
    echo "###########################################################################"
    exit
}

usage () {
    _SCRIPT=$(basename "$0")
    echo "Usage: sudo ./$_SCRIPT <parameters> [OPTION: move_data_over or do_release]"
    echo '          release_version=<XX> *** [MANDATORY] ***'
    echo '          destination_server=<DEV|PROD> *** [MANDATORY] ***'
    echo '          privatekey=<path for certificate pem file>'
    echo '          email_me=<your valid email address>'
    echo '          static_dir=<Path for static folder> [Default: /usr/local/reactomes/Reactome/development/Website/static/]'
    echo ''
    echo '          move_data_over [Copy download folder, solr and graph to remote server. Recommended to run using `screen`]'
    echo '          do_release [Release the data. Recommended to run using `screen`]'
    echo '          remove_proxy_pass [TO BE USED ONLY WHEN THE SCRIPT RECOMMENDS]'
    echo '          help'
    exit
}

# Check arguments
for ARGUMENT in "$@"
do
    KEY=$(echo ${ARGUMENT} | cut -f1 -d=)
    VALUE=$(echo ${ARGUMENT} | cut -f2 -d=)

    case "$KEY" in
        release_version)           RELEASE_VERSION=${VALUE} ;;
        destination_server)        DESTINATION_SERVER=${VALUE} ;;
        static_dir)                STATIC_DIR=${VALUE} ;;
        privatekey)                PRIVATE_KEY=${VALUE} ;;
        email_me)                  MAIL_TO=${VALUE} ;;
        do_release)                DO_RELEASE="do-release" ;;
        move_data_over)            MOVE_DATA="move-data" ;;
        help)                      HELP="help-me" ;;
        remove_proxy_pass)         REMOVE_PP="remove-pp" ;;
        *)
    esac
done

########### VARIABLES ###########
STATIC_DIR="/usr/local/reactomes/Reactome/production/Website/static"

DESTINATION_SERVER_USER=""
DESTINATION_SERVER_PASSWD=""

# server
DEV_SERVER="dev.reactome.org"
RELEASE_SERVER="release.reactome.org"
PRD1_SERVER="reactome.org"
LIVE_SERVER="reactome.org"

# No trailing slash, they're added when needed.
SOLR_DATA_DIR="/var/solr/data"  # solr:solr
NEO4J_GRAPH_DIR="/var/lib/neo4j/data/databases/graph.db" # neo4j:adm
ICON_DIR="/usr/local/reactomes/Reactome/production/Icons"
FIGURES_DIR="${STATIC_DIR}/figures"

# services
TOMCAT_PROCESS="tomcat7"
SOLR_PROCESS="solr"
NEO4J_PROCESS="neo4j"

# apache
APACHE_HOME="/etc/apache2"
REACTOME_APACHE_CONF="001-reactome.conf"
REACTOME_APACHE_CONF_PP="001-reactome-proxypass.conf"

# analysis
ANALYSIS_BIN_FOLDER="/usr/local/reactomes/Reactome/production/AnalysisService/input"
ANALYSIS_DIGESTER_BIN_FOLDER="/usr/local/reactomes/Reactome/production/AnalysisService/digester"

# folders to clean up
EXPORTER_FOLDER="/usr/local/reactomes/Reactome/production/ContentService/exporter/*" # delete content and keep exporter
ANALYSIS_TEMP_FOLDER="/usr/local/reactomes/Reactome/production/AnalysisService/temp"
CGI_TMP_FOLDER="/usr/local/reactomes/Reactome/production/Website/static/cgi-tmp" # can't use /* it has folders inside that are needed

# download
# PREVIOUS_RELEASE_VERSION is calculated after validating release version
DOWNLOAD_HOME=${STATIC_DIR}"/download"
DOWNLOAD_DIR=${STATIC_DIR}"/download/"${RELEASE_VERSION}

# database
MYSQL_HOME="/usr/bin"
MYSQL_PORT=3306
WEBSITE_MYSQL_USER=""
WEBSITE_MYSQL_PASSWD=""
GK_CURRENT_DB="gk_current";
STABLE_ID_DB="stable_identifiers";
R_MYSQL_USER=""
R_MYSQL_PASSWD=""
GK_CURRENT_TMP_FILE="/tmp/${GK_CURRENT_DB}_release.sql"

# website
JOOMLA_SCRIPT="${STATIC_DIR}/scripts/joomla_migration.sh"
SOURCE_SERVER_USER=""
SOURCE_SERVER_PASSWD=""

FROM="p2p-noreply@reactome.org"
DEFAULT_MAIL_TO="nobody@reactome.org"

PRIVATE_KEY="/home/shared/.ssh/shared.pem"
SHARED_USER="shared"
PASSPHRASE="" # do not push this script if the passphrase is written down here

SYNC_TOOL="sudo ${STATIC_DIR}/scripts/sync_tool.sh";

# IMPORTANT: SAME DIRECTORY IS USED FOR CLEAN UP - NEVER PUT A
# to add more directories to be transferred ["name"]=dir
declare -A dict=( ["solr"]=${SOLR_DATA_DIR} ["neo4j"]=${NEO4J_GRAPH_DIR} ["icons"]=${ICON_DIR} ["figures"]=${FIGURES_DIR} )

if [[ "${HELP}" == "help-me" ]]; then
    print_help
fi

########### CHECKING MANDATORY PARAMETERS ###########
if [[ "${RELEASE_VERSION}" = "" ]] && [[ ! "${REMOVE_PP}" ]]; then
    echo "Missing release version. Please ensure you specify the correct release version. e.g release_version=63"
    usage
fi

re='^[0-9]+$'
if ! [[ "${RELEASE_VERSION}" =~ $re ]] && [[ ! "${REMOVE_PP}" ]]; then
   echo "Release Version is not a number"
   exit;
fi
PREVIOUS_RELEASE_VERSION=$(( ${RELEASE_VERSION}-1 ))

if [[ "${DESTINATION_SERVER}" = "" ]]; then
    echo "Missing destination server [DEV|PROD]"
    usage
fi

if [[ "${DESTINATION_SERVER}" == "PROD" ]]
then
    SERVER=${PRD1_SERVER}
elif [[ "${DESTINATION_SERVER}" == "DEV" ]]
then
    SERVER=${DEV_SERVER}
else
    echo $"Invalid destination server. Please provide DEV or PROD"
    exit;
fi

if  [[ "${MAIL_TO}" = "" ]]; then
    MAIL_TO="${DEFAULT_MAIL_TO}"
fi

send_error_mail () {
    sleep 15s
    SUBJECT="[Pass2Production] Something went wrong..."
    BODY=`cat ${LOGFILE}`
    FROM="Pass2Production<p2p-noreply@reactome.org>"
    echo -e "Subject:${SUBJECT}\n${BODY}" | sendmail -f "${FROM}" -t "${MAIL_TO}"
    exit
}

send_mail () {
    SUBJECT="[Pass2Production] Execution completed"
    BODY=`cat ${LOGFILE}`
    FROM="Pass2Production<p2p-noreply@reactome.org>"
    echo -e "Subject:${SUBJECT}\n${BODY}" | sendmail -f "${FROM}" -t "${MAIL_TO}"
    exit
}

transfer_download_folder (){
    begin=$(date +"%s")
    echo $""

    SIZE=$(du -sh ${DOWNLOAD_DIR} | cut -f1)

    echo "Transferring download folder [${DOWNLOAD_DIR}]. Folder size is [$SIZE]"
    read -r -p "Copying the download folder [size=$SIZE] is recommended to use 'screen'. Continue? [y/N] " response
    case "$response" in
        [yY][eE][sS]|[yY])
            sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) rsync -rogtO -e 'ssh -i '${PRIVATE_KEY}' -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null' -i --links --delete --ignore-errors ${DOWNLOAD_DIR}/ ${SHARED_USER}@${SERVER}:${DOWNLOAD_DIR} #2> /dev/null
            OUT=$?
            if [[ "$OUT" -ne 0 ]]; then
                echo "[ERROR] [Download] - Rsync didn't executed properly. Check system output and address it manually. Re-run once the issue is sorted."
                send_error_mail
            fi
            ;;
        *)
            exit
            ;;
    esac

    difftimelps=$(($(date +"%s")-$begin))
    echo "Download folder has been synchronised. Elapsed time: [$(($difftimelps / 60)) minutes and $(($difftimelps % 60)) seconds]"

    sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) ssh -i ${PRIVATE_KEY} -qn -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${SHARED_USER}@${SERVER} "${SYNC_TOOL} ZIP_ARCHIVE release_version=${RELEASE_VERSION}"
}

# solr, neo4j, icons, figures...
transfer_others_to_tmp () {
    for name in "${!dict[@]}"
    do
        begin=$(date +"%s")
        echo $""

        DIR=${dict[$name]}
        SIZE=$(du -sh ${DIR} | cut -f1)

        MOVE_DATA_OVER_DIR="/tmp/"${name}
        echo "Transferring [$DIR] to [${SERVER}:${MOVE_DATA_OVER_DIR}]. Folder size is [$SIZE]"
        sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) rsync -rogtO -e 'ssh -i '${PRIVATE_KEY}' -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null' -i --links --delete --ignore-errors ${DIR}/ ${SHARED_USER}@${SERVER}:${MOVE_DATA_OVER_DIR} #2> /dev/null
        OUT=$?
        if [[ "$OUT" -ne 0 ]]; then
            echo "[ERROR] [${name}] - Rsync didn't executed properly. Check system output and address it manually. Re-run once the issue is sorted."
            send_error_mail
            exit
        fi

        difftimelps=$(($(date +"%s")-$begin))
        echo "${name} folder has been synchronised. Elapsed time: [$(($difftimelps / 60)) minutes and $(($difftimelps % 60)) seconds]"
    done
}

export_mysql_databases () {
    # Note: If you are adding another DB, please remember to add it in the sync_tool.sh > other_database > dbs.
    other_dbs_dict=( ${GK_CURRENT_DB} )

    for DBNAME in "${other_dbs_dict[@]}"
    do
        echo $""
        echo "Dumping ${DBNAME}..."
        CURR_DB_FILE="/tmp/${DBNAME}_from_release.sql"

        export MYSQL_PWD=${R_MYSQL_PASSWD}
        ${MYSQL_HOME}/mysqldump -P ${MYSQL_PORT} -u ${R_MYSQL_USER} ${DBNAME} > ${CURR_DB_FILE}

        CURR_DB_FILE_GZ=${CURR_DB_FILE}".gz"
        if [[ -f ${CURR_DB_FILE_GZ} ]]; then
            rm -f ${CURR_DB_FILE_GZ}
        fi
        echo "Compressing ${DBNAME}..."
        gzip ${CURR_DB_FILE}

        echo "Transferring ${CURR_DB_FILE_GZ}"
        sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) rsync -rogtO -e 'ssh -i '${PRIVATE_KEY}' -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null' -i --links --delete --ignore-errors ${CURR_DB_FILE_GZ} ${SHARED_USER}@${SERVER}:${CURR_DB_FILE_GZ} #2> /dev/null
        OUT=$?
        if [[ "$OUT" -ne 0 ]]; then
            echo "[WARN] [${GK_CURRENT_TMP_FILE}.gz] - Rsync didn't executed properly. Check system output and address it manually. Re-run once the issue is sorted."
        fi

        echo "Removing database dump file ${CURR_DB_FILE} from ${RELEASE_SERVER}"
        rm -f ${CURR_DB_FILE_GZ}
        rm -f ${CURR_DB_FILE}
    done
}

# Sync website. Executing joomla_migration in the CLI
website () {
    echo "Updating Website in [${DESTINATION_SERVER}]"
    echo "Calling ${JOOMLA_SCRIPT}"
    /bin/bash ${JOOMLA_SCRIPT} 'env='${DESTINATION_SERVER} 'privatekey='${PRIVATE_KEY} 'passphrase='${PASSPHRASE} 'osuser='${SOURCE_SERVER_USER} 'ospasswd='${SOURCE_SERVER_PASSWD} 'dbuser='${WEBSITE_MYSQL_USER} 'dbpasswd='${WEBSITE_MYSQL_PASSWD}
    echo "Joomla Website has been synchronised"
}

proxy_pass_to_release () {
    sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) ssh -i ${PRIVATE_KEY} -qn -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${SHARED_USER}@${SERVER} "${SYNC_TOOL} ENABLEPP"
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        exit;
    fi
}

remove_proxy_pass () {
    sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) ssh -i ${PRIVATE_KEY} -qn -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${SHARED_USER}@${SERVER} "${SYNC_TOOL} REMOVEPP"
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        exit;
    fi
}

start_services () {
    sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) ssh -i ${PRIVATE_KEY} -qn -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${SHARED_USER}@${SERVER} "${SYNC_TOOL} STARTSERVS"
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        exit;
    fi
}

stop_services () {
    sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) ssh -i ${PRIVATE_KEY} -qn -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${SHARED_USER}@${SERVER} "${SYNC_TOOL} STOPSERVS"
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        exit;
    fi
}

rsync_from_tmp_to_src_dir () {
    sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) ssh -i ${PRIVATE_KEY} -qn -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${SHARED_USER}@${SERVER} "${SYNC_TOOL} FROMTMPTOSRC"
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        exit;
    fi
}

reload_apache () {
    sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) ssh -i ${PRIVATE_KEY} -qn -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${SHARED_USER}@${SERVER} "${SYNC_TOOL} RELOAD_APACHE"
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        exit;
    fi
}

# At this point download folder is already in th Destination Server
# We only need to update the 'current' symlink
update_download_folder () {
    echo "Creating 'current' symlink in the Download folder"
    LINK="unlink ${DOWNLOAD_HOME}/current ; ln -s ${DOWNLOAD_DIR} ${DOWNLOAD_HOME}/current"
    sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) ssh -i ${PRIVATE_KEY} -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${SHARED_USER}@${SERVER} "echo ${DESTINATION_SERVER_PASSWD} | ${LINK} "
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        echo "[WARN] Could not symlink download folder to current. Check the server and probably address it manually."
    fi
    echo "Download folder is done"
}

analysis_files () {
    ANALYSIS_BIN="analysis_v${RELEASE_VERSION}.bin"
    ANALYSIS_FULLNAME=${ANALYSIS_BIN_FOLDER}"/"${ANALYSIS_BIN}
    ANALYSIS_SYMLINK=${ANALYSIS_BIN_FOLDER}"/analysis.bin"

    echo "Transferring ${ANALYSIS_BIN}"
    sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) rsync -rogtO -e 'ssh -i '${PRIVATE_KEY}' -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null' -i --links --delete --ignore-errors ${ANALYSIS_FULLNAME} ${SHARED_USER}@${SERVER}:${ANALYSIS_FULLNAME} #2> /dev/null
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        echo "[WARN] [${ANALYSIS_BIN}] - Rsync didn't executed properly. Check system output and address it manually. Re-run once the issue is sorted."
    fi

    EXPERIMENTS=${ANALYSIS_DIGESTER_BIN_FOLDER}"/experiments.bin"

    echo "Transferring ${EXPERIMENTS}"
    sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) rsync -rogtO -e 'ssh -i '${PRIVATE_KEY}' -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null' -i --links --delete --ignore-errors ${EXPERIMENTS} ${SHARED_USER}@${SERVER}:${EXPERIMENTS} #2> /dev/null
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        echo "[WARN] [${EXPERIMENTS}] - Rsync didn't executed properly. Check system output and address it manually. Re-run once the issue is sorted."
    fi

    sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) ssh -i ${PRIVATE_KEY} -qn -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${SHARED_USER}@${SERVER} "${SYNC_TOOL} ANALYSIS release_version=${RELEASE_VERSION}"
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        exit;
    fi
}

adjust_folders_owners_and_permissions () {
    sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) ssh -i ${PRIVATE_KEY} -qn -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${SHARED_USER}@${SERVER} "${SYNC_TOOL} OWNERANDPERM"
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        exit;
    fi
}

other_databases () {
    sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) ssh -i ${PRIVATE_KEY} -qn -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${SHARED_USER}@${SERVER} "${SYNC_TOOL} OTHER_DBS mysql_user=${R_MYSQL_USER} mysql_passwd=${R_MYSQL_PASSWD}"
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        exit;
    fi
}

folders_to_clean_up () {
    sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) ssh -i ${PRIVATE_KEY} -qn -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${SHARED_USER}@${SERVER} "${SYNC_TOOL} CLEANUP release_version=${RELEASE_VERSION}"
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        exit;
    fi
}

# At this point proxy pass is enabled, so we need to check services directly in Tomcat.
# Secure HTTP is done at the Apache Level, so https://<server>:<8080> won't work.
# That's the reason why we are using http
check_services () {
    sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) ssh -i ${PRIVATE_KEY} -qn -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${SHARED_USER}@${SERVER} "${SYNC_TOOL} CHECKSERV release_version=${RELEASE_VERSION}"
}

remove_notice_banner () {
    if [[ "${DESTINATION_SERVER}" == "PROD" ]]; then
        sed -i -e '/show_notice_mod =/ s/= .*/= \'"'"'0\'"';"'/' ${STATIC_DIR}/configuration.php
        sed -i -e 's/\r$//g' ${STATIC_DIR}/configuration.php
    fi
}

add_notice_banner () {
    if [[ "${DESTINATION_SERVER}" == "PROD" ]]; then
        sed -i -e '/show_notice_mod =/ s/= .*/= \'"'"'1\'"';"'/' ${STATIC_DIR}/configuration.php
        sed -i -e 's/\r$//g' ${STATIC_DIR}/configuration.php
    fi
}

# Confirm the Release_Version. This can't be wrong.
check_release_version () {
    echo $""
    while true; do
        read -r -p "*** Do you confirm 'release_version' ${RELEASE_VERSION} ? [y/n] ***  " yn
        case ${yn} in
            [Yy]* ) echo "OK. Ready to move data over :)"; echo $""; break;;
            [Nn]* ) echo "OK, correct 'release_version' parameter in the command line and run again."; exit;;
            * ) echo "Please answer (y/Y) or (n/N).";;
        esac
    done
}

validate_cert_passphrase () {
    echo "Validating certificate passphrase"
    if [[ ! -e ${PRIVATE_KEY} ]]; then
        echo "[ERROR] Couldn't find the private key [${PRIVATE_KEY}]"
        exit
    fi
    sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) ssh-keygen -y -f ${PRIVATE_KEY} &> /dev/null
    local OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        echo "[ERROR] Invalid certificate passphrase. Please check and try again"
    fi
    return ${OUT}
}

ask_passphrase () {
    while true; do
        read -s -p "Passphrase for ${PRIVATE_KEY} > " PASSPHRASE
        validate_cert_passphrase
        if [[ "$?" -eq 0 ]]; then
            echo "Certificate Passphrase... OK"
            break
        fi
    done
}

# Credentials in for the source (mainly reactomerelease) is needed in the website update phase.
validate_source_credentials () {
    echo $""
    echo "Validating [${RELEASE_SERVER}] credentials..."
    sshpass -p ${SOURCE_SERVER_PASSWD} sudo -S -u ${SOURCE_SERVER_USER} sudo ls &> /dev/null
    local OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        echo "[ERROR] Can't connect to [${RELEASE_SERVER}]. Please user and password and try again."
    fi
    return ${OUT}
}

validate_mysql_credentials () {
    echo $""
    echo "Validating MySQL credentials..."
    # Exporting MySQL password so we don't print it in the command line.
    export MYSQL_PWD=$2
    ${MYSQL_HOME}/mysql -P ${MYSQL_PORT} -u $1 -e exit 2> /dev/null
    local OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        echo "[ERROR] Can't connect to MySQL. Please check DB user and password and try again."
    fi
    return ${OUT}
}

ask_db_credentials () {
    echo $""
    echo "These credentials are required for ${GK_CURRENT_DB} database"

    while true; do
        read -r -p "Type DATABASE user for ${GK_CURRENT_DB} > " R_MYSQL_USER
        read -s -p "Type password for ${R_MYSQL_USER} > " R_MYSQL_PASSWD
        validate_mysql_credentials ${R_MYSQL_USER} ${R_MYSQL_PASSWD}
        if [[ "$?" -eq 0 ]]; then
            echo "MySQL Credentials... OK"
            break
        fi
    done
}

# extra credentials: release server and database
ask_extra_credentials () {
    echo $""
    echo "These credentials are required for updating the website (Joomla)"

    while true; do
        # Read credentials for Source Server
        read -r -p "Type your user @ ${RELEASE_SERVER} > " SOURCE_SERVER_USER
        read -s -p "Type your password ${SOURCE_SERVER_USER}@${RELEASE_SERVER} > " SOURCE_SERVER_PASSWD
        validate_source_credentials
        if [[ "$?" -eq 0 ]]; then
            echo "OS Credentials... OK"
            break
        fi
    done

    echo $""

    while true; do
        read -r -p "Type DATABASE user for website > " WEBSITE_MYSQL_USER
        read -s -p "Type password for ${WEBSITE_MYSQL_USER} > " WEBSITE_MYSQL_PASSWD
        validate_mysql_credentials ${WEBSITE_MYSQL_USER} ${WEBSITE_MYSQL_PASSWD}
        if [[ "$?" -eq 0 ]]; then
            echo "MySQL Credentials... OK"
            break
        fi
    done

    echo $""
    echo "These credentials are required for ${GK_CURRENT_DB} database"

    while true; do
        read -r -p "Type DATABASE user for ${GK_CURRENT_DB} > " R_MYSQL_USER
        read -s -p "Type password for ${R_MYSQL_USER} > " R_MYSQL_PASSWD
        validate_mysql_credentials ${R_MYSQL_USER} ${R_MYSQL_PASSWD}
        if [[ "$?" -eq 0 ]]; then
            echo "MySQL Credentials... OK"
            break
        fi
    done
}

# KEY FUNCTION
move_data_over () {
    begin_all=$(date +"%s")
    echo "Starting moving data over..."

    transfer_download_folder
    transfer_others_to_tmp
    export_mysql_databases

    difftimelps=$(($(date +"%s")-$begin_all))
    ELAPSED_MSG="Elapsed time: [$(($difftimelps / 60)) minutes and $(($difftimelps % 60)) seconds]"
    MAIL_MSG="Data transferring is completed. \n If you haven't got any error... Please run the script again without 'move_data_over' flag \n ${ELAPSED_MSG}"
    echo ${ELAPSED_MSG}
    echo "DONE! Data have been moved and you can proceed with the Release."
    echo "Run the script again and choose 'do_release'"

    send_mail
}

# KEY FUNCTION
do_release () {
    proxy_pass_to_release
    remove_notice_banner
    reload_apache
    stop_services

    update_download_folder
    rsync_from_tmp_to_src_dir
    website
    analysis_files
    other_databases
    folders_to_clean_up
    adjust_folders_owners_and_permissions

    start_services

    check_services
    if [[ "$?" -eq 0 ]]; then
        echo "Services have been checked and all of them seems to be running. Ready to remove the ProxyPass!"
        remove_proxy_pass
        add_notice_banner
        reload_apache
    else
        echo "## READ THOSE LINES CAREFULLY ##"
        echo "Some services are not running properly and the ProxyPass still points to ${RELEASE_SERVER}"
        echo "Once you address the issue, run 'sudo ./$(basename "$0") destination_server=${DESTINATION_SERVER} remove_proxy_pass'"
    fi
}

if [[ "${MOVE_DATA}" == "move-data" ]]; then
    check_release_version
    ask_passphrase
    validate_cert_passphrase
    ask_db_credentials
    move_data_over

elif [[ "${REMOVE_PP}" == "remove-pp" ]]; then
    ask_passphrase
    remove_proxy_pass
    add_notice_banner
    reload_apache

elif [[ "${DO_RELEASE}" == "do-release" ]]; then
    check_release_version
    ask_passphrase
    ask_extra_credentials
    do_release

else
    echo "Crystal Ball is not implemented. You tell me what to do and I will do it :). Cheers."
fi

echo $""
echo "Execution has finished, please have close look to the email you've got and address any WARNING manually"

send_mail