FROM node:18-slim@sha256:d900c28d8cbb51cee5473215e5941b6334d9b02da75ef60f490d4c0c13160bb1

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