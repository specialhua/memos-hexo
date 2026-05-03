# Hexo Memos 说说页

这是一个用于 Hexo 博客的独立说说页面，通过 Memos API 拉取公开内容并展示为单列长卡片时间流。

本项目基于以下上游仓库修改而来：

- 上游仓库：[`Mintimate/memos-bb-time`](https://github.com/Mintimate/memos-bb-time)
- 上游作者：`Mintimate`

我在上游基础上做了针对自己博客的定制和重构，包括页面样式、加载动画、Memos API 请求逻辑和若干兼容性修复。

## 当前特性

- 单独页面集成到 Hexo，不依赖 Hexo 插件
- 通过 Memos API 拉取公开说说
- 单列长卡片布局，适合桌面和移动端阅读
- 作者名、时间、正文、图片/附件、标签筛选
- 自定义数学曲线加载动画
- 兼容自建 Memos 的跨域公开 API 场景

## 相对上游的主要改动

- 将原先的瀑布流卡片布局改为单列长卡片布局
- 重做桌面端和移动端 UI，使其更接近随笔流样式
- 去除旧的瀑布流定位与重排逻辑，保留更简单的列表渲染
- 修复 Memos API 探测逻辑，改为探测实际可用的 `/api/v1/memos`
- 修复首屏请求里 `creatorId` 被写死的问题
- 增加 `memos` 地址自动补全末尾 `/`
- 替换默认转圈加载动画为数学曲线加载动画
- 增加 `authorName` 配置项，用于覆盖显示作者名

## 目录结构

核心文件位于：

- `source/Memos/index.md`
- `source/Memos/bb-lmm-mk.js`
- `source/Memos/marked.min.js`
- `source/Memos/view-image.min.js`
- `source/Memos/lately.min.js`
- `source/Memos/emaction.js`

## 使用方式

1. 将本仓库中的 `source/Memos` 目录复制到你的 Hexo 项目 `source/` 目录下。
2. 编辑 `source/Memos/index.md`。
3. 在主题导航中加入该页面入口。
4. 重新生成并部署 Hexo。

## 配置示例

编辑 `source/Memos/index.md` 中的配置：

```js
var bbMemos = {
  memos: 'https://your-memos-domain/',
  limit: '10',
  creatorId: '1',
  domId: '#bber',
  authorName: '',
}
```

字段说明：

- `memos`：你的 Memos 站点地址，建议填完整 HTTPS 地址
- `limit`：每页请求条数
- `creatorId`：Memos 用户 ID
- `domId`：页面内容挂载节点
- `authorName`：可选，自定义展示的作者名

## 主题导航示例

以 Hexo Fluid 主题为例，可在主题菜单中加入：

```yaml
menu:
  - { key: "home", link: "/", icon: "iconfont icon-home-fill" }
  - { key: "archive", link: "/archives/", icon: "iconfont icon-archive-fill" }
  - { key: "tag", link: "/tags/", icon: "iconfont icon-tags-fill" }
  - { key: "about", link: "/about/", icon: "iconfont icon-user-fill" }
  - { key: "碎语", link: "/Memos/", icon: "iconfont iconbg-chat" }
```

## Memos API 要求

需要满足以下条件：

- Memos 页面对外可访问
- `GET /api/v1/memos` 可以返回公开内容
- 如果 Hexo 博客和 Memos 不同域，Memos 需要允许跨域访问

可用下面的方式检查：

```bash
curl -i 'https://your-memos-domain/api/v1/memos?pageSize=1'
curl -i 'https://your-memos-domain/api/v1/memos?pageSize=1' -H 'Origin: https://your-blog-domain'
```

## 致谢

感谢以下项目和作者：

- [`Mintimate/memos-bb-time`](https://github.com/Mintimate/memos-bb-time)
- 原始灵感与早期代码来源：木木木木木 <https://immmmm.com>
- Memos 项目：<https://github.com/usememos/memos>

## 许可证

本项目基于 GPL-3.0 许可证的上游项目修改而来，并继续以 GPL-3.0 许可证发布。

你在分发、修改或再发布本项目时，应保留原有许可证与来源说明。
