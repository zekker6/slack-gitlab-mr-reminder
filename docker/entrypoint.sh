echo "$REMINDER_CRON_SCHEDULE root /opt/app/src/remind.js $REMINDER_CONFIG_PATH >> /var/log/cron.log 2>&1" >> /etc/cron.d/reminder

cron && tail -f /var/log/cron.log
