# Copilot Instructions for MCP Server Project

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is an MCP (Model Context Protocol) server project built with TypeScript. 

## Key Guidelines:

1. **MCP Server Development**: This project implements an MCP server that can provide tools, resources, and prompts to AI models.

2. **SDK Usage**: Use the `@modelcontextprotocol/sdk` for all MCP-related functionality.

3. **Logging**: For STDIO-based servers, never write to stdout. Use console.error() or proper logging libraries that write to stderr.

4. **Schema Validation**: Use Zod for input validation and schema definition.

5. **Documentation**: You can find more info and examples at https://modelcontextprotocol.io/llms-full.txt

## Project Structure:
- `src/` - TypeScript source files
- `build/` - Compiled JavaScript output
- `.vscode/mcp.json` - MCP server configuration for VS Code

## Example Tools:
The server should implement tools that can be called by AI models, such as:
- File operations
- API calls
- Data processing
- External service integrations

Remember to follow MCP best practices and ensure proper error handling.
