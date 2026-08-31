(() => {
  const scriptUrl = document.currentScript?.src || "";
  const assetBase = new URL("./assets/", scriptUrl).href;
  const COLLAPSED_WIDTH = 70;
  const EXPANDED_WIDTH = 230;
  const EXPANDED_THRESHOLD = EXPANDED_WIDTH;
  const navGroups = [
    ["任务管理", [["任务处理", "icon-task-list.svg"], ["分配管理", "icon-assignment.svg"]]],
    ["工作台", [["标注工作台", "icon-annotation.svg", true]]],
    ["工作流", [["流程管理", "icon-workflow.svg"], ["算子管理", "icon-operator.svg"]]],
    ["配置管理", [["规则管理", "icon-rules.svg"], ["工作台管理", "icon-workbench.svg"]]],
    ["运营管理", [["用户组管理", "icon-users.svg"], ["供应商管理", "icon-store.svg"], ["权限管理", "icon-shield.svg"]]]
  ];

  class PlatformSidebar extends HTMLElement {
    connectedCallback() {
      if (this.dataset.rendered === "true") return;
      const groups = navGroups.map(([label, items], index) => `
        <section class="platform-sidebar__group">
          ${index ? '<span class="platform-sidebar__divider" aria-hidden="true"></span>' : ''}
          <button class="platform-sidebar__group-title" type="button" aria-expanded="true"><span>${label}</span><span aria-hidden="true">⌄</span></button>
          <div class="platform-sidebar__group-items">${items.map(([itemLabel, icon, active]) => `
            <button class="platform-sidebar__item${active ? ' platform-sidebar__item--active' : ''}" type="button" title="${itemLabel}"${active ? ' aria-current="page"' : ''}>
              <span class="platform-sidebar__icon"><img src="${assetBase}${icon}" alt="" /></span><span class="platform-sidebar__label">${itemLabel}</span>
            </button>`).join('')}</div>
        </section>`).join('');

      this.innerHTML = `
        <aside class="platform-sidebar" data-component="platform-sidebar" data-expanded="false" aria-label="平台侧边导航">
          <div class="platform-sidebar__main">
            <div class="platform-sidebar__brand"><div class="platform-sidebar__logo"><img src="${assetBase}quanta-logo.png" alt="" /></div><div class="platform-sidebar__brand-name">Quanta</div></div>
            <button class="platform-sidebar__platform" type="button" aria-haspopup="listbox" aria-expanded="false"><span class="platform-sidebar__platform-icon"><img src="${assetBase}icon-data-platform.svg" alt="" /></span><span class="platform-sidebar__platform-short">数</span><span class="platform-sidebar__platform-name">数据平台</span><span class="platform-sidebar__chevron" aria-hidden="true">⌄</span></button>
            <nav class="platform-sidebar__nav" aria-label="平台导航">${groups}</nav>
          </div>
          <div class="platform-sidebar__footer"><span class="platform-sidebar__footer-divider" aria-hidden="true"></span><div class="platform-sidebar__profile"><span class="platform-sidebar__avatar" aria-hidden="true"></span><span class="platform-sidebar__username">Aria.Pei</span></div><div class="platform-sidebar__version" role="group" aria-label="版本切换"><button type="button">新</button><button class="is-active" type="button">旧</button></div></div>
          <div class="platform-sidebar__resize-handle" role="separator" aria-label="调整侧边栏宽度" aria-orientation="vertical" aria-valuemin="70" aria-valuemax="230" tabindex="0"></div>
        </aside>`;
      this.dataset.rendered = "true";
      this.sidebar = this.querySelector('.platform-sidebar');
      this.resizeHandle = this.querySelector('.platform-sidebar__resize-handle');
      this.setWidth(COLLAPSED_WIDTH);
      this.setupInteractions();
    }

    setWidth(width) {
      const nextWidth = Math.max(COLLAPSED_WIDTH, Math.min(EXPANDED_WIDTH, Math.round(width)));
      const expanded = nextWidth >= EXPANDED_THRESHOLD;
      this.style.width = `${nextWidth}px`;
      this.sidebar.style.width = `${nextWidth}px`;
      this.sidebar.dataset.expanded = String(expanded);
      this.resizeHandle.setAttribute('aria-valuenow', String(nextWidth));
      document.documentElement.style.setProperty('--platform-sidebar-width', `${nextWidth}px`);
      this.dispatchEvent(new CustomEvent('platform-sidebar-resize', { bubbles: true, detail: { width: nextWidth, expanded } }));
    }

    setupInteractions() {
      let startX = 0;
      let startWidth = COLLAPSED_WIDTH;
      this.resizeHandle.addEventListener('pointerdown', (event) => {
        startX = event.clientX;
        startWidth = this.sidebar.getBoundingClientRect().width;
        this.sidebar.classList.add('is-resizing');
        this.resizeHandle.setPointerCapture(event.pointerId);
      });
      this.resizeHandle.addEventListener('pointermove', (event) => {
        if (this.resizeHandle.hasPointerCapture(event.pointerId)) this.setWidth(startWidth + event.clientX - startX);
      });
      const finish = (event) => {
        if (this.resizeHandle.hasPointerCapture(event.pointerId)) this.resizeHandle.releasePointerCapture(event.pointerId);
        this.sidebar.classList.remove('is-resizing');
      };
      this.resizeHandle.addEventListener('pointerup', finish);
      this.resizeHandle.addEventListener('pointercancel', finish);
      this.resizeHandle.addEventListener('dblclick', () => this.setWidth(this.sidebar.dataset.expanded === 'true' ? COLLAPSED_WIDTH : EXPANDED_WIDTH));
      this.resizeHandle.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        if (event.key === 'Home') return this.setWidth(COLLAPSED_WIDTH);
        if (event.key === 'End') return this.setWidth(EXPANDED_WIDTH);
        this.setWidth(this.sidebar.getBoundingClientRect().width + (event.key === 'ArrowRight' ? 10 : -10));
      });
      this.querySelectorAll('.platform-sidebar__group-title').forEach((button) => button.addEventListener('click', () => {
        const group = button.closest('.platform-sidebar__group');
        const collapsed = group.classList.toggle('is-collapsed');
        button.setAttribute('aria-expanded', String(!collapsed));
      }));
    }
  }
  if (!customElements.get("platform-sidebar")) customElements.define("platform-sidebar", PlatformSidebar);
})();
