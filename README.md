# a-little-room-to-grow

从用户拥有的 ChatGPT 站点导出的原始源码、资产及依赖。此仓库按用户要求设为私有。

| 站点 | 目录 | 类型 | 来源版本 |
|---|---|---|---|
| [A Little Room to Grow · The Cambridge Room](https://a-little-room-to-grow-3d-cambridge.shian493719370.chatgpt.site) | `./a-little-room-to-grow-3d-cambridge` | 静态 HTML / JavaScript | v2 |
| [A little room for hope](https://cambridge-room-for-hope.shian493719370.chatgpt.site) | `./cambridge-room-for-hope` | 静态 HTML / JavaScript | v1 |
| [A Little Room to Grow | Cambridge Pledge](https://a-little-room-to-grow-cambridge.shian493719370.chatgpt.site) | `./a-little-room-to-grow-cambridge` | 静态 HTML / JavaScript | v7 |
| [留一点，给花](https://a-little-room-to-grow.shian493719370.chatgpt.site) | `./a-little-room-to-grow` | 静态 HTML / JavaScript | v2 |

## 本地运行

在 `./a-little-room-to-grow-3d-cambridge` 目录运行 `python3 -m http.server 8000 --directory dist`，然后访问 http://localhost:8000。

在 `./cambridge-room-for-hope` 目录运行 `python3 -m http.server 8000 --directory dist`，然后访问 http://localhost:8000。

在 `./a-little-room-to-grow-cambridge` 目录运行 `python3 -m http.server 8000 --directory dist`，然后访问 http://localhost:8000。

在 `./a-little-room-to-grow` 目录运行 `python3 -m http.server 8000 --directory dist`，然后访问 http://localhost:8000。

## 迁移说明

- 本次操作只把代码和资产上传到 GitHub；没有配置 GitHub Pages，也没有新部署网站。上表链接指向原有 ChatGPT 站点。
- 各站点保留自己的源文件、资产、依赖清单及锁文件（如原项目有提供）；没有把不同项目的依赖合并。仅有 dist 的静态项目保留原有可编辑 HTML/JS/CSS，未声称恢复不存在的上游工程。
- `.openai/hosting.json` 保留原站点关联信息；它不是凭据。不要为其他部署目标直接复用原站点身份。
- React/Vinext 项目保留原来的 Sites 插件和 Cloudflare 配置。迁移到其他服务时可能需要适配插件、登录、服务器路由、环境变量和数据库；不保证在 GitHub Pages 直接运行。
- 玄鉴工作台依赖 Cloudflare D1；需要单独配置数据库、绑定及迁移。未导出生产数据库、用户记录或上传数据。
- 玄龟 AI 解读需要自行配置服务端 `DEEPSEEK_API_KEY`；保留的 `.env.example` 只有变量名称和非敏感默认值。其他密钥应在部署服务的环境设置中配置。
- 没有导出 Git 历史、真实环境变量、短期访问凭据、node_modules、运行时状态或线上私有数据。仅导出选定源码提交中的文件；两处历史验证资料中的原电脑路径如有出现已脱敏，具体见来源清单。
- 第三方素材、模型及依赖沿用原项目的许可与权利归属；没有另外授予开源许可。
- 本次迁移以文件完整性和敏感信息检查为验证范围，没有修改应用代码，也没有重新构建四个框架项目。

文件 SHA-256 与来源提交记录见 [source-provenance.json](source-provenance.json)。
