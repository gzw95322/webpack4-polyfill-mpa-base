# 基于webpack4多页面打包项目架构

## 介绍

- master分支为公共的基础文件, 包括基本的模板, js, css. 
- 项目已做兼容处理, 可兼容到ie7, (es6新语法已经转义, 但是es6新API需要使用corejs处理，tmpl不支持es6)
- 项目为多页面多页面打包, 配置见`webpack.base.conf.js`，配置文件在config/file.generate.config.js
- 公共模板使用ejs
- jquery版本为`1.8.3`, 最好使用`require("")`方式来做全局引用, 同时尽量用`$`来替换`jQuery`
- 添加mock功能.
- 支持ts

## 项目结构
``` bash
│  .editorconfig
│  .gitignore
│  jsconfig.json
│  package.json
│  postcss.config.js
│  README.md
│  webpack.base.conf.js
│  webpack.dev.conf.js
│  webpack.prod.conf.js
│
├─dist
│  │  detail.html
│  │  dialog.html
│  │
│  ├─css
│  │      detail.845b13c.css
│  │      dialog.845b13c.css
│  │
│  ├─img
│  │      icon-ext.ba81b24.png
│  │      icon.551539f.png
│  │      loading-0.a72011c.gif
│  │      loading-2.50c5e3e.gif
│  │      loading.0e6e0f4.gif
│  │      logo.b289188.png
│  │
│  ├─js
│  │      detail.845b13c.js
│  │      detail.845b13c.js.LICENSE
│  │      dialog.845b13c.js
│  │      jquery.845b13c.js
│  │      jquery.845b13c.js.LICENSE
│  │
│  └─static
│          es5-sham.min.js
│          es5-shim.min.js
│          jquery.pager.js
│
└─src // 开发环境
    ├─assets // 多媒体资源
    │      loading.gif
    │      logo.png
    │
    ├─constants // 常量
    │  │─utils // 工具方法
    │  │        jqueryModule.js
    │  └─config // 配置文件
    ├─pages // 具体页面
    │  ├─detail
    │  │  │  index.ejs
    │  │  │  index.js
    │  │  │  index.scss
    │  │  │
    │  │  └─tpl  // 模板文件
    │  │          panel.ejs
    │  │
    │  └─dialog
    │          index.ejs
    │          index.js
    │          index.scss
    │
    ├─public // 公共文件
    │      style.css // 公共样式
    │      footer.ejs
    │      header.ejs
    │
    └─static // 项目静态引用文件, 不会做打包处理
            es5-sham.min.js
            es5-shim.min.js
            jquery.pager.js

```

## TODO

- ~~typescript支持~~✔️
- ~~eslint支持~~✔️
- ~~terminal错误提示美化~~✔️ 
- ~~templatejs-loader支持~~✔️
- ~~mock支持~~✔️