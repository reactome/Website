#!/bin/bash

if [[ $1 == "ENABLEPP" ]]; then
    proxy_pass_to_release
elif [[ $1 == "REMOVEPP" ]]; then
    remove_proxy_pass
elif [[ $1 == "STARTSERVS" ]]; then
    start_services
elif [[ $1 == "STOPSERVS" ]]; then
    stop_services
elif [[ $1 == "CLEANUP" ]]; then
    folders_to_clean_up
elif [[ $1 == "CHECKSERV" ]]; then
    check_services
elif [[ $1 == "OWNERANDPERM" ]]; then
    owners_and_permissions_serv
    owners_and_permissions_website
elif [[ $1 == "OWNERANDPERMWEBSITE" ]]; then
    owners_and_permissions_website
elif [[ $1 == "FROMTMPTOSRC" ]]; then
    rsync_from_tmp_to_src_dir
elif [[ $1 == "ANALYSIS" ]]; then
    analysis
elif [[ $1 == "RELOAD_APACHE" ]]; then
    reload_apache
elif [[ $1 == "DOWNLOAD_FOLDER" ]]; then
    update_download_folder
elif [[ $1 == "OTHER_DBS" ]]; then
    other_databases
elif [[ $1 == "ZIP_ARCHIVE" ]]; then
    tar_download_folder_and_archive
else
    echo ""
fi

# Check arguments
for ARGUMENT in "$@"
do
    KEY=$(echo ${ARGUMENT} | cut -f1 -d=)
    VALUE=$(echo ${ARGUMENT} | cut -f2 -d=)

    case "$KEY" in
        release_version)   RELEASE_VERSION=${VALUE} ;;
        mysql_user)        MYSQL_USER=${VALUE} ;;
        mysql_passwd)      MYSQL_PASSWD=${VALUE} ;;
        *)
    esac
done

# VARIABLES
DIR="/usr/local/reactomes/Reactome/production/Website"
STATIC_DIR="${DIR}/static"

# apache
APACHE_HOME="/etc/apache2"
REACTOME_APACHE_CONF="001-reactome.conf"
REACTOME_APACHE_CONF_PP="001-reactome-proxypass.conf"

DESTINATION_SERVER_USER=""
DESTINATION_SERVER_PASSWD=""

# services
TOMCAT_PROCESS="tomcat7"
SOLR_PROCESS="solr"
NEO4J_PROCESS="neo4j"

ANALYSIS_BIN_FOLDER="/usr/local/reactomes/Reactome/production/AnalysisService/input"

# folders to clean up
EXPORTER_FOLDER="/usr/local/reactomes/Reactome/production/ContentService/exporter/*" # delete content and keep exporter
ANALYSIS_TEMP_FOLDER="/usr/local/reactomes/Reactome/production/AnalysisService/temp"
CGI_TMP_FOLDER="/usr/local/reactomes/Reactome/production/Website/static/cgi-tmp" # can't use /* it has folders inside that are needed

# download
# PREVIOUS_RELEASE_VERSION is calculated after validating release version
DOWNLOAD_HOME=${STATIC_DIR}"/download"
DOWNLOAD_DIR=${STATIC_DIR}"/download/"${RELEASE_VERSION}

MYSQL=`which mysql`
MYSQL_DUMP=`which mysqldump`
GK_CURRENT_DB="gk_current"

# No trailing slash, they're added when needed.
SOLR_DATA_DIR="/var/solr/data"  # solr:solr
NEO4J_GRAPH_DIR="/var/lib/neo4j/data/databases/graph.db" # neo4j:adm
EHLD_ICONS_DIR="/usr/local/reactomes/Reactome/production/Icons"
FIGURES_DIR="${STATIC_DIR}/figures"

declare -A dict=( ["solr"]=${SOLR_DATA_DIR} ["neo4j"]=${NEO4J_GRAPH_DIR} ["ehld-icons"]=${EHLD_ICONS_DIR} ["figures"]=${FIGURES_DIR} )

