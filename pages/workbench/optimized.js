const taskHeader = document.querySelector('workbench-task-header');
const instruction = document.querySelector('workbench-instruction');
const mediaViewer = document.querySelector('workbench-media-viewer');
const semanticTimeline = document.querySelector('semantic-annotation-track');
const actionTimeline = document.querySelector('action-annotation-track');
const qualityTimeline = document.querySelector('workbench-quality-track');
const segmentEditors = [...document.querySelectorAll('workbench-segment-editor')];
const semanticEditor = segmentEditors.find(editor => !editor.hasAttribute('variant'));
const qualityEditor = segmentEditors.find(editor => editor.getAttribute('variant') === 'variant-2');
const actionEditor = segmentEditors.find(editor => editor.getAttribute('variant') === 'variant-3');
const segmentList = document.querySelector('workbench-segment-list');
let activeWorkbenchMode = 'segments';
let activeSegmentIndex = 1;
const qualityList = segmentList.querySelector('[data-quality-list]');
// Share each record so navigation and error-reason edits use the same data.
qualityEditor._segments = qualityList._items.map(item => {
  Object.defineProperty(item, 'error', {get(){return this.reason;},set(value){this.reason=value;}, configurable:true});
  return item;
});
function syncQualityEditor() {
  const item = qualityList._items[activeSegmentIndex];
  if (!item) return;
  qualityEditor.querySelector('.workbench-mistake-description').value = item.description;
  qualityEditor.querySelectorAll('.workbench-severity-options input').forEach(input => {input.checked=input.value===item.severity;});
}
function updateQualityList() {
  const item=qualityList._items[activeSegmentIndex];
  if (!item) return;
  item.description=qualityEditor.querySelector('.workbench-mistake-description').value;
  item.severity=qualityEditor.querySelector('.workbench-severity-options input:checked')?.value || '轻微';
  qualityList.render();
}
qualityEditor.addEventListener('input',updateQualityList);
qualityEditor.addEventListener('change',updateQualityList);
qualityEditor.addEventListener('segment-update',updateQualityList);

taskHeader.addEventListener('workbench-close', () => {
  window.location.assign('../action-quality-check/index.html');
});

function selectSegment(index, source = 'page') {
  const safeIndex = Math.max(0, Math.min(5, Number(index) || 0));
  activeSegmentIndex = safeIndex;
  const activeTimeline = activeWorkbenchMode === 'action' ? actionTimeline : semanticTimeline;
  if (activeWorkbenchMode !== 'quality' && source !== activeTimeline) activeTimeline.selectSegment(safeIndex, false);
  segmentEditors.forEach(editor => {
    if (editor !== source) editor.setSegment(safeIndex + 1, false);
  });
  if (source !== 'list') segmentList.selectSegment(safeIndex + 1, false);
  syncQualityEditor();
}

[semanticTimeline, actionTimeline].forEach(track => track.addEventListener('track-change', event => {
  selectSegment(event.detail.index, track);
}));

segmentEditors.forEach(editor => editor.addEventListener('segment-change', event => {
  selectSegment(event.detail.index - 1, editor);
}));

segmentList.addEventListener('segment-change', event => {
  selectSegment(event.detail.index - 1, 'list');
});

segmentList.addEventListener('review-variant-change', event => {
  const variant = event.detail.variant;
  if (variant === 'quality' || variant === 'segments' || variant === 'action') activeWorkbenchMode = variant;
  instruction.setMode(activeWorkbenchMode);
  const qualityMode = activeWorkbenchMode === 'quality';
  const actionMode = activeWorkbenchMode === 'action';
  semanticTimeline.hidden = qualityMode || actionMode;
  actionTimeline.hidden = !actionMode;
  qualityTimeline.hidden = !qualityMode;
  const timelineCard = actionTimeline.closest('.timeline-card');
  timelineCard.classList.toggle('is-quality-mode', qualityMode);
  timelineCard.classList.toggle('is-action-mode', actionMode);
  semanticEditor.hidden = qualityMode || actionMode;
  qualityEditor.hidden = !qualityMode;
  actionEditor.hidden = !actionMode;
  requestAnimationFrame(() => selectSegment(activeSegmentIndex, 'mode'));
});

selectSegment(1);
