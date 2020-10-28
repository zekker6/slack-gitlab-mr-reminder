# Save process env
env > /tmp/env

echo "$REMINDER_CRON_SCHEDULE root . /tmp/env; /usr/local/bin/node /opt/app/src/remind.js $REMINDER_CONFIG_PATH >> /var/log/cron.log 0>&1" >> /etc/cron.d/reminder

cron && tail -f /var/log/cron.log
