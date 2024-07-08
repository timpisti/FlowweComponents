#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const { watchComponent } = require('./watch');
const { generateIndexHtml, openInBrowser } = require('./utils');

program
  .version('1.0.0')
  .description('FlowweComponents CLI');

program
  .command('new <componentName>')
  .description('Create a new component')
  .option('-t, --template <templateName>', 'Template to use', 'default')
  .option('-w, --watch', 'Start watching the component after creation')
  .action((componentName, options) => {
    createComponent(componentName, options.template);
    if (options.watch) {
      const wss = openInBrowser(generateIndexHtml(componentName));
      watchComponent(componentName, wss);
    }
  });

program
  .command('watch <componentName>')
  .description('Watch a component for changes and update CSS')
  .action((componentName) => {
    const wss = openInBrowser(generateIndexHtml(componentName));
    watchComponent(componentName, wss);
  });

program
  .command('start <componentName>')
  .description('Start development server for an existing component')
  .action((componentName) => {
    startDevelopmentServer(componentName);
  });


function createComponent(componentName, templateName) {
  const formattedComponentName = `flowwejs-${componentName.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`;
  const componentDir = path.join(process.cwd(), 'components', componentName);
  
  if (fs.existsSync(componentDir)) {
    console.error(`Component ${componentName} already exists.`);
    return;
  }

  fs.mkdirSync(componentDir, { recursive: true });

  // Create HTML file
  const htmlContent = `<div class="p-4 bg-gray-100 rounded-lg shadow">
  <h2 class="text-xl font-bold mb-2">New ${componentName} component</h2>
  <p class="text-gray-600">Edit this template in ${componentName}.html</p>
</div>`;
  fs.writeFileSync(path.join(componentDir, `${componentName}.html`), htmlContent);

  // Create CSS file
  fs.writeFileSync(path.join(componentDir, `${componentName}.css`), '');

  // Create JavaScript file from template
  const jsContent = getTemplateContent(templateName, componentName, formattedComponentName);
  fs.writeFileSync(path.join(componentDir, `${componentName}.js`), jsContent);

  console.log(`Component ${componentName} created successfully in the components directory.`);
}

function getTemplateContent(templateName, componentName, formattedComponentName) {
  const templatesDir = path.join(__dirname, 'templates');
  const templatePath = path.join(templatesDir, `${templateName}.js`);

  if (!fs.existsSync(templatePath)) {
    console.warn(`Template ${templateName} not found. Using default template.`);
    templateName = 'default';
  }

  let templateContent = fs.readFileSync(path.join(templatesDir, `${templateName}.js`), 'utf-8');
  
  // Replace placeholders in the template
  templateContent = templateContent.replace(/\[ComponentName\]/g, componentName);
  templateContent = templateContent.replace(/\[FormattedComponentName\]/g, formattedComponentName);
  templateContent = templateContent.replace(/\[ClassName\]/g, `Flowwejs${componentName.charAt(0).toUpperCase() + componentName.slice(1)}`);

  return templateContent;
}

function startDevelopmentServer(componentName) {
  const componentDir = path.join(process.cwd(), 'components', componentName);
  
  if (!fs.existsSync(componentDir)) {
    console.error(`Component ${componentName} does not exist. Please create it first using the 'new' command.`);
    return;
  }

  const indexPath = generateIndexHtml(componentName);
  const wss = openInBrowser(indexPath);
  watchComponent(componentName, wss);
}

program.parse(process.argv);