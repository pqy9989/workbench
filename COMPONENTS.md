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
