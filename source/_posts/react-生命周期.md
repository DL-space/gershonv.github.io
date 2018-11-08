---
title: react 生命周期
date: 2018-08-07 22:42:05
categories: React
tags: React
toc: true
comments: true
---

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
