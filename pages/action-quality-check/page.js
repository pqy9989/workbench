const pageId = document.body.dataset.pageId;

const fillResizer = document.querySelector('.fill-resizer');
const pageContent = document.querySelector('.page-content');

function setFillColumn(width) {
  if (!pageContent || !fillResizer) return;
  const minWidth = 360;
  const maxWidth = Math.max(minWidth, pageContent.clientWidth - 420 - 8);
  const nextWidth = Math.min(maxWidth, Math.max(minWidth, Math.round(width)));
  document.documentElement.style.setProperty('--fill-column', `${nextWidth}px`);
  fillResizer.setAttribute('aria-valuenow', String(nextWidth));
}

fillResizer?.addEventListener('pointerdown', (event) => {
  fillResizer.setPointerCapture(event.pointerId);
  document.body.classList.add('is-resizing-fill');
});

fillResizer?.addEventListener('pointermove', (event) => {
  if (!fillResizer.hasPointerCapture(event.pointerId) || !pageContent) return;
  setFillColumn(pageContent.getBoundingClientRect().right - event.clientX);
});

fillResizer?.addEventListener('pointerup', (event) => {
  if (fillResizer.hasPointerCapture(event.pointerId)) {
    fillResizer.releasePointerCapture(event.pointerId);
  }
  document.body.classList.remove('is-resizing-fill');
});

fillResizer?.addEventListener('keydown', (event) => {
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  const currentWidth = Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue('--fill-column'), 10) || 450;
  setFillColumn(currentWidth + (event.key === 'ArrowLeft' ? 20 : -20));
});

function configureTaskHeader(options) {
  const header = document.querySelector('task-header');
  if (!header) return;

  Object.entries(options).forEach(([key, value]) => {
    const attribute = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
    if (value === null || value === undefined || value === '') {
      header.removeAttribute(attribute);
      return;
    }
    header.setAttribute(attribute, value);
  });
}

function setFillAreaTitle(fillArea, title) {
  if (!fillArea) return;
  fillArea.setAttribute('aria-label', title);
  const visibleTitle = fillArea.querySelector('.fill-area__title > span');
  if (visibleTitle) visibleTitle.textContent = title;
}

const themeButtons = document.querySelectorAll('.task-header__theme-button');
const savedTheme = localStorage.getItem('workbench-theme');
const initialTheme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';
let workbenchTheme = initialTheme;
let countdownTimer = null;

function stopWorkbenchCountdown() {
  if (countdownTimer !== null) window.clearInterval(countdownTimer);
  countdownTimer = null;
}

function startWorkbenchCountdown() {
  stopWorkbenchCountdown();
  const header = document.querySelector('task-header');
  let remainingSeconds = 59 * 60 + 59;
  const update = () => {
    const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
    const seconds = String(remainingSeconds % 60).padStart(2, '0');
    header?.setAttribute('countdown', `${minutes}:${seconds}`);
  };
  update();
  countdownTimer = window.setInterval(() => {
    if (remainingSeconds <= 0) {
      stopWorkbenchCountdown();
      return;
    }
    remainingSeconds -= 1;
    update();
  }, 1000);
}

function setPageView(view, { updateHistory = true } = {}) {
  const workbench = view === 'workbench';
  document.body.dataset.view = workbench ? 'workbench' : 'task-list';
  applyTheme(workbench ? workbenchTheme : 'light');
  if (workbench) startWorkbenchCountdown();
  else stopWorkbenchCountdown();

  if (updateHistory) {
    const url = new URL(window.location.href);
    if (workbench) {
      url.searchParams.set('page', 'action-annotation');
      url.searchParams.set('mode', 'workbench');
    } else {
      url.searchParams.delete('mode');
      url.searchParams.delete('page');
    }
    window.history.pushState({ view: document.body.dataset.view }, '', url);
  }
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  themeButtons.forEach((button) => {
    const buttonTheme = button.getAttribute('aria-label') === '浅色主题' ? 'light' : 'dark';
    const isActive = buttonTheme === theme;
    button.classList.toggle('task-header__theme-button--active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

setPageView(new URLSearchParams(window.location.search).get('mode') === 'workbench' ? 'workbench' : 'task-list', { updateHistory: false });

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const theme = button.getAttribute('aria-label') === '浅色主题' ? 'light' : 'dark';
    workbenchTheme = theme;
    applyTheme(theme);
    localStorage.setItem('workbench-theme', theme);
  });
});

document.querySelectorAll('.task-list-view__start').forEach((button) => {
  button.addEventListener('click', () => setPageView('workbench'));
});

document.addEventListener('task-header-close', () => setPageView('task-list'));

document.querySelectorAll('.platform-sidebar__item').forEach((button) => {
  if (button.textContent.trim() === '标注工作台') button.addEventListener('click', () => setPageView('task-list'));
});

window.addEventListener('popstate', () => {
  setPageView(new URLSearchParams(window.location.search).get('mode') === 'workbench' ? 'workbench' : 'task-list', { updateHistory: false });
});

if (pageId === 'quality-spot-check') {
  document.title = '动作质检-质检抽检';

  configureTaskHeader({
    dataVariant: 'spot-check',
    ariaLabel: '任务信息-抽检',
    breadcrumbCurrent: '质检抽检',
    currentNode: '质检抽检',
    status: '待抽检',
    previousNode: '动作质检 · 供应商A · 提交 · 前序节点处理完成 · 已流转至当前节点'
  });

  const fillArea = document.querySelector('[data-component="fill-area"]');
  fillArea.dataset.variant = 'quality-spot-check';
  setFillAreaTitle(fillArea, '质检抽检');

  fillArea.querySelectorAll('.fill-area__row').forEach((row, index) => {
    const field = document.createElement('button');
    field.className = `fill-area__field${index === 0 ? ' is-placeholder' : ''}`;
    field.type = 'button';
    field.textContent = index === 0 ? '请选择失误描述' : '夹取明显不规范';
    row.querySelector('.fill-area__row-main').append(field);
  });

  const actions = fillArea.querySelectorAll('.fill-area__button');
  actions[0].textContent = '通过';
  actions[1].textContent = '修正并驳回';
}

