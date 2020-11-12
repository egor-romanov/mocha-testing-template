FROM node:lts-alpine

LABEL authors "<egor.romanov@gmail.com>"

COPY . ./tests

WORKDIR /tests

RUN yarn install --frozen-lockfile
ENV ADMIN_URL=localhost:8080

ENTRYPOINT ["/bin/sh", "/tests/entrypoint.sh"]
