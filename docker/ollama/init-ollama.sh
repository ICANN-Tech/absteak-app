#!/bin/bash

# Set Ollama host
OLLAMA_API_URL="http://${OLLAMA_HOST:-ollama:11434}"

# Wait for Ollama service to be ready
echo "Waiting for Ollama service to start at ${OLLAMA_API_URL}..."
while ! curl -f "${OLLAMA_API_URL}/api/tags" >/dev/null 2>&1; do
    echo "Ollama not ready yet, waiting..."
    sleep 5
done

echo "Ollama service is ready!"

# Set OLLAMA_HOST for ollama CLI
export OLLAMA_HOST="${OLLAMA_HOST:-ollama:11434}"

# Pull the mxbai-embed-large model
echo "Pulling mxbai-embed-large model..."
ollama pull mxbai-embed-large

if [ $? -eq 0 ]; then
    echo "Successfully pulled mxbai-embed-large model"
else
    echo "Failed to pull mxbai-embed-large model"
    exit 1
fi

# List available models to verify
echo "Available models:"
ollama list

echo "Ollama initialization completed!"