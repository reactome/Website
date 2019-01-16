#!/bin/bash

#-------------------------------------------------------------------------------------------------------
#
# Panic Button
#
# 1) Complete Reload: Proxy to reactomerelease, simply perform a reload in all services in production
# 2) Stop only: Proxy to Rel
# 3) start everything, remove proxy
#
# Guilherme Viteri  - gviteri@ebi.ac.uk
# January, 2018
#
#-------------------------------------------------------------------------------------------------------

if [[ $(id -u) -ne 0 ]] ; then echo "Please run as sudo." ; exit 1 ; fi

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd ${DIR};

print_help () {
    echo $""
    echo "##################################################################"
    echo "############################ Panic ###############################"
    echo $""
    echo " > Perform complete reload in Production. Also proxy to Release."
    echo "    e.g sudo ./$(basename "$0") destination_server=PROD complete_reload"
    echo " > ProxyPass and stop to analyse logs or maintenance"
    echo "    e.g sudo ./$(basename "$0") destination_server=PROD stop_only"
    echo " > Remove ProxyPass and start all again"
    echo "    e.g sudo ./$(basename "$0") destination_server=PROD start_only"
    echo $""
    echo "##################################################################"
    exit
}

usage () {
    _SCRIPT=$(basename "$0")
    echo "Usage: sudo ./$_SCRIPT arguments... <command> [commands: complete_reload, stop_only, start_only, help]"
    echo '          destination_server=<DEV|PROD> *** [MANDATORY] ***'
    echo '          static_dir=[DEFAULT: /usr/local/reactomes/Reactome/production/Website/static] ** if using different one, it must have configuration.php'
    echo ''
    echo '          complete_reload [Perform complete reload in Production]'
    echo '          stop_only [ProxyPass and stop to analyse logs or maintenance]'
    echo '          start_only [Remove ProxyPass and start all again]'
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
        destination_server)   DESTINATION_SERVER=${VALUE} ;;
        complete_reload)      COMPLETE_RELOAD="complete-reload" ;;
        stop_only)            STOP_ONLY="stop-only" ;;
        start_only)           START_ONLY="start-only" ;;
        remove_proxy_pass)    REMOVE_PP="remove-pp" ;;
        help)                 HELP="help-me" ;;
        *)
    esac
done

########### VARIABLES ###########
STATIC_DIR="/usr/local/reactomes/Reactome/production/Website/static"

DESTINATION_SERVER_USER=""
DESTINATION_SERVER_PASSWD=""

# server
DEV_SERVER="reactomedev.oicr.on.ca"
RELEASE_SERVER="reactomerelease.oicr.on.ca"
PRD1_SERVER="reactomeprd1.oicr.on.ca"

# services
TOMCAT_PROCESS="tomcat7"
SOLR_PROCESS="solr"
NEO4J_PROCESS="neo4j"

# apache
APACHE_HOME="/etc/apache2"
REACTOME_APACHE_CONF="001-reactome.conf"
REACTOME_APACHE_CONF_PP="001-reactome-proxypass.conf"

if [ "${HELP}" == "help-me" ]; then
    print_help
fi

if  [ "${DESTINATION_SERVER}" = "" ]; then
    echo "Missing destination server [DEV|PROD]"
    usage
fi

if [ "${DESTINATION_SERVER}" == "PROD" ]
then
    SERVER=${PRD1_SERVER}
elif [ "${DESTINATION_SERVER}" == "DEV" ]
then
    SERVER=${DEV_SERVER}
else
    echo $"Invalid destination server. Please provide DEV or PROD"
    exit;
fi

proxy_pass_to_release (){
    echo "Proxying [${SERVER}] to Reactome Release";

    SITES_AVAILABLE=${APACHE_HOME}"/sites-available"
    SITES_ENABLED=${APACHE_HOME}"/sites-enabled"

    UNLINK="sudo -S a2dissite ${REACTOME_APACHE_CONF}"
    LINK="sudo -S a2ensite ${REACTOME_APACHE_CONF_PP}"

    sshpass -p ${DESTINATION_SERVER_PASSWD} ssh -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${DESTINATION_SERVER_USER}@${SERVER} "echo ${DESTINATION_SERVER_PASSWD} | ${UNLINK} &> /dev/null"
    OUT=$?
    if [ "$OUT" -ne 0 ]; then
        echo "[WARN] Could not a2dissite [${REACTOME_APACHE_CONF}]."
    fi

    sshpass -p ${DESTINATION_SERVER_PASSWD} ssh -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${DESTINATION_SERVER_USER}@${SERVER} "echo ${DESTINATION_SERVER_PASSWD} | ${LINK} &> /dev/null"
    OUT=$?
    if [ "$OUT" -ne 0 ]; then
        echo "[ERROR] Could not proxy to release while trying to 'a2ensite' [${REACTOME_APACHE_CONF_PP}]. Please check the folders [${SITES_AVAILABLE}] and [${SITES_ENABLED}] in [${SERVER}]"
        exit 1
    fi

    echo "The server [${SERVER}] is now proxying to Reactome Release"
}

