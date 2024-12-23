#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails.
rm -f /myapp/tmp/pids/server.pid

# Check if the database exists, and if not, create and migrate it
if ! bundle exec rails db:exists; then
  echo "Database does not exist. Creating and migrating now..."
  bundle exec rails db:create
  bundle exec rails db:migrate
fi

# Then exec the container's main process (what's set as CMD in the Dockerfile).

exec "$@"
