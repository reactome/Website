#!/bin/bash

_JOOMLA_STATIC='/usr/local/reactomes/Reactome/production/Website/static'
sudo chown -R www-data:reactome ${_JOOMLA_STATIC}

sudo find ${_JOOMLA_STATIC} -type d -exec chmod 775 {} \; &> /dev/null