(() => {
  const scriptUrl = document.currentScript?.src || "";
  const assetBase = new URL("./assets/", scriptUrl).href;

  const defaults = {
    breadcrumbRoot: "任务列表",
    breadcrumbCurrent: "数据标注",
    taskId: "17782",
    taskName: "20260717_山东省临清市中周店村11号数据堂_UDASv22",
    serialNumber: "UDAS-0002-2983",
    collector: "328698",
    version: "第1版",
    standardText: "质检标准",
    currentNode: "动作质检",
    status: "待质检",
    label: "任务信息"
  };

  class TaskHeader extends HTMLElement {
    static get observedAttributes() {
      return [
        "data-variant",
        "aria-label",
        "breadcrumb-root",
        "breadcrumb-current",
        "task-id",
        "task-name",
        "serial-number",
        "collector",
        "version",
        "standard-text",
        "current-node",
        "status",
        "previous-node"
      ];
    }

    connectedCallback() {
      if (this.dataset.rendered !== "true") {
        this.render();
        this.dataset.rendered = "true";
      }
      this.syncAttributes();
      this.setupInfoPopover();
    }

    attributeChangedCallback() {
      if (this.dataset.rendered === "true") this.syncAttributes();
    }

    value(name, fallback) {
      return this.getAttribute(name) || fallback;
    }

    render() {
      this.innerHTML = `
        <section class="task-header" data-component="task-header">
          <div class="task-header__nav-row">
            <div class="task-header__breadcrumb" aria-label="当前位置">
              <span class="task-header__breadcrumb-root" data-task-header-field="breadcrumb-root"></span>
              <span class="task-header__breadcrumb-separator">/</span>
              <span class="task-header__breadcrumb-current" data-task-header-field="breadcrumb-current"></span>
            </div>
            <div class="task-header__theme-switch" role="group" aria-label="主题切换"><button class="task-header__theme-button task-header__theme-button--active" type="button" aria-label="深色主题"><img src="${assetBase}icon-moon.svg" alt="" /></button><button class="task-header__theme-button" type="button" aria-label="浅色主题"><img src="${assetBase}icon-sun.svg" alt="" /></button></div>
          </div>

          <div class="task-header__info-row">
            <div class="task-header__main-meta">
              <div class="task-header__meta-group"><span class="task-header__muted">任务ID</span><span class="task-header__text" data-task-header-field="task-id"></span><button class="task-header__info-button" type="button" aria-label="查看任务信息" aria-expanded="false"><img src="${assetBase}icon-info.svg" alt="" /></button></div>
              <span class="task-header__divider" aria-hidden="true"></span>
              <div class="task-header__meta-group task-header__task-name"><span class="task-header__muted">任务名称</span><span class="task-header__text task-header__ellipsis" data-task-header-field="task-name"></span></div>
              <span class="task-header__divider" aria-hidden="true"></span>
              <div class="task-header__chip task-header__chip--current"><i aria-hidden="true"></i><span>当前节点</span><strong data-task-header-field="current-node"></strong></div>
              <span class="task-header__status-divider" aria-hidden="true"></span>
              <div class="task-header__chip task-header__chip--pending"><i aria-hidden="true"></i><span>状态</span><strong data-task-header-field="status"></strong></div>
            </div>

            <a class="task-header__link" href="#"><span class="task-header__standard-icon" aria-hidden="true"><img src="${assetBase}icon-gesture.svg" alt="" /></span><span data-task-header-field="standard-text"></span></a>
          </div>

          <section class="task-header__info-popover" aria-label="任务信息" hidden>
            <h3>基本信息</h3>
            <dl>
              <div><dt>序列号</dt><dd data-task-header-field="serial-number"></dd></div>
              <hr />
              <div><dt>采集员</dt><dd data-task-header-field="collector"></dd></div>
              <hr />
              <div><dt>采集员</dt><dd data-task-header-field="version"></dd></div>
              <hr />
              <div class="task-header__info-previous"><dt>上一节点</dt><dd data-task-header-field="previous-node"></dd></div>
            </dl>
            <a href="#">查看日志</a>
          </section>
        </section>
      `;
    }

    syncAttributes() {
      const root = this.querySelector("[data-component='task-header']");
      if (!root) return;

      root.dataset.variant = this.getAttribute("data-variant") || "default";
      root.setAttribute("aria-label", this.getAttribute("aria-label") || defaults.label);

      const fields = {
        "breadcrumb-root": this.value("breadcrumb-root", defaults.breadcrumbRoot),
        "breadcrumb-current": this.value("breadcrumb-current", defaults.breadcrumbCurrent),
        "task-id": this.value("task-id", defaults.taskId),
        "task-name": this.value("task-name", defaults.taskName),
        "serial-number": this.value("serial-number", defaults.serialNumber),
        "collector": this.value("collector", defaults.collector),
        "version": this.value("version", defaults.version),
        "standard-text": this.value("standard-text", defaults.standardText),
        "current-node": this.value("current-node", defaults.currentNode),
        "status": this.value("status", defaults.status),
        "previous-node": this.value("previous-node", "动作质检·供应商A提交")
      };

      Object.entries(fields).forEach(([name, value]) => {
        const field = root.querySelector(`[data-task-header-field="${name}"]`);
        if (field) field.textContent = value;
      });

    }

    setupInfoPopover() {
      if (this.dataset.infoReady === "true") return;
      const button = this.querySelector(".task-header__info-button");
      const popover = this.querySelector(".task-header__info-popover");
      if (!button || !popover) return;

      const close = () => {
        popover.hidden = true;
        button.setAttribute("aria-expanded", "false");
      };

      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const willOpen = popover.hidden;
        popover.hidden = !willOpen;
        button.setAttribute("aria-expanded", String(willOpen));
      });

      popover.addEventListener("click", (event) => event.stopPropagation());
      document.addEventListener("click", close);
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") close();
      });
      this.dataset.infoReady = "true";
    }
  }

  if (!customElements.get("task-header")) {
    customElements.define("task-header", TaskHeader);
  }
})();
