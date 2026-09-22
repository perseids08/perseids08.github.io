# 两人食堂 · 本地 / GitHub Pages 版

一个无需安装依赖、无需后端、无需登录的纯静态点菜网页。HTML、CSS、JavaScript、图片和图标都在此目录内，运行时不依赖外部 CDN。

## 本地打开

保持整个文件夹完整，双击 `index.html`，在浏览器中打开即可。

如果浏览器限制本地文件的存储权限，页面会提示无法保存。此时可在这个目录开启静态预览：

```sh
python3 -m http.server 8080
```

然后打开 `http://localhost:8080`。没有 Python 的话，也可以使用 VS Code 的 Live Server 扩展。两种预览方法任选其一；网页本身不需要构建。

## 使用

1. 点击「添加菜品」，填写菜名、可选介绍，勾选谁会做；两个人都勾选就是「都会做」。
2. 点击菜品右上角铅笔进行编辑；编辑窗口内可以删除菜品。
3. 点击菜品的「＋」选择这一餐想吃的菜；再次点击或点清单中的「×」可以移除。
4. 点击「就吃这些」下单，在「已下的单」中查看。

初次打开时有 6 道可修改的示例菜。删除示例后不会重新补回；删除所有菜品后会显示空菜单。历史订单保留当时的菜名和谁会做，不受之后编辑或删菜影响。

## 数据保存范围

- 菜品和订单保存在**当前浏览器的 localStorage**，刷新页面会保留。
- **你和男朋友使用不同设备或不同浏览器时，数据不会自动同步。** 打开同一 GitHub Pages 地址也不会共享菜单和订单。要共同维护同一份数据，需要之后另加共享后端。
- 同一个浏览器、同一地址的多个标签页会更新显示已保存的数据。
- 清除网站数据、使用隐私模式、切换网址/端口/文件目录，可能导致原有数据不可见或被删除。
- 已有在线版本里的菜品和订单不会自动迁移到此版本。
- 本地新增内容不会上传到 GitHub；发布的是网页代码和初始示例菜单。

## 放到 GitHub Pages

1. 在 GitHub 创建一个仓库；免费个人账号可用公开仓库。
2. 将**本目录内的文件**上传到仓库根目录，保持 `assets` 文件夹的层级。不要再套一层 `github-pages` 文件夹；仓库根目录应直接包含 `index.html`。
3. 打开仓库 **Settings → Pages**。
4. 在 **Build and deployment → Source** 选择 **Deploy from a branch**。
5. 选择 `main`（或实际使用的分支），目录选择 **/ (root)**，点击 **Save**。
6. 发布完成后，打开 Pages 设置中给出的地址。

也可以把此目录内的内容放到仓库 `/docs` 目录，在第 5 步选择 `/docs`。

页面中的资源路径全部使用 `./`，既适用于 `用户名.github.io/`，也适用于 `用户名.github.io/仓库名/`。附带 `.nojekyll`，无需 React、Node.js、数据库或 GitHub Actions 构建脚本。

普通 GitHub Pages 页面公开访问，不带原来在线版本的账号访问限制；浏览器中保存的个人菜单和订单不会随发布上传。

官方说明：[配置 GitHub Pages 发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) · [创建 GitHub Pages 站点](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)。

## 文件说明

- `index.html`：页面结构，双击此文件即可打开。
- `styles.css`：界面和手机适配。
- `app.js`：编辑、选菜、下单等界面操作。
- `storage.js`：本地保存、数据校验和订单快照。
- `menu-data.js`：初始示例菜、图片署名、内置图标。编辑示例菜只影响尚未初始化本地数据的新访客。
- `assets/`：所有本地图片、图标和许可证。
- `.nojekyll`：GitHub Pages 静态发布标记。

菜品图片署名与许可见页面「图片来源」。照片经过缩小、转换为 WebP 和页面裁切，仍遵循原许可。Lucide 图标的 ISC / MIT 许可保存在 `assets/LUCIDE-LICENSE.txt`。
