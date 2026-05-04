/*
* @Author: Mintimate
* @Date:  2025-06-22 17:31:25
* @Modified from: 木木木木木<https://immmmm.com>
* @Description:
  - 适配新版本的 Memos
  - 删除一些不常用的功能
*/

// 配置对象，使用更严格的默认值和类型检查
const DEFAULT_CONFIG = {
  memos: 'https://demo.usememos.com/',
  emactionApi: 'https://emaction-go.mintimate.cn',
  limit: 10,
  creatorId: '1',
  domId: '#bber',
  authorName: '',
};

function normalizeMemosUrl(url) {
  if (typeof url !== 'string') {
    return '';
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return '';
  }

  return trimmed.endsWith('/') ? trimmed : `${trimmed}/`;
}

// 合并用户配置
const bbMemo = {
  ...DEFAULT_CONFIG,
  ...(typeof bbMemos !== 'undefined' ? bbMemos : {})
};

bbMemo.memos = normalizeMemosUrl(bbMemo.memos);

// 验证配置
if (!bbMemo.memos || !bbMemo.domId) {
  console.error('Memos配置不完整，请检查 memos 和 domId 参数');
}

function renderError(message) {
  if (!AppState.bbDom) {
    return;
  }

  AppState.bbDom.innerHTML = `<div class="error">${message}</div>`;
}

