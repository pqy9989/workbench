(() => {
  class FormInput extends HTMLElement {
    connectedCallback() {
      if (this.control) return;
      const label = document.createElement('label');
      label.className = 'form-input';
      const caption = document.createElement('span');
      caption.className = 'form-input__label';
      caption.textContent = this.getAttribute('label') || '';
      const control = document.createElement(this.hasAttribute('multiline') ? 'textarea' : 'input');
      control.className = 'form-input__control';
      if (control.tagName === 'INPUT') control.type = 'text';
      control.value = this.getAttribute('value') || '';
      control.placeholder = this.getAttribute('placeholder') || '';
      control.name = this.getAttribute('name') || '';
      control.disabled = this.hasAttribute('disabled');
      control.readOnly = this.hasAttribute('readonly');
      control.setAttribute('aria-label', this.getAttribute('label') || this.getAttribute('aria-label') || '输入内容');
      if (caption.textContent) label.append(caption);
      label.append(control);
      this.append(label);
      this.control = control;
      control.addEventListener('input', () => this.dispatchEvent(new CustomEvent('value-change', {bubbles:true, detail:{name:control.name,value:control.value}})));
    }
    get value() { return this.control?.value ?? this.getAttribute('value') ?? ''; }
    set value(value) { if(this.control) this.control.value=value; else this.setAttribute('value',value); }
  }
  if (!customElements.get('form-input')) customElements.define('form-input', FormInput);
})();
