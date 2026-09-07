const taskHeader = document.querySelector('workbench-task-header');
const instruction = document.querySelector('workbench-instruction');
const mediaViewer = document.querySelector('workbench-media-viewer');
const timeline = document.querySelector('segmented-track');
const qualityTimeline = document.querySelector('workbench-quality-track');
const segmentEditors = [...document.querySelectorAll('workbench-segment-editor')];
const segmentEditor = segmentEditors.find(editor => !editor.hasAttribute('variant'));
const qualityEditor = segmentEditors.find(editor => editor.getAttribute('variant') === 'variant-2');
const segmentList = document.querySelector('workbench-segment-list');
let activeWorkbenchMode = 'segments';

taskHeader.addEventListener('workbench-close', () => {
  window.location.assign('../action-quality-check/index.html');
});

function selectSegment(index, source = 'page') {
  const safeIndex = Math.max(0, Math.min(5, Number(index) || 0));
  if (source !== 'timeline') timeline.selectSegment(safeIndex, false);
  segmentEditors.forEach(editor => {
    if (editor !== source) editor.setSegment(safeIndex + 1, false);
  });
  if (source !== 'list') segmentList.selectSegment(safeIndex + 1, false);
}

timeline.addEventListener('track-change', event => {
  selectSegment(event.detail.index, 'timeline');
});

segmentEditors.forEach(editor => editor.addEventListener('segment-change', event => {
  selectSegment(event.detail.index - 1, editor);
}));

segmentList.addEventListener('segment-change', event => {
  selectSegment(event.detail.index - 1, 'list');
});

segmentList.addEventListener('review-variant-change', event => {
  const variant = event.detail.variant;
  if (variant === 'quality' || variant === 'segments') activeWorkbenchMode = variant;
  instruction.setMode(activeWorkbenchMode);
  const qualityMode = activeWorkbenchMode === 'quality';
  timeline.hidden = qualityMode;
  qualityTimeline.hidden = !qualityMode;
  timeline.closest('.timeline-card').classList.toggle('is-quality-mode', qualityMode);
  segmentEditor.hidden = qualityMode;
  qualityEditor.hidden = !qualityMode;
});

selectSegment(1);