// 工具函数
const Utils = {
  // 加载CSS代码
  loadCssCode(code) {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.appendChild(document.createTextNode(code));
    document.head.appendChild(style);
  },

  // 获取URL参数
  getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split("=");
      if (pair[0] === variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    return false;
  },

  // 错误处理包装器
  async safeExecute(asyncFn, errorMsg = '操作失败') {
    try {
      return await asyncFn();
    } catch (error) {
      console.error(`${errorMsg}:`, error);
      throw error;
    }
  }
};
const allCSS = `
/* 主容器 */
#bber {
  margin-top: 1rem;
  width: auto !important;
  min-height: 100vh;
  /* 确保容器有足够的内边距 */
  box-sizing: border-box;
}

/* 内容区域 */
.bb-cont {
  margin-bottom: 0;
  line-height: 1.85;
  font-size: 15px;
  letter-spacing: 0.01em;
}

.bb-cont p {
  margin: 0.5rem 0;
  color: inherit;
}

.bb-cont img {
  border-radius: 8px;
  max-width: 100%;
  max-height: 400px;
  height: auto;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease;
  /* 添加最小高度避免布局跳跃 */
  min-height: 120px;
  background-color: #f5f5f5;
  /* 图片加载时的占位样式 */
  background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
                    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

.bb-cont img:hover {
  transform: scale(1.02);
}

/* 标签样式 */
.tag-span {
  display: inline-block;
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.2rem 0.4rem;
  border-radius: 12px;
  font-size: 0.875rem;
  margin: 0.2rem 0.2rem 0.2rem 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-span:hover {
  background: #bbdefb;
}

#tag-list .tag-span {
  background: rgba(25, 118, 210, 0.1);
  border: 1px solid #1976d2;
  position: relative;
}

/* 亮色模式特定样式 */
[data-user-color-scheme="light"] .bb-timeline .bb-item {
  background: rgba(255, 255, 255, 0.78);
  border-color: rgba(120, 120, 120, 0.22);
  color: #333;
}

[data-user-color-scheme="light"] .bb-cont p {
  color: #333;
}

[data-user-color-scheme="light"] .bb-info {
  color: #666;
}

[data-user-color-scheme="light"] .bb-info a {
  color: #666;
}

[data-user-color-scheme="light"] .bb-tool {
  border-top-color: #f0f0f0;
}

[data-user-color-scheme="light"] .datacount {
  color: #666;
}

[data-user-color-scheme="light"] .datacount:hover {
  color: #1976d2;
}

/* 工具栏 */
.bb-tool {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-top: 0;
  border-top: none;
  margin-top: 0;
  opacity: 0.78;
  transform-origin: left center;
  font-size: 12px;
}

/* 信息区域 */
.bb-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.4rem;
  font-size: 12px;
  color: #666;
}

.bb-info a {
  text-decoration: none;
  color: #666;
}

.bb-info a:hover {
  color: var(--post-link-color);
}

.datatime {
  font-size: 10px;
  letter-spacing: 0.12em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace;
}

/* 加载按钮 - 风琴样式 */
.bb-load {
  position: relative;
  width: 100%;
  margin: 2rem 0;
  z-index: 10;
}

.bb-load button {
  width: 100%;
  padding: 0.5rem 0;
  background: transparent;
  color: #666;
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 400;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
}

.bb-load button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transition: left 0.6s ease;
}

.bb-load button:hover {
  border-color: #667eea;
  color: #667eea;
  background: rgba(102, 126, 234, 0.05);
  transform: translateY(-1px);
}

.bb-load button:hover::before {
  left: 100%;
}

.bb-load button:active {
  transform: translateY(0);
  transition: transform 0.1s;
}

.bb-load button:disabled {
  background: transparent;
  color: #ccc;
  border-color: #f0f0f0;
  cursor: not-allowed;
  transform: none;
}

.bb-load button:disabled::before {
  display: none;
}

/* 加载中动画 */
.bb-load button.loading {
  pointer-events: none;
  border-style: solid;
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
  color: #667eea;
}

.bb-load button.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid transparent;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: button-spin 1s linear infinite;
}

@keyframes button-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 图片网格 */
.resimg {
  margin: 0.4rem 0;
}

.resimg img {
  max-height: 300px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease;
  /* 添加最小高度避免布局跳跃 */
  min-height: 120px;
  background-color: #f5f5f5;
  border-radius: 8px;
  /* 图片加载时的占位样式 */
  background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
                    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 15px 15px;
  background-position: 0 0, 0 7.5px, 7.5px -7.5px, -7.5px 0px;
}

.resimg img:hover {
  transform: scale(1.02);
}

.resimg.grid {
  display: grid;
  gap: 0.3rem;
  grid-template-columns: repeat(3, 1fr);
}

.resimg.grid-1 {
  grid-template-columns: repeat(1, 1fr);
}

.resimg.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.resimg.grid-4 {
  grid-template-columns: repeat(2, 1fr);
}

.resimg figure {
  margin: 0;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  max-height: 250px;
}

.resimg.grid figure.gallery-thumbnail {
  max-height: 200px;
}

.resimg.grid figure.gallery-thumbnail > img.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

/* 视频容器 */
.video-wrapper {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  margin: 0.75rem 0;
  border-radius: 8px;
  overflow: hidden;
}

.video-wrapper iframe,
.video-wrapper video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.github-repo-card {
  display: block;
  margin: 0.9rem 0 0.3rem;
  width: min(100%, 460px);
  margin-left: auto;
  margin-right: auto;
  padding: 0.82rem 0.95rem;
  color: inherit;
  text-decoration: none;
  border: 1px solid rgba(120, 120, 120, 0.2);
  background: rgba(255, 255, 255, 0.03);
  transition: border-color 0.2s ease, transform 0.2s ease, background 0.2s ease;
}

.github-repo-card:hover {
  transform: translateY(-1px);
  border-color: rgba(120, 120, 120, 0.34);
  background: rgba(255, 255, 255, 0.05);
}

.github-repo-card__header,
.github-repo-card__top,
.github-repo-card__owner,
.github-repo-card__title,
.github-repo-card__meta {
  display: flex;
}

.github-repo-card__header,
.github-repo-card__top {
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.8rem;
}

.github-repo-card__owner,
.github-repo-card__title {
  min-width: 0;
  gap: 0.82rem;
}

.github-repo-card__owner {
  align-items: flex-start;
}

.github-repo-card__title {
  flex-direction: column;
  gap: 0.2rem;
}

.github-repo-card__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.12rem 0.4rem;
  border: 1px solid rgba(120, 120, 120, 0.22);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.github-repo-card__name,
.github-repo-card__repo {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.35;
}

.github-repo-card__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 42px;
  width: 42px;
  height: 42px;
  min-width: 42px;
  color: #666;
  line-height: 1;
  transform: none;
}

.github-repo-card__mark-icon {
  display: block;
  width: 26px;
  height: 26px;
}

.github-repo-card__body,
.github-repo-card__desc {
  color: #666;
  font-size: 13px;
  line-height: 1.65;
}

.github-repo-card__desc {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.github-repo-card__meta {
  flex-wrap: wrap;
  gap: 0.42rem 0.75rem;
  margin-top: 0.55rem;
  color: #777;
  font-size: 11px;
  letter-spacing: 0.04em;
}

.github-repo-card__arrow {
  color: #777;
  align-self: flex-start;
  margin-top: 0.05rem;
  font-size: 16px;
  line-height: 1;
}

.github-repo-card.is-loading .github-repo-card__body,
.github-repo-card.is-error .github-repo-card__desc {
  color: #888;
}

/* 加载动画 */
.loader {
  position: relative;
  width: 100%;
  margin: 2.75rem auto;
  display: grid;
  place-items: center;
  z-index: 10;
}

.loader-frame {
  width: min(30vmin, 140px);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
}

.loader-frame svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.loader-path {
  stroke: currentColor;
  stroke-width: 4.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.12;
  fill: none;
}

.loader-particle {
  fill: currentColor;
}

/* 暗色主题 */
[data-user-color-scheme="dark"] .bb-cont p {
  color: var(--subtitle-color);
}

[data-user-color-scheme="dark"] .load-btn {
  color: var(--subtitle-color);
}

[data-user-color-scheme="dark"] .bb-timeline .bb-item {
  background: rgba(255, 255, 255, 0.015);
  border-color: rgba(255, 255, 255, 0.14);
  color: var(--text-color);
}

[data-user-color-scheme="dark"] .tag-span {
  background: rgba(21, 137, 233, 0.2);
  color: var(--post-link-color);
}

[data-user-color-scheme="dark"] .bb-tool {
  border-top-color: transparent;
}

[data-user-color-scheme="dark"] .bb-info {
  color: var(--sec-text-color);
}

[data-user-color-scheme="dark"] .bb-info a {
  color: var(--sec-text-color);
}

[data-user-color-scheme="dark"] .bb-info a:hover {
  color: var(--post-link-color);
}

[data-user-color-scheme="dark"] .datacount {
  color: var(--sec-text-color);
}

[data-user-color-scheme="dark"] .datacount:hover {
  color: var(--post-link-color);
}

:root {
  --start-smile-border-color-default: #e5e5e5;
  --start-smile-border-color-hover-default: #cccccc;
  --start-smile-bg-color-default: #ffffff;
  --start-smile-svg-fill-color-default: #333333;
  --reaction-got-not-reacted-bg-color-default: #ffffff;
  --reaction-got-not-reacted-bg-color-hover-default: #f2f2f2;
  --reaction-got-not-reacted-border-color-default: #e5e5e5;
  --reaction-got-not-reacted-text-color-default: #333333;
  --reaction-got-reacted-bg-color-default: #f2f2f2;
  --reaction-got-reacted-bg-color-hover-default: #e5e5e5;
  --reaction-got-reacted-border-color-default: #42b983;
  --reaction-got-reacted-text-color-default: #42b983;
  --reaction-available-popup-bg-color-default: #ffffff;
  --reaction-available-popup-border-color-default: #dddddd;
  --reaction-available-popup-box-shadow-default: 0 4px 6px rgba(0,0,0,.04);
  --reaction-available-emoji-reacted-bg-color-default: #388bfd1a;
  --reaction-available-emoji-bg-color-hover-default: #f2f2f2;
  --reaction-available-emoji-z-index-default: 100;
  --reaction-available-mask-z-index-default: 80;
}

.reaction-got-reacted {
    background-color: var(--reaction-got-not-reacted-bg-color, var(--reaction-got-not-reacted-bg-color-default));
    border-width: 1px;
    border-style: solid;
    border-color: var(--reaction-got-not-reacted-border-color, var(--reaction-got-not-reacted-border-color-default));
    color: var(--reaction-got-not-reacted-text-color, var(--reaction-got-not-reacted-text-color-default));
}

/* 暗色主题变量覆盖 */
[data-user-color-scheme="dark"] {
  --start-smile-border-color-default: #3b3d42;
  --start-smile-border-color-hover-default: #3b3d42;
  --start-smile-bg-color-default: transparent;
  --start-smile-svg-fill-color-default: #ffffff;
  --reaction-got-not-reacted-bg-color-default: transparent;
  --reaction-got-not-reacted-bg-color-hover-default: #272727;
  --reaction-got-not-reacted-border-color-default: #3b3d42;
  --reaction-got-not-reacted-text-color-default: #ffffff;
  --reaction-got-reacted-bg-color-default: #272727;
  --reaction-got-reacted-bg-color-hover-default: #272727;
  --reaction-got-reacted-border-color-default: #42b983;
  --reaction-got-reacted-text-color-default: #42b983;
  --reaction-available-popup-bg-color-default: #161b22;
  --reaction-available-popup-border-color-default: #30363d;
  --reaction-available-popup-box-shadow-default: 0 4px 6px rgba(0,0,0,.04);
  --reaction-available-emoji-reacted-bg-color-default: #388bfd1a;
  --reaction-available-emoji-bg-color-hover-default: #30363d;

}

/* 列表长卡片布局覆盖 */
.memos-hero {
  max-width: 760px;
  margin: 0 auto 2rem;
}

.memos-hero h1 {
  margin: 0;
  color: #1b1b1b;
  font-size: clamp(2.2rem, 5vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
}

.memos-hero p {
  margin: 0;
  color: #666;
  font-size: 1rem;
  line-height: 1.7;
}

.bb-timeline {
  position: static;
  max-width: 760px;
  margin: 0 auto;
}

.bb-timeline .memo-item {
  position: relative;
  width: 100% !important;
  left: auto !important;
  top: auto !important;
  opacity: 1;
  padding: 0;
}

.bb-timeline .memo-item:not(:last-child) {
  margin-bottom: 1.35rem;
}

.bb-timeline .bb-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(120, 120, 120, 0.22);
  border-radius: 0;
  box-shadow: none;
  padding: 0.9rem 1.1rem 0.8rem;
}

.bb-timeline .bb-item:hover {
  box-shadow: none;
  transform: none;
  border-color: rgba(120, 120, 120, 0.32);
}

.memo-head {
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
  gap: 0.7rem;
  margin-bottom: 0.8rem;
  padding-bottom: 0.45rem;
  border-bottom: 1px solid rgba(120, 120, 120, 0.16);
}

.memo-meta {
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 0.7rem;
  flex-wrap: wrap;
}

.memo-name {
  display: block;
  color: #222;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 0.05em;
}

.memo-time-link {
  color: inherit;
  text-decoration: none;
}

.memo-time-link:hover {
  color: var(--post-link-color);
}

.memo-foot {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem;
  margin-top: 0.7rem;
  margin-bottom: 0;
}

.bb-cont {
  margin-bottom: 0;
  line-height: 1.85;
  font-size: 15px;
  letter-spacing: 0.01em;
}

.bb-cont p {
  margin: 0.5rem 0;
  color: inherit;
}

.bb-tool {
  justify-content: flex-start;
  padding-top: 0;
  border-top: none;
  margin-top: 0;
  opacity: 0.78;
  transform: none;
  transform-origin: left center;
  font-size: 12px;
}

.bb-info {
  margin-top: 0;
  font-size: 12px;
  color: inherit;
}

.datatime {
  color: #777;
  white-space: nowrap;
  font-size: 10px;
  letter-spacing: 0.12em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace;
}

[data-user-color-scheme="light"] .memos-hero h1 {
  color: #1b1b1b;
}

[data-user-color-scheme="light"] .memos-hero p {
  color: #666;
}

[data-user-color-scheme="light"] .memo-name {
  color: #1f1f1f;
}

[data-user-color-scheme="light"] .datatime {
  color: #7a7a7a;
}

[data-user-color-scheme="light"] .bb-timeline .bb-item {
  background: rgba(255, 255, 255, 0.78);
  border-color: rgba(120, 120, 120, 0.22);
}

[data-user-color-scheme="light"] .memo-head {
  border-bottom-color: rgba(120, 120, 120, 0.16);
}

[data-user-color-scheme="light"] .github-repo-card {
  background: rgba(255, 255, 255, 0.7);
  border-color: rgba(120, 120, 120, 0.2);
}

[data-user-color-scheme="light"] .github-repo-card:hover {
  border-color: rgba(120, 120, 120, 0.34);
}

[data-user-color-scheme="light"] .github-repo-card__desc,
[data-user-color-scheme="light"] .github-repo-card__body {
  color: #666;
}

[data-user-color-scheme="light"] .github-repo-card__meta,
[data-user-color-scheme="light"] .github-repo-card__arrow,
[data-user-color-scheme="light"] .github-repo-card__mark {
  color: #777;
}

[data-user-color-scheme="light"] .bb-timeline .bb-item:hover {
  border-color: rgba(120, 120, 120, 0.34);
}

[data-user-color-scheme="dark"] .memo-name {
  color: var(--text-color);
}

[data-user-color-scheme="dark"] .memos-hero h1 {
  color: #f2f2f2;
}

[data-user-color-scheme="dark"] .memos-hero p {
  color: rgba(220, 220, 220, 0.7);
}

[data-user-color-scheme="dark"] .loader {
  color: rgba(255, 255, 255, 0.9);
}

[data-user-color-scheme="dark"] .datatime {
  color: var(--sec-text-color);
}

[data-user-color-scheme="dark"] .memo-head {
  border-bottom-color: rgba(255, 255, 255, 0.12);
}

[data-user-color-scheme="dark"] .github-repo-card {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.12);
}

[data-user-color-scheme="dark"] .github-repo-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.035);
}

[data-user-color-scheme="dark"] .github-repo-card__desc,
[data-user-color-scheme="dark"] .github-repo-card__body {
  color: var(--sec-text-color);
}

[data-user-color-scheme="dark"] .github-repo-card__meta,
[data-user-color-scheme="dark"] .github-repo-card__arrow,
[data-user-color-scheme="dark"] .github-repo-card__badge,
[data-user-color-scheme="dark"] .github-repo-card__mark {
  color: rgba(255, 255, 255, 0.72);
}

[data-user-color-scheme="dark"] .github-repo-card__badge {
  border-color: rgba(255, 255, 255, 0.14);
}

[data-user-color-scheme="dark"] .bb-timeline .bb-item {
  background: rgba(255, 255, 255, 0.015);
  border-color: rgba(255, 255, 255, 0.14);
}

[data-user-color-scheme="dark"] .bb-timeline .bb-item:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

[data-user-color-scheme="light"] .loader {
  color: #222;
}

@media (max-width: 768px) {
  .memos-hero {
    margin-bottom: 2rem;
  }

  .memo-head {
    align-items: flex-start;
  }

  .github-repo-card {
    width: 100%;
    padding: 0.76rem 0.84rem;
  }

  .github-repo-card__top {
    align-items: flex-start;
  }

  .github-repo-card__owner {
    align-items: flex-start;
  }

  .github-repo-card__mark {
    flex-basis: 36px;
    width: 36px;
    height: 36px;
    min-width: 36px;
  }

  .github-repo-card__mark-icon {
    width: 22px;
    height: 22px;
  }

  .bb-timeline .bb-item {
    padding: 0.9rem 0.95rem 0.8rem;
  }
}
`
Utils.loadCssCode(allCSS);

