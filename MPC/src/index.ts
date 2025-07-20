#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Sample MCP server implementation
const server = new McpServer({
  name: "mcp-sample-server",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
    prompts: {},
  },
});

// Helper function for logging (use stderr to avoid corrupting JSON-RPC)
function log(message: string) {
  console.error(`[MCP Server] ${message}`);
}

// Example tool: Echo tool that returns the input text
server.tool(
  "echo",
  "Echo the input text back to the user",
  {
    text: z.string().describe("The text to echo back"),
  },
  async ({ text }) => {
    log(`Echo tool called with: ${text}`);
    return {
      content: [
        {
          type: "text",
          text: `Echo: ${text}`,
        },
      ],
    };
  }
);

// Example tool: Current time
server.tool(
  "get_current_time",
  "Get the current date and time",
  {},
  async () => {
    const now = new Date();
    log(`Current time requested`);
    return {
      content: [
        {
          type: "text",
          text: `Current date and time: ${now.toISOString()}`,
        },
      ],
    };
  }
);

// Example tool: Random number generator
server.tool(
  "random_number",
  "Generate a random number between min and max (inclusive)",
  {
    min: z.number().optional().default(1).describe("Minimum value (default: 1)"),
    max: z.number().optional().default(100).describe("Maximum value (default: 100)"),
  },
  async ({ min, max }) => {
    if (min > max) {
      throw new Error("Minimum value cannot be greater than maximum value");
    }
    
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    log(`Random number generated: ${randomNum} (range: ${min}-${max})`);
    
    return {
      content: [
        {
          type: "text",
          text: `Random number between ${min} and ${max}: ${randomNum}`,
        },
      ],
    };
  }
);

// Example resource: Server information
server.resource(
  "server://info",
  "Information about this MCP server",
  async () => ({
    contents: [
      {
        uri: "server://info",
        text: JSON.stringify({
          name: "MCP Sample Server",
          version: "1.0.0",
          description: "A sample Model Context Protocol server implementation",
          tools: ["echo", "get_current_time", "random_number"],
          timestamp: new Date().toISOString(),
        }, null, 2),
        mimeType: "application/json",
      },
    ],
  })
);

// Example prompt: Greeting prompt
server.prompt(
  "greeting",
  "Generate a friendly greeting message",
  {
    name: z.string().optional().describe("Name of the person to greet"),
  },
  async ({ name }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: name 
            ? `Generate a friendly, personalized greeting for ${name}. Make it warm and welcoming.`
            : "Generate a friendly, general greeting message. Make it warm and welcoming.",
        },
      },
    ],
  })
);

// Main function to start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  log("MCP Sample Server running on stdio");
}

// Error handling
process.on("unhandledRejection", (error: unknown) => {
  console.error("Unhandled promise rejection:", error);
  process.exit(1);
});

process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

// Start the server
main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