if (pageId === 'action-annotation') {
  document.title = '动作标注';

  configureTaskHeader({
    ariaLabel: '任务信息-动作标注',
    breadcrumbCurrent: '数据标注',
    currentNode: '动作标注',
    status: '待标注',
    standardText: '任务描述',
    previousNode: null
  });

  const mediaViewer = document.querySelector('[data-component="media-viewer"]');
  mediaViewer.dataset.variant = 'four-equal-feeds';
  mediaViewer.setAttribute('aria-label', '视频区-四格');
  mediaViewer.querySelector('.media-viewer__grid').innerHTML = `
    <figure class="media-viewer__feed"><img class="media-viewer__image" src="../../components/media-viewer/assets/camera-head.png" alt="左臂视角视频画面" /><figcaption class="media-viewer__label"><span>左臂视角</span><button class="media-viewer__fullscreen" type="button" aria-label="全屏查看左臂视角" title="全屏"><span aria-hidden="true">⛶</span></button></figcaption></figure>
    <figure class="media-viewer__feed"><img class="media-viewer__image" src="../../components/media-viewer/assets/camera-head.png" alt="右臂视角视频画面" /><figcaption class="media-viewer__label"><span>右臂视角</span><button class="media-viewer__fullscreen" type="button" aria-label="全屏查看右臂视角" title="全屏"><span aria-hidden="true">⛶</span></button></figcaption></figure>
    <figure class="media-viewer__feed"><img class="media-viewer__image" src="../../components/media-viewer/assets/camera-left-arm.png" alt="头部视角视频画面" /><figcaption class="media-viewer__label"><span>头部视角</span><button class="media-viewer__fullscreen" type="button" aria-label="全屏查看头部视角" title="全屏"><span aria-hidden="true">⛶</span></button></figcaption></figure>
    <figure class="media-viewer__feed"><img class="media-viewer__image" src="../../components/media-viewer/assets/camera-right-arm.png" alt="头部结束帧画面" /><figcaption class="media-viewer__label media-viewer__label--wide"><span>头部结束帧</span><button class="media-viewer__fullscreen" type="button" aria-label="全屏查看头部结束帧" title="全屏"><span aria-hidden="true">⛶</span></button></figcaption></figure>`;

  const timeline = document.querySelector('[data-component="annotation-timeline"]');
  timeline.dataset.variant = 'action-annotation';
  timeline.setAttribute('aria-label', '动作标注-标注时间轴');
  timeline.innerHTML = `
    <div class="timeline-slot"><div class="timeline-card timeline-card--segments"><div class="timeline-ruler"><img class="ruler-start" src="../../components/annotation-timeline/assets/icon-timeline-start.svg" alt="" /><img class="marker marker--red" src="../../components/annotation-timeline/assets/icon-marker-red.svg" alt="" /><img class="marker marker--orange marker--two" src="../../components/annotation-timeline/assets/icon-marker-orange.svg" alt="" /><div class="segment-scale"><span class="segment-progress is-draggable" role="slider" tabindex="0" aria-label="标注选区" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i class="segment-resize-handle segment-resize-handle--start" aria-hidden="true"></i><i class="segment-resize-handle segment-resize-handle--end" aria-hidden="true"></i></span></div><div class="scale-labels"><span>00:00s</span><span>00:10s</span></div></div><div class="annotation-row"><b class="row-count">0</b><div class="color-segments color-segments--interactive" aria-label="已添加标注片段"></div></div></div></div>
    <div class="controls-slot"><div class="control-panel"><div class="transport-tools"><button class="tool-button tool-button--primary" type="button" data-action="toggle-play"><img src="../../components/annotation-timeline/assets/icon-play.svg" alt="播放" /></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-skip-prev.svg" alt="上一帧" /></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-skip-next.svg" alt="下一帧" /></button><button class="tool-button tool-button--speed" type="button"><b>2x</b><span>倍速</span></button></div><div class="annotation-tools"><button class="tool-button" type="button" data-action="add-segment"><img src="../../components/annotation-timeline/assets/icon-plus.svg" alt="" /><span>添加</span></button><button class="tool-button tool-button--small-label" type="button" data-action="add-and-forward"><img src="../../components/annotation-timeline/assets/icon-plus-forward.svg" alt="" /><span>添加并前进</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-forward.svg" alt="" /><span>仅前进</span></button><button class="tool-button" type="button" data-action="clear-segments"><img src="../../components/annotation-timeline/assets/icon-eraser.svg" alt="" /><span>清空</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-drag.svg" alt="" /><span>拖动</span></button><button class="tool-button" type="button" data-action="split-mode" aria-pressed="false"><img src="../../components/annotation-timeline/assets/icon-scissors.svg" alt="" /><span>分割</span></button><button class="tool-button" type="button" data-action="merge-segments"><img src="../../components/annotation-timeline/assets/icon-merge.svg" alt="" /><span>合并</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-merge-up.svg" alt="" /><span>向上合并</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-merge-down.svg" alt="" /><span>向下合并</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-source-first.svg" alt="" /><span>源视频优先</span></button><button class="tool-button" type="button" data-action="show-shortcuts" aria-haspopup="dialog"><img src="../../components/annotation-timeline/assets/icon-keyboard.svg" alt="" /><span>快捷键</span></button></div></div></div>`;

  const fillArea = document.querySelector('[data-component="fill-area"]');
  fillArea.dataset.variant = 'action-annotation';
  setFillAreaTitle(fillArea, '标注');
  const fillContent = fillArea.querySelector('.fill-area__content');
  fillContent.innerHTML = '<div class="fill-area__empty">暂无标注数据</div>';
  fillArea.querySelector('.fill-area__footer').innerHTML = '<button class="fill-area__button fill-area__button--primary" type="button">提交</button><button class="fill-area__button" type="button">暂离</button>';

  const timelineCard = timeline.querySelector('.timeline-card--segments');
  const scale = timeline.querySelector('.segment-scale');
  const selection = timeline.querySelector('.segment-progress');
  const resizeStart = timeline.querySelector('.segment-resize-handle--start');
  const resizeEnd = timeline.querySelector('.segment-resize-handle--end');
  const segmentTrack = timeline.querySelector('.color-segments--interactive');
  const count = timeline.querySelector('.row-count');
  const startTimeLabel = timeline.querySelector('.scale-labels span:first-child');
  const endTimeLabel = timeline.querySelector('.scale-labels span:last-child');
  const addButton = timeline.querySelector('[data-action="add-segment"]');
  const addAndForwardButton = timeline.querySelector('[data-action="add-and-forward"]');
  const onlyForwardButton = [...timeline.querySelectorAll('.annotation-tools .tool-button')].find((button) => button.textContent.trim() === '仅前进');
  const clearButton = timeline.querySelector('[data-action="clear-segments"]');
  const splitButton = timeline.querySelector('[data-action="split-mode"]');
  const mergeButton = timeline.querySelector('[data-action="merge-segments"]');
  const mergeUpButton = [...timeline.querySelectorAll('.annotation-tools .tool-button')].find((button) => button.textContent.trim() === '向上合并');
  const mergeDownButton = [...timeline.querySelectorAll('.annotation-tools .tool-button')].find((button) => button.textContent.trim() === '向下合并');
  const shortcutButton = timeline.querySelector('[data-action="show-shortcuts"]');
  const segmentColors = ['#399ed0', '#d06b39', '#9139d0', '#39d078'];
  const dropdownOptions = {
    element: ['机械臂', '夹爪', '目标物体', '工作台', '收纳区域'],
    description: ['抓取物体', '移动物体', '放置物体', '调整姿态', '松开夹爪']
  };
  let segmentCount = 0;
  let splitModeActive = false;
  let linkedSegmentId = null;
  const historyStack = [];

  const splitCursor = document.createElement('span');
  splitCursor.className = 'split-cursor';
  splitCursor.setAttribute('aria-hidden', 'true');
  splitCursor.innerHTML = '<img src="../../components/annotation-timeline/assets/icon-scissors.svg" alt="" />';
  segmentTrack.append(splitCursor);
  const mergeStatus = document.createElement('button');
  mergeStatus.type = 'button';
  mergeStatus.className = 'merge-selection-status';
  mergeStatus.setAttribute('aria-label', '合并选中的片段');
  segmentTrack.append(mergeStatus);
  const annotationToast = document.createElement('div');
  annotationToast.className = 'annotation-toast';
  annotationToast.setAttribute('role', 'alert');
  annotationToast.setAttribute('aria-live', 'assertive');
  annotationToast.innerHTML = '<span aria-hidden="true">×</span><p></p>';
  document.body.append(annotationToast);
  let toastTimer = 0;

  const shortcutItems = [
    ['切换输入框/选项', ['Option', '↑ / ↓']],
    ['切换轻微/严重', ['Option', '← / →']],
    ['切换条目', ['↑ / ↓']],
    ['删除条目', ['Delete']],
    ['无法描述', ['Control', '/']],
    ['添加', ['Control', '+']],
    ['切分', ['J']],
    ['拖动模式', ['Control', 'E']],
    ['分割', ['Control', 'X']],
    ['多选', ['Option', '点击']],
    ['合并', ['Enter']],
    ['向上合并', ['Command', '←']],
    ['向下合并', ['Command', '→']],
    ['退出', ['Esc']],
    ['提交标注', ['Enter', 'S']],
    ['添加并前进', ['Control', 'S']],
    ['仅前进', ['Control', 'D']],
    ['标记首帧', ['Control', 'Q']],
    ['标记尾帧', ['Control', 'W']],
    ['播放/暂停', ['Space']],
    ['调整时间范围', ['←', '→']],
    ['撤销', ['Command', 'Z']],
    ['重做', ['Command', 'Shift', 'Z']]
  ];
  const shortcutDialog = document.createElement('dialog');
  shortcutDialog.className = 'shortcut-dialog';
  shortcutDialog.setAttribute('aria-labelledby', 'shortcut-dialog-title');
  shortcutDialog.innerHTML = `
    <div class="shortcut-dialog__header">
      <h2 id="shortcut-dialog-title">快捷键</h2>
      <button class="shortcut-dialog__close" type="button" aria-label="关闭快捷键菜单">×</button>
    </div>
    <div class="shortcut-dialog__list">
      ${shortcutItems.map(([label, keys]) => `<div class="shortcut-dialog__item"><span>${label}</span><span class="shortcut-dialog__keys">${keys.map((key) => `<kbd>${key}</kbd>`).join('<i>+</i>')}</span></div>`).join('')}
    </div>`;
  document.body.append(shortcutDialog);

  const toolbarShortcutMap = new Map([
    ['添加', 'Control + +'],
    ['添加并前进', 'Control + S'],
    ['仅前进', 'Control + D'],
    ['清空', 'Command + Shift + Z'],
    ['拖动', 'Control + E'],
    ['分割', 'Control + X'],
    ['合并', 'Enter'],
    ['向上合并', 'Command + ←'],
    ['向下合并', 'Command + →'],
    ['快捷键', '点击查看全部']
  ]);
  timeline.querySelectorAll('.tool-button').forEach((button) => {
    const label = button.querySelector('span')?.textContent.trim() || button.querySelector('img')?.alt || button.textContent.trim();
    const shortcut = toolbarShortcutMap.get(label);
    button.dataset.tooltip = shortcut ? `${label}\n${shortcut}` : label;
  });

  function positionShortcutDialog() {
    const buttonBounds = shortcutButton.getBoundingClientRect();
    const dialogWidth = shortcutDialog.offsetWidth || 340;
    const edgeGap = 12;
    const left = Math.min(
      window.innerWidth - dialogWidth - edgeGap,
      Math.max(edgeGap, buttonBounds.right - dialogWidth)
    );
    shortcutDialog.style.left = `${left}px`;
    shortcutDialog.style.bottom = `${window.innerHeight - buttonBounds.top + 8}px`;
    shortcutDialog.style.maxHeight = `${Math.max(260, buttonBounds.top - 20)}px`;
  }

  shortcutButton.addEventListener('click', () => {
    if (shortcutDialog.open) {
      shortcutDialog.close();
      return;
    }
    shortcutDialog.show();
    positionShortcutDialog();
  });
  shortcutDialog.querySelector('.shortcut-dialog__close').addEventListener('click', () => shortcutDialog.close());
  document.addEventListener('pointerdown', (event) => {
    if (!shortcutDialog.open || shortcutDialog.contains(event.target) || shortcutButton.contains(event.target)) return;
    shortcutDialog.close();
  });
  window.addEventListener('resize', () => {
    if (shortcutDialog.open) positionShortcutDialog();
  });

  function updateSelectionGeometry(left, width) {
    selection.style.left = `${left}px`;
    selection.style.width = `${width}px`;
    timelineCard.style.setProperty('--segment-selection-left', `${left}px`);
    timelineCard.style.setProperty('--segment-progress-width', `${width}px`);
    const maxLeft = Math.max(0, scale.clientWidth - width);
    selection.setAttribute('aria-valuenow', String(maxLeft ? Math.round((left / maxLeft) * 100) : 0));
    updateTimeLabels(left, width);
  }

  function updateTimeLabels(left, width) {
    const secondsPerPixel = 10 / 128;
    const formatTime = (seconds) => `00:${String(Math.max(0, Math.round(seconds))).padStart(2, '0')}s`;
    startTimeLabel.style.left = `${left}px`;
    endTimeLabel.style.left = `${left + width}px`;
    startTimeLabel.textContent = formatTime(left * secondsPerPixel);
    endTimeLabel.textContent = formatTime((left + width) * secondsPerPixel);
  }

  function moveElement(element, track, clientX, grabOffset) {
    const bounds = track.getBoundingClientRect();
    const maxLeft = Math.max(0, bounds.width - element.offsetWidth);
    const left = Math.min(maxLeft, Math.max(0, clientX - bounds.left - grabOffset));
    element.style.left = `${left}px`;
    return { left, maxLeft };
  }

  function makeDraggable(element, track, onMove) {
    let grabOffset = 0;
    element.addEventListener('pointerdown', (event) => {
      grabOffset = event.clientX - element.getBoundingClientRect().left;
      element.setPointerCapture(event.pointerId);
      element.classList.add('is-dragging');
    });
    element.addEventListener('pointermove', (event) => {
      if (!element.hasPointerCapture(event.pointerId)) return;
      const position = moveElement(element, track, event.clientX, grabOffset);
      onMove?.(position);
    });
    element.addEventListener('pointerup', (event) => {
      if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
      element.classList.remove('is-dragging');
    });
  }

  function makeResizable(handle, edge) {
    const minimumWidth = 32;
    let initialLeft = 0;
    let initialWidth = 0;

    handle.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const scaleBounds = scale.getBoundingClientRect();
      const selectionBounds = selection.getBoundingClientRect();
      initialLeft = selectionBounds.left - scaleBounds.left;
      initialWidth = selectionBounds.width;
      handle.setPointerCapture(event.pointerId);
      selection.classList.add('is-resizing');
    });

    handle.addEventListener('pointermove', (event) => {
      if (!handle.hasPointerCapture(event.pointerId)) return;
      const pointerX = event.clientX - scale.getBoundingClientRect().left;
      if (edge === 'start') {
        const right = initialLeft + initialWidth;
        const left = Math.max(0, Math.min(pointerX, right - minimumWidth));
        updateSelectionGeometry(left, right - left);
      } else {
        const right = Math.min(scale.clientWidth, Math.max(initialLeft + minimumWidth, pointerX));
        updateSelectionGeometry(initialLeft, right - initialLeft);
      }
    });

    handle.addEventListener('pointerup', (event) => {
      if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
      selection.classList.remove('is-resizing');
    });
  }

  makeDraggable(selection, scale, ({ left, maxLeft }) => {
    timelineCard.style.setProperty('--segment-selection-left', `${left}px`);
    selection.setAttribute('aria-valuenow', String(maxLeft ? Math.round((left / maxLeft) * 100) : 0));
    updateTimeLabels(left, selection.getBoundingClientRect().width);
  });
  makeResizable(resizeStart, 'start');
  makeResizable(resizeEnd, 'end');

  function shiftSelection(delta) {
    const minimumWidth = 32;
    const currentLeft = Number.parseFloat(getComputedStyle(selection).left) || 0;
    const currentWidth = selection.getBoundingClientRect().width;
    let maximumWidth = Math.max(minimumWidth, scale.clientWidth - currentLeft);
    const linkedSegment = linkedSegmentId
      ? segmentTrack.querySelector(`.annotation-segment[data-segment-id="${linkedSegmentId}"]`)
      : null;
    let nextLinkedSegment = null;
    if (linkedSegment) {
      const linkedLeft = Number.parseFloat(linkedSegment.style.left);
      nextLinkedSegment = [...segmentTrack.querySelectorAll('.annotation-segment')]
        .filter((segment) => segment !== linkedSegment)
        .filter((segment) => Number.parseFloat(segment.style.left) > linkedLeft)
        .sort((a, b) => Number.parseFloat(a.style.left) - Number.parseFloat(b.style.left))[0] || null;
      if (nextLinkedSegment) {
        const nextRight = Number.parseFloat(nextLinkedSegment.style.left) + Number.parseFloat(nextLinkedSegment.style.width);
        const minimumNextWidth = (minimumWidth / scale.clientWidth) * 100;
        maximumWidth = Math.min(maximumWidth, ((nextRight - linkedLeft - minimumNextWidth) / 100) * scale.clientWidth);
      }
    }
    const nextWidth = Math.min(maximumWidth, Math.max(minimumWidth, currentWidth + delta));
    updateSelectionGeometry(currentLeft, nextWidth);
    if (linkedSegment) {
      const linkedLeft = Number.parseFloat(linkedSegment.style.left);
      const nextWidthPercent = (nextWidth / scale.clientWidth) * 100;
      linkedSegment.style.width = `${nextWidthPercent}%`;
      if (nextLinkedSegment) {
        const nextRight = Number.parseFloat(nextLinkedSegment.style.left) + Number.parseFloat(nextLinkedSegment.style.width);
        const nextLeft = linkedLeft + nextWidthPercent;
        nextLinkedSegment.style.left = `${nextLeft}%`;
        nextLinkedSegment.style.width = `${nextRight - nextLeft}%`;
      }
    }
  }

  selection.addEventListener('keydown', (event) => {
    if (event.metaKey || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    shiftSelection(event.key === 'ArrowLeft' ? -8 : 8);
  });

  document.addEventListener('keydown', (event) => {
    if (event.defaultPrevented || shortcutDialog.open) return;
    const target = event.target;
    const isTyping = target instanceof HTMLElement && (
      target.matches('input, textarea, select') || target.isContentEditable
    );
    if (isTyping) return;

    if (event.metaKey && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      if (event.shiftKey) clearSegments();
      else undoLastAction();
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'x') {
      event.preventDefault();
      setSplitMode(!splitModeActive);
      return;
    }
    if (event.ctrlKey && (event.key === '+' || event.key === '=')) {
      event.preventDefault();
      addSegment();
      return;
    }
    if (event.ctrlKey && event.key.toLowerCase() === 's') {
      event.preventDefault();
      if (addSegment()) advanceSelection();
      return;
    }
    if (event.ctrlKey && event.key.toLowerCase() === 'd') {
      event.preventDefault();
      advanceSelection();
      return;
    }
    if (event.metaKey && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      mergeAdjacentSegment(event.key === 'ArrowLeft' ? -1 : 1);
      return;
    }
    if (event.key === 'Enter' && segmentTrack.querySelectorAll('.annotation-segment.is-selected').length > 1) {
      event.preventDefault();
      mergeSelectedSegments();
      return;
    }
    if (event.key === 'Escape' && splitModeActive) {
      event.preventDefault();
      setSplitMode(false);
      return;
    }
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    shiftSelection(event.key === 'ArrowLeft' ? -8 : 8);
  });

  function setSplitMode(active) {
    splitModeActive = active;
    timeline.classList.toggle('is-split-mode', active);
    splitButton.classList.toggle('is-active', active);
    splitButton.setAttribute('aria-pressed', String(active));
    if (!active) splitCursor.classList.remove('is-visible');
  }

  splitButton.addEventListener('click', () => setSplitMode(!splitModeActive));
  mergeButton.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || segmentTrack.querySelectorAll('.annotation-segment.is-selected').length < 2) return;
    event.preventDefault();
    mergeSelectedSegments();
  });
  mergeButton.addEventListener('click', mergeSelectedSegments);
  mergeStatus.addEventListener('click', mergeSelectedSegments);
  mergeUpButton.addEventListener('click', () => mergeAdjacentSegment(-1));
  mergeDownButton.addEventListener('click', () => mergeAdjacentSegment(1));

  function updateMergeSelection() {
    const selected = [...segmentTrack.querySelectorAll('.annotation-segment.is-selected')];
    mergeButton.classList.toggle('is-active', selected.length > 1);
    if (selected.length < 2) {
      mergeStatus.classList.remove('is-visible');
      return;
    }
    const left = Math.min(...selected.map((segment) => Number.parseFloat(segment.style.left)));
    const right = Math.max(...selected.map((segment) => Number.parseFloat(segment.style.left) + Number.parseFloat(segment.style.width)));
    mergeStatus.textContent = `合并 (${selected.length})`;
    mergeStatus.style.left = `${(left + right) / 2}%`;
    mergeStatus.classList.add('is-visible');
  }

  function mergeSelectedSegments() {
    const selected = [...segmentTrack.querySelectorAll('.annotation-segment.is-selected')];
    if (selected.length < 2) return;
    recordHistory();
    selected.sort((a, b) => Number.parseFloat(a.style.left) - Number.parseFloat(b.style.left));
    const survivor = selected[0];
    const left = Number.parseFloat(survivor.style.left);
    const right = Math.max(...selected.map((segment) => Number.parseFloat(segment.style.left) + Number.parseFloat(segment.style.width)));
    survivor.style.left = `${left}%`;
    survivor.style.width = `${right - left}%`;
    survivor.classList.remove('is-selected');

    selected.slice(1).forEach((segment) => {
      fillContent.querySelector(`.fill-area__row[data-segment-id="${segment.dataset.segmentId}"]`)?.remove();
      segment.remove();
    });
    count.textContent = String(segmentTrack.querySelectorAll('.annotation-segment').length);
    activateSegment(survivor.dataset.segmentId);
    updateMergeSelection();
  }

  function mergeAdjacentSegment(direction) {
    const orderedSegments = [...segmentTrack.querySelectorAll('.annotation-segment')]
      .sort((a, b) => Number.parseFloat(a.style.left) - Number.parseFloat(b.style.left));
    const current = segmentTrack.querySelector('.annotation-segment.is-current');
    if (!current) return;
    const currentIndex = orderedSegments.indexOf(current);
    const neighbor = orderedSegments[currentIndex + direction];
    if (!neighbor) return;

    orderedSegments.forEach((segment) => segment.classList.remove('is-selected'));
    current.classList.add('is-selected');
    neighbor.classList.add('is-selected');
    mergeSelectedSegments();
  }

  segmentTrack.addEventListener('pointermove', (event) => {
    if (!splitModeActive) return;
    const bounds = segmentTrack.getBoundingClientRect();
    const x = Math.min(bounds.width, Math.max(0, event.clientX - bounds.left));
    splitCursor.style.left = `${x}px`;
    splitCursor.classList.add('is-visible');
  });

  segmentTrack.addEventListener('pointerleave', () => splitCursor.classList.remove('is-visible'));

  segmentTrack.addEventListener('click', (event) => {
    const selectedSegment = event.target.closest('.annotation-segment');
    if (event.altKey && selectedSegment) {
      selectedSegment.classList.toggle('is-selected');
      updateMergeSelection();
      return;
    }
    if (!splitModeActive) {
      if (!selectedSegment) return;
      activateSegment(selectedSegment.dataset.segmentId, { revealRow: true });
      return;
    }
    const bounds = segmentTrack.getBoundingClientRect();
    const splitRatio = (event.clientX - bounds.left) / bounds.width;
    const segment = [...segmentTrack.querySelectorAll('.annotation-segment')].find((item) => {
      const left = Number.parseFloat(item.style.left) / 100;
      const right = left + Number.parseFloat(item.style.width) / 100;
      return splitRatio > left && splitRatio < right;
    });
    if (!segment) return;

    const segmentLeft = Number.parseFloat(segment.style.left) / 100;
    const segmentWidth = Number.parseFloat(segment.style.width) / 100;
    const firstWidth = splitRatio - segmentLeft;
    const secondWidth = segmentWidth - firstWidth;
    if (firstWidth * bounds.width < 8 || secondWidth * bounds.width < 8) return;

    recordHistory();
    segment.style.width = `${firstWidth * 100}%`;
    segmentCount += 1;
    const newSegment = segment.cloneNode();
    const newColorIndex = (segmentCount - 1) % segmentColors.length;
    newSegment.dataset.segmentId = String(segmentCount);
    newSegment.dataset.colorClass = ['blue', 'orange', 'purple', 'green'][newColorIndex];
    newSegment.style.left = `${splitRatio * 100}%`;
    newSegment.style.width = `${secondWidth * 100}%`;
    newSegment.style.background = segmentColors[newColorIndex];
    segmentTrack.insertBefore(newSegment, splitCursor);
    count.textContent = String(segmentCount);
    renderRightRow(segmentCount, newSegment.dataset.colorClass);
    activateSegment(newSegment.dataset.segmentId);
    setSplitMode(false);
  });

  function renderRightRow(index, colorClass) {
    if (!fillContent.querySelector('.fill-area__list')) fillContent.innerHTML = '<div class="fill-area__list"></div>';
    fillContent.querySelector('.fill-area__list').insertAdjacentHTML('beforeend', `
      <article class="fill-area__row fill-area__row--action" data-segment-id="${index}">
        <b>${String(index).padStart(2, '0')}</b><div class="fill-area__row-main"><div class="fill-area__row-top fill-area__action-top"><time>06:15~06:15(4:40:47)</time><i class="fill-area__color fill-area__color--${colorClass}"></i><button type="button" aria-label="删除"><img src="../../components/fill-area/assets/icon-trash.svg" alt="" /></button></div>
        ${renderDropdown('element', '请选择动作元素')}
        <div class="fill-area__field-row">${renderDropdown('description', '选择或输入动作描述')}<img class="fill-area__ban" src="../../components/fill-area/assets/icon-ban.svg" alt="" /></div></div>
      </article>`);
    const row = fillContent.querySelector(`.fill-area__row[data-segment-id="${index}"]`);
    row.querySelectorAll('.fill-area__select').forEach((select, selectIndex) => {
      const dropdown = select.querySelector('.fill-area__dropdown');
      const field = select.querySelector('.fill-area__field');
      dropdown.id = `segment-${index}-options-${selectIndex}`;
      field.setAttribute('aria-controls', dropdown.id);
      dropdown.querySelectorAll('.fill-area__option').forEach((option, optionIndex) => {
        option.id = `${dropdown.id}-${optionIndex}`;
      });
    });
    const firstField = row.querySelector('[data-dropdown="element"] > .fill-area__field');
    window.requestAnimationFrame(() => firstField.focus({ preventScroll: true }));
  }

  function activateSegment(segmentId, { revealRow = false } = {}) {
    const segment = segmentTrack.querySelector(`.annotation-segment[data-segment-id="${segmentId}"]`);
    const row = fillContent.querySelector(`.fill-area__row[data-segment-id="${segmentId}"]`);
    if (!segment || !row) return;

    fillContent.querySelectorAll('.fill-area__row--action.is-active').forEach((item) => item.classList.remove('is-active'));
    segmentTrack.querySelectorAll('.annotation-segment.is-current').forEach((item) => item.classList.remove('is-current'));
    row.classList.add('is-active');
    segment.classList.add('is-current');
    linkedSegmentId = segmentId;

    if (revealRow) row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

    const leftRatio = Number.parseFloat(segment.style.left) / 100;
    const widthRatio = Number.parseFloat(segment.style.width) / 100;
    updateSelectionGeometry(leftRatio * scale.clientWidth, widthRatio * scale.clientWidth);
  }

  function renderDropdown(type, placeholder) {
    const options = dropdownOptions[type]
      .map((option) => `<button class="fill-area__option" type="button" role="option" data-value="${option}">${option}</button>`)
      .join('');
    return `<div class="fill-area__select" data-dropdown="${type}">
      <button class="fill-area__field is-placeholder" type="button" aria-haspopup="listbox" aria-expanded="false">${placeholder}</button>
      <div class="fill-area__dropdown" role="listbox" hidden>${options}</div>
    </div>`;
  }

  function closeDropdowns(except = null) {
    fillContent.querySelectorAll('.fill-area__select.is-open').forEach((select) => {
      if (select === except) return;
      select.classList.remove('is-open');
      select.querySelector('.fill-area__field').setAttribute('aria-expanded', 'false');
      select.querySelector('.fill-area__dropdown').hidden = true;
      select.querySelector('.fill-area__field').removeAttribute('aria-activedescendant');
      select.querySelectorAll('.fill-area__option.is-highlighted').forEach((option) => option.classList.remove('is-highlighted'));
    });
  }

  function highlightDropdownOption(select, index) {
    const options = [...select.querySelectorAll('.fill-area__option')];
    if (!options.length) return;
    const normalizedIndex = Math.max(0, Math.min(index, options.length - 1));
    options.forEach((option, optionIndex) => option.classList.toggle('is-highlighted', optionIndex === normalizedIndex));
    select.querySelector('.fill-area__field').setAttribute('aria-activedescendant', options[normalizedIndex].id);
    options[normalizedIndex].scrollIntoView({ block: 'nearest' });
  }

  function setDropdownOpen(select, open) {
    const field = select.querySelector('.fill-area__field');
    closeDropdowns(open ? select : null);
    select.classList.toggle('is-open', open);
    field.setAttribute('aria-expanded', String(open));
    select.querySelector('.fill-area__dropdown').hidden = !open;
    if (open) {
      const options = [...select.querySelectorAll('.fill-area__option')];
      const selectedIndex = Math.max(0, options.findIndex((option) => option.classList.contains('is-selected')));
      highlightDropdownOption(select, selectedIndex);
    }
  }

  function chooseDropdownOption(option, moveToNextField = false) {
    const select = option.closest('.fill-area__select');
    const field = select.querySelector('.fill-area__field');
    field.textContent = option.dataset.value;
    field.classList.remove('is-placeholder');
    select.querySelectorAll('.fill-area__option').forEach((item) => item.classList.toggle('is-selected', item === option));
    setDropdownOpen(select, false);
    if (moveToNextField) {
      const rowFields = [...select.closest('.fill-area__row--action').querySelectorAll('.fill-area__select > .fill-area__field')];
      const nextField = rowFields[rowFields.indexOf(field) + 1];
      (nextField || field).focus({ preventScroll: true });
    } else {
      field.focus({ preventScroll: true });
    }
  }

  fillContent.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('button[aria-label="删除"]');
    if (deleteButton) {
      const row = deleteButton.closest('.fill-area__row[data-segment-id]');
      const segmentId = row?.dataset.segmentId;
      if (!segmentId) return;
      recordHistory();
      segmentTrack.querySelector(`.annotation-segment[data-segment-id="${segmentId}"]`)?.remove();
      row.remove();
      const remaining = segmentTrack.querySelectorAll('.annotation-segment').length;
      count.textContent = String(remaining);
      if (remaining === 0) {
        segmentCount = 0;
        linkedSegmentId = null;
        fillContent.innerHTML = '<div class="fill-area__empty">暂无标注数据</div>';
      }
      else if (row.classList.contains('is-active')) {
        const fallbackRow = fillContent.querySelector('.fill-area__row--action:last-child');
        if (fallbackRow) activateSegment(fallbackRow.dataset.segmentId);
      }
      updateMergeSelection();
      return;
    }

    const clickedRow = event.target.closest('.fill-area__row--action[data-segment-id]');
    if (clickedRow) activateSegment(clickedRow.dataset.segmentId);

    const option = event.target.closest('.fill-area__option');
    if (option) {
      chooseDropdownOption(option);
      return;
    }

    const field = event.target.closest('.fill-area__select > .fill-area__field');
    if (!field) return;
    const select = field.closest('.fill-area__select');
    const willOpen = !select.classList.contains('is-open');
    setDropdownOpen(select, willOpen);
  });

  fillContent.addEventListener('keydown', (event) => {
    const field = event.target.closest('.fill-area__select > .fill-area__field');
    if (!field) return;
    const select = field.closest('.fill-area__select');
    const isOpen = select.classList.contains('is-open');
    if (event.altKey && ['ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      const currentRow = field.closest('.fill-area__row--action');
      const rowFields = [...currentRow.querySelectorAll('.fill-area__select > .fill-area__field')];
      const currentFieldIndex = rowFields.indexOf(field);
      const targetField = rowFields[currentFieldIndex + (event.key === 'ArrowUp' ? -1 : 1)];
      setDropdownOpen(select, false);
      targetField?.focus({ preventScroll: true });
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      if (!isOpen) {
        setDropdownOpen(select, true);
      } else {
        const highlighted = select.querySelector('.fill-area__option.is-highlighted');
        if (highlighted) chooseDropdownOption(highlighted);
        else setDropdownOpen(select, false);
      }
      return;
    }
    if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      if (isOpen) {
        const options = [...select.querySelectorAll('.fill-area__option')];
        const currentIndex = options.findIndex((option) => option.classList.contains('is-highlighted'));
        highlightDropdownOption(select, currentIndex + (event.key === 'ArrowDown' ? 1 : -1));
        return;
      }
      const currentRow = field.closest('.fill-area__row--action');
      const rows = [...fillContent.querySelectorAll('.fill-area__row--action')];
      const currentRowIndex = rows.indexOf(currentRow);
      const targetRow = rows[currentRowIndex + (event.key === 'ArrowUp' ? -1 : 1)];
      if (!targetRow) return;
      const currentFields = [...currentRow.querySelectorAll('.fill-area__select > .fill-area__field')];
      const fieldIndex = currentFields.indexOf(field);
      setDropdownOpen(select, false);
      activateSegment(targetRow.dataset.segmentId);
      const targetFields = targetRow.querySelectorAll('.fill-area__select > .fill-area__field');
      targetFields[Math.max(0, fieldIndex)]?.focus({ preventScroll: true });
      return;
    }
    if (isOpen && event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      setDropdownOpen(select, false);
    }
  });

  document.addEventListener('click', (event) => {
    if (!fillArea.contains(event.target)) closeDropdowns();
  });

  function addSegment() {
    const scaleBounds = scale.getBoundingClientRect();
    const selectionBounds = selection.getBoundingClientRect();
    const leftRatio = (selectionBounds.left - scaleBounds.left) / scaleBounds.width;
    const widthRatio = selectionBounds.width / scaleBounds.width;
    const rightRatio = leftRatio + widthRatio;
    const hasConflict = [...segmentTrack.querySelectorAll('.annotation-segment')].some((existing) => {
      const existingLeft = Number.parseFloat(existing.style.left) / 100;
      const existingRight = existingLeft + Number.parseFloat(existing.style.width) / 100;
      const overlapRatio = Math.min(rightRatio, existingRight) - Math.max(leftRatio, existingLeft);
      return overlapRatio * scaleBounds.width > 2;
    });
    if (hasConflict) {
      showAnnotationToast('当前标注段与已有标注段存在时间重叠，请调整时间范围');
      return false;
    }

    recordHistory();
    segmentCount += 1;
    const segment = document.createElement('i');
    const colorIndex = (segmentCount - 1) % segmentColors.length;
    segment.className = 'annotation-segment';
    segment.dataset.segmentId = String(segmentCount);
    segment.dataset.colorClass = ['blue', 'orange', 'purple', 'green'][colorIndex];
    segment.style.left = `${leftRatio * 100}%`;
    segment.style.width = `${widthRatio * 100}%`;
    segment.style.background = segmentColors[colorIndex];
    segmentTrack.append(segment);
    count.textContent = String(segmentTrack.querySelectorAll('.annotation-segment').length);
    renderRightRow(segmentCount, segment.dataset.colorClass);
    activateSegment(segment.dataset.segmentId);
    return true;
  }

  function showAnnotationToast(message) {
    window.clearTimeout(toastTimer);
    annotationToast.querySelector('p').textContent = message;
    annotationToast.classList.add('is-visible');
    toastTimer = window.setTimeout(() => annotationToast.classList.remove('is-visible'), 3200);
  }

  function createHistorySnapshot() {
    return {
      segmentCount,
      linkedSegmentId,
      count: count.textContent,
      fillContent: fillContent.innerHTML,
      selectionLeft: Number.parseFloat(getComputedStyle(selection).left) || 0,
      selectionWidth: selection.getBoundingClientRect().width,
      segments: [...segmentTrack.querySelectorAll('.annotation-segment')].map((segment) => ({
        className: segment.className,
        segmentId: segment.dataset.segmentId,
        colorClass: segment.dataset.colorClass,
        left: segment.style.left,
        width: segment.style.width,
        background: segment.style.background
      }))
    };
  }

  function recordHistory() {
    historyStack.push(createHistorySnapshot());
    if (historyStack.length > 50) historyStack.shift();
  }

  function restoreHistorySnapshot(snapshot) {
    segmentTrack.querySelectorAll('.annotation-segment').forEach((segment) => segment.remove());
    snapshot.segments.forEach((data) => {
      const segment = document.createElement('i');
      segment.className = data.className;
      segment.dataset.segmentId = data.segmentId;
      segment.dataset.colorClass = data.colorClass;
      segment.style.left = data.left;
      segment.style.width = data.width;
      segment.style.background = data.background;
      segmentTrack.append(segment);
    });
    segmentCount = snapshot.segmentCount;
    linkedSegmentId = snapshot.linkedSegmentId;
    count.textContent = snapshot.count;
    fillContent.innerHTML = snapshot.fillContent;
    updateSelectionGeometry(snapshot.selectionLeft, snapshot.selectionWidth);
    updateMergeSelection();
  }

  function undoLastAction() {
    const snapshot = historyStack.pop();
    if (snapshot) restoreHistorySnapshot(snapshot);
  }

  function clearSegments() {
    if (!segmentTrack.querySelector('.annotation-segment')) return;
    recordHistory();
    segmentCount = 0;
    linkedSegmentId = null;
    segmentTrack.querySelectorAll('.annotation-segment').forEach((segment) => segment.remove());
    count.textContent = '0';
    fillContent.innerHTML = '<div class="fill-area__empty">暂无标注数据</div>';
    updateMergeSelection();
  }

  function advanceSelection() {
    const scaleBounds = scale.getBoundingClientRect();
    const selectionBounds = selection.getBoundingClientRect();
    const currentLeft = selectionBounds.left - scaleBounds.left;
    const position = moveElement(selection, scale, scaleBounds.left + currentLeft + selectionBounds.width, 0);
    timelineCard.style.setProperty('--segment-selection-left', `${position.left}px`);
    selection.setAttribute('aria-valuenow', String(position.maxLeft ? Math.round((position.left / position.maxLeft) * 100) : 0));
    updateTimeLabels(position.left, selectionBounds.width);
    linkedSegmentId = null;
  }

  addButton.addEventListener('click', addSegment);
  addAndForwardButton.addEventListener('click', () => {
    if (addSegment()) advanceSelection();
  });
  onlyForwardButton.addEventListener('click', advanceSelection);

  clearButton.addEventListener('click', clearSegments);
  updateTimeLabels(Number.parseFloat(getComputedStyle(selection).left) || 0, selection.getBoundingClientRect().width);
}

