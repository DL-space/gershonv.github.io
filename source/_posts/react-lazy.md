---
title: react - lazy(v16.6)
date: 2018-11-26 17:31:09
categories: React
tags: React
---

## 动态 import

在 [Code-Splitting](https://reactjs.org/docs/code-splitting.html#import) 部分，提出拆分组件的最佳方式（best way） 是使用动态的 import 方式。

比如下面两种使用方式的对比：

```js
// 之前
import { add } from './math'

console.log(add(16, 26))

// 之后
import('./math').then(math => {
  console.log(math.add(16, 26))
})
```

可以发现动态 `import` 提供了 `Promise` 规范的 API，比如 `.then()`

<!--more-->

## demo

动态 `import` 主要应用场景是延迟加载方法，对于组件来说，并不是很适用，但是 `React.lazy` 对于组件的加载则是有比较大的帮助。

> `React.lazy` 和 `suspense` 并不适用于服务端渲染

```jsx
import React, { Component, lazy, Suspense } from 'react'

const MyComponent = lazy(() => import('./MyComponent'))

class App extends Component {
  render() {
    // lazy 需要配合 Suspense 使用
    // Suspense 使用的时候，fallback 一定是存在且有内容的， 否则会报错。
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <MyComponent />
      </Suspense>
    )
  }
}
export default App
```

## 实现 lazy-load

```jsx
import React from 'react'
import NProgress from 'nprogress'

export default loadComponent =>
  class AsyncComponent extends React.Component {
    state = { Component: null }

    async componentDidMount() {
      if (this.state.Component !== null) return
      NProgress.start()
      try {
        const { default: Component } = await loadComponent()
        this.setState({ Component })
      } catch (err) {
        console.error(`Cannot load component in <AsyncComponent />`)
        throw err
      }
      NProgress.done()
    }

    render() {
      const { Component } = this.state
      return Component ? <Component {...this.props} /> : null
    }
  }
```

## react-loadable （router4 推荐）

[react-router - [译] Code Splitting](https://gershonv.github.io/2018/11/07/react-router-3/)

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
