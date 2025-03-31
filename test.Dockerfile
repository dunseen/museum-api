FROM node:20.16.0-alpine

RUN apk add --no-cache bash
RUN npm i -g @nestjs/cli typescript ts-node

COPY package*.json /tmp/app/
RUN cd /tmp/app && npm install

COPY . /usr/src/app

COPY ./wait-for-it.sh /opt/wait-for-it.sh
RUN chmod +x /opt/wait-for-it.sh
COPY ./startup.test.sh /opt/startup.test.sh
RUN chmod +x /opt/startup.test.sh
RUN sed -i 's/\r//g' /opt/wait-for-it.sh
RUN sed -i 's/\r//g' /opt/startup.test.sh

WORKDIR /usr/src/app

RUN echo "" > .env

CMD ["/opt/startup.test.sh"]
