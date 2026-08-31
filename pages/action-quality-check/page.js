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

const themeButtons = document.querySelectorAll('.task-header__theme-button');
const savedTheme = localStorage.getItem('workbench-theme');
const initialTheme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';

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

applyTheme(initialTheme);

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const theme = button.getAttribute('aria-label') === '浅色主题' ? 'light' : 'dark';
    applyTheme(theme);
    localStorage.setItem('workbench-theme', theme);
  });
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
  fillArea.setAttribute('aria-label', '人工质检-质检抽检');

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
    <div class="controls-slot"><div class="control-panel"><div class="transport-tools"><button class="tool-button tool-button--primary" type="button" data-action="toggle-play"><img src="../../components/annotation-timeline/assets/icon-play.svg" alt="播放" /></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-skip-prev.svg" alt="上一帧" /></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-skip-next.svg" alt="下一帧" /></button><button class="tool-button tool-button--speed" type="button"><b>2x</b><span>倍速</span></button></div><div class="annotation-tools"><button class="tool-button" type="button" data-action="add-segment"><img src="../../components/annotation-timeline/assets/icon-plus.svg" alt="" /><span>添加</span></button><button class="tool-button tool-button--small-label" type="button" data-action="add-and-forward"><img src="../../components/annotation-timeline/assets/icon-plus-forward.svg" alt="" /><span>添加并前进</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-forward.svg" alt="" /><span>仅前进</span></button><button class="tool-button" type="button" data-action="clear-segments"><img src="../../components/annotation-timeline/assets/icon-eraser.svg" alt="" /><span>清空</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-drag.svg" alt="" /><span>拖动</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-scissors.svg" alt="" /><span>分割</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-merge.svg" alt="" /><span>合并</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-merge-up.svg" alt="" /><span>向上合并</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-merge-down.svg" alt="" /><span>向下合并</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-source-first.svg" alt="" /><span>源视频优先</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-keyboard.svg" alt="" /><span>快捷键</span></button></div></div></div>`;

  const fillArea = document.querySelector('[data-component="fill-area"]');
  fillArea.dataset.variant = 'action-annotation';
  fillArea.setAttribute('aria-label', '动作标注-标注');
  const fillContent = fillArea.querySelector('.fill-area__content');
  fillContent.innerHTML = '<div class="fill-area__empty">暂无标注数据</div>';
  fillArea.querySelector('.fill-area__footer').innerHTML = '<button class="fill-area__button fill-area__button--primary" type="button">通过</button><button class="fill-area__button" type="button">采集-不合格</button><button class="fill-area__button" type="button">驳回-标注</button><button class="fill-area__button" type="button">暂离</button>';
  const buttons = fillArea.querySelectorAll('.fill-area__button');
  buttons[0].textContent = '通过';
  buttons[1].textContent = '采集-不合格';
  buttons[2].textContent = '驳回-标注';
  buttons[3].textContent = '暂离';

  const timelineCard = timeline.querySelector('.timeline-card--segments');
  const scale = timeline.querySelector('.segment-scale');
  const selection = timeline.querySelector('.segment-progress');
  const resizeStart = timeline.querySelector('.segment-resize-handle--start');
  const resizeEnd = timeline.querySelector('.segment-resize-handle--end');
  const segmentTrack = timeline.querySelector('.color-segments--interactive');
  const count = timeline.querySelector('.row-count');
  const addButton = timeline.querySelector('[data-action="add-segment"]');
  const addAndForwardButton = timeline.querySelector('[data-action="add-and-forward"]');
  const clearButton = timeline.querySelector('[data-action="clear-segments"]');
  const segmentColors = ['#399ed0', '#d06b39', '#9139d0', '#39d078'];
  const dropdownOptions = {
    element: ['机械臂', '夹爪', '目标物体', '工作台', '收纳区域'],
    description: ['抓取物体', '移动物体', '放置物体', '调整姿态', '松开夹爪']
  };
  let segmentCount = 0;

  function updateSelectionGeometry(left, width) {
    selection.style.left = `${left}px`;
    selection.style.width = `${width}px`;
    timelineCard.style.setProperty('--segment-selection-left', `${left}px`);
    timelineCard.style.setProperty('--segment-progress-width', `${width}px`);
    const maxLeft = Math.max(0, scale.clientWidth - width);
    selection.setAttribute('aria-valuenow', String(maxLeft ? Math.round((left / maxLeft) * 100) : 0));
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
  });
  makeResizable(resizeStart, 'start');
  makeResizable(resizeEnd, 'end');

  selection.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const current = Number.parseFloat(getComputedStyle(selection).left) || 0;
    const nextX = scale.getBoundingClientRect().left + current + (event.key === 'ArrowLeft' ? -8 : 8);
    const position = moveElement(selection, scale, nextX, 0);
    timelineCard.style.setProperty('--segment-selection-left', `${position.left}px`);
  });

  function renderRightRow(index, colorClass) {
    if (segmentCount === 1) fillContent.innerHTML = '<div class="fill-area__list"></div>';
    fillContent.querySelector('.fill-area__list').insertAdjacentHTML('beforeend', `
      <article class="fill-area__row fill-area__row--action" data-segment-id="${index}">
        <b>${String(index).padStart(2, '0')}</b><div class="fill-area__row-main"><div class="fill-area__row-top fill-area__action-top"><time>06:15~06:15(4:40:47)</time><i class="fill-area__color fill-area__color--${colorClass}"></i><button type="button" aria-label="删除"><img src="../../components/fill-area/assets/icon-trash.svg" alt="" /></button></div>
        ${renderDropdown('element', '请选择动作元素')}
        <div class="fill-area__field-row">${renderDropdown('description', '选择或输入动作描述')}<img class="fill-area__ban" src="../../components/fill-area/assets/icon-ban.svg" alt="" /></div></div>
      </article>`);
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
    });
  }

  fillContent.addEventListener('click', (event) => {
    const option = event.target.closest('.fill-area__option');
    if (option) {
      const select = option.closest('.fill-area__select');
      const field = select.querySelector('.fill-area__field');
      field.textContent = option.dataset.value;
      field.classList.remove('is-placeholder');
      select.querySelectorAll('.fill-area__option').forEach((item) => item.classList.toggle('is-selected', item === option));
      closeDropdowns();
      return;
    }

    const field = event.target.closest('.fill-area__select > .fill-area__field');
    if (!field) return;
    const select = field.closest('.fill-area__select');
    const willOpen = !select.classList.contains('is-open');
    closeDropdowns(select);
    select.classList.toggle('is-open', willOpen);
    field.setAttribute('aria-expanded', String(willOpen));
    select.querySelector('.fill-area__dropdown').hidden = !willOpen;
  });

  document.addEventListener('click', (event) => {
    if (!fillArea.contains(event.target)) closeDropdowns();
  });

  function addSegment() {
    segmentCount += 1;
    const scaleBounds = scale.getBoundingClientRect();
    const selectionBounds = selection.getBoundingClientRect();
    const leftRatio = (selectionBounds.left - scaleBounds.left) / scaleBounds.width;
    const widthRatio = selectionBounds.width / scaleBounds.width;
    const segment = document.createElement('i');
    const colorIndex = (segmentCount - 1) % segmentColors.length;
    segment.className = 'annotation-segment';
    segment.dataset.segmentId = String(segmentCount);
    segment.style.left = `${leftRatio * 100}%`;
    segment.style.width = `${widthRatio * 100}%`;
    segment.style.background = segmentColors[colorIndex];
    segmentTrack.append(segment);
    count.textContent = String(segmentCount);
    renderRightRow(segmentCount, ['blue', 'orange', 'purple', 'green'][colorIndex]);
  }

  function advanceSelection() {
    const scaleBounds = scale.getBoundingClientRect();
    const selectionBounds = selection.getBoundingClientRect();
    const currentLeft = selectionBounds.left - scaleBounds.left;
    const position = moveElement(selection, scale, scaleBounds.left + currentLeft + selectionBounds.width, 0);
    timelineCard.style.setProperty('--segment-selection-left', `${position.left}px`);
    selection.setAttribute('aria-valuenow', String(position.maxLeft ? Math.round((position.left / position.maxLeft) * 100) : 0));
  }

  addButton.addEventListener('click', addSegment);
  addAndForwardButton.addEventListener('click', () => {
    addSegment();
    advanceSelection();
  });

  clearButton.addEventListener('click', () => {
    segmentCount = 0;
    segmentTrack.replaceChildren();
    count.textContent = '0';
    fillContent.innerHTML = '<div class="fill-area__empty">暂无标注数据</div>';
  });
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
    <div class="controls-slot"><div class="control-panel"><div class="transport-tools"><button class="tool-button tool-button--primary" type="button" data-action="toggle-play"><img src="../../components/annotation-timeline/assets/icon-play.svg" alt="播放" /></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-skip-prev.svg" alt="上一帧" /></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-skip-next.svg" alt="下一帧" /></button><button class="tool-button tool-button--speed" type="button"><b>2x</b><span>倍速</span></button></div><div class="annotation-tools"><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-plus.svg" alt="" /><span>添加</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-plus-forward.svg" alt="" /><span>添加并前进</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-forward.svg" alt="" /><span>仅前进</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-eraser.svg" alt="" /><span>清空</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-drag.svg" alt="" /><span>拖动</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-scissors.svg" alt="" /><span>分割</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-merge.svg" alt="" /><span>合并</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-merge-up.svg" alt="" /><span>向上合并</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-merge-down.svg" alt="" /><span>向下合并</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-source-first.svg" alt="" /><span>源视频优先</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-keyboard.svg" alt="" /><span>快捷键</span></button></div></div></div>`;

  const fillArea = document.querySelector('[data-component="fill-area"]');
  fillArea.dataset.variant = 'action-spot-check';
  fillArea.setAttribute('aria-label', '动作标注-抽检');
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
  fillArea.setAttribute('aria-label', '语义标注-切分');
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
  fillArea.setAttribute('aria-label', '语义标注-切分抽检');
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

  const fillArea = document.querySelector('[data-component="fill-area"]');
  fillArea.dataset.variant = 'semantic-annotation-acceptance';
  fillArea.setAttribute('aria-label', '语义标注-标注验收');
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

document.querySelectorAll('.fill-area button[aria-label="删除"]').forEach((button) => {
  button.dataset.tooltip = '删除';
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