proxy_pass_to_release (){
    echo "Proxying to Reactome Release";

    SITES_AVAILABLE=${APACHE_HOME}"/sites-available"
    SITES_ENABLED=${APACHE_HOME}"/sites-enabled"

    UNLINK="sudo -S a2dissite ${REACTOME_APACHE_CONF}"
    LINK="sudo -S a2ensite ${REACTOME_APACHE_CONF_PP}"

    #sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) ssh -i ${PRIVATE_KEY} -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${DESTINATION_SERVER_USER}@${SERVER} "echo ${DESTINATION_SERVER_PASSWD} | ${UNLINK} &> /dev/null"
    ${UNLINK} &> /dev/null
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        echo "[WARN] Could not a2dissite [${REACTOME_APACHE_CONF}]."
    fi

    #sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) ssh -i ${PRIVATE_KEY} -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${DESTINATION_SERVER_USER}@${SERVER} "echo ${DESTINATION_SERVER_PASSWD} | ${LINK} &> /dev/null"
    ${LINK} &> /dev/null
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        echo "[ERROR] Could not proxy to release while trying to 'a2ensite' [${REACTOME_APACHE_CONF_PP}]. Please check the folders [${SITES_AVAILABLE}] and [${SITES_ENABLED}]"
        exit 1
    fi

    echo "The server is now proxying to Reactome Release"
}

remove_proxy_pass (){
    echo "Removing ProxyPass";

    SITES_AVAILABLE=${APACHE_HOME}"/sites-available"
    SITES_ENABLED=${APACHE_HOME}"/sites-enabled"

    UNLINK="sudo a2dissite ${REACTOME_APACHE_CONF_PP}"
    LINK="sudo a2ensite ${REACTOME_APACHE_CONF}"

    #sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) ssh -i ${PRIVATE_KEY} -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${DESTINATION_SERVER_USER}@${SERVER} "echo ${DESTINATION_SERVER_PASSWD} | ${UNLINK} &> /dev/null"
    ${UNLINK} &> /dev/null
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        echo "[WARN] Could not unlink the file [${REACTOME_APACHE_CONF_PP}]. File is not linked."
    fi

    #sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) ssh -i ${PRIVATE_KEY} -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${DESTINATION_SERVER_USER}@${SERVER} "echo ${DESTINATION_SERVER_PASSWD} | ${LINK} &> /dev/null"
    ${LINK} &> /dev/null
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        echo "[ERROR] Could not a2ensite [${REACTOME_APACHE_CONF}]. Please check the folders [${SITES_AVAILABLE}] and [${SITES_ENABLED}]"
        exit 1
    fi

    echo "ProxyPass has been removed"
}

start_services () {
    echo "Starting services..."

    echo "Starting solR"
    sudo service solr start &> /dev/null
    check_started ${SOLR_PROCESS}

    echo "Starting Neo4j"
    sudo service neo4j start &> /dev/null
    check_started ${NEO4J_PROCESS}

    echo "Starting Tomcat"
    sudo service tomcat7 start &> /dev/null
    check_started ${TOMCAT_PROCESS}

    echo "Services have been started"
}

stop_services () {
    echo "Stopping services..."

    echo "Stopping Tomcat"
    sudo service ${TOMCAT_PROCESS} stop &> /dev/null
    check_stopped ${TOMCAT_PROCESS}

    echo "Stopping SolR"
    sudo service ${SOLR_PROCESS} stop &> /dev/null
    check_stopped ${SOLR_PROCESS}

    echo "Stopping Neo4j"
    sudo service ${NEO4J_PROCESS} stop &> /dev/null
    check_stopped ${NEO4J_PROCESS}

    echo "Services have been stopped"
}

# check_started <argument>, checks if the given service has started
check_started () {
    if ps aux | grep -q $1; then
        echo "$1 has been STARTED"
    else
        echo "$1 hasn't been STARTED properly"
    fi
}

# check_started <argument>, checks if the given service has stopped
check_stopped () {
    if ps aux | grep -q $1; then
        echo "$1 hasn't been STOPPED properly"
    else
        echo "$1 has been STOPPED"
    fi
}

