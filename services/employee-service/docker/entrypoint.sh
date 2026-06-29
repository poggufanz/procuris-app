#!/bin/sh
set -e

if [ "${DB_CONNECTION:-mysql}" = "mysql" ]; then
  echo "waiting for db ${DB_HOST}:${DB_PORT} ..."
  until php -r 'exit((int) ! @fsockopen(getenv("DB_HOST"), (int) getenv("DB_PORT")));' 2>/dev/null; do
    sleep 2
  done
fi

php artisan migrate --force

exec "$@"
