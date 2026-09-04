(()=>{
  const assets=new URL("../../pages/workbench/assets/",document.currentScript?.src||location.href).href;
  const segments=[['15','#42a8d2'],['5.5','#ff9559'],['4.6','#9850d7'],['4.2','#48c98a'],['8.5','#8fd04c'],['6.5','#d7a23b'],['4.3','#3d8fd8'],['8.5','#4c63df'],['8.2','#42bd7d'],['8.7','#4eabe0'],['4.8','#dd8b43'],['4.4','#45c97b'],['6.3','#db405f'],['4','#cf3ba8']];
  const tools=[['figma-2x.svg','倍速',' is-2x'],['figma-plus.svg','添加',''],['figma-plus-arrow.svg','添加并前进',''],['figma-forward.svg','仅前进',''],['figma-trash.svg','清空',''],['figma-forward-alt.svg','拖动',''],['figma-scissors-rotate.svg','分割',' is-rotate-neg'],['figma-scissors.svg','父级分割',''],['figma-merge.svg','合并',''],['figma-merge-up.svg','向上合并',''],['figma-merge-down.svg','向下合并',' is-rotate-180'],['figma-keyboard.svg','快捷键',''],['figma-settings.svg','设置','']];

  class TimelineRangeRuler extends HTMLElement{
    connectedCallback(){
      if(this.dataset.rendered)return;
      this.dataset.rendered="true";
      this._start=0;
      this._end=14.28;
      this._snapPoints=[];
      this.innerHTML=`<div class="segmented-timeline__ruler">${['00:00','00:10','00:20','00:30','00:40','00:50','01:00','01:10'].map((time,index)=>`<span style="left:${index===7?100:index*14.28}%">${time}</span>`).join('')}</div><div class="segmented-timeline__range"><span class="segmented-timeline__range-label is-start">00:00s</span><span class="segmented-timeline__range-label is-end">00:10s</span><div class="segmented-timeline__range-rail"><span class="segmented-timeline__range-fill"></span><button type="button" class="segmented-timeline__range-handle is-start" aria-label="调整开始时间"></button><button type="button" class="segmented-timeline__range-handle is-end" aria-label="调整结束时间"></button></div></div>`;
      this._rail=this.querySelector('.segmented-timeline__range-rail');
      this._fill=this.querySelector('.segmented-timeline__range-fill');
      this._startHandle=this.querySelector('.segmented-timeline__range-handle.is-start');
      this._endHandle=this.querySelector('.segmented-timeline__range-handle.is-end');
      this._startLabel=this.querySelector('.segmented-timeline__range-label.is-start');
      this._endLabel=this.querySelector('.segmented-timeline__range-label.is-end');
      this._dragMode='';
      this._dragX=0;
      this._dragStart=0;
      this._dragEnd=0;
      this._startHandle.addEventListener('pointerdown',event=>this._beginDrag(event,'start'));
      this._endHandle.addEventListener('pointerdown',event=>this._beginDrag(event,'end'));
      this._fill.addEventListener('pointerdown',event=>this._beginDrag(event,'fill'));
      this.addEventListener('pointermove',event=>this._moveDrag(event));
      this.addEventListener('pointerup',event=>this._endDrag(event));
      this.setRange(0,14.28);
    }
    _format(percent){const total=Math.round(percent*.7);return `${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}s`;}
    setSnapPoints(points){this._snapPoints=[...new Set(points.map(value=>Math.max(0,Math.min(100,value))))];}
    _snap(value){
      const threshold=this._rail.clientWidth?18/this._rail.clientWidth*100:0;
      const nearest=this._snapPoints.reduce((best,point)=>Math.abs(point-value)<Math.abs(best-value)?point:best,value);
      return {value:Math.abs(nearest-value)<=threshold?nearest:value,snapped:Math.abs(nearest-value)<=threshold};
    }
    setRange(start,end,emit=false){
      this._start=Math.max(0,Math.min(99,start));
      this._end=Math.max(this._start+1,Math.min(100,end));
      this._fill.style.left=`${this._start}%`;
      this._fill.style.width=`${this._end-this._start}%`;
      this._startHandle.style.left=`${this._start}%`;
      this._endHandle.style.left=`${this._end}%`;
      this._startLabel.style.left=`${this._start}%`;
      this._endLabel.style.left=`${this._end}%`;
      this._startLabel.textContent=this._format(this._start);
      this._endLabel.textContent=this._format(this._end);
      if(emit)this.dispatchEvent(new CustomEvent('range-change',{bubbles:true,detail:{start:this._start,end:this._end}}));
    }
    _beginDrag(event,mode){event.preventDefault();event.stopPropagation();this._dragMode=mode;this._dragX=event.clientX;this._dragStart=this._start;this._dragEnd=this._end;event.currentTarget.setPointerCapture(event.pointerId);event.currentTarget.classList.add('is-dragging');}
    _moveDrag(event){
      if(!this._dragMode)return;
      const bounds=this._rail.getBoundingClientRect();
      const pointer=Math.max(0,Math.min(100,(event.clientX-bounds.left)/bounds.width*100));
      let snapped=false;
      if(this._dragMode==='start'){const result=this._snap(pointer);snapped=result.snapped;this.setRange(Math.min(result.value,this._end-1),this._end,true);}
      if(this._dragMode==='end'){const result=this._snap(pointer);snapped=result.snapped;this.setRange(this._start,Math.max(result.value,this._start+1),true);}
      if(this._dragMode==='fill'){
        const width=this._dragEnd-this._dragStart;
        const delta=(event.clientX-this._dragX)/bounds.width*100;
        let start=Math.max(0,Math.min(100-width,this._dragStart+delta));
        const left=this._snap(start),right=this._snap(start+width);
        if(left.snapped){start=left.value;snapped=true;}else if(right.snapped){start=right.value-width;snapped=true;}
        start=Math.max(0,Math.min(100-width,start));
        this.setRange(start,start+width,true);
      }
      const target=this._dragMode==='start'?this._startHandle:this._dragMode==='end'?this._endHandle:this._fill;
      target.classList.toggle('is-snapped',snapped);
    }
    _endDrag(event){
      if(!this._dragMode)return;
      const target=this._dragMode==='start'?this._startHandle:this._dragMode==='end'?this._endHandle:this._fill;
      target.classList.remove('is-dragging','is-snapped');
      if(target.hasPointerCapture(event.pointerId))target.releasePointerCapture(event.pointerId);
      this._dragMode='';
    }
  }

  class AnnotationSegmentRow extends HTMLElement{
    connectedCallback(){if(this.dataset.rendered)return;this.dataset.rendered="true";this.innerHTML=`<div class="segmented-timeline__row"><span class="segmented-timeline__index">${this.getAttribute('label')||'14'}</span><div class="segmented-timeline__track"><div class="segmented-timeline__segments">${segments.map(([flex,color],index)=>`<button type="button" data-index="${index}" style="flex:${flex};--segment-color:${color}" aria-label="片段 ${index+1}"${index===0?' class="is-active"':''}>${index===1||index===5?'<b class="segmented-timeline__warning" aria-label="该色块存在问题"></b>':''}</button>`).join('')}</div></div></div>`;this.buttons=[...this.querySelectorAll('.segmented-timeline__segments>button')];this.buttons.forEach(button=>button.addEventListener('click',()=>this.selectIndex(Number(button.dataset.index),true)));}
    selectIndex(index,emit=false){const safe=Math.max(0,Math.min(this.buttons.length-1,index));this.buttons.forEach((button,buttonIndex)=>button.classList.toggle('is-active',buttonIndex===safe));if(emit)this.dispatchEvent(new CustomEvent('segment-select',{bubbles:true,detail:{index:safe}}));}
  }

  class AnnotationBaseRow extends HTMLElement{
    connectedCallback(){if(this.dataset.rendered)return;this.dataset.rendered="true";this.innerHTML=`<div class="segmented-timeline__row"><span class="segmented-timeline__index">${this.getAttribute('label')||'1'}</span><div class="segmented-timeline__track"><div class="segmented-timeline__segments"><button type="button" style="flex:100;--segment-color:#4fbd91" aria-label="连续轨道"></button></div></div></div>`;}
  }

  class TimelineControls extends HTMLElement{
    connectedCallback(){if(this.dataset.rendered)return;this.dataset.rendered="true";this.innerHTML=`<div class="segmented-timeline__tools"><div class="segmented-timeline__playback"><button type="button" class="segmented-timeline__play" aria-label="播放"><img src="${assets}icon-play.svg" alt=""></button><span>00:13:27 <i>/</i> 08:47:00</span></div><div class="segmented-timeline__tool-group">${tools.map(([icon,label,extra])=>`<button type="button" class="segmented-timeline__tool${extra}" aria-label="${label}"><img src="${assets}${icon}" alt=""></button>`).join('')}</div><a href="#" class="segmented-timeline__standard">标注标准</a></div>`;this.querySelector('a').addEventListener('click',event=>event.preventDefault());const play=this.querySelector('.segmented-timeline__play');play.addEventListener('click',()=>{const playing=play.getAttribute('aria-label')==='暂停';play.setAttribute('aria-label',playing?'播放':'暂停');});}
  }

  class WorkbenchTaskHeader extends HTMLElement{
    connectedCallback(){
      if(this.dataset.rendered)return;
      this.dataset.rendered='true';
      this.innerHTML=`<header class="workbench-task-info"><div class="workbench-task-info__left"><button class="workbench-task-info__close" type="button" aria-label="关闭"><img src="${assets}icon-close.svg" alt=""></button><div class="workbench-task-info__identity"><span>任务ID</span><b>17782</b></div><i class="workbench-task-info__divider" aria-hidden="true"></i><div class="workbench-task-info__workflow"><div class="workbench-task-info__step"><span>当前节点</span><b>内部验收</b></div><i class="workbench-task-info__divider" aria-hidden="true"></i><div class="workbench-task-info__step"><span>上一节点</span><b>供应商验收</b><em>·</em><b>Aria提交</b><em>·</em></div></div><div class="workbench-task-info__reject" title="驳回原因：High-level片段范围需要调整">驳回原因：High-level片段范围需要调整</div></div></header>`;
      this.querySelector('.workbench-task-info__close').addEventListener('click',()=>this.dispatchEvent(new CustomEvent('workbench-close',{bubbles:true})));
    }
  }

  class WorkbenchInstruction extends HTMLElement{
    connectedCallback(){
      if(this.dataset.rendered)return;
      this.dataset.rendered='true';
      this.innerHTML=`<div class="workbench-instruction" role="button" tabindex="0" aria-expanded="true"><span>采集指令：归位书本与笔记本:将散落的书本和笔记本整理并放回书架指定位置，保持竖立排列或按类别分层摆放，便于查找和取用</span><img src="${assets}icon-chevron.svg" alt=""></div>`;
      const toggle=()=>{const bar=this.firstElementChild;bar.setAttribute('aria-expanded',String(bar.getAttribute('aria-expanded')!=='true'));};
      this.firstElementChild.addEventListener('click',toggle);
      this.firstElementChild.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();toggle();}});
    }
  }

  class WorkbenchMediaViewer extends HTMLElement{
    connectedCallback(){
      if(this.dataset.rendered)return;
      this.dataset.rendered='true';
      const feed=(label,className)=>`<figure class="workbench-feed ${className}"><img src="${assets}frame.png" alt=""><figcaption>${label} <img src="${assets}icon-fullscreen.svg" alt=""></figcaption></figure>`;
      this.innerHTML=`<div class="workbench-media-preview"><div class="workbench-video-grid"><div class="workbench-video-grid__arms">${feed('左臂视角','workbench-feed--arm')}${feed('右臂视角','workbench-feed--arm')}</div>${feed('头部视角','workbench-feed--head')}${feed('头部结束帧','workbench-feed--head')}</div></div>`;
      const grid=this.querySelector('.workbench-video-grid');
      const resize=()=>{const width=Math.max(0,grid.clientWidth),height=Math.max(0,grid.clientHeight),gap=8,layoutHeight=Math.floor(Math.min(height,Math.max(0,(width-10)/2.75))),armHeight=Math.floor((layoutHeight-gap)/2),armWidth=Math.floor(armHeight*1.5);grid.style.setProperty('--head-video-size',`${layoutHeight}px`);grid.style.setProperty('--arm-video-width',`${armWidth}px`);grid.style.setProperty('--arm-video-height',`${armHeight}px`);};
      this._resizeObserver=new ResizeObserver(resize);
      this._resizeObserver.observe(grid);
      resize();
    }
    disconnectedCallback(){this._resizeObserver?.disconnect();}
  }

  class WorkbenchSegmentEditor extends HTMLElement{
    connectedCallback(){
      if(this.dataset.rendered)return;
      this.dataset.rendered='true';
      this._index=2;
      this._segments=[
        {start:'00:00',end:'00:11',duration:'00:11',description:'观察并整理桌面物品（前端测试V4 预标注片段 1）',error:'片段范围错误',unavailable:false},
        {start:'00:11',end:'00:15',duration:'00:04',description:'选择错移动遥控器到目标位置（前端测试V4 预标注片段 2）',error:'片段范围错位',unavailable:false},
        {start:'00:15',end:'00:18',duration:'00:03',description:'打开或关闭抽屉（前端测试V4 预标注片段 3）',error:'',unavailable:false},
        {start:'00:18',end:'00:21',duration:'00:03',description:'调整纸盒摆放位置（前端测试V4 预标注片段 4）',error:'动作结束边界偏晚',unavailable:false},
        {start:'00:21',end:'00:27',duration:'00:06',description:'将散落书本整理并竖直放回书架（前端测试V4 预标注片段 5）',error:'',unavailable:false},
        {start:'00:27',end:'00:32',duration:'00:05',description:'将笔记本按类别放回指定位置（前端测试V4 预标注片段 6）',error:'',unavailable:false}
      ];
      const reasons=['片段范围错误','片段范围错位','动作开始边界偏早','动作开始边界偏晚','动作结束边界偏早','动作结束边界偏晚','描述与画面不一致'];
      this.innerHTML=`<div class="segment-editor-component"><section class="card form-card"><div class="form-row form-row--meta"><div class="segment-meta"><span class="segment-current segment-current--code">01-<b class="current-segment-value" data-number>02</b></span><span>开始时间</span><b data-start>00:11</b><span>结束时间</span><b data-end>00:15</b><span>时长</span><b data-duration>00:04</b></div><div class="segment-actions" aria-label="片段操作"><button class="segment-action segment-action--navigate" type="button" data-action="previous">上一段 <kbd>⌘↑</kbd></button><button class="segment-action segment-action--navigate" type="button" data-action="next">下一段 <kbd>⌘↓</kbd></button><button class="segment-action segment-action--danger" type="button" data-action="delete">删除 <kbd>⌘⌫</kbd></button><button class="segment-action" type="button" data-action="unavailable" aria-pressed="false">无法标注 <kbd>⌘/</kbd></button></div></div><div class="form-row"><span class="field-label">描述</span><div class="input-like input-like--description"><span class="description-value" data-description></span><span class="unavailable-tag" hidden>无法标注<button type="button" data-action="clear-unavailable" aria-label="关闭无法标注状态">×</button></span></div></div><div class="form-row form-row--error"><span class="field-label">错误原因</span><button type="button" class="input-like error-trigger" data-action="error" aria-haspopup="listbox" aria-expanded="false"><span data-error></span><img src="${assets}icon-chevron.svg" alt=""></button></div></section><div class="error-popover" role="dialog" aria-label="选择错误原因" hidden><div class="error-options" role="listbox">${reasons.map(reason=>`<button class="error-option" type="button" data-reason="${reason}" role="option">${reason}<span>✓</span></button>`).join('')}</div><button class="error-popover__clear" type="button" data-action="clear-error">清除错误原因</button></div></div>`;
      this.addEventListener('click',event=>this._handleClick(event));
      this._externalChange=event=>{if(event.target!==this&&event.detail?.index)this.setSegment(event.detail.index,false);};
      this._documentClick=event=>{if(!this.contains(event.target))this._setErrorOpen(false);};
      this._documentKeydown=event=>{
        if(event.key==='Escape')this._setErrorOpen(false);
        if(!event.metaKey)return;
        const action=event.key==='ArrowUp'?'previous':event.key==='ArrowDown'?'next':event.key==='Backspace'?'delete':event.key==='/'?'unavailable':'';
        if(!action)return;
        event.preventDefault();
        this.querySelector(`[data-action="${action}"]`)?.click();
      };
      this._windowResize=()=>{if(!this.querySelector('.error-popover').hidden)this._positionErrorPopover();};
      document.addEventListener('segment-change',this._externalChange);
      document.addEventListener('click',this._documentClick);
      document.addEventListener('keydown',this._documentKeydown);
      window.addEventListener('resize',this._windowResize);
      this.setSegment(2,false);
    }
    disconnectedCallback(){document.removeEventListener('segment-change',this._externalChange);document.removeEventListener('click',this._documentClick);document.removeEventListener('keydown',this._documentKeydown);window.removeEventListener('resize',this._windowResize);}
    _handleClick(event){
      const action=event.target.closest('[data-action]')?.dataset.action;
      if(action==='previous')this.setSegment(this._index-1,true);
      if(action==='next')this.setSegment(this._index+1,true);
      if(action==='delete'){const button=this.querySelector('[data-action=delete]');button.classList.add('is-active');window.setTimeout(()=>button.classList.remove('is-active'),260);this.dispatchEvent(new CustomEvent('segment-delete',{bubbles:true,detail:{index:this._index}}));}
      if(action==='unavailable')this._setUnavailable(!this._unavailable);
      if(action==='clear-unavailable'){event.stopPropagation();this._setUnavailable(false);}
      if(action==='error')this._setErrorOpen(this.querySelector('.error-popover').hidden);
      if(action==='clear-error'){this._segments[this._index-1].error='';this.setSegment(this._index,false);this._emitUpdate();this._setErrorOpen(false);}
      const reason=event.target.closest('[data-reason]')?.dataset.reason;
      if(reason){this._segments[this._index-1].error=reason;this.setSegment(this._index,false);this._emitUpdate();this._setErrorOpen(false);}
    }
    _setUnavailable(value,persist=true){this._unavailable=value;if(persist)this._segments[this._index-1].unavailable=value;this.querySelector('.unavailable-tag').hidden=!value;const button=this.querySelector('[data-action=unavailable]');button.classList.toggle('is-active',value);button.setAttribute('aria-pressed',String(value));if(persist)this._emitUpdate();}
    _positionErrorPopover(){const trigger=this.querySelector('.error-trigger'),popover=this.querySelector('.error-popover'),bounds=trigger.getBoundingClientRect(),left=Math.max(12,bounds.left),width=Math.min(bounds.width,window.innerWidth-left-12);popover.style.width=`${width}px`;popover.style.left=`${left}px`;popover.style.top=`${Math.max(12,bounds.top-popover.offsetHeight-8)}px`;}
    _setErrorOpen(open){const popover=this.querySelector('.error-popover'),trigger=this.querySelector('.error-trigger');popover.hidden=!open;trigger.classList.toggle('is-open',open);trigger.setAttribute('aria-expanded',String(open));this.querySelectorAll('[data-reason]').forEach(button=>button.setAttribute('aria-selected',String(button.classList.contains('is-selected'))));if(open)requestAnimationFrame(()=>this._positionErrorPopover());}
    _emitUpdate(){const data=this._segments[this._index-1];this.dispatchEvent(new CustomEvent('segment-update',{bubbles:true,detail:{index:this._index,error:data.error,unavailable:data.unavailable}}));}
    setSegment(index,emit=true){const safe=Math.max(1,Math.min(this._segments.length,Number(index)||1)),{start,end,duration,description,error,unavailable}=this._segments[safe-1];this._index=safe;this.querySelector('[data-number]').textContent=String(safe).padStart(2,'0');this.querySelector('[data-start]').textContent=start;this.querySelector('[data-end]').textContent=end;this.querySelector('[data-duration]').textContent=duration;this.querySelector('[data-description]').textContent=description;this.querySelector('[data-error]').textContent=error||'请选择错误原因';this.querySelector('.error-trigger').classList.toggle('is-placeholder',!error);this.querySelectorAll('[data-reason]').forEach(button=>button.classList.toggle('is-selected',button.dataset.reason===error));this._setUnavailable(unavailable,false);if(emit)this.dispatchEvent(new CustomEvent('segment-change',{bubbles:true,detail:{index:safe}}));}
  }

  class WorkbenchSegmentList extends HTMLElement{
    connectedCallback(){
      if(this.dataset.rendered)return;
      this.dataset.rendered='true';
      this._segments=[
        ['00:00','00:11','00:11','观察并整理桌面物品（前端测试V4 预标注片段 1）','片段范围错误'],
        ['00:11','00:15','00:04','选择错移动遥控器到目标位置（前端测试V4 预标注片段 2）','片段范围错位'],
        ['00:15','00:18','00:03','打开或关闭抽屉（前端测试V4 预标注片段 3）',''],
        ['00:18','00:21','00:03','调整纸盒摆放位置（前端测试V4 预标注片段 4）','动作结束边界偏晚'],
        ['00:21','00:27','00:06','将散落书本整理并竖直放回书架（前端测试V4 预标注片段 5）',''],
        ['00:27','00:32','00:05','将笔记本按类别放回指定位置（前端测试V4 预标注片段 6）','']
      ];
      this.innerHTML=`<aside class="workbench-review"><section class="workbench-review__panel"><div class="workbench-review__content"><header class="workbench-review__header">片段列表</header><div class="workbench-review__list"><button class="workbench-review__parent" type="button" aria-expanded="true"><span class="workbench-review__parent-index">01 <i>⌄</i></span><span class="workbench-review__parent-cell"><b>完成整段录制的前端测试V4预标注抽验任务</b><em>6 个子片段</em></span></button><div class="workbench-review__children"></div></div></div></section><nav class="workbench-review__tabs" aria-label="复核侧栏"><button type="button">质检</button><button type="button" class="is-active">标注</button><button type="button">标签</button><button type="button">日志</button><button type="button">基本信息</button></nav></aside>`;
      this._children=this.querySelector('.workbench-review__children');
      this.selectSegment(2,false);
      const parent=this.querySelector('.workbench-review__parent');
      parent.addEventListener('click',()=>{const expanded=parent.getAttribute('aria-expanded')==='true';parent.setAttribute('aria-expanded',String(!expanded));this._children.hidden=expanded;});
      this.querySelectorAll('.workbench-review__tabs button').forEach(tab=>tab.addEventListener('click',()=>this.querySelectorAll('.workbench-review__tabs button').forEach(item=>item.classList.toggle('is-active',item===tab))));
      this._segmentUpdate=event=>{const item=this._segments[event.detail?.index-1];if(!item)return;item[4]=event.detail.error||'';item[5]=Boolean(event.detail.unavailable);this.selectSegment(event.detail.index,false);};
      document.addEventListener('segment-update',this._segmentUpdate);
    }
    disconnectedCallback(){document.removeEventListener('segment-update',this._segmentUpdate);}
    selectSegment(activeIndex,emit=true){
      this._children.innerHTML=this._segments.map(([start,end,duration,description,error,unavailable],index)=>`<button class="workbench-review__row${index+1===activeIndex?' is-active':''}" type="button" data-index="${index+1}"><span class="workbench-review__index">${String(index+1).padStart(2,'0')}</span><span class="workbench-review__cell">${index+1===activeIndex?`<span class="workbench-review__time"><span>${start}~${end}（${duration}）</span><img src="${assets}icon-trash.svg?v=2" alt="删除片段"></span>`:''}<b>${description}</b>${error?`<em>错误原因：${error}</em>`:''}${unavailable?'<em class="workbench-review__unavailable">无法标注</em>':''}</span></button>`).join('');
      this._children.querySelectorAll('.workbench-review__row').forEach(row=>row.addEventListener('click',()=>this.selectSegment(Number(row.dataset.index),true)));
      if(emit)this.dispatchEvent(new CustomEvent('segment-change',{bubbles:true,detail:{index:activeIndex}}));
    }
  }

  class WorkbenchFooterActions extends HTMLElement{
    connectedCallback(){
      if(this.dataset.rendered)return;
      this.dataset.rendered='true';
      this.innerHTML='<footer class="workbench-footer-actions"><button type="button" data-action="submit">提交</button><button type="button" data-action="reject">驳回</button><button type="button" data-action="save">保存</button></footer>';
      this.addEventListener('click',event=>{
        const button=event.target.closest('button[data-action]');
        if(!button)return;
        this.dispatchEvent(new CustomEvent('workbench-action',{bubbles:true,detail:{action:button.dataset.action}}));
      });
    }
  }

  class SegmentedTrack extends HTMLElement{
    connectedCallback(){
      if(this.dataset.rendered)return;
      this.dataset.rendered="true";
      const position=Math.max(0,Math.min(100,Number(this.getAttribute('position')||19)))/100;
      this.innerHTML=`<section class="segmented-timeline" style="--play-position:${position}"><div class="segmented-timeline__body"><timeline-range-ruler></timeline-range-ruler><annotation-segment-row label="${this.getAttribute('label')||'14'}"></annotation-segment-row><annotation-base-row label="1"></annotation-base-row><i class="segmented-timeline__playhead" role="slider" aria-label="播放位置" tabindex="0"></i></div><timeline-controls></timeline-controls></section>`;
      requestAnimationFrame(()=>this._connectInteractions());
    }
    _connectInteractions(){
      const section=this.querySelector('.segmented-timeline');
      const ruler=this.querySelector('timeline-range-ruler');
      const row=this.querySelector('annotation-segment-row');
      const track=row.querySelector('.segmented-timeline__track');
      const playhead=this.querySelector('.segmented-timeline__playhead');
      const syncGeometry=()=>{
        const bounds=track.getBoundingClientRect();
        const points=[0,100];
        row.buttons.forEach(button=>{const box=button.getBoundingClientRect();points.push((box.left-bounds.left)/bounds.width*100,(box.right-bounds.left)/bounds.width*100);});
        ruler.setSnapPoints(points);
      };
      const syncRange=(index,emit=false)=>{
        syncGeometry();
        const rail=ruler._rail.getBoundingClientRect();
        const box=row.buttons[index].getBoundingClientRect();
        const start=(box.left-rail.left)/rail.width*100;
        const end=(box.right-rail.left)/rail.width*100;
        ruler.setRange(start,end,emit);
        this.dispatchEvent(new CustomEvent('track-change',{bubbles:true,detail:{index,start:ruler._start,end:ruler._end,source:'segment'}}));
      };
      row.addEventListener('segment-select',event=>syncRange(event.detail.index,false));
      ruler.addEventListener('range-change',event=>{
        const center=(event.detail.start+event.detail.end)/2;
        const bounds=track.getBoundingClientRect();
        const x=bounds.left+bounds.width*center/100;
        const index=Math.max(0,row.buttons.findIndex(button=>{const box=button.getBoundingClientRect();return x>=box.left&&x<=box.right;}));
        row.selectIndex(index,false);
        this.dispatchEvent(new CustomEvent('track-range-change',{bubbles:true,detail:{...event.detail,index}}));
        this.dispatchEvent(new CustomEvent('track-change',{bubbles:true,detail:{...event.detail,index,source:'range'}}));
      });
      let dragging=false,moved=false,startX=0;
      const setPlayPosition=clientX=>{
        const bounds=track.getBoundingClientRect();
        const points=ruler._snapPoints;
        let percent=Math.max(0,Math.min(100,(clientX-bounds.left)/bounds.width*100));
        const threshold=18/bounds.width*100;
        const nearest=points.reduce((best,point)=>Math.abs(point-percent)<Math.abs(best-percent)?point:best,percent);
        const snapped=Math.abs(nearest-percent)<=threshold;
        if(snapped)percent=nearest;
        section.style.setProperty('--play-position',percent/100);
        playhead.classList.toggle('is-snapped',snapped);
        playhead.setAttribute('aria-valuenow',String(Math.round(percent)));
        this.dispatchEvent(new CustomEvent('playhead-change',{bubbles:true,detail:{percent}}));
      };
      playhead.addEventListener('pointerdown',event=>{event.preventDefault();dragging=true;moved=false;startX=event.clientX;playhead.setPointerCapture(event.pointerId);playhead.classList.add('is-dragging');});
      playhead.addEventListener('pointermove',event=>{if(!dragging)return;if(Math.abs(event.clientX-startX)>2)moved=true;setPlayPosition(event.clientX);});
      playhead.addEventListener('pointerup',event=>{if(!dragging)return;dragging=false;playhead.classList.remove('is-dragging','is-snapped');if(playhead.hasPointerCapture(event.pointerId))playhead.releasePointerCapture(event.pointerId);if(!moved)ruler.setRange(0,100,true);});
      playhead.addEventListener('keydown',event=>{
        if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
        event.preventDefault();
        const current=Number(playhead.getAttribute('aria-valuenow')||Number(this.getAttribute('position')||19));
        const percent=event.key==='Home'?0:event.key==='End'?100:current+(event.key==='ArrowLeft'?-1:1);
        const bounds=track.getBoundingClientRect();
        setPlayPosition(bounds.left+bounds.width*Math.max(0,Math.min(100,percent))/100);
      });
      playhead.setAttribute('aria-valuemin','0');
      playhead.setAttribute('aria-valuemax','100');
      playhead.setAttribute('aria-valuenow',String(Math.round(Number(this.getAttribute('position')||19))));
      const resizeObserver=new ResizeObserver(()=>{syncGeometry();const activeIndex=Math.max(0,row.buttons.findIndex(button=>button.classList.contains('is-active')));syncRange(activeIndex);});
      resizeObserver.observe(track);
      syncRange(0);
    }
  }

  class SegmentColorPalette extends HTMLElement{
    connectedCallback(){
      if(this.dataset.rendered)return;
      this.dataset.rendered="true";
      const count=Math.max(1,Number(this.getAttribute('count')||50));
      const palette=['#D5B486','#A6E0F2','#ADD586','#A1ABE8','#A8DEC9','#D5CA86','#A9B2D9','#86D5BA','#CDA0DD','#D5869A','#D2B660','#4EABE0','#8FD04C','#7584DE','#60C9D2','#E6DC72','#668FB8','#39CDB1','#AC6AC7','#D26069','#FF9559','#42A8D2','#B7E23C','#4C63DF','#168F78','#D7A23B','#3D8FD8','#48C98A','#9850D7','#DB405F','#C44F3A','#167C9A','#9A9F18','#3048B8','#45C97B','#DD8B43','#24507A','#42BD7D','#7932A6','#CF3BA8','#9A3F1F','#1E718A','#788F18','#263DA5','#159E94','#946219','#1D4478','#198F45','#543075','#B52B7A'];
      const colors=palette.slice(0,count);
      const luminance=color=>{const [r,g,b]=color.match(/[\dA-F]{2}/gi).map(value=>parseInt(value,16));return .2126*r+.7152*g+.0722*b;};
      const familyNames=['橙棕','蓝色','黄绿色','靛蓝','青绿色','金黄色','深蓝','绿色','紫色','红色'];
      const familyOrder=[0,5,2,7,4,1,6,3,8,9];
      const families=familyOrder.map(family=>({name:familyNames[family],items:Array.from({length:5},(_,tone)=>{const index=tone*10+family;return {color:colors[index],index};}).filter(item=>item.color).sort((a,b)=>luminance(a.color)-luminance(b.color))}));
      const rgb=color=>color.match(/[\dA-F]{2}/gi).map(value=>parseInt(value,16));
      const distance=(a,b)=>Math.hypot(...rgb(a).map((value,index)=>value-rgb(b)[index]));
      const hueOf=color=>{const [r,g,b]=rgb(color).map(value=>value/255),max=Math.max(r,g,b),min=Math.min(r,g,b),delta=max-min;if(!delta)return 0;const raw=max===r?((g-b)/delta)%6:max===g?(b-r)/delta+2:(r-g)/delta+4;return (raw*60+360)%360;};
      const hueDistance=(a,b)=>{const gap=Math.abs(hueOf(a)-hueOf(b));return Math.min(gap,360-gap);};
      const stripColors=[];
      let randomSeed=20260903;
      const fixedRandom=()=>{randomSeed=(randomSeed*1664525+1013904223)>>>0;return randomSeed/4294967296;};
      const darkestIndexes=new Set(families.map(family=>family.items[0]?.index).filter(index=>index!==undefined));
      const segmentPaletteIndexes=[21,20,28,27,12,25,26,23,37,11,35,34,29,39].filter(index=>index<colors.length);
      const leadingIndexes=new Set(segmentPaletteIndexes);
      const darkest=colors.map((color,index)=>({color,index})).filter(item=>darkestIndexes.has(item.index));
      const unused=colors.map((color,index)=>({color,index})).filter(item=>!darkestIndexes.has(item.index)&&!leadingIndexes.has(item.index));
      stripColors.push(...segmentPaletteIndexes.map(index=>({color:colors[index],index})));
      const appendGentle=source=>{
        while(source.length){
          const previous=stripColors.at(-1);
          const choices=source.map((item,index)=>{const hueGap=hueDistance(previous.color,item.color),rgbGap=distance(previous.color,item.color);return {item,index,score:Math.abs(hueGap-58)+Math.max(0,58-rgbGap)*3+Math.max(0,hueGap-112)*2};}).sort((a,b)=>a.score-b.score).slice(0,3);
          const choice=choices[Math.floor(fixedRandom()*choices.length)];
          stripColors.push(source.splice(choice.index,1)[0]);
        }
      };
      appendGentle(unused);
      const harmonyOrder=[4,44,36,13,18,33,14];
      const harmonySet=new Set(harmonyOrder);
      const harmonySlots=stripColors.map((item,index)=>harmonySet.has(item.index)?index:-1).filter(index=>index>=0);
      harmonySlots.forEach((slot,index)=>{stripColors[slot]={color:colors[harmonyOrder[index]],index:harmonyOrder[index]};});
      appendGentle(darkest);
      const tailOrder=[9,0,15,32,31,46,43,48,49,40,45,42,47,24,41];
      const tailSet=new Set(tailOrder);
      const tailSlots=stripColors.map((item,index)=>tailSet.has(item.index)?index:-1).filter(index=>index>=0);
      tailSlots.forEach((slot,index)=>{stripColors[slot]={color:colors[tailOrder[index]],index:tailOrder[index]};});
      this.innerHTML=`<div class="segment-color-palette__strip" aria-label="50 色随机连续效果">${stripColors.map(({color,index})=>`<span style="--palette-color:${color}" title="${String(index+1).padStart(2,'0')} · ${color}"></span>`).join('')}</div><div class="segment-color-palette">${families.map(family=>`<div class="segment-color-palette__family"><strong>${family.name}</strong>${family.items.map(({color,index})=>`<div class="segment-color-palette__item"><span style="--palette-color:${color}"></span><code>${String(index+1).padStart(2,'0')} · ${color}</code></div>`).join('')}</div>`).join('')}</div>`;
    }
  }

  if(!customElements.get('timeline-range-ruler'))customElements.define('timeline-range-ruler',TimelineRangeRuler);
  if(!customElements.get('annotation-segment-row'))customElements.define('annotation-segment-row',AnnotationSegmentRow);
  if(!customElements.get('annotation-base-row'))customElements.define('annotation-base-row',AnnotationBaseRow);
  if(!customElements.get('timeline-controls'))customElements.define('timeline-controls',TimelineControls);
  if(!customElements.get('workbench-task-header'))customElements.define('workbench-task-header',WorkbenchTaskHeader);
  if(!customElements.get('workbench-instruction'))customElements.define('workbench-instruction',WorkbenchInstruction);
  if(!customElements.get('workbench-media-viewer'))customElements.define('workbench-media-viewer',WorkbenchMediaViewer);
  if(!customElements.get('workbench-segment-editor'))customElements.define('workbench-segment-editor',WorkbenchSegmentEditor);
  if(!customElements.get('workbench-segment-list'))customElements.define('workbench-segment-list',WorkbenchSegmentList);
  if(!customElements.get('workbench-footer-actions'))customElements.define('workbench-footer-actions',WorkbenchFooterActions);
  if(!customElements.get('segmented-track'))customElements.define('segmented-track',SegmentedTrack);
  if(!customElements.get('segment-color-palette'))customElements.define('segment-color-palette',SegmentColorPalette);
})();
