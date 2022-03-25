FROM alpine:3.15
WORKDIR /app
CMD [ "geth", "attach", "http://$NETWORK_URL:$NETWORK_PORT" ]

RUN apk --no-cache add nodejs npm git geth python3 make g++ && \
    npm i -g npm && \
    npm i -g truffle && \
    apk del python3 make g++

COPY package*.json ./
RUN apk --no-cache add python3 make g++ && \
    npm i && \
    apk del python3 make g++

COPY . .
