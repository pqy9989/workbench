(() => {
  const scriptUrl = document.currentScript?.src || "";
  const assetBase = new URL("./assets/", scriptUrl).href;

  class PlatformSidebar extends HTMLElement {
    connectedCallback() {
      if (this.dataset.rendered === "true") return;

      this.innerHTML = `
        <div class="platform-sidebar" data-component="platform-sidebar" aria-label="平台侧边导航">
          <div class="platform-sidebar__brand">
            <div class="platform-sidebar__logo">
              <img src="${assetBase}quanta-logo.png" alt="Quanta logo" />
            </div>
            <div class="platform-sidebar__brand-name">Quanta</div>
          </div>

          <nav class="platform-sidebar__nav" aria-label="平台导航">
            <button class="platform-sidebar__item" type="button" title="任务处理">
              <span class="platform-sidebar__icon">
                <img src="${assetBase}icon-task-list.svg" alt="" />
              </span>
              <span class="platform-sidebar__label">任务处理</span>
            </button>

            <button class="platform-sidebar__item" type="button" title="分配管理">
              <span class="platform-sidebar__icon">
                <img src="${assetBase}icon-assignment.svg" alt="" />
              </span>
              <span class="platform-sidebar__label">分配管理</span>
            </button>

            <span class="platform-sidebar__divider" aria-hidden="true"></span>

            <button class="platform-sidebar__item platform-sidebar__item--active" type="button" title="标注工作台" aria-current="page">
              <span class="platform-sidebar__icon">
                <img src="${assetBase}icon-annotation.svg" alt="" />
              </span>
              <span class="platform-sidebar__label">标注工作台</span>
            </button>

            <span class="platform-sidebar__divider" aria-hidden="true"></span>

            <button class="platform-sidebar__item" type="button" title="流程管理">
              <span class="platform-sidebar__icon">
                <img src="${assetBase}icon-workflow.svg" alt="" />
              </span>
              <span class="platform-sidebar__label">流程管理</span>
            </button>

            <button class="platform-sidebar__item" type="button" title="算子管理">
              <span class="platform-sidebar__icon"><img src="${assetBase}icon-operator.svg" alt="" /></span>
              <span class="platform-sidebar__label">算子管理</span>
            </button>

            <span class="platform-sidebar__divider" aria-hidden="true"></span>

            <button class="platform-sidebar__item" type="button" title="规则管理">
              <span class="platform-sidebar__icon"><img src="${assetBase}icon-rules.svg" alt="" /></span>
              <span class="platform-sidebar__label">规则管理</span>
            </button>

            <button class="platform-sidebar__item" type="button" title="工作台管理">
              <span class="platform-sidebar__icon"><img src="${assetBase}icon-workbench.svg" alt="" /></span>
              <span class="platform-sidebar__label">工作台管理</span>
            </button>

            <span class="platform-sidebar__divider" aria-hidden="true"></span>

            <button class="platform-sidebar__item" type="button" title="权限管理">
              <span class="platform-sidebar__icon"><img src="${assetBase}icon-users.svg" alt="" /></span>
              <span class="platform-sidebar__label">权限管理</span>
            </button>

            <button class="platform-sidebar__item" type="button" title="供应商管理">
              <span class="platform-sidebar__icon"><img src="${assetBase}icon-store.svg" alt="" /></span>
              <span class="platform-sidebar__label">供应商管理</span>
            </button>

            <button class="platform-sidebar__item" type="button" title="权限管理">
              <span class="platform-sidebar__icon"><img src="${assetBase}icon-shield.svg" alt="" /></span>
              <span class="platform-sidebar__label">权限管理</span>
            </button>
          </nav>
        </div>
      `;
      this.dataset.rendered = "true";
    }
  }

  if (!customElements.get("platform-sidebar")) {
    customElements.define("platform-sidebar", PlatformSidebar);
  }
})();
