
    const timeline = document.querySelector('.video-timeline');
    const playhead = document.querySelector('.playhead');
    const playButton = document.querySelector('.play');
    const playbackCurrent = document.querySelector('.playback-time__current');
    const exitWorkbenchButton = document.querySelector('[data-action="exit-workbench"]');
    exitWorkbenchButton.addEventListener('click', () => {
      window.location.assign('../action-quality-check/index.html');
    });
    let playing = false;
    let playPosition = 8.2;
    let lastFrame = 0;

    const mediaCard = document.querySelector('.media-card');
    const videoGrid = document.querySelector('.video-grid');
    const mediaHeader = mediaCard.querySelector('.section-header');

    function resizeVideoGrid() {
      const availableWidth = Math.max(0, videoGrid.clientWidth);
      const availableHeight = Math.max(0, videoGrid.clientHeight);
      const fixedSpacing = 8;
      const widthByHorizontalSpace = Math.max(0, (availableWidth - fixedSpacing) / 2);
      const widthByVerticalSpace = Math.max(0, ((availableHeight - fixedSpacing) / 2) * 1.5);
      const videoWidth = Math.floor(Math.min(widthByHorizontalSpace, widthByVerticalSpace));
      const videoHeight = Math.floor(videoWidth / 1.5);
      videoGrid.style.setProperty('--video-width', `${videoWidth}px`);
      videoGrid.style.setProperty('--video-height', `${videoHeight}px`);
    }

    new ResizeObserver(resizeVideoGrid).observe(videoGrid);
    resizeVideoGrid();

    const rangeSelector = document.querySelector('.range-selector__bar');
    const rangeSelection = document.querySelector('.range-selector__selection');
    const rangeStartHandle = document.querySelector('.range-selector__handle--start');
    const rangeEndHandle = document.querySelector('.range-selector__handle--end');
    const rangeStartLabel = document.querySelector('.range-selector__label--start');
    const rangeEndLabel = document.querySelector('.range-selector__label--end');
    let rangeStart = 0;
    let rangeEnd = 14.28;
    let draggingRangeHandle = '';

    function formatRangeTime(percent) {
      const seconds = Math.round(percent * .7);
      return `00:${String(seconds).padStart(2, '0')}s`;
    }

    function renderRangeSelector() {
      rangeSelection.style.left = `${rangeStart}%`;
      rangeSelection.style.width = `${rangeEnd - rangeStart}%`;
      rangeStartHandle.style.left = `${rangeStart}%`;
      rangeEndHandle.style.left = `${rangeEnd}%`;
      rangeStartLabel.style.left = `${rangeStart}%`;
      rangeEndLabel.style.left = `${rangeEnd}%`;
      rangeStartLabel.textContent = formatRangeTime(rangeStart);
      rangeEndLabel.textContent = formatRangeTime(rangeEnd);
    }

    function updateRangeFromPointer(event) {
      const bounds = rangeSelector.getBoundingClientRect();
      const percent = Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100));
      if (draggingRangeHandle === 'start') rangeStart = Math.min(percent, rangeEnd - 1);
      if (draggingRangeHandle === 'end') rangeEnd = Math.max(percent, rangeStart + 1);
      renderRangeSelector();
    }

    rangeStartHandle.addEventListener('pointerdown', event => {
      draggingRangeHandle = 'start';
      rangeStartHandle.setPointerCapture(event.pointerId);
    });
    rangeEndHandle.addEventListener('pointerdown', event => {
      draggingRangeHandle = 'end';
      rangeEndHandle.setPointerCapture(event.pointerId);
    });
    window.addEventListener('pointermove', event => {
      if (draggingRangeHandle) updateRangeFromPointer(event);
    });
    window.addEventListener('pointerup', () => { draggingRangeHandle = ''; });
    renderRangeSelector();

    function setPlayPosition(percent) {
      playPosition = Math.max(0, Math.min(100, percent));
      playhead.style.left = `calc(40px + (100% - 44px) * ${playPosition / 100})`;
      const currentSeconds = playPosition * .7;
      const minutes = Math.floor(currentSeconds / 60);
      const seconds = Math.floor(currentSeconds % 60);
      const centiseconds = Math.floor((currentSeconds % 1) * 100);
      playbackCurrent.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(centiseconds).padStart(2, '0')}`;
    }

    timeline.addEventListener('click', (event) => {
      if (event.target.closest('.timeline-warning, .range-selector')) return;
      const track = timeline.querySelector('.timeline-track');
      const bounds = track.getBoundingClientRect();
      setPlayPosition(((event.clientX - bounds.left) / bounds.width) * 100);
    });

    function animate(now) {
      if (!playing) return;
      if (lastFrame) setPlayPosition(playPosition + (now - lastFrame) / 900);
      lastFrame = now;
      if (playPosition >= 100) { playing = false; playButton.setAttribute('aria-label', '播放'); return; }
      requestAnimationFrame(animate);
    }

    playButton.addEventListener('click', () => {
      playing = !playing;
      playButton.setAttribute('aria-label', playing ? '暂停' : '播放');
      if (playing) { lastFrame = 0; requestAnimationFrame(animate); }
    });

    const segmentValue = document.querySelector('.current-segment-value');
    const segmentActions = document.querySelectorAll('.segment-action');
    const reviewRows = [...document.querySelectorAll('.review-children .review-row')];
    const timelineSegments = [...timeline.querySelector('.track-row').querySelectorAll('.timeline-segment')];
    const segmentStart = document.querySelector('[data-field="start"]');
    const segmentEnd = document.querySelector('[data-field="end"]');
    const segmentDuration = document.querySelector('[data-field="duration"]');
    const segmentDescription = document.querySelector('[data-field="description"]');
    const segmentError = document.querySelector('[data-field="error"]');
    const simulatedSegments = [
      { start: '00:00', end: '00:11', duration: '00:11', description: '观察并整理桌面物品（前端测试V4 预标注片段 1）', error: '片段范围错误' },
      { start: '00:11', end: '00:15', duration: '00:04', description: '选择错移动遥控器到目标位置（前端测试V4 预标注片段 2）', error: '片段范围错位' },
      { start: '00:15', end: '00:18', duration: '00:03', description: '打开或关闭抽屉（前端测试V4 预标注片段 3）', error: '' },
      { start: '00:18', end: '00:21', duration: '00:03', description: '调整纸盒摆放位置（前端测试V4 预标注片段 4）', error: '动作结束边界偏晚' },
      { start: '00:21', end: '00:27', duration: '00:06', description: '将散落书本整理并竖直放回书架（前端测试V4 预标注片段 5）', error: '' },
      { start: '00:27', end: '00:32', duration: '00:05', description: '将笔记本按类别放回指定位置（前端测试V4 预标注片段 6）', error: '' }
    ];

    function renderReviewRows(activeIndex) {
      reviewRows.forEach((row, index) => {
        const data = simulatedSegments[index];
        const cell = row.querySelector('.review-cell');
        row.classList.toggle('review-row--active', index === activeIndex);
        const time = index === activeIndex
          ? `<div class="review-time"><span>${data.start}~${data.end}（${data.duration}）</span><img src="./assets/icon-trash.svg" alt="删除片段" width="16" height="16" /></div>`
          : '';
        const reason = data.error ? `<span class="reason">错误原因：${data.error}</span>` : '';
        cell.innerHTML = `${time}<p>${data.description}</p>${reason}`;
      });
    }

    function selectSimulatedSegment(index) {
      const safeIndex = Math.max(0, Math.min(simulatedSegments.length - 1, index));
      const data = simulatedSegments[safeIndex];
      segmentValue.textContent = String(safeIndex + 1).padStart(2, '0');
      segmentStart.textContent = data.start;
      segmentEnd.textContent = data.end;
      segmentDuration.textContent = data.duration;
      segmentDescription.textContent = data.description;
      segmentError.textContent = data.error || '请选择错误原因';
      segmentError.closest('.input-like').classList.toggle('is-placeholder', !data.error);
      timelineSegments.forEach((segment, segmentIndex) => segment.classList.toggle('is-active', segmentIndex === safeIndex));
      renderReviewRows(safeIndex);

      const activeSegment = timelineSegments[safeIndex];
      const track = activeSegment.closest('.timeline-track');
      const trackBounds = track.getBoundingClientRect();
      const segmentBounds = activeSegment.getBoundingClientRect();
      setPlayPosition((((segmentBounds.left + segmentBounds.right) / 2) - trackBounds.left) / trackBounds.width * 100);
    }

    reviewRows.forEach((row, index) => row.addEventListener('click', () => selectSimulatedSegment(index)));
    timelineSegments.forEach((segment, index) => segment.addEventListener('click', event => {
      event.stopPropagation();
      selectSimulatedSegment(index);
    }));

    function runSegmentAction(action) {
      if (action === 'previous' || action === 'next') {
        const current = Number(segmentValue.textContent) || 1;
        const next = action === 'previous' ? Math.max(1, current - 1) : Math.min(simulatedSegments.length, current + 1);
        selectSimulatedSegment(next - 1);
      }
      if (action === 'unavailable') {
        const button = document.querySelector('[data-action="unavailable"]');
        button.classList.toggle('is-active');
        button.setAttribute('aria-pressed', String(button.classList.contains('is-active')));
      }
      if (action === 'delete') {
        const button = document.querySelector('[data-action="delete"]');
        button.classList.add('is-active');
        window.setTimeout(() => button.classList.remove('is-active'), 260);
      }
    }

    segmentActions.forEach(button => button.addEventListener('click', () => runSegmentAction(button.dataset.action)));
    selectSimulatedSegment(1);
    window.addEventListener('keydown', event => {
      if (!event.metaKey) return;
      const action = event.key === 'ArrowUp' ? 'previous'
        : event.key === 'ArrowDown' ? 'next'
        : event.key === 'Backspace' ? 'delete'
        : event.key === '/' ? 'unavailable' : '';
      if (!action) return;
      event.preventDefault();
      runSegmentAction(action);
    });

    const reviewParent = document.querySelector('.review-row--head[aria-controls]');
    const reviewChildren = document.getElementById(reviewParent.getAttribute('aria-controls'));

    function toggleReviewChildren() {
      const expanded = reviewParent.getAttribute('aria-expanded') === 'true';
      reviewParent.setAttribute('aria-expanded', String(!expanded));
      reviewChildren.hidden = expanded;
    }

    reviewParent.addEventListener('click', toggleReviewChildren);
    reviewParent.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      toggleReviewChildren();
    });
  
