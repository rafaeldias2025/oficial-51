# MCP Server Development Guide

## Quick Start

1. **Install dependencies**: `npm install`
2. **Build the project**: `npm run build`
3. **Run the server**: `npm start`
4. **Quick setup**: `./start.sh`

## Development Workflow

### Building and Running
```bash
# Development mode (build + run)
npm run dev

# Watch mode (rebuild on changes)
npm run watch

# Production build
npm run build

# Clean build artifacts
npm run clean
```

### Debugging in VS Code

1. **Use the built-in debugger**: Press F5 or use the "Debug MCP Server" configuration
2. **Set breakpoints**: Click in the gutter next to line numbers in TypeScript files
3. **Debug console**: View logs and inspect variables in the debug console

### Testing

#### Using the Test Client
```bash
npm run test-client
```

#### Using Claude Desktop
Add this configuration to your `claude_desktop_config.json`:
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

#### Using VS Code MCP Extensions
The project includes `.vscode/mcp.json` configuration that allows VS Code to automatically detect and use this MCP server in Agent mode.

## Project Structure

```
├── src/
│   └── index.ts          # Main MCP server implementation
├── build/                # Compiled JavaScript output
├── .vscode/
│   ├── mcp.json         # VS Code MCP server configuration
│   ├── tasks.json       # VS Code build tasks
│   └── launch.json      # VS Code debug configurations
├── package.json         # Node.js project configuration
├── tsconfig.json        # TypeScript configuration
├── test-client.ts       # Test client for the MCP server
├── start.sh            # Quick start script
└── README.md           # Main documentation
```

## MCP Server Implementation

### Tools
- **echo**: Simple echo tool for testing
- **get_current_time**: Returns current timestamp
- **random_number**: Generates random numbers

### Resources
- **server://info**: Server metadata and information

### Prompts
- **greeting**: Generate personalized greeting messages

## Extending the Server

### Adding New Tools
```typescript
server.tool(
  "tool_name",
  "Tool description",
  {
    // Zod schema for input validation
    param1: z.string().describe("Parameter description"),
    param2: z.number().optional().describe("Optional parameter"),
  },
  async ({ param1, param2 }) => {
    // Tool implementation
    return {
      content: [
        {
          type: "text",
          text: "Tool response",
        },
      ],
    };
  }
);
```

### Adding New Resources
```typescript
server.resource(
  "resource://name",
  "Resource description",
  async () => ({
    contents: [
      {
        uri: "resource://name",
        text: "Resource content",
        mimeType: "text/plain",
      },
    ],
  })
);
```

### Adding New Prompts
```typescript
server.prompt(
  "prompt_name",
  "Prompt description",
  {
    // Zod schema for prompt parameters
    param: z.string().optional().describe("Prompt parameter"),
  },
  async ({ param }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: "Prompt template with " + param,
        },
      },
    ],
  })
);
```

## Best Practices

1. **Logging**: Always use `console.error()` for logging in STDIO servers to avoid corrupting JSON-RPC messages
2. **Error Handling**: Implement proper error handling for all tools and resources
3. **Input Validation**: Use Zod schemas for robust input validation
4. **Documentation**: Document all tools, resources, and prompts with clear descriptions
5. **Testing**: Use the test client to verify functionality before integrating with AI models

## Troubleshooting

### Common Issues

1. **Server not starting**: Check TypeScript compilation errors with `npm run build`
2. **JSON-RPC errors**: Ensure no `console.log()` statements in the server code
3. **Tools not working**: Verify Zod schemas match the expected input format
4. **VS Code integration issues**: Check the `.vscode/mcp.json` file paths

### Debug Output
The server logs to stderr, which you can view in:
- VS Code integrated terminal
- Claude Desktop logs (if using Claude Desktop)
- Terminal when running manually

## Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [VS Code MCP Integration](https://code.visualstudio.com/docs/copilot/chat/mcp-servers)