# At this point solr, neo4j, etc have been copied to /tmp/<service>
# update_other_folders moves them to the actual directory
rsync_from_tmp_to_src_dir () {
    echo $""
    echo "Copying files from /tmp to the actual directory..."

    # at this point all the data are in the destination server, so simple rsync directly connected in the destination server
    for name in "${!dict[@]}"
    do
        # both directories in the destination server
        SOURCE="/tmp/"${name}"/" # trailing slash is very important - makes rsync to the content inside and not the root directory
        DESTINATION=${dict[$name]}

        echo "deleting ${DESTINATION}"

        if [[ ${DESTINATION} != "/" ]]; then
             sudo -S find ${DESTINATION} -type f -exec rm -f {} \; &> /dev/null
        fi

        sudo rsync -rogtO -i --links --delete --ignore-errors ${SOURCE} ${DESTINATION}
        OUT=$?
        if [[ "$OUT" -ne 0 ]]; then
            echo "[ERROR] [${name}] - rsync ${SOURCE} ${DESTINATION} didn't execute properly."
            echo "Please find attached a logfile" | mail -s "[Pass2Production] ${name} FAILED sync " -r "Pass2Production<p2p@noreply.com>"
            #-a ${LOGFILE} ${MAIL_TO}
            exit
        fi
    done
    echo "Files have been copied"
}

folders_to_clean_up () {
    echo "Starting cleaning up some folders"

    PREVIOUS_RELEASE_VERSION=$(( ${RELEASE_VERSION}-1 ))

    DOWNLOAD_PREVIOUS="${DOWNLOAD_HOME}/${PREVIOUS_RELEASE_VERSION}"

    declare -A folders_to_clean=( ["download"]=${DOWNLOAD_PREVIOUS} ["exporter"]=${EXPORTER_FOLDER} )
    for key in "${!folders_to_clean[@]}"
    do
        DIR=${folders_to_clean[${key}]}
        echo "Cleaning ${DIR} folder";
        sudo -S rm -rf ${DIR} &> /dev/null
        OUT=$?
        if [[ "$OUT" -ne 0 ]]; then
            echo "[WARN] Could not delete [${DIR}] folder. It can be deleted manually and we won't exit the script."
        fi
    done

    # can't delete analysis using rm. It throws an error of argument is too long.
    declare -A folders_to_clean_using_find=( ["analysis-temp"]=${ANALYSIS_TEMP_FOLDER} ["cgi-tmp"]=${CGI_TMP_FOLDER} )
    for key in "${!folders_to_clean_using_find[@]}"
    do
        DIR=${folders_to_clean_using_find[${key}]}
        echo "Cleaning ${DIR} folder";
        sudo -S find ${DIR} -type f -exec rm -r {} \; &> /dev/null
        OUT=$?
        if [[ "$OUT" -ne 0 ]]; then
            echo "[WARN] Could not clean up [${DIR}] folder. It can be deleted manually and we won't exit the script."
        fi
    done

    # tmp
    local delete_in_tmp=( "solr" "neo4j" "ehld-icons" "figures" )
    for key in "${delete_in_tmp[@]}"
    do
        DIR="/tmp/${key}"
        echo "Cleaning ${DIR} folder";
        sudo -S rm -rf ${DIR} &> /dev/null
        OUT=$?
        if [[ "$OUT" -ne 0 ]]; then
            echo "[WARN] Could not delete [${DIR}] folder. It can be deleted manually and we won't exit the script."
        fi
    done

    echo "Clean up is done. If you have got any WARN message, please address it manually."
}

