(() => {
  const scriptUrl = document.currentScript?.src || "";
  const assetBase = new URL("./assets/", scriptUrl).href;

  const qualityRow = (id, time) => `
    <article class="fill-area__row"><b>${id}</b><div class="fill-area__row-main"><div class="fill-area__row-top"><time>${time}</time><div class="fill-area__severity" role="radiogroup" aria-label="${id} 失误程度"><button type="button" data-severity="轻微"><i></i>轻微</button><button class="is-selected" type="button" data-severity="严重"><i></i>严重</button></div><button type="button" aria-label="删除"><img src="${assetBase}icon-trash.svg" alt="" /></button></div></div></article>`;

  class FillArea extends HTMLElement {
    connectedCallback() {
      if (this.dataset.behaviorsReady !== "true") {
        this.dataset.behaviorsReady = "true";
        this.addEventListener("click", (event) => {
          const trigger = event.target.closest(".fill-area__icon-hint");
          if (!trigger || !this.contains(trigger)) return;
          const row = trigger.closest(".fill-area__field-row");
          const field = row?.querySelector(".fill-area__field");
          if (!field) return;
          field.replaceChildren(document.createTextNode("无法标注"));
          field.classList.remove("is-placeholder");
          trigger.setAttribute("aria-pressed", "true");
        });

        this._banObserver = new MutationObserver(() => this.enhanceBanIcons());
        this._banObserver.observe(this, { childList: true, subtree: true });
      }

      if (this.dataset.rendered === "true") return;

      const variant = this.getAttribute("data-variant") || "manual-quality-check";
      const label = this.getAttribute("aria-label") || "人工质检-动作质检";

      this.innerHTML = `
        <section class="fill-area" data-component="fill-area" data-variant="${variant}" aria-label="${label}">
          <div class="fill-area__content">
            <div class="fill-area__banner">采集指令：归位书本与笔记本:将散落的书本和笔记本整理并放回书架指定位置，保持竖立排列或按类别分层摆放，便于查找和取用</div>
            <div class="fill-area__list">
              ${qualityRow("01", "5.14s")}
              ${qualityRow("02", "5.14s")}
              ${qualityRow("03", "5.14s")}
              ${qualityRow("04", "06:15~06:15")}
            </div>
          </div>
          <footer class="fill-area__footer"><button class="fill-area__button fill-area__button--primary" type="button">合格</button><button class="fill-area__button" type="button">不合格</button><button class="fill-area__button" type="button">暂离</button></footer>
        </section>
      `;
      this.dataset.rendered = "true";
      this.enhanceBanIcons();
    }

    disconnectedCallback() {
      this._banObserver?.disconnect();
    }

    enhanceBanIcons() {
      this.querySelectorAll(".fill-area__ban:not(.fill-area__icon-hint .fill-area__ban)").forEach((icon) => {
        const hint = document.createElement("button");
        hint.className = "fill-area__icon-hint";
        hint.type = "button";
        hint.dataset.tooltip = "无法描述";
        hint.setAttribute("aria-label", "无法描述");
        hint.setAttribute("aria-pressed", "false");
        icon.before(hint);
        hint.append(icon);
      });
    }
  }

  if (!customElements.get("fill-area")) {
    customElements.define("fill-area", FillArea);
  }
})();
