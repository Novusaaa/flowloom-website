# 官网维护与交接

维护日期：2026-10-18。产品 Flowloom / 织流，署名 **义乌市亨苑科技有限公司**，联系邮箱 **xianniana@gmail.com**。

## 仓库范围

本仓库公开官网展示代码和静态构建，不包含账号后端、管理系统、数据库、服务器配置或真实凭据。`package.json` 中的 `private:true` 用于防止误发布到 npm，不代表 GitHub 仓库为私有。

- 正式网站：https://flowloom.cc/
- Pages：https://novusaaa.github.io/flowloom-website/
- Pages 发布源：`main` 分支的 `/docs`。
- 登录、工作台、下载、指南等入口连接正式网站；Pages 本身没有 API 服务。
- 影片、封面和品牌下载来自正式站点；字体与随附许可保存在本仓库 `public/assets/`。

## 从哪里修改

| 文件 | 内容 |
| --- | --- |
| `src/Marketing.jsx` | 官网内容、导航、FAQ、影片弹层、公司 / 联系邮箱与 GitHub 链接 |
| `src/marketing.css` | 官网布局、字体、响应式和交互样式 |
| `src/MarketingDemo.jsx` / `marketing-demo.css` | 产品操作动画，不是真实账号或执行接口 |
| `src/Brand.jsx` / `brand.json` | SVG Logo 与产品名 |
| `src/i18n.jsx` / `messages.json` | 简体中文 / English；用户语言保存在浏览器 |
| `src/motion.jsx` / `motion.css` | 通用动画、弹层、焦点和减少动态效果 |
| `src/main.jsx` | 仅挂载官网和弹层，不能替换成完整工作台入口 |
| `index.html` | 标题、描述、canonical、favicon |
| `vite.config.js` | Pages 子目录 base 与构建目录 |

修改公司、邮箱、域名或品牌时，同时检查页脚、README、HTML 元信息和正式站点副本。不要发布没有收信能力的 noreply 地址作为咨询邮箱。

## 本地开发与发布

```sh
npm ci
npm run dev
npm run build
```

需要 Node.js 24+。`npm ci` 按锁文件还原依赖，`npm run build` 生成 `docs/`。Vite 会清空构建目录，**不要把人工交接文档放在 `docs/`**；维护说明放仓库根目录。

提交时包含源码和最新 `docs/`。GitHub Pages 会自动发布分支中的静态输出。检查 Actions 的 Pages 任务成功，再访问公开地址；仅 push 源文件不保证已上线。

生产业务链接使用 `https://flowloom.cc/...`，本页锚点继续使用 `#...`。本地 Logo 首页链接用 `./`，不要误跳 `novusaaa.github.io/` 的用户根目录。迁移仓库名时同步调整 `base`，否则 JS / CSS 会 404。

## 与完整项目同步

完整项目持有人可以从主项目导出，保持网站展示组件一致：

```sh
python outputs/weave/scripts/export-public-website.py --output ../flowloom-website
cd ../flowloom-website
npm ci
npm run build
git diff --stat
```

目标应是这个公开仓库的独立 checkout。导出脚本白名单只复制官网需要的组件、字体与品牌元数据，改写业务链接；不会复制 server、数据库、key 或备份，不会删除本维护文档或 README。首次全新导出还需用 `npm install --ignore-scripts` 生成并提交锁文件；已有仓库优先保留锁文件。

先用 `--check` 可只列出需同步文件，不写入；有差异时退出码为 1。若依赖声明改变，更新锁文件后重新安装和构建。不要通过直接复制完整主项目来公开官网。

## 发布前复核

- 公司名、联系邮箱、正式域名、GitHub 链接准确。
- 首页及 390px 手机宽度可读，无横向溢出；中英切换、菜单、FAQ、演示标签和影片弹层正常。
- 键盘可到达按钮和链接；弹层可关闭、焦点可恢复；减少动态效果偏好不被忽略。
- 登录 / 下载入口指向正式站点，不向 Pages 请求 `/api/...`。
- Logo、字体、封面、视频可加载，控制台没有资源 404；视频仍为无配音动态字幕版。
- 没有提交 `.env`、密钥、Cookie、数据库、用户文档或后台诊断。

公开官网代码不等于后端能力全部上线。当前模型可真实接入，但外部应用动作仍是模拟，模型逐 token 流式输出、高可用和收费没有交付。文案不能把这些待办写成已完成。

## 2026-10-18 搜索与匿名访问口径

官网静态 HTML 含正文、canonical、Open Graph 和分享图，镜像规范地址指向 https://flowloom.cc/。Pages 不提供站点管理后台；真实官网统计读取仅限站点持有人。匿名采集尊重 DNT / GPC，不发送账号、完整来源 URL、查询参数或 hash；接口失败不影响页面使用。正式服务 3.4 尚待发布，在此之前镜像统计请求可能不被采集，不能把预留采集代码写成线上已累计真实流量。

Google 的正式域名 HTML 验证文件只发布在正式站点，不复制到 Pages；验证状态和收录由搜索平台决定。不要将后端部署证据、服务器地址、账号或密钥加入本公开仓库。