// 状态管理
const AppState = {
  limit: bbMemo.limit, // 每页显示条数
  memos: bbMemo.memos,// 所有数据
  offset: 0,
  nextDom: null, // 下一页数据
  apiV1: '',
  bbDom: bbMemo.domId ? document.querySelector(bbMemo.domId) : null,
  isLoading: false,
  tageFilter: '', // 过滤的标签
  emactionApi: bbMemo.emactionApi,
};
const load = '<div class="bb-load"><button class="load-btn button-load">加载中……</button></div>';
const loading = `
  <div class="loader" aria-label="加载中">
    <div class="loader-frame">
      <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <g class="loader-group">
          <path class="loader-path"></path>
        </g>
      </svg>
    </div>
  </div>
`;

function initLoaderAnimation(scope = document) {
  const loader = scope.querySelector('.loader:not([data-loader-ready])');
  if (!loader) {
    return;
  }

  loader.setAttribute('data-loader-ready', 'true');

  const group = loader.querySelector('.loader-group');
  const path = loader.querySelector('.loader-path');
  if (!group || !path) {
    return;
  }

  const config = {
    particleCount: 28,
    trailSpan: 0.31,
    durationMs: 5300,
    rotationDurationMs: 28000,
    pulseDurationMs: 4400,
    strokeWidth: 4.2,
    roseA: 9.2,
    roseABoost: 0.6,
    roseBreathBase: 0.72,
    roseBreathBoost: 0.28,
    roseScale: 3.25,
  };
  const SVG_NS = 'http://www.w3.org/2000/svg';

  path.setAttribute('stroke-width', String(config.strokeWidth));

  const particles = Array.from({ length: config.particleCount }, () => {
    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('class', 'loader-particle');
    group.appendChild(circle);
    return circle;
  });

  const normalizeProgress = (progress) => ((progress % 1) + 1) % 1;
  const pointAt = (progress, detailScale) => {
    const t = progress * Math.PI * 2;
    const a = config.roseA + detailScale * config.roseABoost;
    const r = a * (config.roseBreathBase + detailScale * config.roseBreathBoost) * Math.cos(3 * t);
    return {
      x: 50 + Math.cos(t) * r * config.roseScale,
      y: 50 + Math.sin(t) * r * config.roseScale,
    };
  };
  const buildPath = (detailScale, steps = 240) =>
    Array.from({ length: steps + 1 }, (_, index) => {
      const point = pointAt(index / steps, detailScale);
      return `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
    }).join(' ');

  const startedAt = performance.now();
  const render = (now) => {
    if (!loader.isConnected) {
      return;
    }

    const time = now - startedAt;
    const progress = (time % config.durationMs) / config.durationMs;
    const pulseProgress = (time % config.pulseDurationMs) / config.pulseDurationMs;
    const pulseAngle = pulseProgress * Math.PI * 2;
    const detailScale = 0.52 + ((Math.sin(pulseAngle + 0.55) + 1) / 2) * 0.48;
    const rotation = -((time % config.rotationDurationMs) / config.rotationDurationMs) * 360;

    group.setAttribute('transform', `rotate(${rotation} 50 50)`);
    path.setAttribute('d', buildPath(detailScale));

    particles.forEach((node, index) => {
      const tailOffset = index / Math.max(config.particleCount - 1, 1);
      const point = pointAt(normalizeProgress(progress - tailOffset * config.trailSpan), detailScale);
      const fade = Math.pow(1 - tailOffset, 0.56);
      node.setAttribute('cx', point.x.toFixed(2));
      node.setAttribute('cy', point.y.toFixed(2));
      node.setAttribute('r', (0.7 + fade * 1.9).toFixed(2));
      node.setAttribute('opacity', (0.05 + fade * 0.95).toFixed(3));
    });

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
}

// 初始化应用
if (AppState.bbDom) {
  Utils.safeExecute(
    () => fetchStatus(),
    '初始化失败'
  ).catch(error => {
    console.error('应用启动失败:', error);
    renderError(error.message || '加载失败，请刷新页面重试');
  });
}
async function fetchStatus() {
  if (!AppState.memos) {
    throw new Error('请在 index.md 中配置 memos 地址');
  }

  const probeUrl = `${AppState.memos}api/v1/memos?pageSize=1`;
  const response = await fetch(probeUrl);

  if (!response.ok) {
    throw new Error(`Memos API 探测失败，HTTP status: ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Memos API 探测失败，返回的不是 JSON 数据');
  }

  AppState.apiV1 = 'v1/';

  let memoOne = Utils.getQueryVariable("memo") || ''
  if(memoOne){
    getMemoOne(memoOne)
  }else{
    newApiV1(AppState.apiV1)
  }

}
function getMemoOne(memoOne){
  let OneDom = `<iframe style="width:100%;height:100vh;" src="${memoOne}" frameBorder="0"></iframe>`
  let ContDom = document.querySelector('.content') || document.querySelector(bbMemo.domId);
  ContDom.innerHTML = OneDom
}

function newApiV1(apiV1){
  getFirstList(apiV1) //首次加载数据
  AppState.bbDom.innerHTML = loading
  initLoaderAnimation(AppState.bbDom);
}

function buildMemosUrl({ apiV1, pageToken = '', tagName = '' } = {}) {
  const params = new URLSearchParams({
    creatorId: bbMemo.creatorId,
    pageSize: String(AppState.limit),
  });

  if (pageToken) {
    params.set('pageToken', pageToken);
  }

  if (tagName) {
    params.set('filter', `tag in ["${tagName}"]`);
  } else {
    params.set('filter', `creator_id == ${bbMemo.creatorId}`);
  }

  return `${AppState.memos}api/${apiV1}memos?${params.toString()}`;
}

// 绑定加载更多按钮事件
function bindLoadMoreButton(apiV1) {
  // 等待DOM更新后绑定事件
  setTimeout(() => {
    const loadBtn = document.querySelector("button.button-load");
    if (loadBtn && !loadBtn.hasAttribute('data-bound')) {
      loadBtn.setAttribute('data-bound', 'true'); // 防止重复绑定
      
      const handleClick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        
        const btn = e.target;
        btn.textContent = '';
        btn.classList.add('loading');
        btn.disabled = true;
        
        if (!AppState.nextDom || !Array.isArray(AppState.nextDom.memos)) {
          btn.classList.remove('loading');
          btn.textContent = '没有更多了';
          btn.disabled = true;
          return;
        }

        updateHTMl(AppState.nextDom)

        if(AppState.nextDom.memos.length === 0 || AppState.nextDom.memos.length < AppState.limit){
          btn.classList.remove('loading');
          btn.textContent = '没有更多了';
          btn.disabled = true;
        }
        else {
          // 继续预加载下一页
          getNextList(apiV1 || AppState.apiV1);
        }
      };
      
      loadBtn.addEventListener("click", handleClick);
      
      // 存储处理函数，以便之后可能需要移除
      loadBtn._clickHandler = handleClick;
    }
  }, 100);
}