# At this point proxy pass is enabled, so we need to check services directly in Tomcat.
# Secure HTTP is done at the Apache Level, so https://<server>:<8080> won't work.
# That's the reason why we are using http
check_services () {
    local IS_EVERYTHING_OK=0

    echo "Hold your horses. Waiting for the services to start, before we check them."
    sleep 30s # Waits 1 minutes

    echo "Checking ContentService..."
    ATTEMPT=1
    while true;
    do
        # DO NOT CHANGE TO HTTPS
        STATUS=`curl -X GET -w "%{http_code}" --silent --output /dev/null "http://localhost:8080/ContentService/data/database/version" -H "accept: text/plain"`
        if [[ 200 != "${STATUS}" ]] && [[ "${ATTEMPT}" -le 3 ]]; then
            echo "Attempt ${ATTEMPT} / 3 => Could not query ContentService. Status is [${STATUS}]. It will automatically try again within 20s"
            let ATTEMPT=ATTEMPT+1
            sleep 20s;
        else
            if [[ 200 != "${STATUS}" ]]; then
                echo "ContentService might be taking long to start."
                IS_EVERYTHING_OK=1
            else
                echo "ContentService is OK"
                echo "Checking GraphDB version"
                # DO NOT CHANGE TO HTTPS
                DB_VERSION=`curl -X GET --silent "http://localhost:8080/ContentService/data/database/version" -H "accept: text/plain"`
                if [[ "${DB_VERSION}" != "${RELEASE_VERSION}" ]]; then
                    echo "[GraphDB] Graph Database hasn't been updated properly. Current [${DB_VERSION}] and Release version is [${RELEASE_VERSION}]"
                    IS_EVERYTHING_OK=1
                fi
                echo "OK. Version is correct"
            fi
            break;
        fi
    done

    echo "Checking Data Content > Details Page"
    ATTEMPT=1
    while true;
    do
        # DO NOT CHANGE TO HTTPS
        STATUS=`curl -X GET -w "%{http_code}" --silent --output /dev/null "http://localhost:8080/content/detail/R-HSA-199420" -H "accept: text/plain"`
        if [[ 200 != "${STATUS}" ] && [ "${ATTEMPT}" -le 3 ]]; then
            echo "Attempt ${ATTEMPT} / 3 => Could not query ContentService. Status is [${STATUS}]. It will automatically try again within 20s"
            let ATTEMPT=ATTEMPT+1
            sleep 20s;
        else
            if [[ 200 != "${STATUS}" ]]; then
                echo "DataContent might be taking long to start..."
                IS_EVERYTHING_OK=1
            fi;
            break;
        fi
    done

    echo "Checking AnalysisServices"
    ATTEMPT=1
    while true;
    do
        # DO NOT CHANGE TO HTTPS
        STATUS=`curl -X POST -w "%{http_code}" --silent --output /dev/null "http://localhost:8080/AnalysisService/identifiers/" -H "accept: application/json" -H "content-type: text/plain" -d "PTEN"`
        if [[ 200 != "${STATUS}" ]] && [[ "${ATTEMPT}" -le 3 ]]; then
            echo "Attempt ${ATTEMPT} / 3 => Could not query AnalysisService. Status is [${STATUS}]. It will automatically try again within 20s"
            let ATTEMPT=ATTEMPT+1
            sleep 20s;
        else
            if [[ 200 != "${STATUS}" ]]; then
                echo "AnalysisService might be taking long to start."
                IS_EVERYTHING_OK=1
            fi;
            break;
        fi
    done

    return ${IS_EVERYTHING_OK}
}

owners_and_permissions_serv () {
    declare -A dict_perm=( ["solr"]="solr:solr" ["neo4j"]="neo4j:adm" )
    for serv in "${!dict_perm[@]}"
    do
        DIR=${dict[${serv}]}
        PERM=${dict_perm[${serv}]}

        sudo -S chown -R ${PERM} ${DIR} &> /dev/null
        OUT=$?
        if [[ "$OUT" -ne 0 ]]; then
            echo "[WARN] [${serv}] - Couldn't change the owner of the folder [${DIR}] to [${PERM}]."
        fi
    done
}

owners_and_permissions_website () {
    OWNER="www-data:reactome"
    sudo chown -R ${OWNER} ${STATIC_DIR} &> /dev/null
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        echo "[WARN] - Couldn't change the owner of the folder [${DIR}] to [${PERM}]."
    fi

    sudo find ${STATIC_DIR} -type d -exec chmod 775 {} \; &> /dev/null
}

analysis () {
    ANALYSIS_BIN="analysis_v${RELEASE_VERSION}.bin"
    ANALYSIS_FULLNAME=${ANALYSIS_BIN_FOLDER}"/"${ANALYSIS_BIN}
    ANALYSIS_SYMLINK=${ANALYSIS_BIN_FOLDER}"/analysis.bin"

    echo "Updating analysis symlinks"
    unlink ${ANALYSIS_SYMLINK} ; ln -s ${ANALYSIS_FULLNAME} ${ANALYSIS_SYMLINK}
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        echo "[WARN] Could not symlink ${ANALYSIS_BIN} to analysis.bin. Check the server and probably address it manually."
    fi

    ALL_ANALYSIS="${ANALYSIS_BIN_FOLDER}/analysis*"
    PERM="tomcat7:reactome"
    echo "Updating analysis files owner:group to [${PERM}]"
    sudo chown -R ${PERM} ${ALL_ANALYSIS} &> /dev/null
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        echo "[WARN] [${ANALYSIS_BIN}] - Couldn't change the owner of the file [${ANALYSIS_BIN}] to [${PERM}]."
    fi

    echo "Updating analysis files permissions to [664]"
    CHMOD="664"
    sudo chmod -R ${CHMOD} ${ALL_ANALYSIS} &> /dev/null
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        echo "[WARN] [${ANALYSIS_BIN}] - Couldn't change the permission of the file [${ANALYSIS_BIN}] to [664]."
    fi
}

