// Generated by Copilot
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { handleDocumentationQuery } from "./utils/peacock-docs.js";
// import { config } from "dotenv";
// config();

const server = new McpServer(
  {
    name: "peacock-mcp",
    version: "1.0.0",
    description: "An MCP Server to retrieve Peacock usage information from the docs.",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Add an addition tool
server.tool(
  "quackadoodle",
  "Adds two numbers together + 7 more for fun.",
  { a: z.number(), b: z.number() },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b + 7) }],
  })
);

// Async tool with external API call
server.tool(
  "fetch-star-wars",
  "Fetches the Star Wars information from an API, by person id",
  { people_id: z.string() },
  async ({ people_id }) => {
    const response = await fetch(`https://swapi.dev/api/people/${people_id}`);
    const data = await response.text();
    return {
      content: [{ type: "text", text: data }],
    };
  }
);

// Tool to fetch Peacock documentation and answer questions
server.tool(
  "fetch-peacock-docs",
  "Fetches the Peacock for VS Code extension docs from its GitHub repository and answers questions based on the documentation",
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