if (pageId === 'action-spot-check') {
  document.title = '动作标注-抽检';

  configureTaskHeader({
    ariaLabel: '任务信息-抽检',
    breadcrumbCurrent: '供应商抽检',
    currentNode: '供应商抽检',
    status: '待抽检',
    previousNode: '动作标注 · 供应商A · 提交 · 前序节点处理完成 · 已流转至当前节点'
  });

  const mediaViewer = document.querySelector('[data-component="media-viewer"]');
  mediaViewer.dataset.variant = 'four-equal-feeds';
  mediaViewer.setAttribute('aria-label', '视频区-四格');
  mediaViewer.querySelector('.media-viewer__grid').innerHTML = `
    <figure class="media-viewer__feed"><img class="media-viewer__image" src="../../components/media-viewer/assets/camera-head.png" alt="左臂视角视频画面" /><figcaption class="media-viewer__label"><span>左臂视角</span><button class="media-viewer__fullscreen" type="button" aria-label="全屏查看左臂视角" title="全屏"><span aria-hidden="true">⛶</span></button></figcaption></figure>
    <figure class="media-viewer__feed"><img class="media-viewer__image" src="../../components/media-viewer/assets/camera-head.png" alt="右臂视角视频画面" /><figcaption class="media-viewer__label"><span>右臂视角</span><button class="media-viewer__fullscreen" type="button" aria-label="全屏查看右臂视角" title="全屏"><span aria-hidden="true">⛶</span></button></figcaption></figure>
    <figure class="media-viewer__feed"><img class="media-viewer__image" src="../../components/media-viewer/assets/camera-left-arm.png" alt="头部视角视频画面" /><figcaption class="media-viewer__label"><span>头部视角</span><button class="media-viewer__fullscreen" type="button" aria-label="全屏查看头部视角" title="全屏"><span aria-hidden="true">⛶</span></button></figcaption></figure>
    <figure class="media-viewer__feed"><img class="media-viewer__image" src="../../components/media-viewer/assets/camera-right-arm.png" alt="头部结束帧画面" /><figcaption class="media-viewer__label media-viewer__label--wide"><span>头部结束帧</span><button class="media-viewer__fullscreen" type="button" aria-label="全屏查看头部结束帧" title="全屏"><span aria-hidden="true">⛶</span></button></figcaption></figure>`;

  const timeline = document.querySelector('[data-component="annotation-timeline"]');
  timeline.dataset.variant = 'action-annotation';
  timeline.setAttribute('aria-label', '动作标注-抽检时间轴');
  timeline.innerHTML = `
    <div class="timeline-slot"><div class="timeline-card timeline-card--segments"><div class="timeline-ruler"><img class="ruler-start" src="../../components/annotation-timeline/assets/icon-timeline-start.svg" alt="" /><img class="marker marker--red" src="../../components/annotation-timeline/assets/icon-marker-red.svg" alt="" /><img class="marker marker--orange marker--two" src="../../components/annotation-timeline/assets/icon-marker-orange.svg" alt="" /><div class="segment-scale"><span class="segment-progress"></span></div><div class="scale-labels"><span>00:00s</span><span>00:10s</span></div></div><div class="annotation-row"><b class="row-count">14</b><div class="color-segments"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div></div></div>
    <div class="controls-slot"><div class="control-panel"><div class="transport-tools"><button class="tool-button tool-button--primary" type="button" data-action="toggle-play"><img src="../../components/annotation-timeline/assets/icon-play.svg" alt="播放" /></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-skip-prev.svg" alt="上一帧" /></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-skip-next.svg" alt="下一帧" /></button><button class="tool-button tool-button--speed" type="button"><b>2x</b><span>倍速</span></button></div><div class="annotation-tools"><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-plus.svg" alt="" /><span>添加</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-plus-forward.svg" alt="" /><span>添加并前进</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-forward.svg" alt="" /><span>仅前进</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-eraser.svg" alt="" /><span>清空</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-drag.svg" alt="" /><span>拖动</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-scissors.svg" alt="" /><span>分割</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-scissors.svg" alt="" /><span>父级分割</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-merge.svg" alt="" /><span>合并</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-merge-up.svg" alt="" /><span>向上合并</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-merge-down.svg" alt="" /><span>向下合并</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-source-first.svg" alt="" /><span>源视频优先</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-keyboard.svg" alt="" /><span>快捷键</span></button></div></div></div>`;

  const fillArea = document.querySelector('[data-component="fill-area"]');
  fillArea.dataset.variant = 'action-spot-check';
  setFillAreaTitle(fillArea, '抽检');
  const colors = ['blue', 'orange', 'purple', 'green'];
  const labels = ['选择错误原因', '选择错误原因', '选择或输入动作描述', '选择或输入动作描述'];
  fillArea.querySelector('.fill-area__content').innerHTML = `<div class="fill-area__list">${colors.map((color, index) => `
    <article class="fill-area__row fill-area__row--action-check"><b>0${index + 1}</b><div class="fill-area__row-main"><div class="fill-area__row-top fill-area__action-check-top"><time>06:15~06:15(4:40:47)</time><i class="fill-area__color fill-area__color--${color}"></i><button type="button" aria-label="删除"><img src="../../components/fill-area/assets/icon-trash.svg" alt="" /></button></div><button class="fill-area__field" type="button"><span class="fill-area__chip">高的 <img src="../../components/fill-area/assets/icon-close.svg" alt="" /></span></button><div class="fill-area__field-row"><button class="fill-area__field" type="button"><span class="fill-area__chip">夹取 <img src="../../components/fill-area/assets/icon-close.svg" alt="" /></span></button><img class="fill-area__ban" src="../../components/fill-area/assets/icon-ban.svg" alt="" /></div><button class="fill-area__field is-placeholder" type="button">${labels[index]}</button></div></article>`).join('')}</div>`;
  fillArea.querySelector('.fill-area__footer').innerHTML = '<button class="fill-area__button fill-area__button--primary" type="button">通过</button><button class="fill-area__button" type="button">采集-不合格</button><button class="fill-area__button" type="button">驳回-标注</button><button class="fill-area__button" type="button">暂离</button>';
}

