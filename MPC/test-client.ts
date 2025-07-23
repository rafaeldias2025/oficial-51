#!/usr/bin/env node

/**
 * Simple test client for the MCP server
 * This demonstrates how to interact with the server programmatically
 */

import { spawn } from 'child_process';

class MCPTestClient {
  private server: any;
  private requestId = 1;

  constructor() {
    this.server = spawn('node', ['build/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    this.server.stderr.on('data', (data: Buffer) => {
      console.error('Server log:', data.toString());
    });
  }

  private async sendRequest(method: string, params: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = {
        jsonrpc: '2.0',
        id: this.requestId++,
        method,
        params,
      };

      this.server.stdout.once('data', (data: Buffer) => {
        try {
          const response = JSON.parse(data.toString());
          if (response.error) {
            reject(new Error(response.error.message));
          } else {
            resolve(response.result);
          }
        } catch (err) {
          reject(err);
        }
      });

      this.server.stdin.write(JSON.stringify(request) + '\n');
    });
  }

  async initialize() {
    const result = await this.sendRequest('initialize', {
      protocolVersion: '1.0.0',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0',
      },
    });
    console.log('Initialize result:', JSON.stringify(result, null, 2));
    return result;
  }

  async listTools() {
    const result = await this.sendRequest('tools/list');
    console.log('Available tools:', JSON.stringify(result, null, 2));
    return result;
  }

  async callTool(name: string, args: any = {}) {
    const result = await this.sendRequest('tools/call', {
      name,
      arguments: args,
    });
    console.log(`Tool ${name} result:`, JSON.stringify(result, null, 2));
    return result;
  }

  async listResources() {
    const result = await this.sendRequest('resources/list');
    console.log('Available resources:', JSON.stringify(result, null, 2));
    return result;
  }

  async readResource(uri: string) {
    const result = await this.sendRequest('resources/read', { uri });
    console.log(`Resource ${uri} content:`, JSON.stringify(result, null, 2));
    return result;
  }

  async listPrompts() {
    const result = await this.sendRequest('prompts/list');
    console.log('Available prompts:', JSON.stringify(result, null, 2));
    return result;
  }

  async close() {
    this.server.kill();
  }
}

async function main() {
  const client = new MCPTestClient();

  try {
    // Initialize the connection
    await client.initialize();

    // List and call tools
    await client.listTools();
    await client.callTool('echo', { text: 'Hello, MCP!' });
    await client.callTool('get_current_time');
    await client.callTool('random_number', { min: 1, max: 10 });

    // List and read resources
    await client.listResources();
    await client.readResource('server://info');

    // List prompts
    await client.listPrompts();

  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