async function getFirstList(apiV1){
  try {
    AppState.bbDom.insertAdjacentHTML('afterend', load);
    bindLoadMoreButton(apiV1); // 绑定按钮事件
    const bbUrl = buildMemosUrl({ apiV1 });
    const response = await fetch(bbUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const resdata = await response.json();
    
    updateHTMl(resdata)
    
    AppState.offset = resdata.nextPageToken

    if (AppState.offset === '' || !resdata.memos || resdata.memos.length === 0){ // 没有下一项数据，隐藏
      const loadBtn = document.querySelector("button.button-load");
      loadBtn.textContent = '没有更多了';
      loadBtn.disabled = true;
      return
    }

    getNextList(apiV1)
  } catch (error) {
    console.error('获取数据失败:', error);
    renderError(`加载失败：${error.message || '请刷新页面重试'}`);
  }
}
//预加载下一页数据
async function getNextList(apiV1){
  try {
    if (AppState.isLoading) return; // 防止重复加载

    // 已经没有下一页数据 => 隐藏并移除事件
    if (AppState.offset === '') {
      const loadBtn = document.querySelector("button.button-load");
      loadBtn.textContent = '没有更多了';
      loadBtn.disabled = true;
      return; // 没有下一项数据，隐藏
    }
    AppState.isLoading = true;
    
    const bbUrl = buildMemosUrl({
      apiV1,
      pageToken: AppState.offset,
      tagName: AppState.tageFilter,
    });

    const response = await fetch(bbUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const resdata = await response.json();
    AppState.nextDom = resdata
    AppState.offset = resdata.nextPageToken
    
  } catch (error) {
    console.error('预加载下一页失败:', error);
  } finally {
    AppState.isLoading = false;
  }
}
function getCreatorUsername(creator = '') {
  return creator.split('/').pop() || '';
}

function getAuthorDisplayName(memo) {
  return bbMemo.authorName || getCreatorUsername(memo.creator) || 'Memos';
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalizeGithubRepoPath(pathname = '') {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length < 2) {
    return null;
  }

  const owner = parts[0];
  const repo = parts[1].replace(/\.git$/i, '');
  return owner && repo ? `${owner}/${repo}` : null;
}

function parseGithubRepoUrl(url = '') {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./i, '').toLowerCase();
    if (host !== 'github.com') {
      return null;
    }

    const repoPath = normalizeGithubRepoPath(parsed.pathname);
    if (!repoPath) {
      return null;
    }

    const segments = parsed.pathname.split('/').filter(Boolean);
    if (segments.length > 2 && !segments[1].endsWith('.git')) {
      return null;
    }

    const [owner, repo] = repoPath.split('/');
    return {
      owner,
      repo,
      fullName: repoPath,
      url: `https://github.com/${repoPath}`,
    };
  } catch (error) {
    return null;
  }
}