if (pageId === 'semantic-segmentation') {
  document.title = '语义切分';

  configureTaskHeader({
    ariaLabel: '任务信息-语义切分',
    breadcrumbCurrent: '语义切分',
    currentNode: '语义标注',
    status: '待切分',
    previousNode: null
  });

  const mediaViewer = document.querySelector('[data-component="media-viewer"]');
  mediaViewer.dataset.variant = 'four-equal-feeds';
  mediaViewer.setAttribute('aria-label', '视频区-四格');
  mediaViewer.querySelector('.media-viewer__grid').innerHTML = `
    <figure class="media-viewer__feed"><img class="media-viewer__image" src="../../components/media-viewer/assets/camera-head.png" alt="左臂视角视频画面" /><figcaption class="media-viewer__label"><span>左臂视角</span><button class="media-viewer__fullscreen" type="button" aria-label="全屏查看左臂视角" title="全屏"><span aria-hidden="true">⛶</span></button></figcaption></figure>
    <figure class="media-viewer__feed"><img class="media-viewer__image" src="../../components/media-viewer/assets/camera-head.png" alt="右臂视角视频画面" /><figcaption class="media-viewer__label"><span>右臂视角</span><button class="media-viewer__fullscreen" type="button" aria-label="全屏查看右臂视角" title="全屏"><span aria-hidden="true">⛶</span></button></figcaption></figure>
    <figure class="media-viewer__feed"><img class="media-viewer__image" src="../../components/media-viewer/assets/camera-left-arm.png" alt="头部视角视频画面" /><figcaption class="media-viewer__label"><span>头部视角</span><button class="media-viewer__fullscreen" type="button" aria-label="全屏查看头部视角" title="全屏"><span aria-hidden="true">⛶</span></button></figcaption></figure>
    <figure class="media-viewer__feed"><img class="media-viewer__image" src="../../components/media-viewer/assets/camera-right-arm.png" alt="头部结束帧画面" /><figcaption class="media-viewer__label media-viewer__label--wide"><span>头部结束帧</span><button class="media-viewer__fullscreen" type="button" aria-label="全屏查看头部结束帧" title="全屏"><span aria-hidden="true">⛶</span></button></figcaption></figure>`;

  const timeline = document.querySelector('[data-component="annotation-timeline"]');
  timeline.dataset.variant = 'semantic-segmentation';
  timeline.setAttribute('aria-label', '语义标注-切分时间轴');
  timeline.innerHTML = `
    <div class="timeline-slot"><div class="timeline-card timeline-card--segments"><div class="timeline-ruler"><img class="ruler-start" src="../../components/annotation-timeline/assets/icon-timeline-start.svg" alt="" /><img class="marker marker--red" src="../../components/annotation-timeline/assets/icon-marker-red.svg" alt="" /><img class="marker marker--orange marker--two" src="../../components/annotation-timeline/assets/icon-marker-orange.svg" alt="" /><div class="segment-scale"><span class="segment-progress"></span></div><div class="scale-labels"><span>00:00s</span><span>00:10s</span></div></div><div class="annotation-row"><b class="row-count">14</b><div class="color-segments"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div><div class="annotation-row"><b class="row-count">6</b><div class="labeled-segments"><span>Default</span><span>Default</span></div></div></div></div>
    <div class="controls-slot"><div class="control-panel"><div class="transport-tools"><button class="tool-button tool-button--primary" type="button" data-action="toggle-play"><img src="../../components/annotation-timeline/assets/icon-play.svg" alt="播放" /></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-skip-prev.svg" alt="上一帧" /></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-skip-next.svg" alt="下一帧" /></button><button class="tool-button tool-button--speed" type="button"><b>2x</b><span>倍速</span></button></div><div class="annotation-tools"><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-plus.svg" alt="" /><span>添加</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-plus-forward.svg" alt="" /><span>添加并前进</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-forward.svg" alt="" /><span>仅前进</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-eraser.svg" alt="" /><span>清空</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-drag.svg" alt="" /><span>拖动</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-scissors.svg" alt="" /><span>分割</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-scissors.svg" alt="" /><span>父级分割</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-merge.svg" alt="" /><span>合并</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-merge-up.svg" alt="" /><span>向上合并</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-merge-down.svg" alt="" /><span>向下合并</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-source-first.svg" alt="" /><span>源视频优先</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-keyboard.svg" alt="" /><span>快捷键</span></button></div></div></div>`;

  const fillArea = document.querySelector('[data-component="fill-area"]');
  fillArea.dataset.variant = 'semantic-segmentation';
  setFillAreaTitle(fillArea, '切分');
  const parent = (id, open = false) => `<article class="fill-area__tree-item${open ? ' is-open' : ''}"><div class="fill-area__tree-parent">${open ? `<button class="fill-area__tree-badge fill-area__tree-toggle" type="button" aria-expanded="true" aria-controls="semantic-page-${id}" aria-label="收起 ${id} 子片段"><img src="../../components/fill-area/assets/icon-tree-chevron.svg" alt="" />${id}</button>` : `<span class="fill-area__tree-badge">${id}</span>`}<time>06:15~06:15(4:40:47)</time><button type="button" aria-label="删除"><img src="../../components/fill-area/assets/icon-trash.svg" alt="" /></button></div>${open ? `<div class="fill-area__tree-children" id="semantic-page-${id}">${['01','02','03'].map((child) => `<div><span>${child}</span><time>06:15~06:15(4:40:47)</time><button type="button" aria-label="删除"><img src="../../components/fill-area/assets/icon-trash.svg" alt="" /></button></div>`).join('')}</div>` : ''}</article>`;
  fillArea.querySelector('.fill-area__content').innerHTML = `<div class="fill-area__tree-list">${parent('01')}${parent('02', true)}${parent('03')}${parent('04', true)}${parent('05')}${parent('06')}</div>`;
  fillArea.querySelector('.fill-area__footer').innerHTML = '<button class="fill-area__button fill-area__button--primary" type="button">提交</button><button class="fill-area__button" type="button">暂离</button>';
}

