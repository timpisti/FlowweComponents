const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const { reloadBrowser } = require('./utils');

function watchComponent(componentName, wss) {
  const componentDir = path.join(process.cwd(), 'components', componentName);
  const htmlFile = path.join(componentDir, `${componentName}.html`);
  const cssFile = path.join(componentDir, `${componentName}.css`);

  chokidar.watch(htmlFile).on('change', () => {
    console.log(`${componentName}.html changed. Updating CSS...`);
    updateCSS(componentName, wss);
  });
}

async function updateCSS(componentName, wss) {
  const componentDir = path.join(process.cwd(), 'components', componentName);
  const htmlFile = path.join(componentDir, `${componentName}.html`);
  const cssFile = path.join(componentDir, `${componentName}.css`);

  const htmlContent = fs.readFileSync(htmlFile, 'utf-8');

  const tailwindConfig = {
    content: [htmlFile],
    corePlugins: { preflight: false },
  };

  const result = await postcss([
    tailwindcss(tailwindConfig)
  ]).process(`@tailwind components; @tailwind utilities;`, {
    from: undefined,
  });

  fs.writeFileSync(cssFile, result.css);
  console.log(`${componentName}.css updated.`);
  reloadBrowser(wss);
}

module.exports = { watchComponent, updateCSS };