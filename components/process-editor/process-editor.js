(() => {
  const assets = new URL('../../pages/process-editor/assets/', document.currentScript.src);
  const templates = {
  "process-editor-page": "<div class=\"editor-page process-editor-components\">\n    <aside class=\"editor-page__sidebar\"><platform-sidebar collapsed></platform-sidebar></aside>\n\n    <main class=\"workspace\">\n      <process-editor-header></process-editor-header>\n\n      <div class=\"body\">\n        <process-node-library></process-node-library>\n\n        <process-flow-canvas></process-flow-canvas>\n\n        <process-node-properties></process-node-properties>\n      </div>\n    </main>\n    <div class=\"toast\" role=\"status\" aria-live=\"polite\"></div>\n  </div>",
  "process-editor-header": "<header class=\"header\">\n        <img class=\"back\" src=\"assets/header-icon.svg\" alt=\"\">\n        <div class=\"divider\"></div>\n        <div class=\"title-block\"><h1>端到端切分标注流程</h1><p>v0.1-draft · 草稿 · 未保存变更</p></div>\n        <process-actions class=\"header-actions\"></process-actions>\n      </header>",
  "process-node-library": "<aside class=\"left-panel\">\n          <section class=\"flow-list\">\n            <search-input placeholder=\"搜索并聚焦 Flow\"></search-input>\n            <div class=\"flow-section\">\n              <div class=\"flow-head\"><div class=\"flow-label\"><img src=\"assets/chevron.svg\" alt=\"\"><span>正常流程</span><span>0/0</span></div><div class=\"flow-icons\"><img src=\"assets/add.svg\" alt=\"\"><img src=\"assets/layers.svg\" alt=\"\"></div></div>\n              <div class=\"main-flow\"><span>主流程</span><span><img src=\"assets/eye.svg\" alt=\"\" style=\"width:16px;vertical-align:middle;margin-right:12px\"><img src=\"assets/more.svg\" alt=\"\" style=\"width:16px;vertical-align:middle\"></span></div>\n            </div>\n            <div class=\"flow-section\" style=\"margin-top:0\"><div class=\"flow-head\"><div class=\"flow-label\"><img src=\"assets/chevron.svg\" alt=\"\"><span>异常流程</span><span>0/0</span></div><div class=\"flow-icons\"><img src=\"assets/add.svg\" alt=\"\"><img src=\"assets/layers.svg\" alt=\"\"></div></div></div>\n          </section>\n          <section class=\"palette\">\n            <div class=\"palette-group\">\n              <div class=\"group-head\"><img src=\"assets/chevron.svg\" alt=\"\"><span>流程控制</span><span class=\"count\">7</span></div>\n              <div class=\"palette-item\"><span class=\"node-icon green\"><img src=\"assets/start.svg\" alt=\"\"></span>Start</div>\n              <div class=\"palette-item\"><span class=\"node-icon gray\"><img src=\"assets/end.svg\" alt=\"\"></span>End</div>\n              <div class=\"palette-item\"><span class=\"node-icon blue\"><img src=\"assets/condition-fix.svg\" alt=\"\"></span>Condition</div>\n              <div class=\"palette-item\"><span class=\"node-icon mint\"><img src=\"assets/loop.svg\" alt=\"\"></span>Loop</div>\n              <div class=\"palette-item\"><span class=\"node-icon yellow\"><img src=\"assets/delay.svg\" alt=\"\"></span>Delay</div>\n              <div class=\"palette-item\"><span class=\"node-icon pink\"><img src=\"assets/wait.svg\" alt=\"\"></span>Wait For Input</div>\n              <div class=\"palette-item\"><span class=\"node-icon pink2\"><img src=\"assets/human.svg\" alt=\"\"></span>Human Interrupt</div>\n            </div>\n            <div class=\"palette-group\">\n              <div class=\"group-head\"><img src=\"assets/chevron.svg\" alt=\"\"><span>API、知识与数据</span><span class=\"count\">8</span></div>\n              <div class=\"palette-item\"><span class=\"node-icon purple\"><img src=\"assets/api.svg\" alt=\"\"></span>API Request</div>\n              <div class=\"palette-item\"><span class=\"node-icon purple\"><img src=\"assets/rag.svg\" alt=\"\"></span>RAG</div>\n              <div class=\"palette-item\"><span class=\"node-icon purple\"><img src=\"assets/memory.svg\" alt=\"\"></span>Memory</div>\n              <div class=\"palette-item\"><span class=\"node-icon purple\"><img src=\"assets/database.svg\" alt=\"\"></span>数据表查询</div>\n              <div class=\"palette-item\"><span class=\"node-icon purple\"><img src=\"assets/extract.svg\" alt=\"\"></span>参数提取</div>\n              <div class=\"palette-item\"><span class=\"node-icon purple\"><img src=\"assets/variable.svg\" alt=\"\"></span>Variable Assignment</div>\n              <div class=\"palette-item\"><span class=\"node-icon purple\"><img src=\"assets/variable.svg\" alt=\"\"></span>文本模板</div>\n              <div class=\"palette-item\"><span class=\"node-icon purple\"><img src=\"assets/function.svg\" alt=\"\"></span>Function</div>\n            </div>\n            <div class=\"palette-group\">\n              <div class=\"group-head\"><img src=\"assets/chevron.svg\" alt=\"\"><span>机器人技能</span><span class=\"count\">4</span></div>\n              <div class=\"palette-item\"><span class=\"node-icon green\"><img src=\"assets/nav.svg\" alt=\"\"></span>精准导航</div>\n              <div class=\"palette-item\"><span class=\"node-icon green\"><img src=\"assets/pose.svg\" alt=\"\"></span>位姿调整</div>\n              <div class=\"palette-item\"><span class=\"node-icon green\"><img src=\"assets/gripper.svg\" alt=\"\"></span>夹爪开合</div>\n              <div class=\"palette-item\"><span class=\"node-icon green\"><img src=\"assets/omini.svg?v=2\" alt=\"\"></span>Omini Model</div>\n            </div>\n          </section>\n        </aside>",
  "process-flow-canvas": "<section class=\"canvas\">\n          <div class=\"canvas-stage\" data-zoom=\"0.7\" data-pan-x=\"30\" data-pan-y=\"260\">\n            <div class=\"canvas-viewport\">\n              <svg class=\"edge-layer\" viewBox=\"0 0 1600 560\" aria-hidden=\"true\">\n                <defs>\n                  <marker id=\"arrow\" viewBox=\"0 0 10 10\" refX=\"8.5\" refY=\"5\" markerWidth=\"4.5\" markerHeight=\"4.5\" orient=\"auto-start-reverse\">\n                    <path d=\"M 0 0 L 10 5 L 0 10 z\" fill=\"#90a1b9\"></path>\n                  </marker>\n                </defs>\n              </svg>\n\n              <div class=\"scene\">\n                <div class=\"graph-node start-main\" data-node=\"start\" style=\"left:40px;top:90px\">\n                  <img src=\"assets/start.svg\" alt=\"\" style=\"width:12px;height:12px\">\n                  <div class=\"node-text\"><div class=\"graph-title\">京东项目 MVP</div><div class=\"graph-sub\">流程入口</div></div>\n                  <span class=\"port\" style=\"right:-4px;top:15px\"></span>\n                </div>\n                <div class=\"graph-node\" data-node=\"wait\" style=\"left:200px;top:90px\">\n                  <span class=\"mini pink\"><img src=\"assets/wait.svg\" alt=\"\"></span>\n                  <div class=\"node-text\"><div class=\"graph-title\">Wait For Input</div><div class=\"graph-sub\">未配置路径</div></div>\n                  <span class=\"port\" style=\"left:-4px;top:15px\"></span>\n                  <span class=\"port\" style=\"right:-4px;top:15px\"></span>\n                </div>\n\n                <div class=\"loop-box\">\n                  <div class=\"loop-title\">\n                    <span class=\"node-icon mint\" style=\"width:20px;height:20px\"><img src=\"assets/loop.svg\" alt=\"\" style=\"width:12px;height:12px\"></span>\n                    循环区域\n                    <span class=\"loop-chip\">Loop</span>\n                  </div>\n                  <div class=\"loop-stage\"></div>\n                </div>\n\n                <div class=\"graph-node\" data-node=\"nav-grasp\" style=\"left:376px;top:56px\">\n                  <span class=\"mini green\"><img src=\"assets/nav.svg\" alt=\"\"></span>\n                  <div class=\"node-text\"><div class=\"graph-title\">精准导航</div><div class=\"graph-sub\">抓取点位</div></div>\n                  <span class=\"port\" style=\"left:-4px;top:16px\"></span><span class=\"port\" style=\"right:-4px;top:16px\"></span>\n                </div>\n                <div class=\"graph-node\" data-node=\"pose\" style=\"left:376px;top:99px\">\n                  <span class=\"mini green\"><img src=\"assets/pose.svg\" alt=\"\"></span>\n                  <div class=\"node-text\"><div class=\"graph-title\">位姿调整</div><div class=\"graph-sub\">抓取前位姿 init</div></div>\n                  <span class=\"port\" style=\"left:-4px;top:16px\"></span><span class=\"port\" style=\"right:-4px;top:16px\"></span>\n                </div>\n                <div class=\"graph-node selected\" data-node=\"grasp\" style=\"left:376px;top:143px\">\n                  <span class=\"mini green\"><img src=\"assets/omini.svg?v=2\" alt=\"\"></span>\n                  <div class=\"node-text\"><div class=\"graph-title\">京东-SKU抓取</div><div class=\"graph-sub\">Spirit-v1.6 · 94%</div></div>\n                  <span class=\"port\" style=\"left:-4px;top:15px\"></span><span class=\"port\" style=\"right:-4px;top:15px\"></span>\n                </div>\n                <div class=\"graph-node\" data-node=\"human-1\" style=\"left:533px;top:56px\">\n                  <span class=\"mini pink2\"><img src=\"assets/human.svg\" alt=\"\"></span>\n                  <div class=\"node-text\"><div class=\"graph-title\">Human Interrupt</div><div class=\"graph-sub\">等待人工接管</div></div>\n                  <span class=\"port\" style=\"left:-4px;top:16px\"></span><span class=\"port\" style=\"right:-4px;top:16px\"></span>\n                </div>\n                <div class=\"graph-node\" data-node=\"scan\" style=\"left:533px;top:129px\">\n                  <span class=\"mini green\"><img src=\"assets/omini.svg?v=2\" alt=\"\"></span>\n                  <div class=\"node-text\"><div class=\"graph-title\">京东-SKU扫码</div><div class=\"graph-sub\">Spirit-v1.6 · 91%</div></div>\n                  <span class=\"port\" style=\"left:-4px;top:16px\"></span><span class=\"port\" style=\"right:-4px;top:16px\"></span>\n                </div>\n                <div class=\"graph-node\" data-node=\"human-2\" style=\"left:690px;top:56px\">\n                  <span class=\"mini pink2\"><img src=\"assets/human.svg\" alt=\"\"></span>\n                  <div class=\"node-text\"><div class=\"graph-title\">Human Interrupt</div><div class=\"graph-sub\">等待人工接管</div></div>\n                  <span class=\"port\" style=\"left:-4px;top:16px\"></span><span class=\"port\" style=\"right:-4px;top:16px\"></span>\n                </div>\n                <div class=\"graph-node\" data-node=\"condition\" style=\"left:690px;top:128px\">\n                  <span class=\"mini blue\"><img src=\"assets/condition-fix.svg\" alt=\"\"></span>\n                  <div class=\"node-text\"><div class=\"graph-title\">IF/ELSE</div><div class=\"graph-sub\">CASE 1</div></div>\n                  <span class=\"port\" style=\"left:-4px;top:17px\"></span><span class=\"port\" style=\"right:-4px;top:17px\"></span>\n                </div>\n                <div class=\"graph-node\" data-node=\"nav-place-1\" style=\"left:847px;top:56px;width:126px\">\n                  <span class=\"mini green\"><img src=\"assets/nav.svg\" alt=\"\"></span>\n                  <div class=\"node-text\"><div class=\"graph-title\">精准导航</div><div class=\"graph-sub\">放置点位 1（槽位 1、2、4、5、7、8）</div></div>\n                  <span class=\"port\" style=\"left:-4px;top:16px\"></span><span class=\"port\" style=\"right:-4px;top:16px\"></span>\n                </div>\n                <div class=\"graph-node\" data-node=\"nav-place-2\" style=\"left:847px;top:129px;width:126px\">\n                  <span class=\"mini green\"><img src=\"assets/nav.svg\" alt=\"\"></span>\n                  <div class=\"node-text\"><div class=\"graph-title\">精准导航</div><div class=\"graph-sub\">放置点位 2（槽位 3、6、9）</div></div>\n                  <span class=\"port\" style=\"left:-4px;top:16px\"></span><span class=\"port\" style=\"right:-4px;top:16px\"></span>\n                </div>\n                <div class=\"graph-node\" data-node=\"place\" style=\"left:1004px;top:94px\">\n                  <span class=\"mini green\"><img src=\"assets/omini.svg?v=2\" alt=\"\"></span>\n                  <div class=\"node-text\"><div class=\"graph-title\">京东-SKU放置</div><div class=\"graph-sub\">Spirit-v1.6 · 93%</div></div>\n                  <span class=\"port\" style=\"left:-4px;top:16px\"></span><span class=\"port\" style=\"right:-4px;top:8px\"></span><span class=\"port\" style=\"right:-4px;top:24px\"></span>\n                </div>\n                <div class=\"graph-node\" data-node=\"human-3\" style=\"left:1160px;top:56px\">\n                  <span class=\"mini pink2\"><img src=\"assets/human.svg\" alt=\"\"></span>\n                  <div class=\"node-text\"><div class=\"graph-title\">Human Interrupt</div><div class=\"graph-sub\">等待人工接管</div></div>\n                  <span class=\"port\" style=\"left:-4px;top:16px\"></span><span class=\"port\" style=\"right:-4px;top:16px\"></span>\n                </div>\n                <div class=\"graph-node\" data-node=\"continue\" style=\"left:1160px;top:129px\">\n                  <span class=\"mini mint\"><img src=\"assets/loop.svg\" alt=\"\"></span>\n                  <div class=\"node-text\"><div class=\"graph-title\">Continue</div><div class=\"graph-sub\">进入当前 Loop 下一轮</div></div>\n                  <span class=\"port\" style=\"left:-4px;top:16px\"></span><span class=\"port\" style=\"right:-4px;top:16px\"></span>\n                </div>\n                <div class=\"graph-node\" data-node=\"end\" style=\"left:1337px;top:93px;width:129px\">\n                  <span class=\"mini gray\"><img src=\"assets/end.svg\" alt=\"\"></span>\n                  <div class=\"node-text\"><div class=\"graph-title\">End</div><div class=\"graph-sub\">End</div></div>\n                  <span class=\"port\" style=\"left:-4px;top:14px\"></span>\n                </div>\n              </div>\n            </div>\n          </div>\n          <process-canvas-tools></process-canvas-tools>\n          <div class=\"minimap\"><div class=\"minimap-frame\"><img src=\"assets/minimap.svg\" alt=\"\"></div></div>\n          <process-canvas-zoom></process-canvas-zoom>\n        </section>",
  "process-node-properties": "<aside class=\"right-panel\">\n          <div class=\"prop-head\"><div class=\"avatar\"><img src=\"assets/omini.svg?v=2\" alt=\"\"></div><div class=\"prop-title\"><h2>京东-SKU抓取</h2><p>添加备注</p></div><div class=\"prop-tools\"><button><img src=\"assets/toolbar-icon-1.svg\" alt=\"\"></button><button><img src=\"assets/toolbar-icon-2.svg\" alt=\"\"></button><button><img src=\"assets/toolbar-icon-3.svg\" alt=\"\"></button></div></div>\n          <task-status-tabs variant=\"process\" active=\"settings\"></task-status-tabs>\n          <div class=\"panel-scroll\" data-tab=\"settings\">\n            <section class=\"section\"><h3>Omini Model 能力</h3><div class=\"cap-card\"><div class=\"avatar\"><img src=\"assets/omini.svg?v=2\" alt=\"\"></div><div class=\"cap-info\"><strong>京东-SKU抓取</strong><span>Spirit-v1.6 · 仓储拣选 · p-sku-grasp-v4</span></div><div class=\"replace\">更换</div></div><p class=\"desc\">能力引用、Slot 与 Prompt 会随节点一起保存，运行时只读取这里的结构化配置。</p></section>\n            <section class=\"section\"><h3>模型与Prompt</h3><form-input class=\"field\" label=\"模型路径\" name=\"model\" value=\"Spirit-v1.6\"></form-input><form-input class=\"field\" label=\"代码分支\" name=\"branch\" placeholder=\"可选，例如 release/v1.6\"></form-input><form-input class=\"field\" label=\"Prompt\" name=\"prompt\" multiline></form-input></section>\n            <section class=\"section\"><div class=\"section-heading\"><h3>能力参数</h3><span class=\"badge\">1/3</span></div><div class=\"field\"><div class=\"slot-label\"><strong>SKU 形态</strong><span>sku_shape · 必填</span></div><div class=\"input\">rectangular box</div></div><div class=\"field\"><div class=\"slot-label\"><strong>来源槽位</strong><span>source_slot · 必填</span></div><div class=\"input\">A1</div></div><div class=\"field\"><div class=\"slot-label\"><strong>执行手</strong><span>hand · 必填</span></div><div class=\"input\">right<img src=\"assets/dropdown-icon.svg\" alt=\"\" style=\"width:16px;height:16px\"></div></div><div class=\"warning\"><img src=\"assets/warning-icon.svg\" alt=\"\">还有必填参数未配置：SKU 形态、来源槽位</div></section>\n          </div>\n          <div class=\"panel-scroll\" data-tab=\"recent\"><div class=\"recent-empty\">暂无运行记录</div></div>\n        </aside>",
  "process-canvas-tools": "<div class=\"toolbar-left\">\n            <button class=\"tool-btn\" title=\"选择\"><img src=\"assets/cursor.svg\" alt=\"\"></button>\n            <button class=\"tool-btn active\" data-action=\"hand\" title=\"拖拽平移\"><img src=\"assets/hand-tool.svg\" alt=\"\"></button>\n            <button class=\"tool-btn\" data-action=\"undo\" title=\"撤销\"><img src=\"assets/undo.svg\" alt=\"\"></button>\n            <button class=\"tool-btn\" data-action=\"redo\" title=\"重做\"><img src=\"assets/redo.svg\" alt=\"\"></button>\n          </div>",
  "process-canvas-zoom": "<div class=\"zoom\">\n            <button class=\"zoom-btn\" data-action=\"zoom-out\"><img src=\"assets/zoom-minus.svg\" alt=\"\"></button>\n            <div class=\"zoom-text\">70%</div>\n            <button class=\"zoom-btn\" data-action=\"zoom-in\"><img src=\"assets/zoom-plus.svg\" alt=\"\"></button>\n          </div>"
};
  function basicPalette() {
    return `<div class="palette-group">${[['green','start.svg','开始节点'],['pink2','human.svg','人工节点'],['green','omini.svg','自动化节点'],['blue','condition-fix.svg','条件节点'],['gray','end.svg','结束节点']].map(([color, icon, label]) => `<div class="palette-item"><span class="node-icon ${color}"><img src="${assets}${icon}" alt=""></span>${label}</div>`).join('')}</div>`;
  }
  for (const [name, template] of Object.entries(templates)) {
    if (customElements.get(name)) continue;
    customElements.define(name, class extends HTMLElement {
      connectedCallback() {
        if (this.dataset.rendered) return;
        this.dataset.rendered = 'true';
        this.innerHTML = template.replace(/src="assets\//g, 'src="' + assets.href);
        const basic = this.getAttribute('variant') === 'basic';
        if (basic && name === 'process-node-properties') {
          this.innerHTML = `<aside class="right-panel human-properties">
            <header class="human-properties-header"><span class="avatar human-properties-icon"><img src="${assets}human.svg" alt=""></span><h2>供应商抽验</h2><div class="prop-tools"><button type="button" aria-label="关闭属性面板" data-property-action="close"><img src="${assets}toolbar-icon-3.svg" alt=""></button></div></header>
            <form class="human-properties-form">
              <section><h3>基础信息</h3><div class="human-properties-grid"><form-input label="节点名称" name="nodeName" value="供应商抽验"></form-input><form-input label="标识" name="nodeId" value="human_2"></form-input></div><form-input label="描述" name="description" value="供应商抽验" multiline></form-input></section>
              <section><h3>处理人</h3><p>处理人分配</p><div class="human-properties-grid"><label class="human-option"><input type="radio" name="assignee" value="custom" checked>任务自定义</label><label class="human-option"><input type="radio" name="assignee" value="inherit">继承前序节点</label></div></section>
              <section><h3>处理规则</h3><p>处理规则</p><div class="human-properties-grid"><label class="human-option"><input type="radio" name="rule" value="custom">任务自定义</label><label class="human-option"><input type="radio" name="rule" value="inherit">继承前序节点</label><label class="human-option"><input type="radio" name="rule" value="none" checked>无需配置</label></div></section>
              <section><h3>工作台</h3><label class="human-workbench">工作台<select name="workbench"><option value="semantic-v1">语义标注工作台 v1.0</option></select></label><p>可用操作</p><label class="human-option is-disabled"><input type="checkbox" disabled>驳回</label><p class="human-property-note">支持驳回到的节点（当前节点没有前序人工节点，暂不可开启驳回）</p></section>
            </form>
            <footer class="human-properties-footer"><span role="status"></span><text-button variant="outline" data-property-action="delete">删除节点</text-button><text-button variant="primary" data-property-action="save">保存</text-button></footer>
          </aside>`;
          this.querySelector('[data-property-action="save"]').addEventListener('click', () => {
            const detail = Object.fromEntries(new FormData(this.querySelector('form')));
            this.querySelectorAll('form-input').forEach(input => { detail[input.getAttribute('name')] = input.value; });
            this.savedValue = detail;
            this.querySelector('h2').textContent = detail.nodeName;
            this.querySelector('[role="status"]').textContent = '已保存';
            this.dispatchEvent(new CustomEvent('node-properties-save', { bubbles: true, detail }));
          });
          for (const action of ['close', 'delete']) this.querySelector(`[data-property-action="${action}"]`).addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent(`node-properties-${action}`, { bubbles: true, detail: { nodeId: this.querySelector('[name="nodeId"]').value } }));
          });
        }
        if (basic && name === 'process-node-library') {
          this.querySelector('.palette').innerHTML = basicPalette();
        }
        if (basic && name === 'process-flow-canvas') {
          this.querySelector('.loop-box')?.remove();
          const originals = new Map([...this.querySelectorAll('.graph-node')].map(node => [node.dataset.node, node.cloneNode(true)]));
          this.querySelectorAll('.graph-node').forEach(node => node.remove());
          const flow = [
            ['start','start','start','Start'],
            ['split','grasp','端到端切分','生成初始动作片段'],
            ['sample','human-1','供应商抽验','供应商抽验'],
            ['review','human-1','供应商复核','供应商复核'],
            ['accept','human-1','供应商验收','供应商验收'],
            ['condition','condition','供应商抽样','供应商抽样 · IF'],
            ['internal','human-1','内部验收','内部验收'],
            ['end','end','end','End']
          ];
          flow.forEach(([id, source, title, description], index) => {
            const node = originals.get(source).cloneNode(true);
            node.dataset.node = id;
            node.classList.remove('selected');
            node.querySelector('.graph-title').textContent = title;
            node.querySelector('.graph-sub').textContent = description;
            Object.assign(node.style, { left: `${40 + index * 160}px`, top: '160px' });
            // Keep the main input/output ports on the same baseline.
            node.querySelectorAll('.port').forEach(port => {
              port.style.top = '15px';
              port.style.bottom = 'auto';
            });
            if (id === 'condition') {
              node.classList.add('basic-condition');
              node.querySelector('.graph-sub').remove();
              node.querySelectorAll('.port')[1].style.top = '51px';
              node.insertAdjacentHTML('beforeend', '<div class="basic-branches"><div class="basic-branch"><span>供应商抽样</span><b>IF</b></div><div class="basic-branch"><span>其他</span><b>ELSE</b></div></div><span class="port" style="right:-4px;top:79px"></span>');
            }
            this.querySelector('.scene').append(node);
          });
          this.querySelector('process-canvas-tools')?.setAttribute('variant', 'basic');
        }
        if (name === 'process-flow-canvas') {
          const columns = [...new Set([...this.querySelectorAll('.graph-node')].map(node => parseFloat(node.style.left)))].sort((a,b) => a-b);
          const columnPositions = new Map();
          let columnX = columns[0] * 1.65;
          columns.forEach((left, index) => {
            if (index) columnX += 210 + Math.max(24, (left-columns[index-1])*1.65-210-23);
            columnPositions.set(left, columnX);
          });
          this.querySelectorAll('.graph-node').forEach(node => {
            node.style.removeProperty('width');
            const startIcon = node.querySelector(':scope.start-main > img');
            if (startIcon) {
              startIcon.style.width = '23px';
              startIcon.style.height = '23px';
              startIcon.style.flex = 'none';
            }
            node.style.left = `${columnPositions.get(parseFloat(node.style.left))}px`;
            node.style.top = `${parseFloat(node.style.top) * 1.65}px`;
            node.querySelectorAll('.port').forEach(port => {
              port.style.top = `${parseFloat(port.style.top) * 1.65 + (node.classList.contains('basic-condition') ? 3 : -1)}px`;
            });
            if (node.classList.contains('basic-condition')) {
              node.querySelectorAll('.port').forEach((port, index) => {
                port.style.top = `${[24, 67, 103][index]}px`;
              });
            }
          });
        }
        if (name === 'process-node-library') {
          const panel = this.querySelector('.left-panel');
          const toggle = document.createElement('button');
          toggle.type = 'button';
          toggle.className = 'node-library-toggle';
          toggle.textContent = '‹';
          toggle.title = '收起节点栏';
          toggle.setAttribute('aria-expanded', 'true');
          toggle.setAttribute('aria-label', '收起节点栏');
          panel.prepend(toggle);
          toggle.addEventListener('click', () => {
            const collapsed = panel.classList.toggle('is-library-collapsed');
            toggle.textContent = collapsed ? '›' : '‹';
            toggle.setAttribute('aria-expanded', String(!collapsed));
            toggle.setAttribute('aria-label', collapsed ? '展开节点栏' : '收起节点栏');
            toggle.title = collapsed ? '展开节点栏' : '收起节点栏';
          });
        }
        if (name === 'process-canvas-tools') {
          this.querySelector('.toolbar-left').insertAdjacentHTML('beforeend', `
            <span class="toolbar-divider" aria-hidden="true"></span>
            <button type="button" class="tool-btn" data-action="add" title="添加" aria-label="添加">
              <svg class="toolbar-add-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M12 7v10M7 12h10" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>
            </button>`);
          const addButton = this.querySelector('[data-action="add"]');
          const menu = document.createElement('div');
          menu.className = 'canvas-add-menu';
          menu.hidden = true;
          menu.setAttribute('aria-label', '添加节点');
          addButton.setAttribute('aria-expanded', 'false');
          this.querySelector('.toolbar-left').append(menu);
          const closeMenu = () => {
            menu.hidden = true;
            addButton.setAttribute('aria-expanded', 'false');
          };
          addButton.addEventListener('click', (event) => {
            if (!menu.hidden) { closeMenu(); return; }
            menu.removeAttribute('style');
            const fragment = document.createElement('template');
            fragment.innerHTML = templates['process-node-library'].replace(/src="assets\//g, 'src="' + assets.href);
            if (this.getAttribute('variant') === 'basic') fragment.content.querySelector('.palette').innerHTML = basicPalette();
            menu.replaceChildren(fragment.content.querySelector('.palette'));
            menu.querySelectorAll('.group-head').forEach(head => {
              head.tabIndex = 0;
              head.setAttribute('role', 'button');
              head.setAttribute('aria-expanded', 'true');
              head.addEventListener('click', () => {
                const collapsed = head.parentElement.classList.toggle('is-collapsed');
                head.setAttribute('aria-expanded', String(!collapsed));
              });
              head.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); head.click(); }
              });
            });
            menu.querySelectorAll('.palette-item').forEach((item, index) => {
              item.tabIndex = 0;
              item.setAttribute('role', 'button');
              item.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('node-pick', { bubbles: true, detail: { label: item.textContent.trim(), icon: item.querySelector('.node-icon').innerHTML, color: item.querySelector('.node-icon').className } }));
                closeMenu();
                addButton.focus();
              });
              item.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); item.click(); }
              });
            });
            menu.hidden = false;
            const anchor = event.detail?.anchor;
            if (anchor) {
              const bounds = this.closest('.canvas-stage')?.getBoundingClientRect()
                || {left:0, top:0, right:window.innerWidth, bottom:window.innerHeight};
              menu.style.position = 'fixed';
              menu.style.bottom = 'auto';
              menu.style.maxHeight = `${Math.max(80, bounds.bottom-bounds.top-24)}px`;
              const rect = menu.getBoundingClientRect();
              const left = Math.max(bounds.left+12, Math.min(anchor.left, bounds.right-rect.width-12));
              const top = Math.max(bounds.top+12, Math.min(anchor.bottom+8, bounds.bottom-rect.height-12));
              menu.style.left = `${left}px`;
              menu.style.top = `${top}px`;
            }
            addButton.setAttribute('aria-expanded', 'true');
            this.dispatchEvent(new CustomEvent('canvas-add', { bubbles: true }));
          });
          menu.addEventListener('pointerdown', event => event.stopPropagation());
          menu.addEventListener('wheel', event => event.stopPropagation());
          document.addEventListener('pointerdown', event => {
            if (!menu.hidden && !menu.contains(event.target) && !addButton.contains(event.target)) closeMenu();
          });
          menu.addEventListener('keydown', event => {
            if (event.key === 'Escape') { event.stopPropagation(); closeMenu(); addButton.focus(); }
          });
          addButton.addEventListener('keydown', event => {
            if (event.key === 'Escape') closeMenu();
          });
        }
        if (name === 'process-editor-header') {
          const icon = this.querySelector('.back');
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'back-button';
          button.setAttribute('aria-label', '返回上一页');
          button.title = '返回上一页';
          icon.replaceWith(button);
          button.append(icon);
          button.addEventListener('click', () => window.history.back());
        }
        if (name === 'process-flow-canvas' && this.hasAttribute('external-controls')) {
          this.querySelectorAll('process-canvas-tools,process-canvas-zoom').forEach(control => control.remove());
        }
      }
    });
  }
})();