remove_proxy_pass (){
    echo "Removing ProxyPass in [${SERVER}]";

    SITES_AVAILABLE=${APACHE_HOME}"/sites-available"
    SITES_ENABLED=${APACHE_HOME}"/sites-enabled"

    UNLINK="sudo -S a2dissite ${REACTOME_APACHE_CONF_PP}"
    LINK="sudo -S a2ensite ${REACTOME_APACHE_CONF}"

    sshpass -p ${DESTINATION_SERVER_PASSWD} ssh -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${DESTINATION_SERVER_USER}@${SERVER} "echo ${DESTINATION_SERVER_PASSWD} | ${UNLINK} &> /dev/null"
    OUT=$?
    if [ "$OUT" -ne 0 ]; then
        echo "[WARN] Could not unlink the file [${REACTOME_APACHE_CONF_PP}]. File is not linked."
    fi

    sshpass -p ${DESTINATION_SERVER_PASSWD} ssh -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${DESTINATION_SERVER_USER}@${SERVER} "echo ${DESTINATION_SERVER_PASSWD} | ${LINK} &> /dev/null"
    OUT=$?
    if [ "$OUT" -ne 0 ]; then
        echo "[ERROR] Could not a2ensite [${REACTOME_APACHE_CONF}]. Please check the folders [${SITES_AVAILABLE}] and [${SITES_ENABLED}] in [${SERVER}]"
        exit 1
    fi

    echo "ProxyPass has been removed"
}

start_services () {
    echo "Starting services..."
    echo "Starting solR"
    sshpass -p ${DESTINATION_SERVER_PASSWD} ssh -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${DESTINATION_SERVER_USER}@${SERVER} "echo ${DESTINATION_SERVER_PASSWD} | sudo -S service solr start &> /dev/null"
    check_started ${SOLR_PROCESS}
    echo "Starting Neo4j"
    sshpass -p ${DESTINATION_SERVER_PASSWD} ssh -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${DESTINATION_SERVER_USER}@${SERVER} "echo ${DESTINATION_SERVER_PASSWD} | sudo -S service neo4j start &> /dev/null"
    check_started ${NEO4J_PROCESS}
    echo "Starting Tomcat"
    sshpass -p ${DESTINATION_SERVER_PASSWD} ssh -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${DESTINATION_SERVER_USER}@${SERVER} "echo ${DESTINATION_SERVER_PASSWD} | sudo -S /etc/init.d/tomcat7 start &> /dev/null"
    check_started ${TOMCAT_PROCESS}
    echo "Services have been started"
}

stop_services () {
    echo "Stopping services..."
    echo "Stopping Tomcat"
    sshpass -p ${DESTINATION_SERVER_PASSWD} ssh -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${DESTINATION_SERVER_USER}@${SERVER} "echo ${DESTINATION_SERVER_PASSWD} | sudo -S /etc/init.d/tomcat7 stop &> /dev/null"
    check_stopped ${TOMCAT_PROCESS}
    echo "Stopping SolR"
    sshpass -p ${DESTINATION_SERVER_PASSWD} ssh -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${DESTINATION_SERVER_USER}@${SERVER} "echo ${DESTINATION_SERVER_PASSWD} | sudo -S service solr stop &> /dev/null"
    check_stopped ${SOLR_PROCESS}
    echo "Stopping Neo4j"
    sshpass -p ${DESTINATION_SERVER_PASSWD} ssh -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${DESTINATION_SERVER_USER}@${SERVER} "echo ${DESTINATION_SERVER_PASSWD} | sudo -S service neo4j stop &> /dev/null"
    check_stopped ${NEO4J_PROCESS}
    echo "Services have been stopped"
}

