#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { handleDocumentationQuery } from "./utils/peacock-docs.js";
import { getPeacockInstructions } from "./utils/instructions.js";
import { z } from "zod";

const instructions = getPeacockInstructions();

const server = new McpServer(
  {
    name: "peacock-mcp",
    version: "1.1.15",
    description: "An MCP Server to retrieve Peacock usage information from the docs.",
  },
  {
    capabilities: {
      tools: {},
    },
    instructions,
  }
);

// Tool to fetch Peacock documentation and answer questions
server.tool(
  "fetch-peacock-docs",
  "Fetches the Peacock for VS Code extension docs from its GitHub repository and answers questions based on the documentation  ",
  { query: z.string().describe("The question to answer based on the Peacock documentation") },
  async ({ query }) => {
    try {
      const { text } = await handleDocumentationQuery(query);
      return {
        content: [{ type: "text", text }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error searching Peacock documentation: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Peacock MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
