#!/bin/bash
set -e
pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v /docker-entrypoint-initdb.d/tool03.sql
