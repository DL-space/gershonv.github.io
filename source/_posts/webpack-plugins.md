---
title: webpack-plugins
date: 2018-10-12 21:43:08
categories: webpack
tags: webpack
---

## 功能类

### html-webpack-plugin

- 把编译后的文件（css/js）插入到入口文件中，可以只指定某些文件插入，可以对 html 进行压缩等
- `filename`：输出文件名；
- `template`：模板文件，不局限于 html 后缀哦；
- `removeComments`：移除 HTML 中的注释；
- `collapseWhitespace`：删除空白符与换行符，整个文件会压成一行；
- `inlineSource`：插入到 html 的 css、js 文件都要内联，即不是以 link、script 的形式引入；
- `inject`：是否能注入内容到 输出 的页面去；
- `chunks`：指定插入某些模块；
- `hash`：每次会在插入的文件后面加上 hash ，用于处理缓存，如：；
  其他：favicon、meta、title ……；

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出文件的目录
    filename: 'js/[name].[hash:8].js' // 打包路径及名称
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 生成文件名
      template: './public/index.html', // 配置要被编译的html文件
      hash: true,
      // 压缩HTML文件
      minify: {
        removeAttributeQuotes: true, //删除双引号
        collapseWhitespace: true //折叠 html 为一行
      }
    })
  ]
}
```

传送门 ==> [html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin)

### clean-webpack-plugin

> 在编译之前清理指定目录指定内容。

```js
const CleanWebpackPlugin = require('clean-webpack-plugin')
module.exports = {
  plugins: [new CleanWebpackPlugin(['dist'])]
}

// 指定清除哪些文件 new CleanWebpackPlugin(pathsToClean [, {pathsToClean }]) 详情请看 npm
```

传送门 ==> [clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin)

### copy-webpack-plugin

```js
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  plugins: [new CopyWebpackPlugin([...patterns], options)]
}
```

传送门 ==> [copy-webpack-plugin](https://www.npmjs.com/package/copy-webpack-plugin)

### compression-webpack-plugin

> 使用 compression-webpack-plugin 插件进行压缩，提供带 `Content-Encoding` 编码的压缩版的资源。

```js
const CompressionPlugin = require('compression-webpack-plugin')
module.exports = {
  plugins: [
    new CompressionPlugin({
      filename: '[path].gz[query]', //目标资源名称。[file] 会被替换成原资源。[path] 会被替换成原资源路径，[query] 替换成原查询字符串
      algorithm: 'gzip', //算法
      test: /\.js(\?.*)?$/i, //压缩 js
      deleteOriginalAssets: true, // 删除源文件
      threshold: 10240, //只处理比这个值大的资源。按字节计算
      minRatio: 0.8 //只有压缩率比这个值小的资源才会被处理
    })
  ]
}
```

传送门 ==> [compression-webpack-plugin](https://www.npmjs.com/package/compression-webpack-plugin)

### webpack-manifest-plugin

> 该插件可以显示出编译之前的文件和编译之后的文件的映射

```js
const ManifestPlugin = require('webpack-manifest-plugin')
module.exports = {
  plugins: [new ManifestPlugin()]
}
```

传送门 ==> [webpack-manifest-plugin](https://www.npmjs.com/package/webpack-manifest-plugin)

### progress-bar-webpack-plugin

> 编译进度条插件

```js
const ProgressBarPlugin = require('progress-bar-webpack-plugin') // 编译进度条插件
module.exports = {
  plugins: [new ProgressBarPlugin()]
}
```

传送门 ==> [progress-bar-webpack-plugin](https://www.npmjs.com/package/progress-bar-webpack-plugin)

## 代码相关

### webpack.ProvidePlugin

> 自动加载模块，而不必到处 import 或 require 。

```js
const webpack = require('webpack')
module.exports = {
  plugins: [new webpack.ProvidePlugin({ $: 'jquery' })]
}

// index.js
console.log($)
```

传送门 ==> [webpack.ProvidePlugin](https://www.webpackjs.com/plugins/provide-plugin/)

### webpack.DefinePlugin

> `DefinePlugin` 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。如果在开发构建中，而不在发布构建中执行日志记录，则可以使用全局常量来决定是否记录日志。这就是 `DefinePlugin` 的用处，设置它，就可以忘记开发和发布构建的规则。

```js
module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true)
    })
  ]
}

// index.js
console.log(PRODUCTION) // true
```

传送门 ==> [webpack.DefinePlugin](https://www.webpackjs.com/plugins/define-plugin/)

### mini-css-extract-plugin

`mini-css-extract-plugin`，它默认就会对你的样式进行模块化拆分。相对 `extract-text-webpack-plugin`。 即 css 异步按需加载

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 抽取 css 到独立文件

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, 'src')],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../' // chunk publicPath
            }
          },
          'css-loader'
        ]
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:8].css', //这里配置跟output写法一致
      chunkFilename: 'css/[id][chunkhash:8].css'
    })
  ]
}
```

