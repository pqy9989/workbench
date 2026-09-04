    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const graphConnections = [
      ['start', 0, 'wait', 0],
      ['wait', 1, 'nav-grasp', 0],
      ['wait', 1, 'pose', 0],
      ['wait', 1, 'grasp', 0],
      ['nav-grasp', 1, 'human-1', 0],
      ['pose', 1, 'human-1', 0],
      ['human-1', 1, 'human-2', 0],
      ['human-2', 1, 'nav-place-1', 0],
      ['grasp', 1, 'scan', 0],
      ['scan', 1, 'condition', 0],
      ['condition', 1, 'nav-place-2', 0],
      ['nav-place-1', 1, 'place', 0],
      ['nav-place-2', 1, 'place', 0],
      ['place', 1, 'human-3', 0],
      ['place', 2, 'continue', 0],
      ['human-3', 1, 'end', 0],
      ['continue', 1, 'end', 0],
    ];

    function renderGraphEdges() {
      const layer = document.querySelector('.edge-layer');
      if (!layer) return;
      layer.querySelectorAll('.edge').forEach((edge) => edge.remove());

      const portPoint = (nodeName, portIndex) => {
        const node = document.querySelector(`.graph-node[data-node="${nodeName}"]`);
        const port = node?.querySelectorAll('.port')[portIndex];
        if (!node || !port) return null;
        return {
          x: node.offsetLeft + port.offsetLeft + port.offsetWidth / 2,
          y: node.offsetTop + port.offsetTop + port.offsetHeight / 2,
        };
      };

      const appendPath = (d, withArrow = true) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', withArrow ? 'edge' : 'edge edge--branch');
        path.setAttribute('d', d);
        layer.append(path);
      };

      const connections = graphConnections.map(([fromNode, fromPort, toNode, toPort], index) => ({ index, fromNode, fromPort, toNode, toPort }));
      const handled = new Set();
      const sourceGroups = new Map();
      connections.forEach((connection) => {
        const key = `${connection.fromNode}:${connection.fromPort}`;
        if (!sourceGroups.has(key)) sourceGroups.set(key, []);
        sourceGroups.get(key).push(connection);
      });

      sourceGroups.forEach((items) => {
        if (items.length < 2) return;
        const from = portPoint(items[0].fromNode, items[0].fromPort);
        const targets = items.map((item) => ({ item, point: portPoint(item.toNode, item.toPort) })).filter(({ point }) => point);
        if (!from || targets.length < 2) return;
        const startX = from.x + 4;
        const nearestEndX = Math.min(...targets.map(({ point }) => point.x - 5));
        const available = Math.max(20, nearestEndX - startX);
        const junctionX = startX + Math.min(38, available * 0.42);
        targets.forEach(({ item, point }) => {
          const endX = point.x - 5;
          const deltaY = point.y - from.y;

          if (Math.abs(deltaY) < 1) {
            appendPath(`M ${startX} ${from.y} H ${endX}`);
          } else {
            const direction = Math.sign(deltaY);
            const radius = Math.min(
              7,
              Math.abs(deltaY) / 2,
              Math.max(0, junctionX - startX),
              Math.max(0, endX - junctionX),
            );
            const d = [
              `M ${startX} ${from.y}`,
              `H ${junctionX - radius}`,
              `Q ${junctionX} ${from.y} ${junctionX} ${from.y + direction * radius}`,
              `V ${point.y - direction * radius}`,
              `Q ${junctionX} ${point.y} ${junctionX + radius} ${point.y}`,
              `H ${endX}`,
            ].join(' ');
            appendPath(d);
          }
          handled.add(item.index);
        });
      });

      const groups = new Map();
      connections.filter((connection) => !handled.has(connection.index)).forEach(({ fromNode, fromPort, toNode, toPort }) => {
        const key = `${toNode}:${toPort}`;
        if (!groups.has(key)) groups.set(key, { toNode, toPort, sources: [] });
        groups.get(key).sources.push({ fromNode, fromPort });
      });

      groups.forEach(({ toNode, toPort, sources }) => {
        const to = portPoint(toNode, toPort);
        const fromPoints = sources.map(({ fromNode, fromPort }) => portPoint(fromNode, fromPort)).filter(Boolean);
        if (!to || !fromPoints.length) return;
        const endX = to.x - 5;

        if (fromPoints.length > 1) {
          const starts = fromPoints.map((point) => ({ x: point.x + 4, y: point.y }));
          const maxStartX = Math.max(...starts.map((point) => point.x));
          const gap = Math.max(18, endX - maxStartX);
          const junctionX = maxStartX + Math.min(38, gap * 0.48);
          const radius = 6;
          starts.forEach((point) => {
            const direction = Math.sign(to.y - point.y);
            if (!direction) {
              appendPath(`M ${point.x} ${point.y} H ${junctionX}`, false);
              return;
            }
            appendPath(`M ${point.x} ${point.y} H ${junctionX - radius} Q ${junctionX} ${point.y} ${junctionX} ${point.y + direction * radius} V ${to.y}`, false);
          });
          appendPath(`M ${junctionX} ${to.y} H ${endX}`);
          return;
        }

        const from = fromPoints[0];
        const startX = from.x + 4;
        const deltaY = to.y - from.y;
        let d = `M ${startX} ${from.y}`;
        if (Math.abs(deltaY) < 1) {
          d += ` H ${endX}`;
        } else {
          const available = Math.max(12, endX - startX);
          const midX = startX + available * 0.48;
          const radius = Math.min(6, Math.abs(deltaY) / 2, available / 5);
          const direction = Math.sign(deltaY);
          d += ` H ${midX - radius} Q ${midX} ${from.y} ${midX} ${from.y + direction * radius}`;
          d += ` V ${to.y - direction * radius} Q ${midX} ${to.y} ${midX + radius} ${to.y} H ${endX}`;
        }
        appendPath(d);
      });
    }

    function updateCanvasTransform(canvas, zoomText) {
      const scale = Number(canvas.dataset.zoom || '1');
      const panX = Number(canvas.dataset.panX || '0');
      const panY = Number(canvas.dataset.panY || '0');
      canvas.style.setProperty('--scene-scale', scale.toFixed(3));
      canvas.style.setProperty('--scene-x', `${panX.toFixed(1)}px`);
      canvas.style.setProperty('--scene-y', `${panY.toFixed(1)}px`);
      if (zoomText) zoomText.textContent = `${Math.round(scale * 100)}%`;
    }

    function zoomCanvas(canvas, zoomText, nextScale, anchorX, anchorY) {
      const currentScale = Number(canvas.dataset.zoom || '1');
      const scale = clamp(nextScale, 0.35, 1.75);
      const rect = canvas.getBoundingClientRect();
      const localX = anchorX - rect.left;
      const localY = anchorY - rect.top;
      const panX = Number(canvas.dataset.panX || '0');
      const panY = Number(canvas.dataset.panY || '0');
      const worldX = (localX - panX) / currentScale;
      const worldY = (localY - panY) / currentScale;
      const nextPanX = localX - worldX * scale;
      const nextPanY = localY - worldY * scale;
      canvas.dataset.zoom = String(scale);
      canvas.dataset.panX = String(nextPanX);
      canvas.dataset.panY = String(nextPanY);
      updateCanvasTransform(canvas, zoomText);
    }

    function fitCanvas(canvas, zoomText) {
      const rect = canvas.getBoundingClientRect();
      const scale = clamp(Math.min(rect.width / 1560, rect.height / 280), 0.45, 1);
      const contentWidth = 1600;
      const contentHeight = 230;
      const panX = Math.max(24, (rect.width - contentWidth * scale) / 2 - 30);
      const panY = Math.max(24, (rect.height - contentHeight * scale) / 2);
      canvas.dataset.zoom = String(scale);
      canvas.dataset.panX = String(panX);
      canvas.dataset.panY = String(panY);
      updateCanvasTransform(canvas, zoomText);
    }

    window.addEventListener('DOMContentLoaded', () => {
      const canvas = document.querySelector('.canvas-stage');
      const zoomText = document.querySelector('.zoom-text');
      const zoomMinus = document.querySelector('[data-action="zoom-out"]');
      const zoomPlus = document.querySelector('[data-action="zoom-in"]');
      const fitBtn = document.querySelector('[data-action="fit"]');
      const handBtn = document.querySelector('[data-action="hand"]');
      const selectBtn = document.querySelector('.tool-btn[title="选择"]');
      const toast = document.querySelector('.toast');
      const searchInput = document.querySelector('.search input');
      const undoBtn = document.querySelector('[data-action="undo"]');
      const redoBtn = document.querySelector('[data-action="redo"]');

      if (!canvas) return;

      requestAnimationFrame(renderGraphEdges);

      let toastTimer;
      const notify = (message) => {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('is-visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1800);
      };

      const snapshot = () => ({
        zoom: Number(canvas.dataset.zoom || '1'),
        panX: Number(canvas.dataset.panX || '0'),
        panY: Number(canvas.dataset.panY || '0'),
      });
      const history = { past: [], future: [] };
      const record = () => {
        const current = snapshot();
        const previous = history.past[history.past.length - 1];
        if (!previous || JSON.stringify(previous) !== JSON.stringify(current)) history.past.push(current);
        history.future = [];
        updateHistoryButtons();
      };
      const restore = (state) => {
        canvas.dataset.zoom = String(state.zoom);
        canvas.dataset.panX = String(state.panX);
        canvas.dataset.panY = String(state.panY);
        updateCanvasTransform(canvas, zoomText);
      };
      const updateHistoryButtons = () => {
        if (undoBtn) undoBtn.disabled = history.past.length < 2;
        if (redoBtn) redoBtn.disabled = history.future.length === 0;
      };

      canvas.dataset.zoom = '0.7';
      canvas.dataset.panX = '30';
      canvas.dataset.panY = '260';
      updateCanvasTransform(canvas, zoomText);
      requestAnimationFrame(() => fitCanvas(canvas, zoomText));
      history.past.push(snapshot());
      updateHistoryButtons();

      const state = {
        dragging: false,
        startX: 0,
        startY: 0,
        startPanX: 0,
        startPanY: 0,
        handMode: true,
        spaceMode: false,
      };

      const isInteractiveTarget = (target) => Boolean(target.closest('.tool-btn, .zoom-btn, .graph-node, button, a'));

      canvas.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) return;
        if (isInteractiveTarget(event.target)) return;
        if (!state.handMode && !state.spaceMode) return;
        state.dragging = true;
        state.startX = event.clientX;
        state.startY = event.clientY;
        state.startPanX = Number(canvas.dataset.panX || '0');
        state.startPanY = Number(canvas.dataset.panY || '0');
        canvas.classList.add('is-dragging');
        canvas.setPointerCapture(event.pointerId);
      });

      canvas.addEventListener('pointermove', (event) => {
        if (!state.dragging) return;
        const nextPanX = state.startPanX + (event.clientX - state.startX);
        const nextPanY = state.startPanY + (event.clientY - state.startY);
        canvas.dataset.panX = String(nextPanX);
        canvas.dataset.panY = String(nextPanY);
        updateCanvasTransform(canvas, zoomText);
      });

      const endDrag = (event) => {
        if (!state.dragging) return;
        state.dragging = false;
        canvas.classList.remove('is-dragging');
        record();
        if (event && canvas.hasPointerCapture && canvas.hasPointerCapture(event.pointerId)) {
          canvas.releasePointerCapture(event.pointerId);
        }
      };

      canvas.addEventListener('pointerup', endDrag);
      canvas.addEventListener('pointercancel', endDrag);
      canvas.addEventListener('pointerleave', endDrag);

      const isTypingTarget = (target) => target instanceof HTMLElement
        && Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));

      document.addEventListener('keydown', (event) => {
        if (isTypingTarget(event.target)) return;
        if (event.code === 'Space') {
          event.preventDefault();
          state.spaceMode = true;
          canvas.classList.add('is-space-panning');
          return;
        }
        if (state.spaceMode && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
          event.preventDefault();
          const direction = event.key === 'ArrowLeft' ? 1 : -1;
          canvas.dataset.panX = String(Number(canvas.dataset.panX || '0') + direction * 120);
          updateCanvasTransform(canvas, zoomText);
          record();
        }
      });

      document.addEventListener('keyup', (event) => {
        if (event.code !== 'Space') return;
        state.spaceMode = false;
        canvas.classList.remove('is-space-panning');
      });

      window.addEventListener('blur', () => {
        state.spaceMode = false;
        canvas.classList.remove('is-space-panning');
      });

      canvas.addEventListener('wheel', (event) => {
        event.preventDefault();
        if (state.spaceMode) {
          const horizontalDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
          canvas.dataset.panX = String(Number(canvas.dataset.panX || '0') - horizontalDelta);
          updateCanvasTransform(canvas, zoomText);
          record();
          return;
        }
        const currentScale = Number(canvas.dataset.zoom || '1');
        const factor = event.deltaY < 0 ? 1.08 : 0.92;
        zoomCanvas(canvas, zoomText, currentScale * factor, event.clientX, event.clientY);
        record();
      }, { passive: false });

      zoomMinus?.addEventListener('click', (event) => {
        event.preventDefault();
        const rect = canvas.getBoundingClientRect();
        zoomCanvas(canvas, zoomText, Number(canvas.dataset.zoom || '1') * 0.9, rect.left + rect.width / 2, rect.top + rect.height / 2);
        record();
      });

      zoomPlus?.addEventListener('click', (event) => {
        event.preventDefault();
        const rect = canvas.getBoundingClientRect();
        zoomCanvas(canvas, zoomText, Number(canvas.dataset.zoom || '1') * 1.1, rect.left + rect.width / 2, rect.top + rect.height / 2);
        record();
      });

      fitBtn?.addEventListener('click', (event) => {
        event.preventDefault();
        fitCanvas(canvas, zoomText);
        record();
      });

      handBtn?.addEventListener('click', (event) => {
        event.preventDefault();
        state.handMode = !state.handMode;
        handBtn.classList.toggle('active', state.handMode);
        canvas.style.cursor = state.handMode ? 'grab' : 'default';
        notify(state.handMode ? '已启用拖拽平移' : '已切换选择模式');
      });
      selectBtn?.addEventListener('click', (event) => {
        event.preventDefault();
        state.handMode = false;
        handBtn?.classList.remove('active');
        selectBtn.classList.add('active');
        canvas.style.cursor = 'default';
        notify('已切换选择模式');
      });

      undoBtn?.setAttribute('data-action', 'undo');
      redoBtn?.setAttribute('data-action', 'redo');
      undoBtn?.addEventListener('click', (event) => {
        event.preventDefault();
        if (history.past.length < 2) return;
        history.future.push(history.past.pop());
        restore(history.past[history.past.length - 1]);
        updateHistoryButtons();
        notify('已撤销');
      });
      redoBtn?.addEventListener('click', (event) => {
        event.preventDefault();
        const next = history.future.pop();
        if (!next) return;
        history.past.push(next);
        restore(next);
        updateHistoryButtons();
        notify('已重做');
      });

      document.querySelectorAll('.graph-node').forEach((node) => {
        node.addEventListener('click', (event) => {
          event.stopPropagation();
          document.querySelectorAll('.graph-node.selected').forEach((item) => item.classList.remove('selected'));
          node.classList.add('selected');
          const title = node.querySelector('.graph-title')?.textContent?.trim();
          const propTitle = document.querySelector('.prop-title h2');
          if (propTitle && title) propTitle.textContent = title;
          notify(`已选择：${title || '节点'}`);
        });
      });

      document.querySelectorAll('.rail-item').forEach((item) => {
        item.addEventListener('click', () => {
          document.querySelectorAll('.rail-item').forEach((entry) => entry.classList.toggle('active', entry === item));
          notify(`已切换至：${item.querySelector('span')?.textContent?.trim() || '平台'}`);
        });
      });

      document.querySelectorAll('.tabs .tab').forEach((tab) => {
        tab.addEventListener('click', () => {
          const name = tab.dataset.tab;
          document.querySelectorAll('.tabs .tab').forEach((item) => item.classList.toggle('active', item === tab));
          document.querySelectorAll('.panel-scroll[data-tab]').forEach((panel) => {
            panel.style.display = panel.dataset.tab === name ? 'block' : 'none';
          });
        });
      });

      document.querySelectorAll('.group-head').forEach((head) => {
        head.addEventListener('click', () => head.closest('.palette-group')?.classList.toggle('is-collapsed'));
      });
      document.querySelectorAll('.flow-label').forEach((label) => {
        label.addEventListener('click', () => label.closest('.flow-section')?.classList.toggle('is-collapsed'));
      });

      searchInput?.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        document.querySelectorAll('.palette-item').forEach((item) => {
          item.classList.toggle('is-hidden', query && !item.textContent.toLowerCase().includes(query));
        });
      });

      document.querySelectorAll('.palette-item').forEach((item) => {
        item.addEventListener('click', () => notify(`已选择节点：${item.textContent.trim()}`));
      });

      document.querySelectorAll('.header-btn, .prop-tools button').forEach((button) => {
        button.addEventListener('click', () => {
          const label = button.textContent.trim() || button.getAttribute('aria-label') || '操作';
          if (button.classList.contains('primary')) notify('发布操作已触发');
          else notify(`${label}已触发`);
        });
      });

      window.addEventListener('resize', () => {
        fitCanvas(canvas, zoomText);
        renderGraphEdges();
      });
    });
