# rubber-duck-mcp

## Running rubber-duck-mcp locally
1. clone repo `git@github.com:kencanak/rubber-duck-mcp.git`
2. rename `.mcp.json.sample` > `.mcp.json`, then copy it to your respective project folder. which ever project that you want to use this mcp server with

    * update the path of the mcp server

    ```json
    {
      "mcpServers": {
        "rubber-duck": {
          "command": "bash",
          "args": ["-c", "./run.sh"],
          "cwd": "[PATH TO LOCAL MCP SERVER]"
        }
      }
    }
    ```
3. start claude in vscode, but before that, make sure you are running node 24. at least node 16 and above
4. [video ref](https://github.com/kencanak/rubber-duck-mcp/raw/refs/heads/main/docs-assets/running-rubber-duck-mcp.mov)