# check_started <argument>, checks if the given service has started
check_started () {
    if sshpass -p ${DESTINATION_SERVER_PASSWD} ssh -qn -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${DESTINATION_SERVER_USER}@${SERVER} ps aux | grep -q $1; then
        echo "$1 has been STARTED"
    else
        echo "$1 hasn't been STARTED properly"
        exit 1
    fi
}

# check_started <argument>, checks if the given service has stopped
check_stopped () {
    if sshpass -p ${DESTINATION_SERVER_PASSWD} ssh -qn -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${DESTINATION_SERVER_USER}@${SERVER} ps aux | grep -q $1; then
        echo "$1 hasn't been STOPPED properly"
        exit 1
    else
        echo "$1 has been STOPPED"
    fi
}

reload_apache () {
    echo "Reloading Apache"
    sshpass -p ${DESTINATION_SERVER_PASSWD} ssh -qn -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${DESTINATION_SERVER_USER}@${SERVER} "echo ${DESTINATION_SERVER_PASSWD} | sudo -S /etc/init.d/apache2 reload &> /dev/null"
    if sshpass -p ${DESTINATION_SERVER_PASSWD} ssh -qn -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${DESTINATION_SERVER_USER}@${SERVER} ps aux | grep -q apache2; then
        echo "Apache2 is running"
    else
        echo "Apache2 is NOT running"
        exit 1
    fi
}

remove_notice_banner () {
    sed -i -e '/show_notice_mod =/ s/= .*/= \'"'"'0\'"';"'/' ${STATIC_DIR}/configuration.php
    sed -i -e 's/\r$//g' ${STATIC_DIR}/configuration.php
}

add_notice_banner () {
    sed -i -e '/show_notice_mod =/ s/= .*/= \'"'"'1\'"';"'/' ${STATIC_DIR}/configuration.php
    sed -i -e 's/\r$//g' ${STATIC_DIR}/configuration.php
}

countdown() {
  secs=59
  while [ ${secs} -ge 0 ]
  do
      sleep 1 &
      printf "\rStarting services... 00:00:%02d" $((secs%60))
      secs=$(( $secs - 1 ))
      wait
  done
  echo
}

# At this point proxy pass is enabled, so we need to check services directly in Tomcat.
# Secure HTTP is done at the Apache Level, so https://<server>:<8080> won't work.
# That's the reason why we are using http
check_services () {
    local IS_EVERYTHING_OK=0

    echo "Hold your horses. Waiting for the services to start, before we check them."

    countdown # countdown 1 minutes

    echo "Checking ContentService..."
    ATTEMPT=1
    while true;
    do
        # DO NOT CHANGE TO HTTPS
        STATUS=`curl -X GET -w "%{http_code}" --silent --output /dev/null "http://${SERVER}:8080/ContentService/data/database/version" -H "accept: text/plain"`
        if [ 200 != "${STATUS}" ] && [ "${ATTEMPT}" -le 3 ]; then
            echo "Attempt ${ATTEMPT} / 3 => Could not query ContentService. Status is [${STATUS}]. It will automatically try again within 20s"
            let ATTEMPT=ATTEMPT+1
            sleep 20s;
        else
            if [ 200 != "${STATUS}" ]; then
                echo "ContentService might be taking long to start."
                IS_EVERYTHING_OK=1
            else
                echo "ContentService is OK"
            fi
            break
        fi
    done

    echo "Checking Data Content > Details Page"
    ATTEMPT=1
    while true;
    do
        # DO NOT CHANGE TO HTTPS
        STATUS=`curl -X GET -w "%{http_code}" --silent --output /dev/null "http://${SERVER}:8080/content/detail/R-HSA-199420" -H "accept: text/plain"`
        if [ 200 != "${STATUS}" ] && [ "${ATTEMPT}" -le 3 ]; then
            echo "Attempt ${ATTEMPT} / 3 => Could not query ContentService. Status is [${STATUS}]. It will automatically try again within 20s"
            let ATTEMPT=ATTEMPT+1
            sleep 20s;
        else
            if [ 200 != "${STATUS}" ]; then
                echo "DataContent might be taking long to start..."
                IS_EVERYTHING_OK=1
            else
                echo "DataContent is OK"
            fi
            break
        fi
    done

    echo "Checking AnalysisService"
    ATTEMPT=1
    while true;
    do
        # DO NOT CHANGE TO HTTPS
        STATUS=`curl -X POST -w "%{http_code}" --silent --output /dev/null "http://${SERVER}:8080/AnalysisService/identifiers/" -H "accept: application/json" -H "content-type: text/plain" -d "PTEN"`
        if [ 200 != "${STATUS}" ] && [ "${ATTEMPT}" -le 3 ]; then
            echo "Attempt ${ATTEMPT} / 3 => Could not query AnalysisService. Status is [${STATUS}]. It will automatically try again within 20s"
            let ATTEMPT=ATTEMPT+1
            sleep 20s;
        else
            if [ 200 != "${STATUS}" ]; then
                echo "AnalysisService might be taking long to start."
                IS_EVERYTHING_OK=1
            else
                echo "AnalysisService is OK"
            fi
            break
        fi
    done

    return ${IS_EVERYTHING_OK}
}

