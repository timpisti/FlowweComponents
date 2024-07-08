class [ClassName] extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    try {
      const [htmlContent, cssContent] = await Promise.all([
        this.fetchHTML(),
        this.fetchCSS()
      ]);

      const template = document.createElement('template');
      template.innerHTML = htmlContent;

      const style = document.createElement('style');
      style.textContent = cssContent;

      this.shadowRoot.appendChild(style);
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    } catch (error) {
      console.error('Error loading component:', error);
    }
  }

  async fetchHTML() {
    const response = await fetch('./[ComponentName].html');
    return await response.text();
  }

  async fetchCSS() {
    const response = await fetch('./[ComponentName].css');
    return await response.text();
  }
}

customElements.define('[FormattedComponentName]', [ClassName]);