<div align="center">
# Peacock MCP Server

[![Open project in GitHub Codespaces](https://img.shields.io/badge/Codespaces-Open-blue?style=flat-square&logo=github)](https://codespaces.new/johnpapa/peacock-mcp?hide_repo_select=true&ref=main&quickstart=true)
[![smithery badge](https://smithery.ai/badge/@johnpapa/peacock-mcp)](https://smithery.ai/server/@johnpapa/peacock-mcp)![Node version](https://img.shields.io/badge/Node.js->=20-3c873a?style=flat-square)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[![Install with NPM in VS Code](https://img.shields.io/badge/VS_Code-NPM-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode:mcp/install?%7B%22name%22%3A%22peacock-mcp%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40johnpapa%2Fpeacock-mcp%22%5D%2C%22env%22%3A%7B%7D%2C%22inputs%22%3A%5B%5D%7D) [![Install with NPM in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-NPM-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders:mcp/install?%7B%22name%22%3A%22peacock-mcp%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40johnpapa%2Fpeacock-mcp%22%5D%2C%22env%22%3A%7B%7D%2C%22inputs%22%3A%5B%5D%7D)

[![Install with Docker in VS Code](https://img.shields.io/badge/VS_Code-Docker-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode:mcp/install?%7B%22name%22%3A%22peacock-mcp%22%2C%22command%22%3A%22docker%22%2C%22args%22%3A%5B%22run%22%2C%22-i%22%2C%22--rm%22%2C%22mcp%2Fpeacock-mcp%22%5D%2C%22env%22%3A%7B%7D%2C%22inputs%22%3A%5B%5D%7D) [![Install with Docker in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Docker-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders:mcp/install?%7B%22name%22%3A%22peacock-mcp%22%2C%22command%22%3A%22docker%22%2C%22args%22%3A%5B%22run%22%2C%22-i%22%2C%22--rm%22%2C%22mcp%2Fpeacock-mcp%22%5D%2C%22env%22%3A%7B%7D%2C%22inputs%22%3A%5B%5D%7D)

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

### VS Code Manual Installation

> **Note**: For quick installation, click the install buttons at the top of this README.

#### Using VS Code Settings

To manually install the Peacock MCP server in VS Code, follow these steps:

1. Open VS Code Settings (JSON) by pressing `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux) and searching for "Preferences: Open User Settings (JSON)"
2. Add the following JSON to your settings file:

```json
{
  "mcp": {
    "servers": {
      "peacock-mcp": {
        "command": "npx",
        "args": ["-y", "@johnpapa/peacock-mcp"],
        "env": {}
      }
    }
  },
  "chat.mcp.discovery.enabled": true
}
```

#### Using CLI Commands

For VS Code Stable:

```bash
code --add-mcp '{"name":"peacock-mcp","command":"npx","args":["-y","@johnpapa/peacock-mcp"],"env":{}}'
```

For VS Code Insiders:

```bash
code-insiders --add-mcp '{"name":"peacock-mcp","command":"npx","args":["-y","@johnpapa/peacock-mcp"],"env":{}}'
```

### Installing via Smithery

To install Peacock MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@johnpapa/peacock-mcp):

```bash
npx -y @smithery/cli install @johnpapa/peacock-mcp --client claude
```

### Run the MCP Server Locally with MCP Inspector

If you'd like to run MCP Inspector locally to test the server, follow these steps:

1. Clone this repository:

   ```bash
   git clone https://github.com/johnpapa/peacock-mcp
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

### Using Tools in GitHub Copilot

1. Now that the mcp server is discoverable, open GitHub Copilot and select the `Agent` mode (not `Chat` or `Edits`).
2. Select the "refresh" button in the Copilot chat text field to refresh the server list.
3. Select the "🛠️" button to see all the possible tools, including the ones from this repo.
4. Put a question in the chat that would naturally invoke one of the tools, for example:

   ```
   How do I set my VS Code accent colors?
   ```

   > **Note**: If you see "Sorry, the response was filtered by the Responsible AI Service. Please rephrase your prompt and try again.", try running it again or rephrasing the prompt.
