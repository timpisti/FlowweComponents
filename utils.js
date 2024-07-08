const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const express = require('express');
const WebSocket = require('ws');

function generateIndexHtml(componentName) {
  const formattedComponentName = `flowwejs-${componentName.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`;
  const indexPath = path.join(process.cwd(), 'components', componentName, 'index.html');
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${componentName} Component</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="${componentName}.js"></script>
    <script>
      // WebSocket connection will be initialized here
    </script>
</head>
<body class="p-4">
    <h1 class="text-2xl font-bold mb-4">Component: ${componentName}</h1>
    <hr class="my-4">
    <${formattedComponentName}></${formattedComponentName}>
</body>
</html>
  `;

  fs.writeFileSync(indexPath, htmlContent);
  return indexPath;
}

function openInBrowser(filePath) {
  const componentDir = path.dirname(filePath);
  const app = express();
  
  // Set up WebSocket server for live reloading
  const wss = new WebSocket.Server({ noServer: true });

  app.use((req, res, next) => {
    if (req.path === '/') {
      const content = fs.readFileSync(filePath, 'utf8');
      const injectedContent = content.replace(
        '// WebSocket connection will be initialized here',
        `
        (function() {
          const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
          const wsUrl = protocol + '//' + window.location.host + '/ws';
          const socket = new WebSocket(wsUrl);
          socket.onmessage = function(event) {
            if (event.data === 'reload') {
              location.reload();
            }
          };
        })();
        `
      );
      res.send(injectedContent);
    } else {
      next();
    }
  });

  app.use(express.static(componentDir));
  
  const server = app.listen(0, () => {
    const port = server.address().port;
    console.log(`Development server running on http://localhost:${port}`);
    const url = `http://localhost:${port}`;
    const command = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
    exec(`${command} ${url}`);
  });

  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  wss.on('connection', (ws) => {
    console.log('Browser connected');
  });

  return wss;
}

function reloadBrowser(wss) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send('reload');
    }
  });
}

module.exports = { generateIndexHtml, openInBrowser, reloadBrowser };