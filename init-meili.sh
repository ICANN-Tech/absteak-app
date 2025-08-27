#!/bin/bash
set -e

MEILI_HOST="http://meilisearch:7700"
MASTER_KEY="7nTizih1X4yDPk0DWp4QuhRPReTbzIZs"
INDEX_UID="agent_support_chatbot_knowledge"

# Tunggu MeiliSearch ready
until curl -s -H "X-Meili-API-Key: $MASTER_KEY" "$MEILI_HOST/health" | grep -q '"status":"available"'; do
  echo "Waiting for MeiliSearch..."
  sleep 2
done

# Cek jika index ada
INDEX_EXIST=$(curl -s -H "X-Meili-API-Key: $MASTER_KEY" "$MEILI_HOST/indexes" | grep "$INDEX_UID" || true)

if [ -z "$INDEX_EXIST" ]; then
  echo "Creating index $INDEX_UID..."
  curl -X POST "$MEILI_HOST/indexes" \
       -H "Content-Type: application/json" \
       -H "X-Meili-API-Key: $MASTER_KEY" \
       -d "{\"uid\": \"$INDEX_UID\", \"primaryKey\": \"id\"}"
else
  echo "Index $INDEX_UID already exists."
fi

# Jalankan Flowise
exec "$@"
