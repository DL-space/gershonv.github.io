---
title: react-router-动态路由
date: 2018-11-08 15:59:59
categories: React
tags: 
  - React
  - react-router
---

## 动态组件

### webpack 的 import 方法

`webpack` 将 `import()`看做一个分割点并将其请求的 `module` 打包为一个独立的 `chunk`。`import()`以模块名称作为参数名并且返回一个 `Promise` 对象。

### 采用适配器模式封装 import()

> 适配器模式（Adapter）:将一个类的接口转换成客户希望的另外一个接口。Adapter 模式使得原本由于接口不兼容而不能一起工作的那些类可以一起工作。

当前场景，需要解决的是，使用 `import()`异步加载组件后，如何将加载的组件交给 `React` 进行更新。
方法也很容易，就是利用 `state`。当异步加载好组件后，调用 `setState` 方法，就可以通知到。
那么，依照这个思路，新建个高阶组件，运用适配器模式，来对 `import()`进行封装。

```jsx
import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

function asyncComponent(importComponent) {
  class AsyncComponent extends Component {
    constructor(props) {
      super(props)
      this.state = {
        component: null
      }
    }
    async componentDidMount() {
      const { default: component } = await importComponent()
      this.setState({
        component: component
      })
    }
    render() {
      const RenderComponet = this.state.component
      return RenderComponet ? <RenderComponet {...this.props} /> : <div>loading...</div>
    }
  }
  return AsyncComponent
}

const NoFound = asyncComponent(() => import('./components/NoFound'))

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={() => <h2>Home</h2>} />
          <Route component={NoFound} />
        </Switch>
      </Router>
    )
  }
}
export default App
```

## 基于 react-loadable 实现代码分割

react-router v4 发生了巨大改变，由静态路由开始转向动态路由，从此，就像使用普通组件一样来声明路由。其实，路由从此就是一个普通组件。

路由的按需加载的实质是代码分割,`react-router` 官网有个代码拆分的示例，是基于 ~~bundle-loader~~ 实现的.现在官网的代码已经改为基于`react-loadable` 实现。

按照上述方法，已经实现了代码分割。然而，`react-loadable` 为我们提供了更好的解决方案。`react-loadable` 核心实现原理也是通过 `dynamic import` 来实现组件的异步加载。在此基础上，它提供了更为强大的功能，如根据延迟时间确定是否显示 `loading` 组件、预加载、支持服务端渲染等。

在另一篇译文- [[译] react-router Code Splitting](https://gershonv.github.io/2018/11/07/react-router-3/)中，我也写过了 react-loadable 的用法介绍，详情可以查看这篇文章。

```jsx
import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Loadable from 'react-loadable'

const NoFound = Loadable({
  loader: () => import('./components/NoFound'),
  loading: <div>loading</div>
})

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={() => <h2>Home</h2>} />
          <Route component={NoFound} />
        </Switch>
      </Router>
    )
  }
}
export default App
```

## 参考

- [React router 动态加载组件-适配器模式的应用](https://blog.segmentfault.net/a/1190000016362502#articleHeader1)
- [react 扬帆起航之路由配置与组件分割](https://blog.segmentfault.net/a/1190000013589728)
