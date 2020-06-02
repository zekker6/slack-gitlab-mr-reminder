FROM node:11

ENV REMINDER_CRON_SCHEDULE='* * * * *'
ENV REMINDER_CONFIG_PATH='/opt/config.yml'

RUN apt-get update && apt-get -y install cron

RUN touch /var/log/cron.log

COPY docker/entrypoint.sh /

RUN chmod +x /entrypoint.sh

WORKDIR /opt/app

COPY . /opt/app

RUN npm ci

CMD /entrypoint.sh