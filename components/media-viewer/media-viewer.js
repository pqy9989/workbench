(() => {
  const scriptUrl = document.currentScript?.src || "";
  const assetBase = new URL("./assets/", scriptUrl).href;

  const feed = (image, label, alt, primary = false, wideLabel = false, modifier = "") => `
    <figure class="media-viewer__feed${primary ? " media-viewer__feed--primary" : ""}${modifier ? ` ${modifier}` : ""}"><img class="media-viewer__image" src="${assetBase}${image}" alt="${alt}" /><figcaption class="media-viewer__label${wideLabel ? " media-viewer__label--wide" : ""}"><span>${label}</span><button class="media-viewer__fullscreen" type="button" aria-label="全屏查看${label}" title="全屏"><span aria-hidden="true">⛶</span></button></figcaption></figure>`;

  class MediaViewer extends HTMLElement {
    connectedCallback() {
      if (this.dataset.rendered === "true") return;

      const variant = this.getAttribute("data-variant") || "three-equal-feeds";
      const label = this.getAttribute("aria-label") || "视频区-三格";
      const isLargeLeft = variant === "one-large-two-stacked";

      this.innerHTML = `
        <section class="media-viewer" data-component="media-viewer" data-variant="${variant}" aria-label="${label}">
          <div class="media-viewer__grid">
            ${feed("camera-head.png", "头部视角", "头部视角视频画面", !isLargeLeft, false, isLargeLeft ? "media-viewer__feed--large-left" : "")}
            ${feed("camera-left-arm.png", "左臂视角", "左臂视角视频画面")}
            ${feed("camera-right-arm.png", "右臂视角", "右臂视角视频画面")}
          </div>
        </section>
      `;
      this.dataset.rendered = "true";
    }
  }

  document.addEventListener("click", async (event) => {
    const button = event.target.closest?.(".media-viewer__fullscreen");
    if (!button) return;

    const feedElement = button.closest(".media-viewer__feed");
    if (!feedElement) return;

    if (document.fullscreenElement === feedElement) {
      await document.exitFullscreen();
      return;
    }

    if (document.fullscreenElement) await document.exitFullscreen();
    await feedElement.requestFullscreen();
  });

  if (!customElements.get("media-viewer")) {
    customElements.define("media-viewer", MediaViewer);
  }
})();
