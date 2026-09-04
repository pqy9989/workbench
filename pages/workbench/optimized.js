
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
      const gap = 8;
      const heightByWidth = Math.max(0, (availableWidth - 10) / 2.75);
      const layoutHeight = Math.floor(Math.min(availableHeight, heightByWidth));
      const armVideoHeight = Math.floor((layoutHeight - gap) / 2);
      const armVideoWidth = Math.floor(armVideoHeight * 1.5);
      videoGrid.style.setProperty('--head-video-size', `${layoutHeight}px`);
      videoGrid.style.setProperty('--arm-video-width', `${armVideoWidth}px`);
      videoGrid.style.setProperty('--arm-video-height', `${armVideoHeight}px`);
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
    let draggingRangeSelection = false;
    let rangeDragPointerStart = 0;
    let rangeDragInitialStart = 0;
    let rangeDragInitialEnd = 0;

    function formatRangeTime(percent) {
      const totalSeconds = Math.round(percent * .7);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}s`;
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
      const track = timeline.querySelector('.timeline-track');
      const trackBounds = track.getBoundingClientRect();
      const boundaries = [trackBounds.left, trackBounds.right];
      track.querySelectorAll('.timeline-segment').forEach(segment => {
        const segmentBounds = segment.getBoundingClientRect();
        boundaries.push(segmentBounds.left, segmentBounds.right);
      });
      const nearestBoundary = boundaries.reduce((nearest, boundary) => (
        Math.abs(boundary - event.clientX) < Math.abs(nearest - event.clientX) ? boundary : nearest
      ), boundaries[0]);
      const snapped = Math.abs(nearestBoundary - event.clientX) <= 18;
      const pointerX = snapped ? nearestBoundary : event.clientX;
      const percent = Math.max(0, Math.min(100, ((pointerX - bounds.left) / bounds.width) * 100));
      const activeHandle = draggingRangeHandle === 'start' ? rangeStartHandle : rangeEndHandle;
      activeHandle.classList.toggle('is-snapped', snapped);
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
    rangeSelection.addEventListener('pointerdown', event => {
      event.preventDefault();
      event.stopPropagation();
      draggingRangeSelection = true;
      rangeDragPointerStart = event.clientX;
      rangeDragInitialStart = rangeStart;
      rangeDragInitialEnd = rangeEnd;
      rangeSelection.setPointerCapture(event.pointerId);
      rangeSelection.classList.add('is-dragging');
    });
    rangeSelection.addEventListener('pointermove', event => {
      if (!draggingRangeSelection) return;
      const rangeBounds = rangeSelector.getBoundingClientRect();
      const width = rangeDragInitialEnd - rangeDragInitialStart;
      const delta = ((event.clientX - rangeDragPointerStart) / rangeBounds.width) * 100;
      let nextStart = Math.max(0, Math.min(100 - width, rangeDragInitialStart + delta));

      const track = timeline.querySelector('.timeline-track');
      const boundaries = [];
      track.querySelectorAll('.timeline-segment').forEach(segment => {
        const segmentBounds = segment.getBoundingClientRect();
        boundaries.push(segmentBounds.left, segmentBounds.right);
      });
      const startX = rangeBounds.left + rangeBounds.width * nextStart / 100;
      const endX = rangeBounds.left + rangeBounds.width * (nextStart + width) / 100;
      const snapCandidates = boundaries.flatMap(boundary => [
        { distance: Math.abs(boundary - startX), start: ((boundary - rangeBounds.left) / rangeBounds.width) * 100 },
        { distance: Math.abs(boundary - endX), start: ((boundary - rangeBounds.left) / rangeBounds.width) * 100 - width },
      ]);
      const nearest = snapCandidates.reduce((best, candidate) => candidate.distance < best.distance ? candidate : best, { distance: Infinity, start: nextStart });
      const snapped = nearest.distance <= 18;
      if (snapped) nextStart = Math.max(0, Math.min(100 - width, nearest.start));

      rangeSelection.classList.toggle('is-snapped', snapped);
      rangeStart = nextStart;
      rangeEnd = nextStart + width;
      renderRangeSelector();
    });
    rangeSelection.addEventListener('pointerup', event => {
      if (!draggingRangeSelection) return;
      draggingRangeSelection = false;
      rangeSelection.classList.remove('is-dragging', 'is-snapped');
      if (rangeSelection.hasPointerCapture(event.pointerId)) rangeSelection.releasePointerCapture(event.pointerId);
    });
    window.addEventListener('pointermove', event => {
      if (draggingRangeHandle) updateRangeFromPointer(event);
    });
    window.addEventListener('pointerup', () => {
      draggingRangeHandle = '';
      rangeStartHandle.classList.remove('is-snapped');
      rangeEndHandle.classList.remove('is-snapped');
    });
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

    let draggingPlayhead = false;
    let playheadMoved = false;
    let playheadPointerStart = 0;

    function updatePlayheadFromPointer(event) {
      const track = timeline.querySelector('.timeline-track');
      const bounds = track.getBoundingClientRect();
      const boundaries = [bounds.left, bounds.right];
      timelineSegments.forEach(segment => {
        const segmentBounds = segment.getBoundingClientRect();
        boundaries.push(segmentBounds.left, segmentBounds.right);
      });
      const nearestBoundary = boundaries.reduce((nearest, boundary) => (
        Math.abs(boundary - event.clientX) < Math.abs(nearest - event.clientX) ? boundary : nearest
      ), boundaries[0]);
      const snapDistance = 18;
      const snapped = Math.abs(nearestBoundary - event.clientX) <= snapDistance;
      const pointerX = snapped ? nearestBoundary : event.clientX;
      playhead.classList.toggle('is-snapped', snapped);
      setPlayPosition(((pointerX - bounds.left) / bounds.width) * 100);
    }

    playhead.addEventListener('pointerdown', event => {
      event.preventDefault();
      event.stopPropagation();
      draggingPlayhead = true;
      playheadMoved = false;
      playheadPointerStart = event.clientX;
      playhead.setPointerCapture(event.pointerId);
      playhead.classList.add('is-dragging');
    });

    playhead.addEventListener('pointermove', event => {
      if (!draggingPlayhead) return;
      if (Math.abs(event.clientX - playheadPointerStart) > 2) playheadMoved = true;
      updatePlayheadFromPointer(event);
    });

    playhead.addEventListener('pointerup', event => {
      if (!draggingPlayhead) return;
      draggingPlayhead = false;
      playhead.classList.remove('is-dragging', 'is-snapped');
      if (playhead.hasPointerCapture(event.pointerId)) playhead.releasePointerCapture(event.pointerId);
      if (!playheadMoved) {
        rangeStart = 0;
        rangeEnd = 100;
        renderRangeSelector();
      }
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
    const unavailableTag = document.querySelector('[data-unavailable-tag]');
    const unavailableButton = document.querySelector('[data-action="unavailable"]');
    const clearUnavailableButton = document.querySelector('[data-action="clear-unavailable"]');
    const errorTrigger = document.querySelector('[data-error-trigger]');
    const errorPopover = document.querySelector('[data-error-popover]');
    const errorClearButton = document.querySelector('[data-error-clear]');
    const errorOptions = [...document.querySelectorAll('[data-error-option]')];
    const simulatedSegments = [
      { start: '00:00', end: '00:11', duration: '00:11', description: '观察并整理桌面物品（前端测试V4 预标注片段 1）', error: '片段范围错误', unavailable: false },
      { start: '00:11', end: '00:15', duration: '00:04', description: '选择错移动遥控器到目标位置（前端测试V4 预标注片段 2）', error: '片段范围错位', unavailable: false },
      { start: '00:15', end: '00:18', duration: '00:03', description: '打开或关闭抽屉（前端测试V4 预标注片段 3）', error: '', unavailable: false },
      { start: '00:18', end: '00:21', duration: '00:03', description: '调整纸盒摆放位置（前端测试V4 预标注片段 4）', error: '动作结束边界偏晚', unavailable: false },
      { start: '00:21', end: '00:27', duration: '00:06', description: '将散落书本整理并竖直放回书架（前端测试V4 预标注片段 5）', error: '', unavailable: false },
      { start: '00:27', end: '00:32', duration: '00:05', description: '将笔记本按类别放回指定位置（前端测试V4 预标注片段 6）', error: '', unavailable: false }
    ];

    function syncRangeToSegment(segment) {
      if (!segment) return;
      const rangeBounds = rangeSelector.getBoundingClientRect();
      const segmentBounds = segment.getBoundingClientRect();
      if (!rangeBounds.width) return;
      rangeStart = Math.max(0, Math.min(100, ((segmentBounds.left - rangeBounds.left) / rangeBounds.width) * 100));
      rangeEnd = Math.max(rangeStart, Math.min(100, ((segmentBounds.right - rangeBounds.left) / rangeBounds.width) * 100));
      renderRangeSelector();
    }

    function currentSegmentIndex() {
      return Math.max(0, (Number(segmentValue.textContent) || 1) - 1);
    }

    function positionErrorPopover() {
      const triggerBounds = errorTrigger.getBoundingClientRect();
      const left = Math.max(12, triggerBounds.left);
      const width = Math.min(triggerBounds.width, window.innerWidth - left - 12);
      errorPopover.style.width = `${width}px`;
      errorPopover.style.left = `${left}px`;
      errorPopover.style.top = `${Math.max(12, triggerBounds.top - errorPopover.offsetHeight - 8)}px`;
    }

    function setErrorPopoverOpen(open) {
      errorPopover.hidden = !open;
      errorTrigger.setAttribute('aria-expanded', String(open));
      errorTrigger.classList.toggle('is-open', open);
      if (!open) return;
      const currentError = simulatedSegments[currentSegmentIndex()].error;
      errorOptions.forEach(option => {
        const selected = option.dataset.errorOption === currentError;
        option.classList.toggle('is-selected', selected);
        option.setAttribute('aria-selected', String(selected));
      });
      requestAnimationFrame(positionErrorPopover);
    }

    function setCurrentSegmentError(error) {
      const index = currentSegmentIndex();
      simulatedSegments[index].error = error;
      selectSimulatedSegment(index);
      setErrorPopoverOpen(false);
    }

    function renderReviewRows(activeIndex) {
      reviewRows.forEach((row, index) => {
        const data = simulatedSegments[index];
        const cell = row.querySelector('.review-cell');
        row.classList.toggle('review-row--active', index === activeIndex);
        const time = index === activeIndex
          ? `<div class="review-time"><span>${data.start}~${data.end}（${data.duration}）</span><img src="./assets/icon-trash.svg?v=2" alt="删除片段" width="16" height="16" /></div>`
          : '';
        const reason = data.error ? `<span class="reason">错误原因：${data.error}</span>` : '';
        const unavailable = data.unavailable ? '<span class="reason reason--unavailable">无法标注</span>' : '';
        const tags = reason || unavailable ? `<div class="review-tags">${reason}${unavailable}</div>` : '';
        cell.innerHTML = `${time}<p>${data.description}</p>${tags}`;
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
      unavailableTag.hidden = !data.unavailable;
      unavailableButton.classList.toggle('is-active', data.unavailable);
      unavailableButton.setAttribute('aria-pressed', String(data.unavailable));
      timelineSegments.forEach((segment, segmentIndex) => segment.classList.toggle('is-active', segmentIndex === safeIndex));
      renderReviewRows(safeIndex);

      const activeSegment = timelineSegments[safeIndex];
      syncRangeToSegment(activeSegment);
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
        const currentIndex = Math.max(0, (Number(segmentValue.textContent) || 1) - 1);
        simulatedSegments[currentIndex].unavailable = !simulatedSegments[currentIndex].unavailable;
        selectSimulatedSegment(currentIndex);
      }
      if (action === 'delete') {
        const button = document.querySelector('[data-action="delete"]');
        button.classList.add('is-active');
        window.setTimeout(() => button.classList.remove('is-active'), 260);
      }
    }

    segmentActions.forEach(button => button.addEventListener('click', () => runSegmentAction(button.dataset.action)));
    clearUnavailableButton.addEventListener('click', event => {
      event.stopPropagation();
      const currentIndex = Math.max(0, (Number(segmentValue.textContent) || 1) - 1);
      simulatedSegments[currentIndex].unavailable = false;
      selectSimulatedSegment(currentIndex);
    });
    errorTrigger.addEventListener('click', event => {
      event.stopPropagation();
      setErrorPopoverOpen(errorPopover.hidden);
    });
    errorTrigger.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      setErrorPopoverOpen(errorPopover.hidden);
    });
    errorOptions.forEach(option => option.addEventListener('click', () => setCurrentSegmentError(option.dataset.errorOption)));
    errorClearButton.addEventListener('click', () => setCurrentSegmentError(''));
    errorPopover.addEventListener('click', event => event.stopPropagation());
    document.addEventListener('click', () => setErrorPopoverOpen(false));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') setErrorPopoverOpen(false);
    });
    window.addEventListener('resize', () => {
      if (!errorPopover.hidden) positionErrorPopover();
    });
    window.addEventListener('resize', () => {
      const currentIndex = Math.max(0, (Number(segmentValue.textContent) || 1) - 1);
      syncRangeToSegment(timelineSegments[currentIndex]);
    });
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

    const reviewTitle = document.querySelector('[data-review-title]');
    const reviewViews = [...document.querySelectorAll('[data-review-view]')];
    const reviewTabs = [...document.querySelectorAll('[data-review-tab]')];
    const reviewFooter = document.querySelector('[data-review-footer]');

    function switchReviewView(view) {
      const titles = { segments: '片段列表', log: '日志', info: '基本信息' };
      reviewTitle.textContent = titles[view] || titles.segments;
      reviewViews.forEach(panel => { panel.hidden = panel.dataset.reviewView !== view; });
      reviewTabs.forEach(tab => {
        const active = tab.dataset.reviewTab === view;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-pressed', String(active));
      });
      reviewFooter.hidden = view !== 'segments';
    }

    reviewTabs.forEach(tab => tab.addEventListener('click', () => switchReviewView(tab.dataset.reviewTab)));

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

    const settingsAnchor = document.querySelector('.settings-anchor');
    const settingsTrigger = document.querySelector('.settings-trigger');
    const settingsPopover = document.querySelector('.settings-popover');
    const sourcePrioritySwitch = document.querySelector('.settings-switch');
    const themeOptions = [...document.querySelectorAll('.theme-option')];
    const themeStorageKey = 'workbench-theme';

    function applyTheme(theme, persist = false) {
      const resolvedTheme = theme === 'light' ? 'light' : 'dark';
      document.body.classList.toggle('theme-light', resolvedTheme === 'light');
      document.documentElement.classList.toggle('theme-light', resolvedTheme === 'light');
      document.body.classList.remove('theme-pending');
      themeOptions.forEach(option => {
        option.classList.toggle('is-active', option.dataset.theme === resolvedTheme);
      });
      if (persist) localStorage.setItem(themeStorageKey, resolvedTheme);
    }

    applyTheme(localStorage.getItem(themeStorageKey));

    function setSettingsOpen(open) {
      settingsPopover.hidden = !open;
      settingsTrigger.setAttribute('aria-expanded', String(open));
    }

    settingsTrigger.addEventListener('click', () => {
      setSettingsOpen(settingsPopover.hidden);
    });

    sourcePrioritySwitch.addEventListener('click', () => {
      const enabled = sourcePrioritySwitch.getAttribute('aria-checked') !== 'true';
      sourcePrioritySwitch.setAttribute('aria-checked', String(enabled));
      sourcePrioritySwitch.classList.toggle('is-on', enabled);
    });

    themeOptions.forEach(button => button.addEventListener('click', () => {
      applyTheme(button.dataset.theme, true);
    }));

    document.addEventListener('click', event => {
      if (!settingsPopover.hidden && !settingsAnchor.contains(event.target)) setSettingsOpen(false);
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') setSettingsOpen(false);
    });
  
