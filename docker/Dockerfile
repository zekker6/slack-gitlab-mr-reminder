FROM node:12-slim

ENV REMINDER_CRON_SCHEDULE='* * * * *'
ENV REMINDER_CONFIG_PATH='/opt/config.yml'

RUN apt-get update && apt-get -y install cron

RUN touch /var/log/cron.log

COPY docker/entrypoint.sh /
COPY docker/remind /usr/local/bin

RUN chmod +x /entrypoint.sh
RUN chmod +x /usr/local/bin/remind

WORKDIR /opt/app

COPY . /opt/app

RUN npm ci

CMD /entrypoint.sh