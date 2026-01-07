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
    echo '          static_dir=[DEFAULT: /usr/local/reactomes/Reactome/production/Website/static]'
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
        privatekey)           PRIVATE_KEY=${VALUE} ;;

        complete_reload)      COMPLETE_RELOAD="complete-reload" ;;
        stop_only)            STOP_ONLY="stop-only" ;;
        start_only)           START_ONLY="start-only" ;;
        remove_proxy_pass)    REMOVE_PP="remove-pp" ;;
        help)                 HELP="help-me" ;;
        *)
    esac
done

########### VARIABLES ###########
DIR="/usr/local/reactomes/Reactome/production/Website/scripts"
STATIC_DIR="/usr/local/reactomes/Reactome/production/Website/static"

# server
DEV_SERVER="dev.reactome.org"
RELEASE_SERVER="release.reactome.org"
PRD1_SERVER="reactome.org"

# services
TOMCAT_PROCESS="tomcat7"
SOLR_PROCESS="solr"
NEO4J_PROCESS="neo4j"

# apache
APACHE_HOME="/etc/apache2"
REACTOME_APACHE_CONF="001-reactome.conf"
REACTOME_APACHE_CONF_PP="001-reactome-proxypass.conf"

PRIVATE_KEY="/home/shared/.ssh/shared.pem"
SHARED_USER="shared"
PASSPHRASE="" # do not push this script if the passphrase is written down here

SYNC_TOOL="sudo ${DIR}/sync_tool.sh";

if [[ "${HELP}" == "help-me" ]]; then
    print_help
fi

if [[ "${DESTINATION_SERVER}" = "" ]]; then
    echo "Missing destination server [DEV|PROD]"
    usage
fi

SERVER=""
if [[ "${DESTINATION_SERVER}" == "PROD" ]]; then
    SERVER=${PRD1_SERVER}
elif [[ "${DESTINATION_SERVER}" == "DEV" ]]; then
    SERVER=${DEV_SERVER}
else
    echo $"Invalid destination server. Please provide DEV or PROD"
    exit;
fi

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

reload_apache () {
    sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) ssh -i ${PRIVATE_KEY} -qn -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${SHARED_USER}@${SERVER} "${SYNC_TOOL} RELOAD_APACHE"
    OUT=$?
    if [[ "$OUT" -ne 0 ]]; then
        exit;
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

# At this point proxy pass is enabled, so we need to check services directly in Tomcat.
# Secure HTTP is done at the Apache Level, so https://<server>:<8080> won't work.
# That's the reason why we are using http
check_services () {
   sshpass -P passphrase -f <(printf '%s\n' ${PASSPHRASE}) ssh -i ${PRIVATE_KEY} -qn -o StrictHostKeyChecking=no -o LogLevel=quiet -o UserKnownHostsFile=/dev/null -t ${SHARED_USER}@${SERVER} "${SYNC_TOOL} CHECKSERV release_version=${RELEASE_VERSION}"
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

# KEY FUNCTION
complete_reload () {
    ask_passphrase

    proxy_pass_to_release
    remove_notice_banner
    reload_apache
    stop_services
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
        echo "Once you address the issue, run 'sudo ./$(basename "$0") remove_proxy_pass'"
    fi
}

# KEY FUNCTION
proxy_and_stop () {
    ask_passphrase

    proxy_pass_to_release
    remove_notice_banner
    reload_apache
    stop_services
}

# KEY FUNCTION
remove_proxy_and_start () {
    ask_passphrase

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
        echo "Once you address the issue, run 'sudo ./$(basename "$0") remove_proxy_pass'"
    fi
}

if [[ "${COMPLETE_RELOAD}" == "complete-reload" ]]; then
    complete_reload
elif [[ "${STOP_ONLY}" == "stop-only" ]]; then
    proxy_and_stop
elif [[ "${START_ONLY}" == "start-only" ]]; then
    remove_proxy_and_start
elif [[ "${REMOVE_PP}" == "remove-pp" ]]; then
    ask_passphrase
    remove_proxy_pass
    add_notice_banner
    reload_apache
else
    usage
fi