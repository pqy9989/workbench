# 组件文件组织规范

所有组件统一放在 `components/` 目录中。每个组件（包含其所有变体）使用一个独立文件夹管理。

## 目录结构

```text
components/
├── _template/                 # 新组件的可复制模板
│   ├── component.html
│   └── component.css
└── <component-name>/           # 例如 button、card、modal
    ├── <component-name>.html
    └── <component-name>.css
```

## 约定

- **一个组件一个文件夹**：例如 `components/button/`。
- **变体与组件放在一起**：同一组件的尺寸、颜色、状态或样式变体，都写在该组件的 HTML 与 CSS 文件中，不单独拆分目录。
- **文件命名一致**：组件文件夹、HTML 和 CSS 文件均使用小写 kebab-case 命名。例如：
  - `components/icon-button/icon-button.html`
  - `components/icon-button/icon-button.css`
- **HTML 文件**：展示组件基础结构和全部可用变体。
- **CSS 文件**：只包含该组件所需的样式；使用组件名称作为 CSS 类前缀，避免与其他组件冲突。
- **底部操作区**：包含操作栏或底栏的组件，应采用纵向 Flex 布局；组件主体设置 `height: 100vh`，内容区使用 `flex: 1` 并允许滚动，底部操作区保持在页面最下方。无论内容条数多少，操作区都固定在组件底部；内容超出时仅内容区滚动，不挤压或覆盖操作区。
- **模板目录**：新增组件时，可复制 `components/_template/` 后重命名，并按组件需求填充内容。

## 新增组件示例

```text
components/button/
├── button.html
└── button.css
```

当你提供组件后，将按此规范创建它的文件夹，并编写对应的 HTML 和 CSS。

## 已收录的任务列表组件

- `task-page-header`：页面标题栏，使用 `title` 属性设置标题。
- `task-status-tabs`：任务池/待办项切换，触发 `tab-change` 事件。
- `task-filter-bar`：ID、序列号、操作人筛选，触发 `filter-change`、`filter-open`、`filter-refresh` 事件。
- `task-data-table`：任务表格与分页，触发 `row-action`、`page-change` 事件；使用 `rows` 属性控制演示行数。

组合预览位于 `components/task-list-components-preview.html`。

### 工作台组件

工作台组件的定义与演示均收纳在 `components/workbench/` 中。`workbench-task-header`、`workbench-instruction`、`workbench-media-viewer`、`workbench-segment-editor`、`workbench-segment-list-panel`、`workbench-annotation-list`、`workbench-quality-list`、`workbench-segment-tabs`、`workbench-segment-list` 和 `workbench-footer-actions` 已逐项复刻。`workbench-media-viewer` 的 `three-panel` 变体为左侧两块、右侧一块的三画面布局，所有画面保持 `3:2`；`workbench-segment-editor` 当前展示默认、`variant-2`、`variant-3` 三个变体；`workbench-segment-list-panel` 支持 `segments`（默认）、`log`、`info` 三种内容变体；`workbench-annotation-list` 与 `workbench-quality-list` 是无树结构的并列片段列表骨架；`workbench-segment-tabs` 为独立右侧 Tab，`workbench-segment-list` 是列表与 Tab 保持联动的兼容组合壳。

实际工作台 `pages/workbench/optimized.html` 通过上述六个自定义元素承载原页面结构；生产页面继续使用 `optimized.css` 与 `optimized.js`，保证组件宿主不改变原样式和既有联动。

时间轴继续由 `segmented-track` 及四个内部子组件组合：

- `timeline-time-scale`：独立时间刻度。
- `timeline-range-selector`：独立范围选择、拖动与吸附；`variant="marked"` 增加选取高亮与定位标记。
- `timeline-range-ruler`：兼容旧引用的时间刻度与范围选择组合壳。
- `annotation-segment-row`：彩色分段轨道与告警标记。
- `annotation-base-row`：连续绿色基础轨道。
- `timeline-controls`：播放时间、编辑工具与标注标准入口。
