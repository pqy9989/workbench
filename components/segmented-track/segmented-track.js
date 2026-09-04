(()=>{
  const assets=new URL("../../pages/workbench/assets/",document.currentScript?.src||location.href).href;
  const segments=[['15','#42a8d2'],['5.5','#ff9559'],['4.6','#9850d7'],['4.2','#48c98a'],['8.5','#8fd04c'],['6.5','#d7a23b'],['4.3','#3d8fd8'],['8.5','#4c63df'],['8.2','#42bd7d'],['8.7','#4eabe0'],['4.8','#dd8b43'],['4.4','#45c97b'],['6.3','#db405f'],['4','#cf3ba8']];
  const tools=[['figma-2x.svg','倍速',' is-2x'],['figma-plus.svg','添加',''],['figma-plus-arrow.svg','添加并定位',''],['figma-forward.svg','前移',''],['figma-trash.svg','删除',''],['figma-forward-alt.svg','双向调整',''],['figma-scissors-rotate.svg','剪切',' is-rotate-neg'],['figma-scissors.svg','分割',''],['figma-merge.svg','合并',''],['figma-merge-up.svg','向上合并',''],['figma-merge-down.svg','向下合并',' is-rotate-180'],['figma-keyboard.svg','键盘快捷键',''],['figma-settings.svg','设置','']];

  class TimelineRangeRuler extends HTMLElement{
    connectedCallback(){if(this.dataset.rendered)return;this.dataset.rendered="true";this.innerHTML=`<div class="segmented-timeline__ruler">${['00:00','00:10','00:20','00:30','00:40','00:50','01:00','01:10'].map((time,index)=>`<span style="left:${index===7?100:index*14.28}%">${time}</span>`).join('')}</div><div class="segmented-timeline__range"><span class="segmented-timeline__range-label is-start">00:00s</span><span class="segmented-timeline__range-label is-end">00:10s</span><div class="segmented-timeline__range-rail"><span class="segmented-timeline__range-fill"></span><i class="segmented-timeline__range-handle is-start"></i><i class="segmented-timeline__range-handle is-end"></i></div></div>`;}
  }

  class AnnotationSegmentRow extends HTMLElement{
    connectedCallback(){if(this.dataset.rendered)return;this.dataset.rendered="true";this.innerHTML=`<div class="segmented-timeline__row"><span class="segmented-timeline__index">${this.getAttribute('label')||'14'}</span><div class="segmented-timeline__track"><div class="segmented-timeline__segments">${segments.map(([flex,color],index)=>`<button type="button" data-index="${index}" style="flex:${flex};--segment-color:${color}"${index===0?' class="is-active"':''}>${index===1||index===5?'<b class="segmented-timeline__warning" aria-label="该色块存在问题"></b>':''}</button>`).join('')}</div></div></div>`;this.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>{this.querySelectorAll('button').forEach(item=>item.classList.toggle('is-active',item===button));this.dispatchEvent(new CustomEvent('segment-select',{bubbles:true,detail:{index:Number(button.dataset.index)}}));}));}
  }

  class AnnotationBaseRow extends HTMLElement{
    connectedCallback(){if(this.dataset.rendered)return;this.dataset.rendered="true";this.innerHTML=`<div class="segmented-timeline__row"><span class="segmented-timeline__index">${this.getAttribute('label')||'1'}</span><div class="segmented-timeline__track"><div class="segmented-timeline__segments"><button type="button" style="flex:100;--segment-color:#4fbd91" aria-label="连续轨道"></button></div></div></div>`;}
  }

  class TimelineControls extends HTMLElement{
    connectedCallback(){if(this.dataset.rendered)return;this.dataset.rendered="true";this.innerHTML=`<div class="segmented-timeline__tools"><div class="segmented-timeline__playback"><button type="button" class="segmented-timeline__play" aria-label="播放"><img src="${assets}icon-play.svg" alt=""></button><span>00:13:27 <i>/</i> 08:47:00</span></div><div class="segmented-timeline__tool-group">${tools.map(([icon,label,extra])=>`<button type="button" class="segmented-timeline__tool${extra}" aria-label="${label}"><img src="${assets}${icon}" alt=""></button>`).join('')}</div><a href="#" class="segmented-timeline__standard">标注标准</a></div>`;this.querySelector('a').addEventListener('click',event=>event.preventDefault());}
  }

  class SegmentedTrack extends HTMLElement{
    connectedCallback(){if(this.dataset.rendered)return;this.dataset.rendered="true";const position=Math.max(0,Math.min(100,Number(this.getAttribute('position')||19)))/100;this.innerHTML=`<section class="segmented-timeline" style="--play-position:${position}"><div class="segmented-timeline__body"><timeline-range-ruler></timeline-range-ruler><annotation-segment-row label="${this.getAttribute('label')||'14'}"></annotation-segment-row><annotation-base-row label="1"></annotation-base-row><i class="segmented-timeline__playhead"></i></div><timeline-controls></timeline-controls></section>`;}
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
  if(!customElements.get('segmented-track'))customElements.define('segmented-track',SegmentedTrack);
  if(!customElements.get('segment-color-palette'))customElements.define('segment-color-palette',SegmentColorPalette);
})();