if (pageId === 'semantic-segmentation-spot-check') {
  document.title = '切分抽检';

  configureTaskHeader({
    ariaLabel: '任务信息-切分抽检',
    breadcrumbCurrent: '切分抽检',
    currentNode: '供应商抽检',
    status: '待抽检',
    previousNode: '语义标注 · 供应商A · 提交 · 前序节点处理完成 · 已流转至当前节点'
  });

  const mediaViewer = document.querySelector('[data-component="media-viewer"]');
  mediaViewer.dataset.variant = 'four-equal-feeds';
  mediaViewer.setAttribute('aria-label', '视频区-四格');
  mediaViewer.querySelector('.media-viewer__grid').innerHTML = `
    <figure class="media-viewer__feed"><img class="media-viewer__image" src="../../components/media-viewer/assets/camera-head.png" alt="左臂视角视频画面" /><figcaption class="media-viewer__label"><span>左臂视角</span><button class="media-viewer__fullscreen" type="button" aria-label="全屏查看左臂视角" title="全屏"><span aria-hidden="true">⛶</span></button></figcaption></figure>
    <figure class="media-viewer__feed"><img class="media-viewer__image" src="../../components/media-viewer/assets/camera-head.png" alt="右臂视角视频画面" /><figcaption class="media-viewer__label"><span>右臂视角</span><button class="media-viewer__fullscreen" type="button" aria-label="全屏查看右臂视角" title="全屏"><span aria-hidden="true">⛶</span></button></figcaption></figure>
    <figure class="media-viewer__feed"><img class="media-viewer__image" src="../../components/media-viewer/assets/camera-left-arm.png" alt="头部视角视频画面" /><figcaption class="media-viewer__label"><span>头部视角</span><button class="media-viewer__fullscreen" type="button" aria-label="全屏查看头部视角" title="全屏"><span aria-hidden="true">⛶</span></button></figcaption></figure>
    <figure class="media-viewer__feed"><img class="media-viewer__image" src="../../components/media-viewer/assets/camera-right-arm.png" alt="头部结束帧画面" /><figcaption class="media-viewer__label media-viewer__label--wide"><span>头部结束帧</span><button class="media-viewer__fullscreen" type="button" aria-label="全屏查看头部结束帧" title="全屏"><span aria-hidden="true">⛶</span></button></figcaption></figure>`;

  const timeline = document.querySelector('[data-component="annotation-timeline"]');
  timeline.dataset.variant = 'semantic-segmentation';
  timeline.setAttribute('aria-label', '语义标注-切分抽检时间轴');
  timeline.innerHTML = `
    <div class="timeline-slot"><div class="timeline-card timeline-card--segments"><div class="timeline-ruler"><img class="ruler-start" src="../../components/annotation-timeline/assets/icon-timeline-start.svg" alt="" /><img class="marker marker--red" src="../../components/annotation-timeline/assets/icon-marker-red.svg" alt="" /><img class="marker marker--orange marker--two" src="../../components/annotation-timeline/assets/icon-marker-orange.svg" alt="" /><div class="segment-scale"><span class="segment-progress"></span></div><div class="scale-labels"><span>00:00s</span><span>00:10s</span></div></div><div class="annotation-row"><b class="row-count">14</b><div class="color-segments"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div><div class="annotation-row"><b class="row-count">6</b><div class="labeled-segments"><span>Default</span><span>Default</span></div></div></div></div>
    <div class="controls-slot"><div class="control-panel"><div class="transport-tools"><button class="tool-button tool-button--primary" type="button" data-action="toggle-play"><img src="../../components/annotation-timeline/assets/icon-play.svg" alt="播放" /></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-skip-prev.svg" alt="上一帧" /></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-skip-next.svg" alt="下一帧" /></button><button class="tool-button tool-button--speed" type="button"><b>2x</b><span>倍速</span></button></div><div class="annotation-tools"><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-plus.svg" alt="" /><span>添加</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-plus-forward.svg" alt="" /><span>添加并前进</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-forward.svg" alt="" /><span>仅前进</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-eraser.svg" alt="" /><span>清空</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-drag.svg" alt="" /><span>拖动</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-scissors.svg" alt="" /><span>分割</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-scissors.svg" alt="" /><span>父级分割</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-merge.svg" alt="" /><span>合并</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-merge-up.svg" alt="" /><span>向上合并</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-merge-down.svg" alt="" /><span>向下合并</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-source-first.svg" alt="" /><span>源视频优先</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-keyboard.svg" alt="" /><span>快捷键</span></button></div></div></div>`;

  const fillArea = document.querySelector('[data-component="fill-area"]');
  fillArea.dataset.variant = 'semantic-segmentation-spot-check';
  setFillAreaTitle(fillArea, '切分抽检');
  const reviewItem = (id, open = false) => `<article class="fill-area__review-item${open ? ' is-open' : ''}"><div class="fill-area__tree-parent">${open ? `<button class="fill-area__tree-badge fill-area__tree-toggle" type="button" aria-expanded="true" aria-controls="segmentation-check-${id}" aria-label="收起 ${id} 子片段"><img src="../../components/fill-area/assets/icon-tree-chevron.svg" alt="" />${id}</button>` : `<span class="fill-area__tree-badge">${id}</span>`}<time>06:15~06:15(4:40:47)</time><button type="button" aria-label="删除"><img src="../../components/fill-area/assets/icon-trash.svg" alt="" /></button></div><div class="fill-area__review-branch"><button class="fill-area__field is-placeholder" type="button">选择错误原因</button></div>${open ? `<div class="fill-area__review-children" id="segmentation-check-${id}">${['01','02'].map((child) => `<div class="fill-area__review-child"><div class="fill-area__review-child-top"><span>${child}</span><time>06:15~06:15(4:40:47)</time><button type="button" aria-label="删除"><img src="../../components/fill-area/assets/icon-trash.svg" alt="" /></button></div><button class="fill-area__field is-placeholder" type="button">选择错误原因</button></div>`).join('')}</div>` : ''}</article>`;
  fillArea.querySelector('.fill-area__content').innerHTML = `<div class="fill-area__review-list">${reviewItem('01')}${reviewItem('02', true)}${reviewItem('03')}${reviewItem('04', true)}</div>`;
  const fillFooter = fillArea.querySelector('.fill-area__footer');
  fillFooter.className = 'fill-area__footer fill-area__footer--four';
  fillFooter.innerHTML = '<button class="fill-area__button fill-area__button--primary" type="button">通过</button><button class="fill-area__button" type="button">采集-不合格</button><button class="fill-area__button" type="button">驳回-标注</button><button class="fill-area__button" type="button">暂离</button>';
}