function wrapGithubRepoLinks(text = '') {
  const GITHUB_REPO_RAW_REG = /(^|[\s>])https?:\/\/(?:www\.)?github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)(?:\.git)?(?=\/?(?:[?#)\]\s<]|$))/gi;

  return text.replace(GITHUB_REPO_RAW_REG, (match, prefix, owner, repo) => {
    const cleanRepo = repo.replace(/\.git$/i, '');
    const url = `https://github.com/${owner}/${cleanRepo}`;
    return `${prefix}[${owner}/${cleanRepo}](${url})`;
  });
}

function createGithubRepoCardSkeleton(repoInfo, url) {
  return `<a class="github-repo-card is-loading" href="${escapeHtml(url)}" target="_blank" rel="noreferrer" data-github-repo="${escapeHtml(repoInfo.fullName)}" data-github-url="${escapeHtml(url)}">
    <span class="github-repo-card__header">
      <span class="github-repo-card__badge">GitHub</span>
      <span class="github-repo-card__name">${escapeHtml(repoInfo.fullName)}</span>
    </span>
    <span class="github-repo-card__body">正在加载仓库信息…</span>
  </a>`;
}

const GITHUB_BRANCH_ICON = `<svg class="github-repo-card__mark-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 16" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 5c0-1.11-.89-2-2-2a1.993 1.993 0 0 0-1 3.72v.3c-.02.52-.23.98-.63 1.38c-.4.4-.86.61-1.38.63c-.83.02-1.48.16-2 .45V4.72a1.993 1.993 0 0 0-1-3.72C.88 1 0 1.89 0 3a2 2 0 0 0 1 1.72v6.56c-.59.35-1 .99-1 1.72c0 1.11.89 2 2 2c1.11 0 2-.89 2-2c0-.53-.2-1-.53-1.36c.09-.06.48-.41.59-.47c.25-.11.56-.17.94-.17c1.05-.05 1.95-.45 2.75-1.25S8.95 7.77 9 6.73h-.02C9.59 6.37 10 5.73 10 5zM2 1.8c.66 0 1.2.55 1.2 1.2c0 .65-.55 1.2-1.2 1.2C1.35 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2zm0 12.41c-.66 0-1.2-.55-1.2-1.2c0-.65.55-1.2 1.2-1.2c.65 0 1.2.55 1.2 1.2c0 .65-.55 1.2-1.2 1.2zm6-8c-.66 0-1.2-.55-1.2-1.2c0-.65.55-1.2 1.2-1.2c.65 0 1.2.55 1.2 1.2c0 .65-.55 1.2-1.2 1.2z"/></svg>`;

function renderGithubRepoCard(data, fallbackUrl, fallbackFullName) {
  const fullName = data.full_name || fallbackFullName;
  const description = data.description ? escapeHtml(data.description) : '没有简介';
  const language = data.language ? escapeHtml(data.language) : 'Unknown';
  const stars = Number(data.stargazers_count || 0).toLocaleString();
  const forks = Number(data.forks_count || 0).toLocaleString();
  const updatedAt = data.updated_at ? new Date(data.updated_at).toLocaleDateString() : '';

  return `<span class="github-repo-card__top">
      <span class="github-repo-card__owner">
        <span class="github-repo-card__mark" aria-hidden="true">${GITHUB_BRANCH_ICON}</span>
        <span class="github-repo-card__title">
          <span class="github-repo-card__repo">${escapeHtml(fullName)}</span>
          <span class="github-repo-card__desc">${description}</span>
        </span>
      </span>
      <span class="github-repo-card__arrow" aria-hidden="true">↗</span>
    </span>
    <span class="github-repo-card__meta">
      <span>★ ${stars}</span>
      <span>⑂ ${forks}</span>
      <span>${language}</span>
      ${updatedAt ? `<span>更新于 ${escapeHtml(updatedAt)}</span>` : ''}
    </span>`;
}

const githubRepoCache = new Map();

async function fetchGithubRepoMeta(owner, repo) {
  const key = `${owner}/${repo}`;

  if (githubRepoCache.has(key)) {
    return githubRepoCache.get(key);
  }

  const request = fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      Accept: 'application/vnd.github+json',
    }
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`GitHub API 请求失败: ${response.status}`);
    }

    return response.json();
  }).catch((error) => {
    githubRepoCache.delete(key);
    throw error;
  });

  githubRepoCache.set(key, request);
  return request;
}

