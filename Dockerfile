# https://github.com/mhart/alpine-node
FROM mhart/alpine-node:5.5.0

ENV DIR=/opt/justinr1234 PORT=3000

COPY package.json ${DIR}/

# Installs (and removes) python and build deps for source builds, ex. node-sass.
# Removing in the same instruction reduces image size bloat.
RUN apk add --update python python-dev build-base && \
  echo "# SUPPRESS WARNING" > ${DIR}/README.md && \
  cd ${DIR} && npm install && \
  apk del python python-dev build-base && \
  rm -rf /etc/ssl /usr/share/man /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

COPY . $DIR

WORKDIR $DIR

EXPOSE $PORT

ENTRYPOINT ["npm"]

CMD ["start"]
