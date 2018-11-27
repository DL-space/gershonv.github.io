---
title: react - 生命周期
date: 2018-07-29 21:20:13
categories: React
tags: React
toc: true
comments: true
---

## v16.3+

- Mounting
  - constructor(props)
  - static getDerivedStateFromProps(props, state)
  - render()
  - componentDidMount()
- Updating
  - static getDerivedStateFromProps()
  - shouldComponentUpdate(nextProps, nextState)
  - render()
  - getSnapshotBeforeUpdate(prevProps, prevState)
  - componentDidUpdate(prevProps, prevState, snapshot)

### constructor(props)

React 组件的构造函数在安装之前被调用。在为 React.Component 子类实现构造函数时，应该在任何其他语句之前调用 `super(props)`。
否则，`this.props` 将在构造函数中未定义，这可能导致错误。

Avoid copying props into state! This is a common mistake:

```js
constructor(props) {
 super(props)
 // Don't do this!
 this.state = { color: props.color }
}
```

### static getDerivedStateFromProps(nextProps, prevState)

`props / state` 改变时触发，需要返回一个对象或者 `null`，相当于 `setState`

- demo

```js
static getDerivedStateFromProps(nextProps, prevState){
  if (nextProps.sum !== this.props.sum) return { sum: nextProps.sum } // 类似于 setState({ sum: nextProps.sum })
  return null
}
```

### render()

```js
render(){
  // don't do this
  this.setState({ num: 12 })
  return null
}

```

### componentDidMount()

组件挂载后。

### shouldComponentUpdate(nextProps, nextState)

```js
shouldComponentUpdate(nextProps, nextState)
```

return true / false 来决定是否重新 render

### getSnapshotBeforeUpdate(prevProps, prevState)

相当于 `componentWillUpdate`

### componentDidUpdate(prevProps, prevState, snapshot)

更新后 - 这里谨慎使用 setState()

## v16.3 以下

```jsx
import React, { Component } from 'react'

/**
 *
 * 挂载数据：
 * @example constructor => componentWillMount => render => componentDidMount
 *
 * 数据变化：
 * @example props change: componentWillReceiveProps => shouldComponentUpdate => componentWillUpdate => render => componentDidUpdate
 * @example state change: shouldComponentUpdate => componentWillUpdate => componentDidUpdate
 *
 */
class LifeCycle extends React.Component {
  constructor() {
    super() // 声明constructor时必须调用super方法
    this.state = {
      subNum: 2
    }
    console.log('01 constructor')
  }

  componentWillMount() {
    console.log('02 componentWillMount')
  }

  componentDidMount() {
    console.log('04 componentDidMount')
  }

  componentWillReceiveProps(nextProps) {
    console.log('05 componentWillReceiveProps')
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('06 shouldComponentUpdate')
    return true // 记得要返回true
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('07 componentWillUpdate')
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('08 componentDidUpdate')
  }

  componentWillUnmount() {
    console.log('09 componentWillUnmount')
  }

  changeState = () => {
    this.setState(prevState => ({
      subNum: ++prevState.subNum
    }))
  }

  render() {
    return (
      <div>
        <button onClick={this.changeState}>change state</button>
        <h2>{this.state.subNum}</h2>
      </div>
    )
  }
}

class App extends Component {
  state = {
    num: 1
  }

  changeProps = () => {
    // this.setState((prevState, props) => ({}))
    this.setState(prevState => ({
      num: ++prevState.num
    }))
  }

  render() {
    return (
      <div>
        <button onClick={this.changeProps}>change props</button>
        <hr />
        <LifeCycle num={this.state.num} />
      </div>
    )
  }
}

export default App
```