if (pageId === 'semantic-annotation-acceptance') {
  document.title = '标注验收';

  configureTaskHeader({
    ariaLabel: '任务信息-标注验收',
    breadcrumbCurrent: '标注验收',
    currentNode: '供应商验收',
    status: '待验收',
    previousNode: '语义切分 · 供应商A · 提交 · 前序节点处理完成 · 已流转至当前节点'
  });

  const mediaViewer = document.querySelector('[data-component="media-viewer"]');
  mediaViewer.dataset.variant = 'four-equal-feeds';
  mediaViewer.setAttribute('aria-label', '视频区-四格');
  mediaViewer.querySelector('.media-viewer__grid').innerHTML = `
    <figure class="media-viewer__feed"><img class="media-viewer__image" src="../../components/media-viewer/assets/camera-head.png" alt="左臂视角视频画面" /><figcaption class="media-viewer__label"><span>左臂视角</span><button class="media-viewer__fullscreen" type="button" aria-label="全屏查看左臂视角" title="全屏"><span aria-hidden="true">⛶</span></button></figcaption></figure>
    <figure class="media-viewer__feed"><img class="media-viewer__image" src="../../components/media-viewer/assets/camera-head.png" alt="右臂视角视频画面" /><figcaption class="media-viewer__label"><span>右臂视角</span><button class="media-viewer__fullscreen" type="button" aria-label="全屏查看右臂视角" title="全屏"><span aria-hidden="true">⛶</span></button></figcaption></figure>
    <figure class="media-viewer__feed"><img class="media-viewer__image" src="../../components/media-viewer/assets/camera-left-arm.png" alt="头部视角视频画面" /><figcaption class="media-viewer__label"><span>头部视角</span><button class="media-viewer__fullscreen" type="button" aria-label="全屏查看头部视角" title="全屏"><span aria-hidden="true">⛶</span></button></figcaption></figure>
    <figure class="media-viewer__feed"><img class="media-viewer__image" src="../../components/media-viewer/assets/camera-right-arm.png" alt="头部结束帧画面" /><figcaption class="media-viewer__label media-viewer__label--wide"><span>头部结束帧</span><button class="media-viewer__fullscreen" type="button" aria-label="全屏查看头部结束帧" title="全屏"><span aria-hidden="true">⛶</span></button></figcaption></figure>`;

  const timeline = document.querySelector('[data-component="annotation-timeline"]');
  timeline.dataset.variant = 'semantic-acceptance';
  timeline.setAttribute('aria-label', '语义标注-标注验收时间轴');
  timeline.innerHTML = `
    <div class="timeline-slot"><div class="timeline-card timeline-card--segments"><div class="timeline-ruler"><img class="ruler-start" src="../../components/annotation-timeline/assets/icon-timeline-start.svg" alt="" /><img class="marker marker--red" src="../../components/annotation-timeline/assets/icon-marker-red.svg" alt="" /><img class="marker marker--orange marker--two" src="../../components/annotation-timeline/assets/icon-marker-orange.svg" alt="" /><div class="segment-scale"><span class="segment-progress"></span></div><div class="scale-labels"><span>00:00s</span><span>00:10s</span></div></div><div class="annotation-row"><b class="row-count">14</b><div class="color-segments"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div><div class="annotation-row"><b class="row-count">1</b><div class="labeled-segments labeled-segments--full"><span>完成整段录制的前端测试V4预标注抽验任务</span></div></div></div></div>
    <div class="controls-slot"><div class="control-panel"><div class="transport-tools"><button class="tool-button tool-button--primary" type="button" data-action="toggle-play"><img src="../../components/annotation-timeline/assets/icon-play.svg" alt="播放" /></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-skip-prev.svg" alt="上一帧" /></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-skip-next.svg" alt="下一帧" /></button><button class="tool-button tool-button--speed" type="button"><b>2x</b><span>倍速</span></button></div><div class="annotation-tools"><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-plus.svg" alt="" /><span>添加</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-plus-forward.svg" alt="" /><span>添加并前进</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-forward.svg" alt="" /><span>仅前进</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-eraser.svg" alt="" /><span>清空</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-drag.svg" alt="" /><span>拖动</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-scissors.svg" alt="" /><span>分割</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-merge.svg" alt="" /><span>合并</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-merge-up.svg" alt="" /><span>向上合并</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-merge-down.svg" alt="" /><span>向下合并</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-source-first.svg" alt="" /><span>源视频优先</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-keyboard.svg" alt="" /><span>快捷键</span></button></div></div></div>`;

  const acceptanceSplitButton = [...timeline.querySelectorAll('.annotation-tools .tool-button')]
    .find((button) => button.textContent.trim() === '分割');
  acceptanceSplitButton?.insertAdjacentHTML('afterend', '<button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-scissors.svg" alt="" /><span>父级分割</span></button>');

  const fillArea = document.querySelector('[data-component="fill-area"]');
  fillArea.dataset.variant = 'semantic-annotation-acceptance';
  setFillAreaTitle(fillArea, '标注验收');
  const acceptanceChildren = [
    ['01', '观察并整理桌面物品（前端测试V4 预标注片段 1）'],
    ['02', '选择错移动遥控器到目标位置（前端测试V4 预标注片段 2）'],
    ['03', '打开或关闭抽屉（前端测试V4 预标注片段 3）'],
    ['04', '调整纸盒摆放位置（前端测试V4 预标注片段 4）']
  ];
  fillArea.querySelector('.fill-area__content').innerHTML = `<article class="fill-area__acceptance-item is-open"><div class="fill-area__tree-parent"><button class="fill-area__tree-badge fill-area__tree-toggle" type="button" aria-expanded="true" aria-controls="semantic-acceptance-01" aria-label="收起 01 子片段"><img src="../../components/fill-area/assets/icon-tree-chevron.svg" alt="" />01</button><time>06:15~06:15(4:40:47)</time><button type="button" aria-label="删除"><img src="../../components/fill-area/assets/icon-trash.svg" alt="" /></button></div><div class="fill-area__acceptance-branch"><div class="fill-area__description">完成整段录制的前端测试V4预标注抽验任务</div><button class="fill-area__field is-placeholder" type="button">选择错误原因</button></div><div class="fill-area__acceptance-children" id="semantic-acceptance-01">${acceptanceChildren.map(([id, description]) => `<div class="fill-area__acceptance-child"><div class="fill-area__review-child-top"><span>${id}</span><time>06:15~06:15(4:40:47)</time><button type="button" aria-label="删除"><img src="../../components/fill-area/assets/icon-trash.svg" alt="" /></button></div><div class="fill-area__description${id === '02' ? ' fill-area__description--wrap' : ''}">${description}</div><button class="fill-area__field is-placeholder" type="button">选择错误原因</button></div>`).join('')}</div></article>`;
  const fillFooter = fillArea.querySelector('.fill-area__footer');
  fillFooter.className = 'fill-area__footer fill-area__footer--three';
  fillFooter.innerHTML = '<button class="fill-area__button fill-area__button--primary" type="button">通过</button><button class="fill-area__button" type="button">采集-不合格</button><button class="fill-area__button" type="button">暂离</button>';
}

