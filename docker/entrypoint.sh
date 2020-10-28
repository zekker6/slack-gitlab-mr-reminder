#!/bin/bash

set -ex
# Save process env
(env | grep -E 'GITLAB|SLACK' | grep -v REMINDER_CRON_SCHEDULE | tr '\r\n' ' ') > /tmp/env

echo "$REMINDER_CRON_SCHEDULE root (`env | grep -E 'GITLAB|SLACK' | grep -v REMINDER_CRON_SCHEDULE | tr '\r\n' ' '`  /usr/local/bin/node /opt/app/src/remind.js $REMINDER_CONFIG_PATH ) > /proc/1/fd/1 2>/proc/1/fd/2" >> /etc/cron.d/reminder

chmod 0644 /etc/cron.d/reminder
crontab /etc/cron.d/reminder

cron -f 
