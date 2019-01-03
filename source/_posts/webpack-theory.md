---
title: webpack - 理论篇
date: 2018-10-11 11:15:56
categories: webpack
tags: webpack
---

## entry

```js
/**
 * @param {String} - String 时 打包为一个文件，默认包名 main.js
 * @param {Array} - Array 时 webpack会把数组里所有文件打包成一个js文件
 * @param {Object} - Object 时 webpack会把对象里的文件分别打包成多个文件
 *
 */
module.exports = {
  entry: './index.js',

  entry: ['./index.js', './about.js'],

  entry: {
    app: './index.js',
    about: './about.js'
  },

  entry: {
    app: './index.js',
    vendors: ['jquery'] // 分离第三方库
  }
}
```
<!--more-->

### vendors 第三方库

// 待补充

## output

> 指示 webpack 如何去输出、以及在哪里输出、输出的格式等

```js
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出文件的目录
    filename: 'js/[name].[chunkhash:8].js', // 打包路径及名称
    chunkFilename: 'js/[name].[chunkhash:8].js' // 按需加载
    // publicPath：文件输出的公共路径，
    //...
  }
}
```

## resolve

> 配置模块如何解析

- `extensions`：自动解析确定的扩展,省去你引入组件时写后缀的麻烦，
- `alias`：非常重要的一个配置，它可以配置一些短路径，
- `modules`：webpack 解析模块时应该搜索的目录，
- ...

```js
module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.json', '.css'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  }
}
```

## module.rules

- `rules`：也就是之前的 loaders，
- `test` ： 正则表达式，匹配编译的文件，
- `exclude`：排除特定条件，如通常会写 `node_modules`，即把某些目录/文件过滤掉，
- `include`：它正好与 `exclude` 相反，
- `use -loader` ：必须要有它，它相当于是一个 `test` 匹配到的文件对应的解析器，`babel-loader`、`style-loader`、`sass-loader`、`url-loader` 等等，
- `use - options`：它与 `loader` 配合使用，可以是一个字符串或对象，它的配置可以直接简写在 `loader` 内一起，它下面还有 `presets`、`plugins` 等属性；

## plugins

// 另一篇文章 webpack - plugins 篇 敬请期待

## devtool

- 控制是否生成，以及如何生成 source map 文件，开发环境下更有利于定位问题，默认 false,
- 当然它的开启，也会影响编译的速度，所以生产环境一定一定记得关闭；
- 常用的值：`cheap-eval-source-map`、`eval-source-map`、`cheap-module-eval-source-map`、`inline-cheap-module-source-map` 等等

```js
devtool: 'eval-source-map' // 原始源代码
```

## webpack-dev-server

- `contentBase` ：告诉服务(dev server)在哪里查找文件，默认不指定会在是当期项目根目录，
- `historyApiFallback`:可以是 boolean、 object，默认响应的入口文件，包括 404 都会指向这里，object 见下面示例：
- `compress`：启用 gzip 压缩，
- `publicPath`：它其实就是 output.publicPath，当你改变了它，即会覆盖了 output 的配置，
- `stats`： 可以自定控制要显示的编译细节信息，
- `proxy`：它其实就是 http-proxy-middleware，可以进行处理一些代理的请求。

```js
const webpack = require('webpack')

module.exports = {
  devServer: {
    contentBase:'./assets',
    port: 1234,
    open: true, // 自动打开浏览器
    compress: true // 服务器压缩
    hot: true // 配合 HotModuleReplacementPlugin 使用
    //... proxy、hot
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}
```

## optimization

- `optimization` 是 `webpack4` 新增的，主要是用来让开发者根据需要自定义一些优化构建打包的策略配置，
- `minimize`：true/false,告诉 webpack 是否开启代码最小化压缩，
- `minimizer`：自定 js 优化配置，会覆盖默认的配置，结合 `UglifyJsPlugin` 插件使用，
- `removeEmptyChunks`: bool 值，它检测并删除空的块。将设置为 false 将禁用此优化，
- `nodeEnv`：它并不是 node 里的环境变量，设置后可以在代码里使用 process.env.NODE_ENV === 'development'来判断一些逻辑，生产环境 `UglifyJsPlugin` 会自动删除无用代码，
- `splitChunks` ：取代了 CommonsChunkPlugin，自动分包拆分、代码拆分，详细默认配置：
- 默认配置，只会作用于异步加载的代码块 —— chunks: 'async'，它有三个值：all,async,initial

```js
module.exports = {
  // 优化构建打包的策略配置
  optimization: {
    minimize: true, // 是否开启代码最小化压缩 默认 false
    //splitChunks 默认配置
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
}
```

### 配合 UglifyJsPlugin

```js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  // 优化构建打包的策略配置
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true, // 开启缓存
        parallel: true, // 开启多线程编译
        sourceMap: true, // 是否sourceMap
        uglifyOptions: {
          // 丑化参数
          comments: false,
          warnings: false,
          compress: {
            unused: true,
            dead_code: true,
            collapse_vars: true,
            reduce_vars: true
          },
          output: {
            comments: false
          }
        }
      })
    ]
  }
}
```

## 参考

- [webpack4 配置详解之慢嚼细咽](https://juejin.im/post/5be64a7bf265da615304493e#heading-9)
