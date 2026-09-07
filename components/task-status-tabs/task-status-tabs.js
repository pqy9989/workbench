class TaskStatusTabs extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    const process = this.getAttribute('variant') === 'process';
    const items = process ? [['settings','设置'],['recent','最近运行']] : [['pool','任务池'],['todo','待办项']];
    this.innerHTML = `<div class="task-status-tabs" role="tablist">${items.map(([value,label])=>`<button type="button" role="tab" data-value="${value}">${label}</button>`).join('')}</div>`;
    this.setActive(this.getAttribute("active") || items[0][0], false);
    this.addEventListener("click", event => { const button=event.target.closest("button[data-value]"); if(button) this.setActive(button.dataset.value,true); });
  }
  setActive(value, emit) {
    this.setAttribute("active",value);
    this.querySelectorAll("button[data-value]").forEach(button=>{const selected=button.dataset.value===value;button.classList.toggle("is-active",selected);button.setAttribute("aria-selected",String(selected));button.tabIndex=selected?0:-1;});
    if(emit)this.dispatchEvent(new CustomEvent("tab-change",{bubbles:true,detail:{value}}));
  }
}
customElements.define("task-status-tabs",TaskStatusTabs);
