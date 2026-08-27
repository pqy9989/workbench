const workbenchPages = [
  {
    id: 'action-quality-check',
    name: '动作质检',
    href: '../action-quality-check/index.html?page=action-quality-check'
  },
  {
    id: 'quality-spot-check',
    name: '动作质检-质检抽检',
    href: '../action-quality-check/index.html?page=quality-spot-check'
  },
  {
    id: 'action-annotation',
    name: '动作标注',
    href: '../action-quality-check/index.html?page=action-annotation'
  },
  {
    id: 'action-spot-check',
    name: '动作标注-抽检',
    href: '../action-quality-check/index.html?page=action-spot-check'
  },
  {
    id: 'semantic-segmentation',
    name: '语义切分',
    href: '../action-quality-check/index.html?page=semantic-segmentation'
  },
  {
    id: 'semantic-segmentation-spot-check',
    name: '切分抽检',
    href: '../action-quality-check/index.html?page=semantic-segmentation-spot-check'
  },
  {
    id: 'semantic-annotation-acceptance',
    name: '标注验收',
    href: '../action-quality-check/index.html?page=semantic-annotation-acceptance'
  }
];

const requestedPageId = new URLSearchParams(window.location.search).get('page');
const currentPageId = workbenchPages.some((page) => page.id === requestedPageId)
  ? requestedPageId
  : document.body.dataset.pageId;

document.body.dataset.pageId = currentPageId;

document.querySelectorAll('[data-page-tabs]').forEach((tabs) => {
  tabs.replaceChildren(...workbenchPages.map((page) => {
    const link = document.createElement('a');
    const label = document.createElement('span');

    link.className = 'page-tabs__item';
    link.href = page.href;
    link.title = page.name;
    label.textContent = page.name;
    link.append(label);

    if (page.id === currentPageId) link.setAttribute('aria-current', 'page');
    return link;
  }));
});
