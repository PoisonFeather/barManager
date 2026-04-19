#!/bin/bash

# Define environment variables if not set
export PGPASSWORD=${POSTGRES_PASSWORD:-secret_password}
POSTGRES_USER=${POSTGRES_USER:-admin_boss}
POSTGRES_DB=${POSTGRES_DB:-bars_management}
POSTGRES_HOST=${POSTGRES_HOST:-localhost}
POSTGRES_PORT=${POSTGRES_PORT:-5432}

echo "Executing migration 002_bar_features_and_activity.sql on $POSTGRES_HOST..."

# Get the directory of this script so we can find the sql file relative to it
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SQL_FILE="$DIR/../docker/migrations/002_bar_features_and_activity.sql"

if command -v psql &> /dev/null; then
    psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -f "$SQL_FILE"
else
    echo "psql not found on host, attempting via docker exec..."
    cat "$SQL_FILE" | docker exec -i bars_database psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
fi

echo "Migration finished."
