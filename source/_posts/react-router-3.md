---
title: 'react-router - [译] Code Splitting'
date: 2018-11-07 10:37:40
categories: React
tags: 
  - React
  - react-router
---

> One great feature of the web is that we don’t have to make our visitors download the entire app before they can use it. You can think of code splitting as incrementally downloading the app. To accomplish this we’ll use webpack, @babel/plugin-syntax-dynamic-import, and react-loadable.

`Code Spliting` 的一个重要特性是我们不必让访问者在使用它之前下载整个应用程序。您可以将代码拆分视为逐步下载应用程序。为此，我们将使用 webpack，[@babel/plugin-syntax-dynamic-import](https://www.npmjs.com/package/@babel/plugin-syntax-dynamic-import) 和 [react-loadable](https://www.npmjs.com/package/react-loadable)。

```
yarn add @babel/plugin-syntax-dynamic-import -D
yarn add react-loadable
```

> webpack has built-in support for dynamic imports; however, if you are using Babel (e.g., to compile JSX to JavaScript) then you will need to use the @babel/plugin-syntax-dynamic-import plugin. This is a syntax-only plugin, meaning Babel won’t do any additional transformations. The plugin simply allows Babel to parse dynamic imports so webpack can bundle them as a code split. Your .babelrc should look something like this:

webpack 内置了对动态导入的支持;但是，如果您使用 Babel（例如，将 JSX 编译为 JavaScript），那么您将需要使用 @babel/plugin-syntax-dynamic-import 插件。这是一个仅限语法的插件，这意味着 Babel 不会进行任何其他转换。该插件只允许 Babel 解析动态导入，因此 webpack 可以将它们捆绑为代码拆分。你的.babelrc 应该是这样的：

```json
{
  "presets": ["@babel/react"],
  "plugins": ["@babel/plugin-syntax-dynamic-import"]
}
```

> react-loadable is a higher-order component for loading components with dynamic imports. It handles all sorts of edge cases automatically and makes code splitting simple! Here’s an example of how to use react-loadable:

react-loadable 是一个高阶组件，用于加载具有动态导入的组件。它自动处理各种边缘情况，使代码分割变得简单！以下是如何使用 react-loadable 的示例：

新建 `components/About.jsx` `components/Loading.jsx`:

```jsx
import React from 'react'
import Loadable from 'react-loadable'
import Loading from './components/Loading'

const LoadableComponent = Loadable({
  loader: () => import('./components/About'),
  loading: Loading
})

export default class App extends React.Component {
  render() {
    return <LoadableComponent />
  }
}
```

只需使用 `LoadableComponent`（或任何您命名的组件），当您在应用程序中使用它时，它将自动加载和呈现。`loader` 选项是一个实际加载组件的函数，而 `loading` 是一个占位符组件，用于在实际组件加载时显示。

## Code-splitting + server rendering | 代码分割与服务端渲染

> react-loadable includes a guide for server-side rendering. All you should need to do is include babel-plugin-import-inspector in your .babelrc and server-side rendering should just work™. Here is an example .babelrc file:

`react-loadable` 包括服务器端呈现的指南。您需要做的就是在`.babelrc` 中包含 `babel-plugin-import-inspector`，服务器端渲染应该只是`work™`。这是一个示例`.babelrc` 文件：

```json
{
  "presets": ["@babel/react"],
  "plugins": [
    "@babel/plugin-syntax-dynamic-import",
    [
      "import-inspector",
      {
        "serverSideRequirePath": true
      }
    ]
  ]
}
```

## 相关介绍

[React Loadable - 以组件为中心的代码分割和懒加载](https://www.jianshu.com/p/697669781276)