async function hydrateGithubRepoCards(root = document) {
  const cards = root.querySelectorAll?.('[data-github-repo]') || [];
  if (!cards.length) {
    return;
  }

  await Promise.all(Array.from(cards).map(async (card) => {
    const repoKey = card.dataset.githubRepo;
    const fallbackUrl = card.dataset.githubUrl || card.href;
    if (!repoKey) {
      return;
    }

    const [owner, repo] = repoKey.split('/');
    if (!owner || !repo) {
      return;
    }

    try {
      const data = await fetchGithubRepoMeta(owner, repo);
      card.classList.remove('is-loading', 'is-error');
      card.innerHTML = renderGithubRepoCard(data, fallbackUrl, repoKey);
      card.href = data.html_url || fallbackUrl;
      card.setAttribute('aria-label', `GitHub 仓库 ${repoKey}`);
    } catch (error) {
      console.warn(`加载 GitHub 仓库失败: ${repoKey}`, error);
      card.classList.add('is-error');
      card.innerHTML = `<span class="github-repo-card__top">
          <span class="github-repo-card__title">
            <span class="github-repo-card__repo">${escapeHtml(repoKey)}</span>
            <span class="github-repo-card__desc">GitHub 信息加载失败，点击可直接访问仓库</span>
          </span>
          <span class="github-repo-card__arrow" aria-hidden="true">↗</span>
        </span>
        <span class="github-repo-card__meta">
          <span>${escapeHtml(repoKey)}</span>
        </span>`;
    }
  }));
}
// 插入 html 
async function updateHTMl(data){
  if (!data || !data.memos) {
    console.error('数据格式错误');
    return;
  }
  
  let result="",resultAll="";
  const TAG_REG = /#([^#\s!.,;:?"'()]+)(?= )/g ///#([^/\s#]+?) /g
  , IMG_REG = /\!\[(.*?)\]\((.*?)\)/g
  , LINK_REG = /\[(.*?)\]\((.*?)\)/g
  , BILIBILI_REG = /<a.*?href="https:\/\/www\.bilibili\.com\/video\/((av[\d]{1,10})|(BV([\w]{10})))\/?".*?>.*<\/a>/g
  , NETEASE_MUSIC_REG = /<a.*?href="https:\/\/music\.163\.com\/.*id=([0-9]+)".*?>.*<\/a>/g
  , QQMUSIC_REG = /<a.*?href="https\:\/\/y\.qq\.com\/.*(\/[0-9a-zA-Z]+)(\.html)?".*?>.*?<\/a>/g
  , QQVIDEO_REG = /<a.*?href="https:\/\/v\.qq\.com\/.*\/([a-z|A-Z|0-9]+)\.html".*?>.*<\/a>/g
  , YOUKU_REG = /<a.*?href="https:\/\/v\.youku\.com\/.*\/id_([a-z|A-Z|0-9|==]+)\.html".*?>.*<\/a>/g
  , YOUTUBE_REG = /<a.*?href="https:\/\/www\.youtube\.com\/watch\?v\=([a-z|A-Z|0-9]{11})\".*?>.*<\/a>/g;
  
  // 确保marked已加载
  if (typeof marked === 'undefined') {
    console.error('marked库未加载');
    return;
  }
  
  marked.setOptions({
    breaks: false,
    smartypants: false,
    langPrefix: 'language-',
    headerIds: false,
    mangle: false
  });

  const memosData = data.memos
  
  for(let i=0;i < memosData.length;i++){
      let bbID = memosData[i].name
      let memoUrl = AppState.memos + bbID
      let authorName = getAuthorDisplayName(memosData[i])
      let bbCont = memosData[i].content + ' '
      let bbContREG = ''

      bbContREG += wrapGithubRepoLinks(bbCont)
        .replace(TAG_REG, "")
        .replace(IMG_REG, "")
        .replace(LINK_REG, '<a class="primary" href="$2" target="_blank">$1</a>')


      //标签
      let tagArr = bbCont.match(TAG_REG);
      let bbContTag = '';
      if (tagArr) {
        bbContTag = tagArr.map(t=>{
          return `<span class='tag-span' onclick='getTypeOfMemos(this)'>${t}</span> `;
        }).join('');
        bbContREG =  bbContTag + bbContREG.trim()
      }
            
      bbContREG = marked.parse(bbContREG)
        .replace(BILIBILI_REG, "<div class='video-wrapper'><iframe src='//www.bilibili.com/blackboard/html5mobileplayer.html?bvid=$1&as_wide=1&high_quality=1&danmaku=0' scrolling='no' border='0' frameborder='no' framespacing='0' allowfullscreen='true'></iframe></div>")
        .replace(NETEASE_MUSIC_REG, "<meting-js auto='https://music.163.com/#/song?id=$1'></meting-js>")
        .replace(QQMUSIC_REG, "<meting-js auto='https://y.qq.com/n/yqq/song$1.html'></meting-js>")
        .replace(QQVIDEO_REG, "<div class='video-wrapper'><iframe src='//v.qq.com/iframe/player.html?vid=$1' allowFullScreen='true' frameborder='no'></iframe></div>")
        .replace(YOUKU_REG, "<div class='video-wrapper'><iframe src='https://player.youku.com/embed/$1' frameborder=0 'allowfullscreen'></iframe></div>")
        .replace(YOUTUBE_REG, "<div class='video-wrapper'><iframe src='https://www.youtube.com/embed/$1' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen title='YouTube Video'></iframe></div>")
        .replace(/<a([^>]*?)href="(https?:\/\/(?:www\.)?github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)(?:\.git)?\/?)"([^>]*)>(.*?)<\/a>/gi, (match, beforeHref, href) => {
          const repoInfo = parseGithubRepoUrl(href);
          if (!repoInfo) {
            return match;
          }
          return createGithubRepoCardSkeleton(repoInfo, repoInfo.url);
        })

      //解析 content 内 md 格式图片
      let IMG_ARR = memosData[i].content.match(IMG_REG) || '',IMG_ARR_Grid='';
      if(IMG_ARR){
        let IMG_ARR_Length = IMG_ARR.length,IMG_ARR_Url = '';
        if(IMG_ARR_Length !== 1){let IMG_ARR_Grid = " grid grid-"+IMG_ARR_Length}
        IMG_ARR.forEach(item => {
            let imgSrc = item.replace(/!\[.*?\]\((.*?)\)/g,'$1')
            IMG_ARR_Url += `<figure class="gallery-thumbnail"><img class="img thumbnail-image" loading="lazy" decoding="async" src="${imgSrc}"/></figure>`
        });
        bbContREG += `<div class="resimg${IMG_ARR_Grid}">${IMG_ARR_Url}</div>`
      }

      //解析内置资源文件
      if(memosData[i].resources && memosData[i].resources.length > 0){
        let resourceList = memosData[i].resources;
        let imgUrl='',resUrl='',resImgLength = 0;
        for(let j=0;j < resourceList.length;j++){
          let restype = resourceList[j].type.slice(0,5)
          let resexlink = resourceList[j].externalLink
          // 20240201 filename -> name
          let resLink = resexlink ? resexlink : 
                        AppState.memos+'file/'+(resourceList[j].publicId || resourceList[j].name) +"/"+ resourceList[j].filename + "?thumbnail=1"

          if(restype == 'image'){
            imgUrl += `<figure class="gallery-thumbnail"><img class="img thumbnail-image" src="${resLink}"/></figure>`
            resImgLength = resImgLength + 1 
          }else if(restype == 'video'){
            imgUrl += `<div class="video-wrapper"><video controls><source src="${resLink}" type="video/mp4"></video></div>`
          }else{
            resUrl += `<a target="_blank" rel="noreferrer" href="${resLink}">${resourceList[j].name}</a>`
          }
        }
        if(imgUrl){
          let resImgGrid = ""
          resImgGrid = "grid grid-"+resImgLength          
          bbContREG += `<div class="resimg ${resImgGrid}">${imgUrl}</div>`
        }
        if(resUrl){
          bbContREG += `<p class="bb-source">${resUrl}</p>`
        }
      }
      let memosIdNow = AppState.memos.replace(/https\:\/\/(.*\.)?(.*)\..*/,'id-$2-')
      let emojiReaction = `<emoji-reaction theme="system" class="reaction" endpoint="${AppState.emactionApi}" reacttargetid="${memosIdNow+'memo-'+bbID}" style="line-height:normal;display:inline-flex;"></emoji-reaction>`
      let datacountDOM = ""
      let displayTime = memosData[i].displayTime || memosData[i].updateTime || memosData[i].createTime
      let displayTimeText = new Date(displayTime).toLocaleString()

      result +=  `<div data-id="memo-${bbID}" class="memo-item">
        <div class="bb-item">
          <div class="memo-head">
            <div class="memo-meta">
              <span class="memo-name">${authorName}</span>
              <a class="memo-time-link" href="${memoUrl}" target="_blank" rel="noreferrer">
                <time class="datatime" datetime="${displayTime}">${displayTimeText}</time>
              </a>
            </div>
          </div>
          <div class="bb-cont">
            ${bbContREG}
          </div>
          <div class="memo-foot bb-tool">${emojiReaction}</div>
          <div class="bb-info">
            ${datacountDOM}
          </div>
        </div>
      </div>`
  }// end for
  
  // 检查是否已存在timeline容器
  const existingTimeline = document.querySelector('.bb-timeline');
  let isIncremental = !!existingTimeline;
  
  if (isIncremental) {
    // 增量加载，直接添加新的memo项目
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = result;
    const newItems = tempDiv.querySelectorAll('.memo-item');
    
    newItems.forEach(item => {
      existingTimeline.appendChild(item);
    });

    hydrateGithubRepoCards(existingTimeline);
    
    // 更新按钮文本并重新绑定事件
    const loadBtn = document.querySelector('button.button-load');
    if(loadBtn) {
      loadBtn.classList.remove('loading');
      loadBtn.textContent = '加载更多';
      loadBtn.disabled = false;
      // 移除旧的绑定标记，重新绑定事件
      bindLoadMoreButton(AppState.apiV1);
    }
  } else {
    // 首次加载，创建完整结构
    let bbBefore = "<section class='bb-timeline'>"
    let bbAfter = "</section>"
    resultAll = bbBefore + result + bbAfter
    let loaderDom = document.querySelector('.loader') || ""
    if(loaderDom) loaderDom.remove()
    AppState.bbDom.insertAdjacentHTML('beforeend', resultAll);
    hydrateGithubRepoCards(AppState.bbDom);
    
    // 更新按钮文本并重新绑定事件
    const loadBtn = document.querySelector('button.button-load');
    if(loadBtn) {
      loadBtn.classList.remove('loading');
      loadBtn.textContent = '加载更多';
      loadBtn.disabled = false;
      // 移除旧的绑定标记，重新绑定事件
      bindLoadMoreButton(AppState.apiV1);
    }
  }

  //图片灯箱
  window.ViewImage && ViewImage.init('.bb-cont img')
  //相对时间
  window.Lately && Lately.init({ target: '.datatime' });
  
  const timeline = document.querySelector('.bb-timeline');
  if (timeline) {
    bindImageLoadEvents(timeline);
  }
}

