FROM node:17-slim@sha256:a180966357fe14cac9dd6c9cd496ed4d85b8a598cb33482705ecebad646145e3

RUN apt-get update && apt-get -y install cron

RUN touch /var/log/cron.log

WORKDIR /opt/app
COPY package*.json /opt/app/
RUN npm ci

COPY docker/entrypoint.sh /
COPY docker/remind /usr/local/bin

RUN chmod +x /entrypoint.sh
RUN chmod +x /usr/local/bin/remind

COPY . /opt/app

ENV REMINDER_CRON_SCHEDULE='"* * * * *"'
ENV REMINDER_CONFIG_PATH='/opt/config.yml'

CMD /entrypoint.sh