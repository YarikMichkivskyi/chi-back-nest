#!/bin/bash

echo "Waiting for Postgres to be ready..."
until nc -z -v -w30 db 5432; do
  echo "Waiting for database connection..."
  sleep 1
done
echo "Postgres is ready!"

echo "Running migrations..."
npm run typeorm:migration:run

echo "Starting the application..."
exec "$@"