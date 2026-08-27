const pageId = document.body.dataset.pageId;

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

  const taskHeader = document.querySelector('[data-component="task-header"]');
  taskHeader.dataset.variant = 'spot-check';
  taskHeader.setAttribute('aria-label', '任务信息-抽检');
  taskHeader.querySelector('.task-header__chip--current strong').textContent = '质检抽检';
  taskHeader.querySelector('.task-header__chip--pending strong').textContent = '待抽检';

  const statusLeft = taskHeader.querySelector('.task-header__status-left');
  const previousDivider = document.createElement('span');
  const previous = document.createElement('div');
  previousDivider.className = 'task-header__status-divider';
  previousDivider.setAttribute('aria-hidden', 'true');
  previous.className = 'task-header__chip task-header__chip--previous';
  previous.innerHTML = '<span>上一节点</span><strong>动作质检 · 供应商A · 提交 · 前序节点处理完成 · 已流转至当前节点</strong>';
  statusLeft.append(previousDivider, previous);

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

  const taskHeader = document.querySelector('[data-component="task-header"]');
  taskHeader.setAttribute('aria-label', '任务信息-动作标注');
  taskHeader.querySelector('.task-header__chip--current strong').textContent = '动作标注';
  taskHeader.querySelector('.task-header__chip--pending strong').textContent = '待标注';

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
    <div class="timeline-slot"><div class="timeline-card timeline-card--segments"><div class="timeline-ruler"><img class="ruler-start" src="../../components/annotation-timeline/assets/icon-timeline-start.svg" alt="" /><img class="marker marker--red" src="../../components/annotation-timeline/assets/icon-marker-red.svg" alt="" /><img class="marker marker--orange marker--two" src="../../components/annotation-timeline/assets/icon-marker-orange.svg" alt="" /><div class="segment-scale"><span class="segment-progress"></span></div><div class="scale-labels"><span>00:00s</span><span>00:10s</span></div></div><div class="annotation-row"><b class="row-count">14</b><div class="color-segments"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div></div></div>
    <div class="controls-slot"><div class="control-panel"><div class="transport-tools"><button class="tool-button tool-button--primary" type="button" data-action="toggle-play"><img src="../../components/annotation-timeline/assets/icon-play.svg" alt="播放" /></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-skip-prev.svg" alt="上一帧" /></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-skip-next.svg" alt="下一帧" /></button><button class="tool-button tool-button--speed" type="button"><b>2x</b><span>倍速</span></button></div><div class="annotation-tools"><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-plus.svg" alt="" /><span>添加</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-plus-forward.svg" alt="" /><span>添加并前进</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-forward.svg" alt="" /><span>仅前进</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-eraser.svg" alt="" /><span>清空</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-drag.svg" alt="" /><span>拖动</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-scissors.svg" alt="" /><span>分割</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-merge.svg" alt="" /><span>合并</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-merge-up.svg" alt="" /><span>向上合并</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-merge-down.svg" alt="" /><span>向下合并</span></button><button class="tool-button tool-button--small-label" type="button"><img src="../../components/annotation-timeline/assets/icon-source-first.svg" alt="" /><span>源视频优先</span></button><button class="tool-button" type="button"><img src="../../components/annotation-timeline/assets/icon-keyboard.svg" alt="" /><span>快捷键</span></button></div></div></div>`;

  const fillArea = document.querySelector('[data-component="fill-area"]');
  fillArea.dataset.variant = 'action-annotation';
  fillArea.setAttribute('aria-label', '动作标注-标注');
  const colors = ['blue', 'orange', 'purple', 'green'];
  const descriptions = ['请选择动作元素', '高的', '高的', '高的'];
  const actions = ['选择或输入动作描述', '夹取', '夹取', '夹取'];
  fillArea.querySelector('.fill-area__content').innerHTML = `<div class="fill-area__list">${colors.map((color, index) => `
    <article class="fill-area__row fill-area__row--action">
      <b>0${index + 1}</b><div class="fill-area__row-main"><div class="fill-area__row-top fill-area__action-top"><time>06:15~06:15(4:40:47)</time><i class="fill-area__color fill-area__color--${color}"></i><button type="button" aria-label="删除"><img src="../../components/fill-area/assets/icon-trash.svg" alt="" /></button></div>
      <button class="fill-area__field${index === 0 ? ' is-placeholder' : ''}" type="button">${index === 0 ? descriptions[index] : `<span class="fill-area__chip">${descriptions[index]} <img src="../../components/fill-area/assets/icon-close.svg" alt="" /></span>`}</button>
      <div class="fill-area__field-row"><button class="fill-area__field${index === 0 ? ' is-placeholder' : ''}" type="button">${index === 0 ? actions[index] : `<span class="fill-area__chip">${actions[index]} <img src="../../components/fill-area/assets/icon-close.svg" alt="" /></span>`}</button><img class="fill-area__ban" src="../../components/fill-area/assets/icon-ban.svg" alt="" /></div></div>
    </article>`).join('')}</div>`;
  fillArea.querySelector('.fill-area__footer').innerHTML = '<button class="fill-area__button fill-area__button--primary" type="button">通过</button><button class="fill-area__button" type="button">采集-不合格</button><button class="fill-area__button" type="button">驳回-标注</button><button class="fill-area__button" type="button">暂离</button>';
  const buttons = fillArea.querySelectorAll('.fill-area__button');
  buttons[0].textContent = '通过';
  buttons[1].textContent = '采集-不合格';
  buttons[2].textContent = '驳回-标注';
  buttons[3].textContent = '暂离';
}

