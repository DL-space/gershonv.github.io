---
title: webpack - babel篇
date: 2018-10-11 14:23:24
categories: webpack
tags: webpack
---

> [Babel](https://babeljs.io/docs/en/) 是一个让我们能够使用 ES 新特性的 JS 编译工具，我们可以在 `webpack` 中配置 `Babel`，以便使用 ES6、ES7 标准来编写 JS 代码。

本文以当前最新版本的 [babel - 7.10](https://babeljs.io/docs/en/) 为例， 做 `babel` 的配置. 相关版本号如下

```json
{
  "devDependencies": {
    "@babel/core": "^7.1.6",
    "@babel/plugin-proposal-decorators": "^7.1.6",
    "@babel/plugin-transform-runtime": "^7.1.0",
    "@babel/preset-env": "^7.1.6",
    "@babel/runtime": "^7.1.5",
    "babel-loader": "^8.0.4",
    "webpack": "^4.26.1",
    "webpack-cli": "^3.1.2"
  }
}
```

## babel-loader 和 @babel/core

建立基本的 `webpack` 配置文件

```js
mkdir webpack-babel => cd  webpack-babel => yarn init -y  // 初始化
npm i yarn -g // 安装了yarn可以忽略
yarn add webpack webpack-cli -D

// package.json 中添加：
"scripts": {
  "start": "webpack --mode development",
  "build": "webpack --mode production"
}

yarn add babel-loader @babel/core -D
```

- [yarn](https://www.npmjs.com/package/yarn) : 和 `npm` 几乎一样，本文使用 `yarn` 安装...
- [babel-loader](https://www.npmjs.com/package/babel-loader): 转义 js 文件代码的 loader
- [@babel/core](https://www.npmjs.com/package/@babel/core)：babel 核心库

根目录下添加 `webpack.config.js`

```js
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: { loader: 'babel-loader' } // options 在 .babelrc 定义
      }
    ]
  }
}
```

`src/index.js`

```js
const func = () => {
  console.log('hello webpack')
}
func()

class User {
  constructor() {
    console.log('new User')
  }
}

const user = new User()
```

执行 `yarn build` 后就可以打包成功，打包后的代码是压缩后的。而 `yarn start` 后的代码是未压缩的。为了使代码可读性高一点，我们可以在`webpack.config.js`添加：

```js
module.exports = {
  //...
  devtool: true
}
```

## @babel-preset-env

打包后我们可以发现箭头函数并未转化为 `ES5` 语法！

查阅 [babel plugins](https://babeljs.io/docs/en/plugins) 文档，如果要转义箭头函数，需要使用到 `@babel/plugin-transform-arrow-functions` 这个插件
同理转义 `class` 需要使用 `@babel/plugin-transform-classes`

```
yarn add @babel/plugin-transform-arrow-functions @babel/plugin-transform-classes -D
```

根目录下建立 `.babelrc` 文件：

```js
{
  "plugins": [
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-transform-classes"
  ]
}
```

`yarn build` 之后可以看出 箭头函数和类都被转义了。

但是假如你再使用 `async await` 之类的 `es6` 语法，你还得一个个添加，这是不实际的。

[@babel-preset-env](https://babeljs.io/docs/en/babel-preset-env#docsNav) 就整合了这些语法转义插件：

```js
Using plugins:
transform-template-literals {}
transform-literals {}
transform-function-name {}
transform-arrow-functions {}
transform-block-scoped-functions {}
transform-classes {}
transform-object-super {}
//...
```

使用如下：

```
yarn add @babel-preset-env -D
```

`.babelrc`

```json
{
  "presets": ["@babel/preset-env"]
}
```

## @babel/polyfill

> Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API ，比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign）都不会转码。

这样就导致了一些新的 API 老版浏览器不兼容。如上述所说，对于新的 API，你可能需要引入 `@babel-polyfill` 来进行兼容

```
yarn add @babel-polyfill -D
```

修改 `weboack.config.js`

```js
module.exports = {
  entry: ['@babel-polyfill', './src/index.js']
}
```

`yarn build` 发现文件体积大了很多，因为上面的代码表示将 `@babel-polyfill` 的代码也打包进去了。

当然这不是我们希望的，如何按需编译呢？ 我们可以这么做：

`index.js`

```js
import '@babel/polyfill' // 引入

const func = () => {
  console.log('hello webpack')
}
func()

class User {
  constructor() {
    console.log('new User')
  }
}

const user = new User()

new Promise(resolve => console.log('promise'))

Array.from('foo')
```

还原 `webpack.config.js`

```js
module.exports = {
  entry: './src/index.js'
}
```

修改 `.babelrc`

```json
{
  "presets": [["@babel/preset-env", { "useBuiltIns": "usage" }]]
}
```

`yarn build` 后发现我们的代码体积就变得很小了！

## @babel/runtime 和 @babel/plugin-transform-runtime

- `babel-polyfill` 会污染全局作用域, 如引入 `Array.prototype.includes` 修改了 Array 的原型，除此外还有 String...
- `babel-polyfill` 引入新的对象： `Promise`、`WeakMap` 等

这也不是我们希望出现的。

- `@babel/runtime` 的作用：
  - 提取辅助函数。ES6 转码时，babel 会需要一些辅助函数，例如 \_extend。babel 默认会将这些辅助函数内联到每一个 js 文件里， babel 提供了 transform-runtime 来将这些辅助函数“搬”到一个单独的模块 `babel-runtime` 中，这样做能减小项目文件的大小。
  - 提供 `polyfill`：不会污染全局作用域，但是不支持实例方法如 Array.includes
- `@transform-runtime` 的作用：
  - `babel-runtime` 更像是分散的 `polyfill` 模块，需要在各自的模块里单独引入，借助 transform-runtime 插件来自动化处理这一切，也就是说你不要在文件开头 import 相关的 `polyfill`，你只需使用，`transform-runtime` 会帮你引入。

```
yarn add  @babel/runtime-corejs2
yarn add @babel/plugin-transform-runtime -D
```

修改 `.babelrc`

```json
{
  "presets": ["@babel/preset-env"],
  "plugins": [["@babel/plugin-transform-runtime", { "corejs": 2 }]]
}
```

`index.js` 移除 `import '@babel/polyfill'`

## @babel/plugin-proposal-decorators

添加装饰器模式的支持

```
yarn add @babel/plugin-proposal-decorators -D
```

`index.js`

```js
function annotation(target) {
  target.annotated = true
}

@annotation
class User {
  constructor() {
    console.log('new User')
  }
}
//...
```

`.babelrc`

```json
{
  "presets": ["@babel/preset-env"],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "decoratorsBeforeExport": true }],
    ["@babel/plugin-transform-runtime", { "corejs": 2 }]
  ]
}

```
