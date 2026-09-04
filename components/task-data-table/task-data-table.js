const taskTableAssetBase = new URL("../../pages/action-quality-check/assets/", document.currentScript?.src || location.href).href;
const taskTableSidebarAssetBase = new URL("../platform-sidebar/assets/", document.currentScript?.src || location.href).href;

class TaskDataTable extends HTMLElement {
  connectedCallback(){
    if(this.dataset.ready)return;this.dataset.ready="true";this.render();
    this.addEventListener("click",event=>{const action=event.target.closest("[data-action]");const page=event.target.closest("[data-page]");if(action){this.dispatchEvent(new CustomEvent("row-action",{bubbles:true,detail:{action:action.dataset.action,row:Number(action.closest("tr")?.dataset.row)}}));if(action.dataset.action==="edit"&&this.getAttribute("editor-url"))location.href=this.getAttribute("editor-url");}if(page)this.selectPage(page.dataset.page);});
  }
  render(){
    if(this.getAttribute("variant")==="process-management"){
      const data=[
        {id:"e2e-split-annotation",name:"端到端切分标注流程",status:"enabled",statusText:"启用",time:"2026-07-29 10:16"},
        {id:"e2e-split-annotation",name:"端到端切分标注流程（草稿）",status:"draft",statusText:"草稿",time:"2026-08-04 11:30"}
      ];
      const rows=data.map((item,index)=>`<tr data-row="${index}"><td><code>${item.id}</code></td><td><strong>${item.name}</strong></td><td><span class="task-data-table__scene">标注</span></td><td><span class="task-data-table__description">自动切分后依次完成供应商抽验、供应商复核、供应商商验…</span></td><td>joanna.qiao</td><td><span class="task-data-table__status task-data-table__status--${item.status}">${item.statusText}</span></td><td><time>${item.time}</time></td><td><button data-action="${item.status==='enabled'?'disable':'enable'}">${item.status==='enabled'?'停用':'启用'}</button>${item.status==='draft'?'<button data-action="edit">编辑</button>':''}<button data-action="detail">详情</button><button data-action="copy">复制</button></td></tr>`).join("");
      this.innerHTML=`<section class="task-data-table task-data-table--process"><div class="task-data-table__scroll"><table><thead><tr><th>流程标识</th><th>名称</th><th><span class="task-data-table__sortable">业务环节<img src="${taskTableSidebarAssetBase}icon-sidebar-section-chevron.svg" alt=""></span></th><th>描述</th><th>创建人</th><th><span class="task-data-table__sortable">状态<img src="${taskTableSidebarAssetBase}icon-sidebar-section-chevron.svg" alt=""></span></th><th>更新时间</th><th>操作</th></tr></thead><tbody>${rows}</tbody></table></div><nav class="task-data-table__pagination" aria-label="分页"><button>10条/页 <img src="${taskTableAssetBase}icon-list-chevron.svg" alt=""></button><button class="is-current" data-page="1">1</button><button data-page="2">2</button><button data-page="3">3</button><button data-page="4">4</button><button data-page="5">5</button><span>...</span><button data-page="105">105</button><button data-page="next" aria-label="下一页"><img class="is-next" src="${taskTableAssetBase}icon-page-chevron.svg" alt=""></button><span class="task-data-table__page-input"></span><button data-action="go">go</button></nav></section>`;
      return;
    }
    const rows=Array.from({length:Number(this.getAttribute("rows")||4)},(_,index)=>`<tr data-row="${index}"><td>端到端切分标注流程</td><td><span class="task-data-table__tag">供应商抽检</span></td><td>243</td><td>39</td><td>3.4小时</td><td><span class="task-data-table__priority">9级 164·7级36·6级42</span></td><td><button data-action="start">开始处理</button><button data-action="more">更多操作</button></td></tr>`).join("");
    this.innerHTML=`<section class="task-data-table"><div class="task-data-table__scroll"><table><thead><tr><th>流程</th><th>节点</th><th>待领取</th><th>处理中</th><th>最长滞留</th><th>优先级分布</th><th>操作</th></tr></thead><tbody>${rows}</tbody></table></div><nav class="task-data-table__pagination" aria-label="分页"><button>10条/页 <img src="${taskTableAssetBase}icon-list-chevron.svg" alt=""></button><button class="is-current" data-page="1">1</button><button data-page="2">2</button><button data-page="3">3</button><button data-page="4">4</button><button data-page="5">5</button><span>...</span><button data-page="105">105</button><button data-page="next" aria-label="下一页"><img class="is-next" src="${taskTableAssetBase}icon-page-chevron.svg" alt=""></button><span class="task-data-table__page-input"></span><button data-action="go">go</button></nav></section>`;
  }
  selectPage(value){if(/^\d+$/.test(value))this.querySelectorAll("[data-page]").forEach(button=>button.classList.toggle("is-current",button.dataset.page===value));this.dispatchEvent(new CustomEvent("page-change",{bubbles:true,detail:{page:value}}));}
}
customElements.define("task-data-table",TaskDataTable);