// 移除图片占位样式
function removeImagePlaceholder(img) {
  img.style.backgroundImage = 'none';
  img.style.backgroundColor = 'transparent';
}

// 为新添加的图片绑定加载事件
function bindImageLoadEvents(container) {
  const images = container.querySelectorAll('img');

  images.forEach(img => {
    if (img.complete && img.naturalHeight !== 0) {
      removeImagePlaceholder(img);
    } else {
      img.addEventListener('load', function() {
        removeImagePlaceholder(this);
      }, { once: true });
      
      img.addEventListener('error', function() {
        removeImagePlaceholder(this);
        // 可以在这里设置错误占位图
        this.style.backgroundColor = '#f0f0f0';
        this.style.backgroundImage = 'none';
      }, { once: true });
    }
  });
}

// 使用分类(Tag)筛选
function getTypeOfMemos(e){
  let tagHtml = `<div id="tag-list"></div>`
  AppState.bbDom.insertAdjacentHTML('beforebegin', tagHtml);
  let tagName = e.innerHTML.replace('#','')
  let domClass = document.getElementById("tag-list")
  window.scrollTo({
    top: domClass.offsetTop - 20,
    behavior: "smooth"
  });
  let tagHtmlNow = `<span class='tag-span' onclick='reLoad()'>${e.innerHTML}</span>`
  document.querySelector('#tag-list').innerHTML = tagHtmlNow
  // 标签模式，同时重置页面序列
  AppState.tageFilter = tagName
  fetchMemoDOM(buildMemosUrl({ apiV1: AppState.apiV1, tagName }))
}

