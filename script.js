const radioCheckedIcon = 'https://www.figma.com/api/mcp/asset/7659fb4c-3df1-4131-b1a7-4f3b47f841bb.svg';
const radioEmptyIcon = 'https://www.figma.com/api/mcp/asset/27fad2c1-9fa3-44ea-a526-3d08bb44bc32.svg';
const trashIcon = 'https://www.figma.com/api/mcp/asset/ac19fe43-2531-43b3-a5af-922014d7865a.svg';
const trashIconAlt = 'https://www.figma.com/api/mcp/asset/5ac1e2ad-846e-4fe9-89c5-64fb2f119e76.svg';
const selectArrowIcon = 'https://www.figma.com/api/mcp/asset/70163025-812d-4fb4-a97d-768046300b25.svg';

const records = [
  { id: '01', time: '5.14s', severity: '严重', description: '请选择失误描述', placeholder: true },
  { id: '02', time: '50:79s-3:04:58', severity: '轻微', description: '夹取明显不规范', altTrash: true },
  { id: '03', time: '5.14s', severity: '严重', description: '夹取明显不规范' },
  { id: '04', time: '50:79s-3:04:58', severity: '轻微', description: '夹取明显不规范' }
];

const recordList = document.querySelector('#recordList');

function renderRecords() {
  recordList.innerHTML = records.map((item) => {
    const severeIcon = item.severity === '严重' ? radioCheckedIcon : radioEmptyIcon;
    const mildIcon = item.severity === '轻微' ? radioCheckedIcon : radioEmptyIcon;
    const selectClass = item.placeholder ? 'select-like placeholder' : 'select-like';
    const deleteIcon = item.altTrash ? trashIconAlt : trashIcon;

    return `
      <article class="record" data-id="${item.id}">
        <div class="record-no">${item.id}</div>
        <div class="record-body">
          <div class="record-top">
            <div class="record-time">
              <div class="field-label">失误时间</div>
              <div class="time-value">${item.time}</div>
            </div>
            <div class="record-severity">
              <div class="field-label">失误程度</div>
              <div class="severity-options" role="radiogroup" aria-label="${item.id} 失误程度">
                <label><img class="radio-icon" src="${mildIcon}" alt="" />轻微</label>
                <label><img class="radio-icon" src="${severeIcon}" alt="" />严重</label>
              </div>
            </div>
            <button class="trash-btn" type="button" aria-label="删除记录 ${item.id}"><img src="${deleteIcon}" alt="" /></button>
          </div>
          <div class="description-block">
            <div class="field-label">失误描述</div>
            <button class="${selectClass}" type="button">
              <span>${item.description}</span>
              <img src="${selectArrowIcon}" alt="" />
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

renderRecords();

document.addEventListener('click', (event) => {
  const target = event.target.closest('button');
  if (!target) return;

  if (target.matches('[data-action="toggle-play"]')) {
    target.classList.toggle('is-paused');
    target.textContent = target.classList.contains('is-paused') ? 'Ⅱ' : '▶';
    return;
  }

  if (target.classList.contains('submit-btn')) {
    document.querySelectorAll('.submit-btn').forEach((btn) => btn.classList.remove('pass'));
    target.classList.add('pass');
  }
});