# Read credentials for Destination Server
ask_destination_credentials () {
    while true; do
        read -r -p "Type your user @ ${SERVER} > " DESTINATION_SERVER_USER
        read -s -p "Type your password ${DESTINATION_SERVER_USER}@${SERVER} > " DESTINATION_SERVER_PASSWD
        validate_destination_credentials
        if [ "$?" -eq 0 ]; then
            break
        fi
    done
}

# This method also checks if the user has sudo access in the destination. Can't continue if not sudoers.
validate_destination_credentials () {
    echo $""
    echo "Validating [${SERVER}] credentials..."
    hash sshpass 2>/dev/null || { echo >&2 "sshpass is required. Please install it in this server. sudo apt-get install sshpass"; exit 1; }
    sshpass -p ${DESTINATION_SERVER_PASSWD} ssh -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t -q ${DESTINATION_SERVER_USER}@${SERVER} exit
    local OUT=$?
    if [ "$OUT" -ne 0 ]; then
        echo "[ERROR] Can't connect to REMOTE server [${SERVER}]. Please type a valid OS user [${DESTINATION_SERVER_USER}] and password"
    else
        sshpass -p ${DESTINATION_SERVER_PASSWD} ssh -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${DESTINATION_SERVER_USER}@${SERVER} "echo ${DESTINATION_SERVER_PASSWD} | sudo -S id -u &> /dev/null"
        if [ $? -ne 0 ]; then
            echo "[ERROR] sudo access is required in the server [${SERVER}]. Make sure you are sudoer before executing again."
            exit
        fi
    fi
    return ${OUT}
}

# KEY FUNCTION
complete_reload () {
    ask_destination_credentials

    proxy_pass_to_release
    remove_notice_banner
    reload_apache
    stop_services
    start_services
    check_services
    if [ "$?" -eq 0 ]; then
        echo "Services have been checked and all of them seems to be running. Ready to remove the ProxyPass!"
        remove_proxy_pass
        add_notice_banner
        reload_apache
    else
        echo "## READ THOSE LINES CAREFULLY ##"
        echo "Some services are not running properly and the ProxyPass still points to ${RELEASE_SERVER}"
        echo "Once you address the issue, run 'sudo ./$(basename "$0") remove_proxy_pass'"
    fi
}

# KEY FUNCTION
proxy_and_stop () {
    ask_destination_credentials

    proxy_pass_to_release
    remove_notice_banner
    reload_apache
    stop_services
}

# KEY FUNCTION
remove_proxy_and_start () {
    ask_destination_credentials

    start_services
    check_services
    if [ "$?" -eq 0 ]; then
        echo "Services have been checked and all of them seems to be running. Ready to remove the ProxyPass!"
        remove_proxy_pass
        add_notice_banner
        reload_apache
    else
        echo "## READ THOSE LINES CAREFULLY ##"
        echo "Some services are not running properly and the ProxyPass still points to ${RELEASE_SERVER}"
        echo "Once you address the issue, run 'sudo ./$(basename "$0") remove_proxy_pass'"
    fi
}

if [ "${COMPLETE_RELOAD}" == "complete-reload" ]; then
    complete_reload
elif [ "${STOP_ONLY}" == "stop-only" ]; then
    proxy_and_stop
elif [ "${START_ONLY}" == "start-only" ]; then
    remove_proxy_and_start
elif [ "${REMOVE_PP}" == "remove-pp" ]; then
    ask_destination_credentials
    remove_proxy_pass
    add_notice_banner
    reload_apache
else
    usage
fi