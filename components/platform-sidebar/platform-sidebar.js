(() => {
  const scriptUrl = document.currentScript?.src || "";
  const assetBase = new URL("./assets/", scriptUrl).href;
  const COLLAPSED_WIDTH = 80;
  const EXPANDED_WIDTH = 230;
  const EXPANDED_THRESHOLD = 170;
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
          <button class="platform-sidebar__group-title" type="button" aria-expanded="true"><span>${label}</span><span class="platform-sidebar__group-chevron" aria-hidden="true"><img src="${assetBase}icon-sidebar-section-chevron.svg" alt="" /></span></button>
          <div class="platform-sidebar__group-items">${items.map(([itemLabel, icon, active]) => `
            <button class="platform-sidebar__item${active ? ' platform-sidebar__item--active' : ''}" type="button" title="${itemLabel}"${active ? ' aria-current="page"' : ''}>
              <span class="platform-sidebar__icon"><img src="${assetBase}${icon}" alt="" /></span><span class="platform-sidebar__label">${itemLabel}</span>
            </button>`).join('')}</div>
        </section>`).join('');

      this.innerHTML = `
        <aside class="platform-sidebar" data-component="platform-sidebar" data-expanded="true" aria-label="平台侧边导航">
          <div class="platform-sidebar__main">
            <div class="platform-sidebar__brand"><div class="platform-sidebar__logo"><img src="${assetBase}quanta-logo.png" alt="" /></div><div class="platform-sidebar__brand-name">Quanta</div></div>
            <button class="platform-sidebar__platform" type="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="platform-switcher-menu"><span class="platform-sidebar__platform-icon"><img src="${assetBase}icon-data-platform.svg" alt="" /></span><span class="platform-sidebar__platform-short">数</span><span class="platform-sidebar__platform-name">数据平台</span><span class="platform-sidebar__chevron" aria-hidden="true"><img src="${assetBase}icon-platform-select-chevron.svg" alt="" /></span></button>
            <nav class="platform-sidebar__nav" aria-label="平台导航">${groups}</nav>
          </div>
          <div class="platform-sidebar__platform-menu" id="platform-switcher-menu" role="listbox" aria-label="切换平台" hidden>
            <button class="platform-sidebar__platform-option is-selected" type="button" role="option" aria-selected="true" data-platform="数据平台"><span><img src="${assetBase}icon-data-platform.svg" alt="" /></span><b>数据平台</b></button>
            <button class="platform-sidebar__platform-option" type="button" role="option" aria-selected="false" data-platform="模型平台"><span><img src="${assetBase}icon-model-platform.svg" alt="" /></span><b>模型平台</b></button>
            <button class="platform-sidebar__platform-option" type="button" role="option" aria-selected="false" data-platform="应用编排平台"><span><img src="${assetBase}icon-orchestrate-platform.svg" alt="" /></span><b>应用编排平台</b></button>
            <button class="platform-sidebar__platform-option" type="button" role="option" aria-selected="false" data-platform="设备管理平台"><span><img src="${assetBase}icon-device-platform.svg" alt="" /></span><b>设备管理平台</b></button>
          </div>
          <div class="platform-sidebar__footer"><span class="platform-sidebar__footer-divider" aria-hidden="true"></span><div class="platform-sidebar__profile"><span class="platform-sidebar__avatar" aria-hidden="true"></span><span class="platform-sidebar__username">Aria.Pei</span></div><div class="platform-sidebar__version" role="group" aria-label="版本切换"><button type="button">新</button><button class="is-active" type="button">旧</button></div></div>
          <div class="platform-sidebar__resize-handle" role="separator" aria-label="调整侧边栏宽度" aria-orientation="vertical" aria-valuemin="80" aria-valuemax="230" tabindex="0"></div>
        </aside>`;
      this.dataset.rendered = "true";
      this.sidebar = this.querySelector('.platform-sidebar');
      this.resizeHandle = this.querySelector('.platform-sidebar__resize-handle');
      this.platformButton = this.querySelector('.platform-sidebar__platform');
      this.platformMenu = this.querySelector('.platform-sidebar__platform-menu');
      this.setWidth(EXPANDED_WIDTH);
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
        document.body?.classList.add('is-resizing-platform-sidebar');
        this.classList.add('is-resizing-host');
        this.sidebar.classList.add('is-resizing');
        this.resizeHandle.setPointerCapture(event.pointerId);
      });
      this.resizeHandle.addEventListener('pointermove', (event) => {
        if (this.resizeHandle.hasPointerCapture(event.pointerId)) this.setWidth(startWidth + event.clientX - startX);
      });
      const finish = (event) => {
        if (this.resizeHandle.hasPointerCapture(event.pointerId)) this.resizeHandle.releasePointerCapture(event.pointerId);
        document.body?.classList.remove('is-resizing-platform-sidebar');
        this.classList.remove('is-resizing-host');
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

      const setPlatformMenuOpen = (open) => {
        this.platformMenu.hidden = !open;
        this.platformButton.setAttribute('aria-expanded', String(open));
        this.sidebar.classList.toggle('is-platform-menu-open', open);
      };
      this.platformButton.addEventListener('click', (event) => {
        event.stopPropagation();
        setPlatformMenuOpen(this.platformMenu.hidden);
      });
      this.platformMenu.addEventListener('click', (event) => {
        const option = event.target.closest('.platform-sidebar__platform-option');
        if (!option) return;
        this.platformMenu.querySelectorAll('.platform-sidebar__platform-option').forEach((item) => {
          const selected = item === option;
          item.classList.toggle('is-selected', selected);
          item.setAttribute('aria-selected', String(selected));
        });
        this.platformButton.querySelector('.platform-sidebar__platform-short').textContent = option.dataset.platform.slice(0, 1);
        this.platformButton.querySelector('.platform-sidebar__platform-name').textContent = option.dataset.platform;
        setPlatformMenuOpen(false);
      });
      document.addEventListener('click', (event) => {
        if (!this.contains(event.target)) setPlatformMenuOpen(false);
      });
      document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || this.platformMenu.hidden) return;
        setPlatformMenuOpen(false);
        this.platformButton.focus();
      });
    }
  }
  if (!customElements.get("platform-sidebar")) customElements.define("platform-sidebar", PlatformSidebar);
})();
