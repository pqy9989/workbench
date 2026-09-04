class TaskPageHeader extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "true";
    const title = this.getAttribute("title") || "采集任务列表";
    const action = this.getAttribute("action");
    this.innerHTML = `<header class="task-page-header"><h1>${title}</h1>${action ? `<button class="task-page-header__action" type="button">${action}</button>` : ""}</header>`;
    this.querySelector(".task-page-header__action")?.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("header-action", { bubbles: true }));
    });
  }
}
customElements.define("task-page-header", TaskPageHeader);
