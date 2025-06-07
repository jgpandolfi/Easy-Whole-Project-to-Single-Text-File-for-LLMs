#!/bin/bash

# Build script for Easy Whole Project to Single Text File for LLMs extension

echo "Building Easy Whole Project to Single Text File for LLMs extension..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Compile TypeScript
echo "Compiling TypeScript..."
npm run compile

# Run linting
echo "Running ESLint..."
npm run lint

echo "Build completed successfully!"

# Optional: Package extension
# echo "Packaging extension..."
# npm run package