传送门 ==> [mini-css-extract-plugin](https://www.npmjs.com/package/mini-css-extract-plugin)

## 编译结果优化类

### wbepack.IgnorePlugin

防止在 import 或 require 调用时，生成以下正则表达式匹配的模块：

- `requestRegExp` 匹配(test)资源请求路径的正则表达式。
- `contextRegExp` （可选）匹配(test)资源上下文（目录）的正则表达式。

moment 2.18 会将所有本地化内容和核心功能一起打包（见该 [GitHub issue](https://github.com/moment/moment/issues/2373)）。你可使用 IgnorePlugin 在打包时忽略本地化内容:

```js
new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
```

传送门 ==> [wbepack.IgnorePlugin](https://www.webpackjs.com/plugins/ignore-plugin/)

### uglifyjs-webpack-plugin

- js 代码压缩,默认会使用 `optimization.minimizer`，
- `cache`: Boolean/String ,字符串即是缓存文件存放的路径；
- `test`：正则表达式、字符串、数组都可以，用于只匹配某些文件，如：/.js(?.\*)?\$/i;
- `parallel` : 启用多线程并行运行来提高编译速度，经常编译的时候听到电脑跑的呼呼响，可能就是它干的，哈哈～；
- `output.comments` ： 删除所有注释，
- `compress.warnings` ：插件在进行删除一些无用代码的时候，不提示警告，
- `compress.drop_console`：喜欢打 console 的同学，它能自动帮你过滤掉，再也不用担心线上还打印日志了；

```js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true, // 开启缓存
        parallel: true, // 开启多线程编译
        sourceMap: true, // 是否sourceMap
        // 丑化参数
        uglifyOptions: {
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

传送门 ==> [uglifyjs-webpack-plugin](https://www.npmjs.com/package/uglifyjs-webpack-plugin)

### optimize-css-assets-webpack-plugin

它的作用在于压缩 css 文件

- `assetNameRegExp`：默认是全部的 css 都会压缩，该字段可以进行指定某些要处理的文件，
- `cssProcessor`：指定一个优化 css 的处理器，默认 cssnano，
- `cssProcessorPluginOptions`：cssProcessor 后面可以跟一个 process 方法，会返回一个 promise 对象，而 cssProcessorPluginOptions 就是一个 options 参数选项！
- `canPrint`：布尔，是否要将编译的消息显示在控制台，没发现有什么用！
- 坑点 ：建议使用高版本的包，之前低版本有遇到样式丢失把各浏览器前缀干掉的问题，

```js
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin') // 丑化 css
module.exports = {
  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin({
        cssProcessor: require('cssnano'), // css 压缩优化器
        cssProcessorOptions: { discardComments: { removeAll: true } } // 去除所有注释
      })
    ]
  }
}
```

传送门 ==> [optimize-css-assets-webpack-plugin](https://www.npmjs.com/package/optimize-css-assets-webpack-plugin)

### SplitChunksPlugin

`webpack` 把 `chunk` 分为两种类型，一种是初始加载 `initial chunk`，另外一种是异步加载 `async chunk`，如果不配置 ` SplitChunksPlugin，``webpack ` 会在 production 的模式下自动开启，默认情况下，`webpack` 会将 `node_modules` 下的所有模块定义为异步加载模块，并分析你的 `entry`、动态加载（`import()`、require.ensure）模块，找出这些模块之间共用的 `node_modules` 下的模块，并将这些模块提取到单独的 `chunk` 中，在需要的时候异步加载到页面当中，其中默认配置如下：

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async', // 异步加载chunk
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~', // 文件名中chunk分隔符
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/, //
          priority: -10
        },
        default: {
          minChunks: 2, // 最小的共享chunk数
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
}
```

传送门 ==> [SplitChunksPlugin](https://www.webpackjs.com/plugins/split-chunks-plugin/)

### webpack.HotModuleReplacementPlugin

热更新, 配合 `webpack-dev-server` 使用

```js
yarn add webpack-dev-server -D
```

```js
new webpack.HotModuleReplacementPlugin()

module.exports = {
  devServer: {
    port: 1234,
    open: true, // 自动打开浏览器
    compress: true, // 服务器压缩
    hot: true // 开启热加载
    //... proxy、hot
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
}

// index.js

if (module.hot) {
  module.hot.accept()
}
```

- 传送门 ==> [devServer](https://www.webpackjs.com/configuration/dev-server/)
- 传送门 ==> [webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server)

## 加快编译速度

### DllPlugin && DllReferencePlugin && autodll-webpack-plugin

`DllPlugin` 和 `DllReferencePlugin` 提供分离包的方式可以大大提高构建时间性能。主要思想在于，将一些不做修改的依赖文件，提前打包，这样我们开发代码发布的时候就不需要再对这部分代码进行打包。从而节省了打包时间。

DllPlugin 插件：用于打包出一个个单独的动态链接库文件。
DllReferencePlugin 插件：用于在主要配置文件中去引入 DllPlugin 插件打包好的动态链接库文件。

- `DllPlugin`
  - `context (optional)`: manifest 文件中请求的上下文(context)(默认值为 webpack 的上下文(context))
  - `name`: 暴露出的 DLL 的函数名 (TemplatePaths: [hash] & [name] )
  - `path`: manifest json 文件的绝对路径 (输出文件)

`DllReferencePlugin`: 这个插件把只有 dll 的 bundle(们)(dll-only-bundle(s)) 引用到需要的预编译的依赖。

- `DllReferencePlugin`
  - `context`: (绝对路径) manifest (或者是内容属性)中请求的上下文
  - `manifest`: 包含 content 和 name 的对象，或者在编译时(compilation)的一个用于加载的 JSON manifest 绝对路径
  - `content (optional)`: 请求到模块 id 的映射 (默认值为 manifest.content)
  - `name (optional)`: dll 暴露的地方的名称 (默认值为 manifest.name) (可参考 externals)
  - `scope (optional)`: dll 中内容的前缀
  - `sourceType (optional)`: dll 是如何暴露的 (libraryTarget)

```js
```

传送门 ==> [DllPlugin](https://www.webpackjs.com/plugins/dll-plugin/)
