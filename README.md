# FlowweComponents

FlowweComponents is a CLI tool for creating and managing custom HTML components with Tailwind CSS integration. It provides a streamlined workflow for developing, previewing, and iterating on web components used (mostly) in Flowwe JS.

## Features

- Create custom HTML components with integrated JavaScript and CSS
- Automatic Tailwind CSS compilation based on used classes
- Live preview with hot reloading
- Component templates for quick start
- Development server for easy testing and iteration

## Installation

1. Clone the repository:
```
   git clone https://github.com/yourusername/FlowweComponents.git
   
   cd FlowweComponents
```
3. Install dependecies
```
    npm install
```
4. Link the CLI tool globally:
```
    npm link
```
## Usage

### Creating a New Component

To create a new component:
```
flowwecomponent new <componentName> [options]
```

Options:
- `-t, --template <templateName>`: Specify a template to use (default: 'default')
- `-w, --watch`: Start watching the component after creation

Example:
```
flowwecomponent new my-button -w
```
This command will:
1. Create a new component named "my-button" in the `/components` directory
2. Start the development server
3. Open the component in your default browser
4. Watch for changes and automatically reload the browser

### Starting Development Server for Existing Component

To start the development server for an existing component:
```
flowwecomponent start my-button
```
## Component Structure

Each component consists of three main files:

1. `<componentName>.html`: The HTML structure of your component
2. `<componentName>.css`: The component's styles (auto-generated from Tailwind)
3. `<componentName>.js`: The JavaScript behavior of your component

The component is defined as a custom element that extends `HTMLElement`.

## Tailwind CSS Integration

Tailwind CSS classes used in your component's HTML are automatically extracted and compiled into the component's CSS file. This ensures that only the used styles are included, keeping your component's CSS lean and efficient.

## Templates

Component templates are stored in the `templates/` directory. You can create custom templates and use them with the `-t` option when creating a new component.

## Development Workflow

1. Create a new component using the `new` command
2. Edit the component files in your preferred code editor
3. View the component in the automatically opened browser window
4. Changes to the component files will trigger automatic reloading

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
