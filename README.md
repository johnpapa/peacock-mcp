<div align="center">
# Peacock MCP Server

[![Open project in GitHub Codespaces](https://img.shields.io/badge/Codespaces-Open-blue?style=flat-square&logo=github)](https://codespaces.new/johnpapa/peacock-mcp?hide_repo_select=true&ref=main&quickstart=true)
[![smithery badge](https://smithery.ai/badge/@johnpapa/peacock-mcp)](https://smithery.ai/server/@johnpapa/peacock-mcp)![Node version](https://img.shields.io/badge/Node.js->=20-3c873a?style=flat-square)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[Features](#features) • [Tools](#tools) • [Setup](#setup) • [Configuring an MCP Host](#configuring-an-mcp-host)

</div>

MCP Server for the [Peacock extension for VS Code](https://peacockcode.dev), coloring your world, one Code editor at a time. _The main goal of the project is to show how an MCP server can be used to interact with APIs._

> **Note**: All data used by this MCP server is fetched from the [official Peacock documentation](https://peacockcode.dev).

<a name="features"></a>

## 🔧 Features

- **Fetch Peacock docs**: Get detailed info on Peacock.

<a name="tools"></a>

## 🧰 Tools

### 1. `fetch_peacock_docs` 🔍🦸‍♂️

- **Description**: Fetches the Peacock for VS Code extension docs from its GitHub repository and answers questions based on the documentation
- **Input**:
  - `prompt` (query): The question about Peacock.
- **Returns**: Your answer!

<a name="setup"></a>

## 🛠️ Setup

[Install Peacock for VS Code HERE](https://marketplace.visualstudio.com/items?itemName=johnpapa.vscode-peacock&wt.mc_id=vscodepeacock-github-jopapa).

### Installing via Smithery

To install Peacock MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@johnpapa/peacock-mcp):

```bash
npx -y @smithery/cli install @johnpapa/peacock-mcp --client claude
```

### Run the MCP Server Locally with MCP Inspector

If you'd like to run MCP Inspector locally to test the server, follow these steps:

1. Clone this repository:

   ```bash
   git clone https://github.com/johnpapa/-peacock-mcp
   ```

1. Install the required dependencies and build the project.

   ```bash
   npm install
   npm run build
   ```

1. (Optional) To try out the server using MCP Inspector run the following command:

   ```bash
   # Start the MCP Inspector
   npx @modelcontextprotocol/inspector node build/index.js
   ```

   Visit the MCP Inspector URL shown in the console in your browser. Change `Arguments` to `dist/index.js` and select `Connect`. Select `List Tools` to see the available tools.

<a name="configuring-an-mcp-host"></a>

## Running the MCP Server hosted in GitHub Copilot with VS Code Insiders

> **Note**: If you already have the MCP server enabled with Claude Desktop, add `chat.mcp.discovery.enabled: true` in your VS Code settings and it will discover existing MCP server lists.

If you want to associate the MCP server with a specific repo, create a `.vscode/mcp.json` file with this content:

```json
{
  "inputs": [],
  "servers": {
    "peacock-mcp": {
      "command": "npx",
      // "command": "node",
      "args": [
        "-y",
        "@johnpapa/peacock-mcp"
        // "_git/peacock-mcp/dist/index.js"
      ],
      "env": {}
    }
  }
}
```

If you want to associate the MCP server with all repos, add the following to your VS Code User Settings JSON:

```json
"mcp": {
  "servers": {
    "peacock-mcp": {
      "command": "npx",
      // "command": "node",
      "args": [
        "-y",
        "@johnpapa/peacock-mcp"
        // "/Users/papa/_git/peacock-mcp/dist/index.js"
        // "_git/peacock-mcp/dist/index.js"
      ],
      "env": {}
    }
  }
}
"chat.mcp.discovery.enabled": true,
```

### Using Tools in GitHub Copilot

1. Now that the mcp server is discoverable, open GitHub Copilot and select the `Agent` mode (not `Chat` or `Edits`).
2. Select the "refresh" button in the Copilot chat text field to refresh the server list.
3. Select the "🛠️" button to see all the possible tools, including the ones from this repo.
4. Put a question in the chat that would naturally invoke one of the tools, for example:

   ```
   How do I set my VS Code accent colors?
   ```

   > **Note**: If you see "Sorry, the response was filtered by the Responsible AI Service. Please rephrase your prompt and try again.", try running it again or rephrasing the prompt.