reload_apache () {
    echo "Reloading Apache"
    sudo service apache2 reload &> /dev/null
    if ps aux | grep -q apache2; then
        echo "Apache2 is running"
    else
        echo "Apache2 is NOT running"
    fi
}

# At this point download folder is already in th Destination Server
# We only need to update the 'current' symlink
update_download_folder () {
    echo "Creating 'current' symlink in the Download folder"
    unlink ${DOWNLOAD_HOME}/current ; ln -s ${DOWNLOAD_DIR} ${DOWNLOAD_HOME}/current
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        echo "[ERROR] Could not symlink download folder to current. Check the server and probably address it manually."
        exit
    fi
    echo "Download folder is done"

}

# Getting databases from ReactomeRelease and update them in the Destination Server
other_databases() {
    echo "Starting databases...";

    # ADD other databases in this dbs array
    dbs=( ${GK_CURRENT_DB} )

    for DB in "${dbs[@]}"
    do
        DUMP_FILE="/tmp/dump_$DB.sql"

        echo "Starting [${DB}]"

        echo " > Dumping [${DB}] from Reactome Release"
        export MYSQL_PWD=${MYSQL_PASSWD}
        ${MYSQL_DUMP} -u ${MYSQL_USER} ${DB} > ${DUMP_FILE}
        OUT=$?
        if [[ "$OUT" -ne 0 ]] || [[ ! -s ${DUMP_FILE} ]]; then
            echo "[ERROR] Could not DUMP [${DB}]"
            exit
        fi

        SIZE=$(du -sh ${DUMP_FILE} | cut -f1)
        echo " > Importing database [${DB}]. Dump size is [${SIZE}]"

        export MYSQL_PWD=${MYSQL_PASSWD}
        ${MYSQL} -u ${MYSQL_USER} ${DB} < ${DUMP_FILE}
        OUT=$?
        if [[ "$OUT" -ne 0 ]]; then
            echo "[ERROR] Could not IMPORT file [$DUMP_FILE] to the database [$DB]"
            exit
        fi

        echo "Database [${DB}] has been created"
    done

    echo "All databases have been created"
}

# Prepare the tgz in the source then transfer it to the destination. Perform md5sum check afterwards.
tar_download_folder_and_archive () {
    local begin_all=$(date +"%s")
    echo $""

    if [[ -f ${DOWNLOAD_HOME}/${PREVIOUS_RELEASE_VERSION}.tgz ]]; then
        echo "${PREVIOUS_RELEASE_VERSION}.tgz already exists. Removing it so a fresh one will be created..."
        rm ${DOWNLOAD_HOME}/${PREVIOUS_RELEASE_VERSION}.tgz
    fi

    echo "The folder [${DOWNLOAD_HOME}/${PREVIOUS_RELEASE_VERSION}] is being zipped. It might take a couple of minutes. Go grab a coffee and chill out..."
    echo "Compressing v${PREVIOUS_RELEASE_VERSION} folder."
    begin=$(date +"%s")
    tar -czvf ${DOWNLOAD_HOME}/${PREVIOUS_RELEASE_VERSION}.tgz -C ${DOWNLOAD_HOME} ${PREVIOUS_RELEASE_VERSION}
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        echo "[ERROR] Could not compress previous release version folder. Check the server and probably address it manually."
        exit 1
    fi

    difftimelps=$(($(date +"%s")-$begin))
    echo "Done! ${PREVIOUS_RELEASE_VERSION}.tgz has been created. Elapsed time: [$(($difftimelps / 60)) minutes and $(($difftimelps % 60)) seconds]"
}