async function fetchMemoDOM(bbUrl){
  try {
    AppState.bbDom.innerHTML = loading
    initLoaderAnimation(AppState.bbDom);
    const response = await fetch(bbUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const resdata = await response.json();
    
    if(resdata){
      document.querySelector(bbMemo.domId).innerHTML = ""
      const loadBtn = document.querySelector("button.button-load");
      
      updateHTMl(resdata)

      AppState.offset = resdata.nextPageToken

      if(AppState.offset === '' || !resdata.memos || resdata.memos.length === 0){ // 没有下一项数据，隐藏
          loadBtn.textContent = '没有更多了';
          loadBtn.disabled = true; 
          return
      }

      getNextList(AppState.apiV1)

    }else{
      alert("404 -_-!")
      setTimeout(reLoad(), 1000);
    }
  } catch (error) {
    console.error('获取数据失败:', error);
    renderError(`加载失败：${error.message || '请刷新页面重试'}`);
  }
}

function reLoad(){
  let urlThis = location.protocol + '//' + location.host + location.pathname;
  window.location.replace(urlThis)
}
window.addEventListener('load', () => {
  // 预加载图片
  const imgObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazyload');
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '100px 0px',
    threshold: 0.1
  });
  
  document.querySelectorAll('img.lazyload').forEach(img => {
    imgObserver.observe(img);
  });
});
