(() => {
  const scriptUrl = document.currentScript?.src || "";
  const assetBase = new URL("./assets/", scriptUrl).href;

  const transportControls = `
    <div class="transport-tools"><button class="tool-button tool-button--primary" type="button" data-action="toggle-play"><img src="${assetBase}icon-play.svg" alt="播放" /></button><button class="tool-button" type="button"><img src="${assetBase}icon-skip-prev.svg" alt="上一帧" /></button><button class="tool-button" type="button"><img src="${assetBase}icon-skip-next.svg" alt="下一帧" /></button><button class="tool-button tool-button--speed" type="button"><b>2x</b><span>倍速</span></button></div>`;

  class AnnotationTimeline extends HTMLElement {
    connectedCallback() {
      if (this.dataset.rendered === "true") return;

      const variant = this.getAttribute("data-variant") || "manual-quality-check";
      const label = this.getAttribute("aria-label") || "人工质检-动作质检";

      this.innerHTML = `
        <div class="annotation-variant" data-component="annotation-timeline" data-variant="${variant}" aria-label="${label}">
          <div class="timeline-slot">
            <div class="timeline-card timeline-card--range"><div class="timeline-ruler timeline-ruler--range"><span class="range-time">00:10:79-3:04:58</span><img class="marker marker--orange marker--one" src="${assetBase}icon-marker-orange.svg" alt="" /><img class="marker marker--orange marker--two" src="${assetBase}icon-marker-orange.svg" alt="" /></div><div class="timeline-track timeline-track--range"><span class="timeline-progress"></span><span class="timeline-selection"></span><img class="range-handle range-handle--start" src="${assetBase}icon-range-handle.svg" alt="" /><img class="range-handle range-handle--end" src="${assetBase}icon-range-handle.svg" alt="" /></div><span class="timeline-current-time">00:10</span></div>
          </div>
          <div class="controls-slot">
            <div class="control-panel">${transportControls}<button class="tool-button tool-button--shortcut" type="button"><img src="${assetBase}icon-keyboard.svg" alt="" /><span>快捷键</span></button></div>
          </div>
        </div>
      `;
      this.dataset.rendered = "true";
    }
  }

  if (!customElements.get("annotation-timeline")) {
    customElements.define("annotation-timeline", AnnotationTimeline);
  }
})();