if (pageId === 'action-spot-check') {
  document.title = '动作标注-抽检';

  const taskHeader = document.querySelector('[data-component="task-header"]');
  taskHeader.setAttribute('aria-label', '任务信息-抽检');
  taskHeader.querySelector('.task-header__chip--current strong').textContent = '供应商抽检';
  taskHeader.querySelector('.task-header__chip--pending strong').textContent = '待抽检';
  const statusLeft = taskHeader.querySelector('.task-header__status-left');
  const previousDivider = document.createElement('span');
  const previous = document.createElement('div');
  previousDivider.className = 'task-header__status-divider';
  previousDivider.setAttribute('aria-hidden', 'true');
  previous.className = 'task-header__chip task-header__chip--previous';
  previous.innerHTML = '<span>上一节点</span><strong>动作标注 · 供应商A · 提交 · 前序节点处理完成 · 已流转至当前节点</strong>';
  statusLeft.append(previousDivider, previous);

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

  const taskHeader = document.querySelector('[data-component="task-header"]');
  taskHeader.setAttribute('aria-label', '任务信息-语义切分');
  taskHeader.querySelector('.task-header__chip--current strong').textContent = '语义标注';
  taskHeader.querySelector('.task-header__chip--pending strong').textContent = '待切分';

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

  const taskHeader = document.querySelector('[data-component="task-header"]');
  taskHeader.setAttribute('aria-label', '任务信息-切分抽检');
  taskHeader.querySelector('.task-header__chip--current strong').textContent = '供应商抽检';
  taskHeader.querySelector('.task-header__chip--pending strong').textContent = '待抽检';
  const statusLeft = taskHeader.querySelector('.task-header__status-left');
  const previousDivider = document.createElement('span');
  const previous = document.createElement('div');
  previousDivider.className = 'task-header__status-divider';
  previousDivider.setAttribute('aria-hidden', 'true');
  previous.className = 'task-header__chip task-header__chip--previous';
  previous.innerHTML = '<span>上一节点</span><strong>语义标注 · 供应商A · 提交 · 前序节点处理完成 · 已流转至当前节点</strong>';
  statusLeft.append(previousDivider, previous);

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

  const taskHeader = document.querySelector('[data-component="task-header"]');
  taskHeader.setAttribute('aria-label', '任务信息-标注验收');
  taskHeader.querySelector('.task-header__chip--current strong').textContent = '供应商验收';
  taskHeader.querySelector('.task-header__chip--pending strong').textContent = '待验收';
  const statusLeft = taskHeader.querySelector('.task-header__status-left');
  const previousDivider = document.createElement('span');
  const previous = document.createElement('div');
  previousDivider.className = 'task-header__status-divider';
  previousDivider.setAttribute('aria-hidden', 'true');
  previous.className = 'task-header__chip task-header__chip--previous';
  previous.innerHTML = '<span>上一节点</span><strong>语义切分 · 供应商A · 提交 · 前序节点处理完成 · 已流转至当前节点</strong>';
  statusLeft.append(previousDivider, previous);

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

document.querySelectorAll('.fill-area__ban').forEach((icon) => {
  const hint = document.createElement('span');
  hint.className = 'fill-area__icon-hint';
  hint.dataset.tooltip = '无法描述';
  hint.setAttribute('role', 'img');
  hint.setAttribute('aria-label', '无法描述');
  icon.before(hint);
  hint.append(icon);
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
