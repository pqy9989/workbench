// Page-specific composition; the complex editor keeps its existing references.
document.querySelector('process-editor-header h1').textContent = '端到端切分标注简洁版';
const library = document.querySelector('process-node-library');
library.querySelector('.node-library-toggle').click();
const libraryToggle = library.querySelector('.node-library-toggle');
libraryToggle.style.display = 'none';
const sidebarButton = document.querySelector('.canvas-stage [data-action="add"]');
sidebarButton.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/></svg>';
const syncSidebarButton = () => {
  const expanded = !library.querySelector('.left-panel').classList.contains('is-library-collapsed');
  sidebarButton.setAttribute('aria-expanded', String(expanded));
  sidebarButton.setAttribute('aria-label', expanded ? '收起节点栏' : '展开节点栏');
  sidebarButton.title = expanded ? '收起节点栏' : '展开节点栏';
};
sidebarButton.addEventListener('click', event => {
  // Edge insertion retains its anchored node picker.
  if (event.detail?.anchor) return;
  event.preventDefault();event.stopImmediatePropagation();
  libraryToggle.click();syncSidebarButton();
}, true);
syncSidebarButton();
const properties = document.querySelector('process-node-properties');
const panel = properties.querySelector('.right-panel');
panel.style.display = 'none';
const canvas = document.querySelector('.canvas-stage');
function openNodeProperties(node) {
  if (!node || node.classList.contains('placement-ghost')) return;
  const title = node.querySelector('.graph-title')?.textContent.trim() || '节点';
  properties.querySelector('h2').textContent = title;
  properties.querySelector('form-input[name="nodeName"]').value = title;
  properties.querySelector('form-input[name="nodeId"]').value = node.dataset.node === 'sample' ? 'human_2' : node.dataset.node;
  properties.querySelector('form-input[name="description"]').value = node.querySelector('.graph-sub')?.textContent.trim() || title;
  const icon = node.querySelector('.mini img, :scope > img');
  const panelIcon = properties.querySelector('.human-properties-icon');
  if (icon) {
    const panelImage = panelIcon.querySelector('img');
    panelImage.src = icon.src;
    panelImage.style.filter = getComputedStyle(icon).filter;
  }
  panelIcon.style.backgroundColor = getComputedStyle(node.querySelector('.mini') || node).backgroundColor;
  properties.querySelector('[role="status"]').textContent = '';
  panel.style.display = '';
}
// Node dragging captures the pointer on the canvas, so the resulting click can
// target the canvas instead of the node. Remember the original pressed node.
let pressedNode = null;
canvas.addEventListener('pointerdown', event => {
  const node = event.target.closest('.graph-node');
  pressedNode = event.button === 0 && node && !event.target.closest('.node-hover-actions')
    ? { node, x: event.clientX, y: event.clientY, pointerId: event.pointerId } : null;
}, true);
document.addEventListener('pointerup', event => {
  const pressed = pressedNode;
  if (!pressed || pressed.pointerId !== event.pointerId) return;
  pressedNode = null;
  if (pressed.node.isConnected && Math.hypot(event.clientX-pressed.x, event.clientY-pressed.y) < 5) openNodeProperties(pressed.node);
}, true);
document.addEventListener('pointercancel', () => { pressedNode = null; }, true);
properties.addEventListener('node-properties-close', () => { panel.style.display = 'none'; });