document.querySelectorAll('.fill-area__footer').forEach((footer) => {
  if ([...footer.querySelectorAll('.fill-area__button')].some((button) => button.textContent.trim() === '保存')) return;
  const saveButton = document.createElement('button');
  saveButton.className = 'fill-area__button';
  saveButton.type = 'button';
  saveButton.textContent = '保存';
  footer.append(saveButton);
});

document.querySelectorAll('.fill-area button[aria-label="删除"]').forEach((button) => {
  button.dataset.tooltip = '删除\nDelete';
});

document.querySelectorAll('.fill-area__tree-toggle').forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const item = toggle.closest('.fill-area__tree-item, .fill-area__review-item, .fill-area__acceptance-item');
    const children = document.getElementById(toggle.getAttribute('aria-controls'));
    const willOpen = !item.classList.contains('is-open');
    item.classList.toggle('is-open', willOpen);
    children.hidden = !willOpen;
    toggle.setAttribute('aria-expanded', String(willOpen));
  });
});

document.querySelectorAll('.media-viewer__fullscreen').forEach((button) => {
  button.addEventListener('click', async () => {
    const feed = button.closest('.media-viewer__feed');
    if (document.fullscreenElement === feed) return document.exitFullscreen();
    if (document.fullscreenElement) await document.exitFullscreen();
    await feed.requestFullscreen();
  });
});

document.querySelectorAll('.fill-area__severity').forEach((group) => {
  group.addEventListener('click', (event) => {
    const selected = event.target.closest('[data-severity]');
    if (!selected) return;
    group.querySelectorAll('[data-severity]').forEach((button) => button.classList.remove('is-selected'));
    selected.classList.add('is-selected');
  });
});

document.querySelectorAll('.fill-area button[aria-label="删除"]').forEach((button) => {
  button.addEventListener('click', () => button.closest('.fill-area__row')?.remove());
});

document.querySelectorAll('.fill-area__button').forEach((button) => {
  button.addEventListener('click', () => {
    const footer = button.closest('.fill-area__footer');
    footer.querySelectorAll('.fill-area__button').forEach((item) => item.classList.remove('fill-area__button--primary'));
    button.classList.add('fill-area__button--primary');
  });
});
