FROM node:20

ARG DIR
ARG TZ
WORKDIR /usr/src/app

COPY . /usr/src/app

WORKDIR /usr/src/app/${DIR}

RUN npm install

RUN npm run build

ENV BACKEND_URL ${BACKEND_URL}

ENV TZ=${TZ}
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

VOLUME /usr/src/app