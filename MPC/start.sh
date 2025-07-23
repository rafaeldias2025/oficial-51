#!/bin/bash

# Quick start script for MCP server development

echo "🚀 Starting MCP Server Development Environment"
echo "=============================================="

# Build the project
echo "📦 Building TypeScript project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🔧 Available Commands:"
    echo "  npm start         - Run the MCP server"
    echo "  npm run dev       - Build and run in one step"
    echo "  npm run watch     - Watch for changes and rebuild"
    echo "  npm run clean     - Clean build directory"
    echo ""
    echo "📖 VS Code Integration:"
    echo "  The server is configured in .vscode/mcp.json"
    echo "  You can debug it using the VS Code MCP extensions"
    echo ""
    echo "🧪 Testing:"
    echo "  Use the test-client.ts for programmatic testing"
    echo "  Or integrate with Claude Desktop using the config below:"
    echo ""
    echo "📋 Claude Desktop Config:"
    echo '{
  "mcpServers": {
    "mcp-sample-server": {
      "command": "node",
      "args": ["'$(pwd)'/build/index.js"]
    }
  }
}'
    echo ""
    echo "🎯 Ready to develop! Your MCP server is built and ready to run."
else
    echo "❌ Build failed. Please check the TypeScript errors above."
    exit 1
fi
