const taskFilterAssetBase = new URL("../../pages/action-quality-check/assets/", document.currentScript?.src || location.href).href;

class TaskFilterBar extends HTMLElement {
  connectedCallback(){
    if(this.dataset.ready)return;this.dataset.ready="true";
    const process = this.getAttribute("variant") === "process-management";
    this.innerHTML=process
      ? `<form class="task-filter-bar task-filter-bar--process"><label><span>流程标识</span><input name="id" type="search" placeholder="请输入流程标识"></label><label><span>流程名称</span><input name="name" type="search" placeholder="请输入流程名称"></label><label><span>创建人</span><input name="creator" type="search" placeholder="请输入创建人"></label></form>`
      : `<form class="task-filter-bar"><label><span>ID搜索</span><input name="id" type="search" placeholder="请输入ID"></label><label><span>序列号</span><button type="button" data-field="serial">请选择设备序列号<img src="${taskFilterAssetBase}icon-list-chevron.svg" alt=""></button></label><label><span>ID搜索</span><button type="button" data-field="operator">请选择操作类型/操作人<img src="${taskFilterAssetBase}icon-list-chevron.svg" alt=""></button></label><button class="task-filter-bar__refresh" type="button" aria-label="刷新列表"><img src="${taskFilterAssetBase}icon-list-refresh.svg" alt=""></button></form>`;
    this.querySelector("input").addEventListener("input",event=>this.emit("filter-change",{id:event.target.value}));
    this.querySelectorAll("[data-field]").forEach(button=>button.addEventListener("click",()=>this.emit("filter-open",{field:button.dataset.field})));
    this.querySelector(".task-filter-bar__refresh")?.addEventListener("click",()=>this.emit("filter-refresh"));
    this.querySelector("form").addEventListener("submit",event=>event.preventDefault());
  }
  emit(name,detail={}){this.dispatchEvent(new CustomEvent(name,{bubbles:true,detail}));}
}
customElements.define("task-filter-bar",TaskFilterBar);
