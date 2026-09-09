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
          this.querySelectorAll('.human-properties-form section > h3 + p').forEach(label=>{
            if(['处理人分配','处理规则'].includes(label.textContent.trim()))label.remove();
          });
          const workbenchLabel=this.querySelector('.human-workbench');
          const rejectOption=this.querySelector('.human-option.is-disabled');
          rejectOption.classList.remove('is-disabled');
          const rejectInput=rejectOption.querySelector('input');rejectInput.disabled=false;rejectInput.name='allowReject';rejectInput.value='true';
          this.querySelector('.human-property-note').textContent='支持驳回到前序人工节点。';
          [...workbenchLabel.childNodes].filter(node=>node.nodeType===Node.TEXT_NODE).forEach(node=>node.remove());
          workbenchLabel.querySelector('select').setAttribute('aria-label','工作台');
          this.querySelector('[data-property-action="save"]').addEventListener('click', () => {
            const detail = Object.fromEntries(new FormData(this.querySelector('form')));
            this.querySelectorAll('form-input').forEach(input => { detail[input.getAttribute('name')] = input.value; });
            this.savedValue = detail;
            this.querySelector('h2').textContent = detail.nodeName;
            this.querySelector('[role="status"]').textContent = '已保存';
            this.dispatchEvent(new CustomEvent('node-properties-save', { bubbles: true, detail }));
          });
          for (const action of ['close', 'delete']) this.querySelector(`[data-property-action="${action}"]`).addEventListener('click', () => {
            if(action==='close')this.querySelector('.right-panel').style.display='none';
            this.dispatchEvent(new CustomEvent(`node-properties-${action}`, { bubbles: true, detail: { nodeId: this.querySelector('[name="nodeId"]').value } }));
          });
        }
        if (basic && name === 'process-node-library') {
          this.querySelector('.palette').innerHTML = basicPalette();
        }
        if ((basic || this.getAttribute('variant') === 'initial') && name === 'process-flow-canvas') {
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
          const initial=this.getAttribute('variant')==='initial';
          (initial?flow.filter(([id])=>id==='start'||id==='end'):flow).forEach(([id, source, title, description], index) => {
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
            const minimumGap = 62;
            if (index) columnX += 210 + Math.max(minimumGap, (left-columns[index-1])*1.65-210-23);
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
          if (this.getAttribute('variant') === 'workflow') {
            const groups = [
              ['WORKFLOW PRIMITIVE', [['green','start','Start'],['gray','end','End'],['blue','condition-fix','Condition'],['mint','loop','Loop'],['yellow','variable-yellow','Variable Assignment'],['purple','api','API Request'],['blue','call-flow','Call Flow'],['pink2','human','Human Interrupt']]],
              ['ROBOT / AI CAPABILITY', [['green','pose','Pose Set'],['green','nav','Navigation'],['green','omini','Omini Model']]]
            ];
            this.querySelector('.palette').innerHTML = groups.map(([label, items]) => `<div class="palette-group"><div class="group-head"><img src="${assets}chevron.svg" alt=""><span>${label}</span><span class="count">${items.length}</span></div>${items.map(([color, icon, text]) => `<div class="palette-item"><span class="node-icon ${color}"><img src="${assets}${icon}.svg" alt=""></span>${text}</div>`).join('')}</div>`).join('');
          }
          const panel = this.querySelector('.left-panel');
          const palette=panel.querySelector('.palette');
          const heading=document.createElement('h3');heading.className='library-section-title';heading.textContent='节点库';
          panel.prepend(heading);
          const flows=panel.querySelector('.flow-list');
          flows.innerHTML='<h3 class="library-section-title">流程</h3><div class="library-flow-tree"><div class="library-flow-row is-current"><span>主流程</span><button type="button" aria-label="主流程更多操作">···</button></div><div class="library-subflows"><div class="library-flow-row"><span>子流程</span><button type="button" aria-label="子流程更多操作">···</button></div></div></div>';
          panel.prepend(flows);
          const more='<button type="button" class="flow-more" aria-label="更多操作"><svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/></svg></button>';
          flows.innerHTML=`<h3 class="library-section-title">流程</h3><div class="library-flow-tree"><div class="library-flow-row is-current"><button class="flow-tree-toggle" type="button" aria-label="收起子流程" aria-expanded="true"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m4 6 4 4 4-4"/></svg></button><span class="flow-name" title="任务处理流程">任务处理流程</span><span class="flow-main-tag">主流程</span>${more}</div><div class="library-subflows"><div class="library-flow-row"><span class="flow-name">数据预处理</span>${more}</div><div class="library-flow-row"><span class="flow-name">质量验收</span>${more}</div></div></div>`;
          flows.querySelector('.flow-main-tag').textContent='主';
          const flowHeading=flows.querySelector('.library-section-title');
          flowHeading.innerHTML='<span>流程 <span class="library-heading-count">'+flows.querySelectorAll('.library-flow-row').length+'</span></span>';
          const nodeCount=document.createElement('span');nodeCount.className='library-heading-count';nodeCount.textContent=String(palette.querySelectorAll('.palette-item').length);
          heading.append(' ',nodeCount);
          const search=document.createElement('label');search.className='library-node-search';
          search.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><input type="search" placeholder="搜索节点" aria-label="搜索节点">';
          heading.after(search);
          const empty=document.createElement('div');empty.className='library-search-empty';empty.textContent='未找到匹配节点';empty.hidden=true;palette.append(empty);
          const groups=[...palette.querySelectorAll('.palette-group')];
          let collapsedBeforeSearch=null;
          search.querySelector('input').addEventListener('input',event=>{
            const query=event.target.value.trim().toLowerCase();
            if(query && !collapsedBeforeSearch)collapsedBeforeSearch=groups.map(group=>group.classList.contains('is-collapsed'));
            let count=0;
            palette.querySelectorAll('.palette-item').forEach(item=>{const match=!query || item.textContent.toLowerCase().includes(query);item.hidden=!match;if(match)count++;});
            groups.forEach((group,index)=>{
              group.hidden=!!query && ![...group.querySelectorAll('.palette-item')].some(item=>!item.hidden);
              if(query)group.classList.remove('is-collapsed');
              else if(collapsedBeforeSearch)group.classList.toggle('is-collapsed',collapsedBeforeSearch[index]);
              group.querySelector('.group-head')?.setAttribute('aria-expanded',String(!group.classList.contains('is-collapsed')));
            });
            if(!query)collapsedBeforeSearch=null;
            empty.hidden=count!==0;
          });
          flows.querySelector('.library-section-title').insertAdjacentHTML('beforeend','<span class="flow-heading-actions"><button type="button" aria-label="定位流程" title="定位流程"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 2v5m0 10v5M2 12h5m10 0h5"/></svg></button><button type="button" aria-label="新增流程" title="新增流程"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M12 4v16M4 12h16"/></svg></button></span>');
          const eye='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
          const flowIds=['main','preprocess','quality'];
          const hiddenFlows=new Set();
          const visibilityButtons=[];
          const allEye=flows.querySelector('.flow-heading-actions button');
          const refreshVisibility=()=>{
            visibilityButtons.forEach((button,index)=>{const visible=!hiddenFlows.has(flowIds[index]);button.innerHTML=eye;button.classList.toggle('is-off',!visible);button.setAttribute('aria-pressed',String(visible));button.title=(visible?'隐藏':'显示')+flows.querySelectorAll('.flow-name')[index].textContent;button.setAttribute('aria-label',button.title);});
            allEye.innerHTML=eye;allEye.title=hiddenFlows.size?'显示全部流程':'隐藏全部流程';allEye.setAttribute('aria-label',allEye.title);allEye.setAttribute('aria-pressed',String(!hiddenFlows.size));
            this.dispatchEvent(new CustomEvent('flow-visibility-change',{bubbles:true,detail:{hidden:[...hiddenFlows]}}));
          };
          flows.querySelectorAll('.library-flow-row').forEach((row,index)=>{
            const button=document.createElement('button');button.type='button';button.className='flow-visibility';row.querySelector('.flow-more').before(button);visibilityButtons.push(button);
            button.addEventListener('click',()=>{const id=flowIds[index];hiddenFlows.has(id)?hiddenFlows.delete(id):hiddenFlows.add(id);refreshVisibility();});
          });
          allEye.addEventListener('click',()=>{if(hiddenFlows.size)hiddenFlows.clear();else flowIds.forEach(id=>hiddenFlows.add(id));refreshVisibility();});
          refreshVisibility();
          const treeToggle=flows.querySelector('.flow-tree-toggle');
          const categoryArrow=palette.querySelector('.group-head img');
          if(categoryArrow){const arrow=categoryArrow.cloneNode(true);arrow.alt='';treeToggle.replaceChildren(arrow);}
          const alignFlowArrow=()=>{
            if(!categoryArrow || panel.classList.contains('is-library-collapsed'))return;
            treeToggle.style.transform='none';
            const target=categoryArrow.getBoundingClientRect();
            const scale=panel.getBoundingClientRect().width/panel.offsetWidth;
            if(!target.width || !scale)return;
            const row=treeToggle.closest('.library-flow-row');
            const rowRect=row.getBoundingClientRect();
            const inset=(target.left-rowRect.left)/scale;
            row.style.paddingLeft=`${inset}px`;
            // Use the category's icon-to-label gap for the flow name as well.
            row.style.gap=getComputedStyle(categoryArrow.parentElement).gap;
            const more=row.querySelector('.flow-more');
            const svg=more.querySelector('svg');
            const internalInset=(more.offsetWidth-svg.getBoundingClientRect().width/scale)/2;
            flows.querySelectorAll('.library-flow-row').forEach(item=>{item.style.paddingRight=`${Math.max(0,inset-internalInset)}px`;});
            const headingActions=flows.querySelector('.flow-heading-actions');
            headingActions.style.transform='none';
            const headingLast=headingActions.lastElementChild.getBoundingClientRect();
            const rowLast=more.getBoundingClientRect();
            headingActions.style.transform=`translateX(${(rowLast.left+rowLast.width/2-headingLast.left-headingLast.width/2)/scale}px)`;
            headingActions.style.gap=getComputedStyle(row).gap;
          };
          const arrowAlignmentObserver=new ResizeObserver(()=>requestAnimationFrame(alignFlowArrow));
          arrowAlignmentObserver.observe(panel);
          requestAnimationFrame(alignFlowArrow);
          treeToggle.addEventListener('click',()=>{
            const expanded=treeToggle.getAttribute('aria-expanded')!=='true';
            treeToggle.setAttribute('aria-expanded',String(expanded));
            treeToggle.setAttribute('aria-label',expanded?'收起子流程':'展开子流程');
            flows.querySelector('.library-subflows').hidden=!expanded;
          });
          const divider=document.createElement('div');divider.className='library-resizer';divider.tabIndex=0;
          divider.setAttribute('role','separator');divider.setAttribute('aria-orientation','horizontal');divider.setAttribute('aria-label','调整流程区域高度');
          flows.after(divider);
          const resize=value=>{const height=Math.max(90,Math.min(value,Math.max(90,panel.clientHeight-160)));flows.style.height=`${height}px`;divider.setAttribute('aria-valuenow',String(Math.round(height)));};
          let resizeDrag=null;
          divider.addEventListener('pointerdown',event=>{if(event.button!==0)return;event.preventDefault();resizeDrag={y:event.clientY,height:flows.offsetHeight};divider.setPointerCapture(event.pointerId);});
          divider.addEventListener('pointermove',event=>{if(resizeDrag)resize(resizeDrag.height+event.clientY-resizeDrag.y);});
          const endResize=()=>{resizeDrag=null;};
          divider.addEventListener('pointerup',endResize);divider.addEventListener('pointercancel',endResize);
          divider.addEventListener('keydown',event=>{if(['ArrowUp','ArrowDown'].includes(event.key)){event.preventDefault();resize(flows.offsetHeight+(event.key==='ArrowUp'?-10:10));}});
          const toggle = document.createElement('button');
          toggle.type = 'button';
          toggle.className = 'node-library-toggle';
          toggle.style.display = 'none';
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
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/></svg>
            </button>`);
          const addButton = this.querySelector('[data-action="add"]');
          addButton.insertAdjacentHTML('afterend','<button type="button" class="tool-btn" data-action="arrange" title="整理节点" aria-label="整理节点"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M9 6h6M6 9v9h9"/></svg></button>');
          const menu = document.createElement('div');
          const toolLabels={fit:'选择 / 适应画布',hand:'拖动画布',undo:'撤销',redo:'重做',add:'展开 / 收起节点栏',arrange:'整理节点'};
          this.querySelectorAll('.tool-btn').forEach(button=>{
            const label=toolLabels[button.dataset.action] || button.getAttribute('aria-label') || '选择节点';
            button.title=label;button.setAttribute('aria-label',label);button.dataset.tooltip=label;
          });
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
            if (!event.detail?.anchor) {
              const canvas=this.closest('.canvas-stage');
              const scope=this.closest('process-editor-page') || this.closest('.process-editor-components');
              let library=canvas?.querySelector('process-node-library') || scope?.querySelector('process-node-library');
              if (!library && canvas) {
                library=document.createElement('process-node-library');
                if(this.getAttribute('variant')==='basic')library.setAttribute('variant','basic');
                canvas.append(library);
                Object.assign(library.querySelector('.left-panel').style,{position:'absolute',left:'0',top:'0',bottom:'0',zIndex:'20'});
                library.querySelector('.left-panel').classList.add('is-library-collapsed');
              }
              library?.querySelector('.node-library-toggle')?.click();
              const expanded=!!library && !library.querySelector('.left-panel').classList.contains('is-library-collapsed');
              addButton.setAttribute('aria-expanded',String(expanded));
              addButton.title=expanded?'收起节点栏':'展开节点栏';
              addButton.setAttribute('aria-label',addButton.title);
              return;
            }
            if (!menu.hidden) { closeMenu(); return; }
            menu.removeAttribute('style');
            const fragment = document.createElement('template');
            fragment.innerHTML = templates['process-node-library'].replace(/src="assets\//g, 'src="' + assets.href);
            if (this.getAttribute('variant') === 'basic') fragment.content.querySelector('.palette').innerHTML = basicPalette();
            menu.replaceChildren(fragment.content.querySelector('.palette'));
            if (event.detail?.anchor) {
              menu.querySelectorAll('.palette-item').forEach(item => {
                if (['start','end','开始节点','结束节点'].includes(item.textContent.trim().toLowerCase())) item.remove();
              });
              menu.querySelectorAll('.palette-group').forEach(group => {
                const count=group.querySelectorAll('.palette-item').length;
                const label=group.querySelector('.count');if(label)label.textContent=String(count);
                if(!count)group.remove();
              });
            }
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
          this.querySelector('.title-block p').textContent = 'v0.1 · 草稿 · 未保存变更';
          const title = this.querySelector('h1');
          const titleRow = document.createElement('div');
          titleRow.className = 'process-title-row';
          title.replaceWith(titleRow);
          titleRow.append(title);
          titleRow.insertAdjacentHTML('beforeend', '<button type="button" class="process-title-edit" aria-label="编辑流程标题" title="编辑标题"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 5 4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15v5Z"/></svg></button>');
          const dialog = document.createElement('dialog');
          dialog.className = 'flow-info-dialog';
          dialog.setAttribute('aria-labelledby', 'flow-info-heading');
          dialog.innerHTML = `<form class="flow-info-form">
            <header><h2 id="flow-info-heading">编辑流程信息</h2><button type="button" data-dismiss aria-label="关闭">×</button></header>
            <div class="flow-info-fields">
              <label>流程标识<input value="e2e-split-annotation" readonly></label>
              <label>流程名称<input name="flowName" required maxlength="100" autocomplete="off"></label>
              <label>业务环节<select disabled><option>标注</option></select></label>
            </div>
            <footer><text-button variant="outline" data-dismiss>关闭</text-button><text-button variant="primary" data-save-info>保存</text-button></footer>
          </form>`;
          this.append(dialog);
          const nameInput = dialog.querySelector('[name="flowName"]');
          titleRow.querySelector('button').addEventListener('click', () => {
            nameInput.value = title.textContent.trim();
            nameInput.setCustomValidity('');
            dialog.showModal();
            nameInput.focus();
            nameInput.setSelectionRange(nameInput.value.length, nameInput.value.length);
          });
          dialog.querySelectorAll('[data-dismiss]').forEach(close => close.addEventListener('click', () => dialog.close()));
          nameInput.addEventListener('input', () => nameInput.setCustomValidity(''));
          dialog.querySelector('[data-save-info]').addEventListener('click', () => dialog.querySelector('form').requestSubmit());
          dialog.querySelector('form').addEventListener('submit', event => {
            event.preventDefault();
            const value = nameInput.value.trim();
            if (!value) { nameInput.setCustomValidity('请输入流程名称'); nameInput.reportValidity(); return; }
            title.textContent = value;
            this.dispatchEvent(new CustomEvent('flow-info-change', {bubbles:true, detail:{name:value}}));
            dialog.close();
          });
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
