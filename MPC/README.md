# MCP Sample Server

This is a Model Context Protocol (MCP) server implementation built with TypeScript. It provides example tools, resources, and prompts that can be used by AI models through the MCP protocol.

## Features

### Tools
- **echo**: Echo text back to the user
- **get_current_time**: Get the current date and time
- **random_number**: Generate a random number within a specified range

### Resources
- **server://info**: Get information about this MCP server

### Prompts
- **greeting**: Generate a friendly greeting message

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Run the server:
   ```bash
   npm start
   ```

## Development

- **Build**: `npm run build`
- **Dev mode**: `npm run dev` (builds and runs)
- **Start**: `npm start` (runs pre-built version)

## VS Code Integration

This project includes a `.vscode/mcp.json` configuration file that allows VS Code to use this MCP server in Agent mode. The server will be automatically detected when VS Code loads this workspace.

## Testing with Claude Desktop

To test this server with Claude Desktop, add the following configuration to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mcp-sample-server": {
      "command": "node",
      "args": ["/absolute/path/to/this/project/build/index.js"]
    }
  }
}
```

## Architecture

The server uses the `@modelcontextprotocol/sdk` to implement:
- STDIO transport for communication
- Zod schemas for input validation
- Error handling and logging to stderr
- Type-safe tool implementations

## Important Notes

- This server uses STDIO transport, so it writes logs to stderr to avoid corrupting JSON-RPC messages
- All tools include proper error handling and input validation
- The server follows MCP best practices for tool registration and resource management

## Learn More

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP SDK for TypeScript](https://github.com/modelcontextprotocol/typescript-sdk)
- [VS Code MCP Integration](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)
