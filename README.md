# 👏look here
这是一个快速批量打开网站的项目，该项目基于Vite + Vue3 + Element Plus

你可以快速体验该项目, 通过链接[快速批量打开网站](https://fast.ganto.cn)

当然也可以直接运行该项目

首先clone项目
```shell
git clone https://github.com/gantoho/fast_project.git
```

安装依赖
```shell
yarn
```

运行
```shell
yarn dev
```

## 黑白风格强制切换

### CLI 切换（推荐，无需启动后端）

```shell
# 切换开/关
npm run theme-toggle
```

修改 [public/theme.config.json](public/theme.config.json) 中的 `forceMonochrome` 字段，刷新页面即可生效。

### 后端服务切换

启动后端服务，提供 HTTP API 进行运行时切换：

```shell
# 安装后端依赖（首次）
cd server && npm install

# 启动后端服务（端口 3500，开发模式已配置 Vite 代理）
npm run theme-server
```

**API 接口（均为 GET，浏览器地址栏可直接调用）：**

- `GET /api/theme/config` — 读取当前配置
- `GET /api/theme/toggle` — 切换强制黑白
- `GET /api/theme/set?forceMonochrome=true` — 开启强制黑白
- `GET /api/theme/set?forceMonochrome=false` — 关闭强制黑白

### 快捷键

`Ctrl + Shift + B` — 前端运行时切换（需要后端服务运行）

### GitHub Actions（无需本地操作）

项目已配置 GitHub Actions 工作流，在 GitHub 仓库页面可直接切换，无需本地克隆或启动后端：

1. 打开仓库 → **Actions** 选项卡
2. 在左侧找到 **切换黑白强制模式**
3. 点击 **Run workflow** 按钮
4. 选择 `true`（开启）或 `false`（关闭）
5. 点击 **Run workflow** 提交

工作流会自动修改 `public/theme.config.json` 并推送到仓库，部署到 GitHub Pages 后自动生效。

### GitHub Issues 触发（仅仓库作者）

提 Issue 即可触发切换，无需进入 Actions 页面：

1. 打开仓库 → **Issues** 选项卡 → **New issue**
2. 标题填写关键词（仅作者提交的 Issue 生效）：
   - `开启黑白` / `true` — 强制开启黑白风格
   - `关闭黑白` / `false` — 恢复风格选择
3. 无需填写正文，直接提交

工作流会自动完成修改、推送，并在 Issue 中回复结果后关闭。

```
localStorage.setItem('fast_forceMonochrome', 'true')
location.reload()

localStorage.setItem('fast_forceMonochrome', 'false')
location.reload()
```

> 如果该项目还不错，可以star该项目
