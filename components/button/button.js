(() => {
  // Button components share this entry point; process-actions is the workflow button group.
  const assets = new URL('../../pages/process-editor/assets/', document.currentScript.src);
  class ProcessActions extends HTMLElement {
    connectedCallback() {
      if (this.querySelector('.process-actions')) return;
      const actions = [['parameters','流程参数','parameters-icon.svg'],['save','保存','save-icon.svg'],['publish','发布','publish-icon.svg'],['history','历史','history-icon.svg']];
      this.innerHTML = `<div class="process-actions" role="group" aria-label="流程操作">${actions.map(([action,label,icon]) => `<button type="button" class="process-actions__button${action==='publish'?' process-actions__button--primary':''}${action==='history'?' process-actions__button--icon':''}" data-process-action="${action}" aria-label="${label}" title="${label}"><img src="${new URL(icon,assets)}" alt="">${action==='history'?'':label}</button>`).join('')}</div>`;
      this.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('process-action', {bubbles:true, detail:{action:button.dataset.processAction}}));
      }));
    }
  }
  if (!customElements.get('process-actions')) customElements.define('process-actions', ProcessActions);
  class TextButton extends HTMLElement {
    static get observedAttributes() { return ['variant', 'disabled', 'icon']; }
    connectedCallback() {
      if (this.button) return;
      const label = this.textContent.trim() || '按钮';
      this.button = document.createElement('button');
      this.button.type = 'button';
      this.button.textContent = label;
      this.replaceChildren(this.button);
      this.attributeChangedCallback();
    }
    attributeChangedCallback() {
      if (!this.button) return;
      const variant = ['primary', 'secondary', 'outline', 'text', 'danger'].includes(this.getAttribute('variant')) ? this.getAttribute('variant') : 'outline';
      this.button.className = `text-button text-button--${variant}`;
      this.button.disabled = this.hasAttribute('disabled');
      this.button.querySelector('svg')?.remove();
      const icons = {
        save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12l4 4v12a2 2 0 0 1-2 2Z"/><path d="M7 3v6h10V3M7 21v-8h10v8"/>',
        plus: '<path d="M12 5v14M5 12h14"/>',
        close: '<path d="m6 6 12 12M18 6 6 18"/>',
        eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
        delete: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/>'
      };
      const icon = icons[this.getAttribute('icon')];
      if (icon) this.button.insertAdjacentHTML('afterbegin', `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icon}</svg>`);
    }
  }
  if (!customElements.get('text-button')) customElements.define('text-button', TextButton);
})();
