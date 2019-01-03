---
title: react - PureComponent 和 memo
date: 2018-11-26 15:58:36
categories: React
tags: React
---

## setState 数据无改变， 组件会重新 render

```jsx
import React, { Component } from 'react'

class MyComponent extends Component {
  render() {
    console.log('render')
    return null
  }
}

class App extends Component {
  state = { num: 1 }

  handleClick = () => {
    this.setState({ num: 1 }) // setState 但是不改变 num
  }

  render() {
    return (
      <div>
        <MyComponent num={this.state.num} />
        <button onClick={this.handleClick}>click</button>
      </div>
    )
  }
}
export default App
```

点击按钮，`setState` 后 `num` 并未发生改变， 但是组件 `MyComponent` 仍然会重新渲染，这就会导致一部分性能的消耗。

我们可以使用 `shouldComponentUpdate(nextProps, nextState)` 来决定组件的渲染与否，也可以使用 react 提供的两个 API

<!--more-->

## React.PureComponent

`pure` 是纯的意思， `PureComponent` 也就是纯组件, 只要把继承类从 `Component` 换成 `PureComponent` 即可，可以减少不必要的 `render` 操作的次数，从而提高性能。

`PureComponent` 主要作用于类组件，而 `memo` 主要作用于函数组件。

> `React.PureComponent` 使用 `prop` 和 `state` 的浅比较来决定是否 `render` 组件。（我们就不需要在 `shouldComponentUpdate` 中写一大段代码了！）

使用方法极其简单（以上面的代码为例）：

```jsx
import React, { Component, PureComponent } from 'react'

class MyComponent extends PureComponent {
  render() {
    console.log('render')
    return null
  }
}

// ... App
```

### 注意

在不可变数据类型（数组、对象等等）`PureComponent` 是不生效的！因为它的引用地址并未发生改变。做一个 demo:

```jsx
import React, { Component, PureComponent } from 'react'

class MyComponent extends PureComponent {
  render() {
    console.log('render')
    return this.props.nums
  }
}

class App extends Component {
  state = { nums: [1, 2, 3] }

  handleClick = () => {
    const { nums } = this.state
    nums.pop()
    this.setState({ nums })
  }

  render() {
    return (
      <div>
        <MyComponent nums={this.state.nums} />
        <button onClick={this.handleClick}>click</button>
      </div>
    )
  }
}
export default App
```

这里无论如何点击按钮，`MyComponent` 也不会重新渲染。具体比较过程是这样的：

```jsx
class MyComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    // nums 引用是一样的，所以 this.props.nums 等于 nextProps.nums，结果永远返回 false，组件不会重新渲染！
    return this.props.nums !== nextProps.nums
  }

  render() {
    console.log('render')
    return this.props.nums
  }
}
```

## React.memo

`React.memo` 是一个高阶组件。它与 `React.PureComponent` 类似，但是对于函数组件而不是类。

```jsx
import React, { Component, memo } from 'react'

const MyComponent = memo(props => {
  console.log('redner')
  return null
})

// ... App
```

如果你的函数组件在给定相同的道具的情况下呈现相同的结果，则可以 `React.memo` 通过记忆结果将其包装在一些调用中以提高性能。这意味着 `React` 将跳过渲染组件，并重用最后渲染的结果。

默认情况下，它只会浅显比较 `props` 对象中的复杂对象。如果要控制比较，还可以提供自定义比较功能作为第二个参数。

```jsx
function MyComponent(props) {
  /* render using props */
}
function areEqual(prevProps, nextProps) {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
}
export default React.memo(MyComponent, areEqual)
```

此方法仅作为性能优化存在。不要依赖它来“防止”渲染，因为这可能导致错误。
