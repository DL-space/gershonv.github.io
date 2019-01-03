---
title: react - hooks(v16.7)
date: 2018-12-03 15:30:32
categories: React
tags: React
---

## 前言

本文不做概念性的解析，旨在实操 `hooks`，相关资源可以自行谷歌。以下提供相关参考资料：

- [Introducing Hooks](https://reactjs.org/docs/hooks-intro.html)
- [理解 React Hooks](https://juejin.im/post/5be409696fb9a049b13db042)
- [React Hooks 实用指南](https://juejin.im/post/5bffc271e51d454dca3547b1#heading-0) - 大都借鉴这篇文章
- [Hooks 一览](https://juejin.im/post/5bd53d6a51882528382d8108)

<!--more-->

## useState

> `useState` 可以让您的函数组件也具备类组件的 `state` 功能。

```js
/**
 * @state - state的值
 * @setState - 更新state的函数, 接受一个参数值来更新 state
 */
const [state, setState] = useState(initialState)
```

### 案例

```js
import React, { useState } from 'react'

function Base() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}

export default Base
```

值得注意的是，`state` 是对象的话， `setState` 接收什么参数，就更新对象下的所有属性，而不是更新单个属性。

```js
import React, { useState } from 'react'

function Demo2() {
  const [info, setInfo] = useState({
    name: 'guodada',
    age: 22
  })

  return (
    <div>
      <p>name: {info.name}</p>
      <p>age: {info.age}</p>
      <button onClick={() => setInfo({ name: 'Sam' })}>setInfo</button>
    </div>
  )
}
```

`click button` => `info = { name: 'Sam' }`，`age` 丢失。

根据业务需求，我们可以在函数组件中使用多个 `useState`，这里不再进行演示。

## useEffect

`Effect Hook`: 它与 `React Class` 中的 `componentDidMount`，`componentDidUpdate` 和 `componentWillUnmount` 具有相同的用途。模拟的是生命周期

```js
/**
 * @didUpdate - function
 * @[] - 参数2为数组，不加参数或者不写的话任何state 的变化都会执行 didUpdate 函数
 */
useEffect(didUpdate, [])
```

### 案例

```js
class Example extends React.Component {
  state = { count: 0 }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    )
  }
}
```

等同于

```js
import { useState, useEffect } from 'react'

function Example() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = `You clicked ${count} times`
  })

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
```

- 添加第二个参数进行控制
```js
import React, { useState, useEffect } from 'react'

function Example() {
  const [count, setCount] = useState(0)
  const [count2, setCount2] = useState(0)

  useEffect(() => {
    console.log('run useEffect')
  }, [count])  // 只有count 变化时才执行这个 useEffect 函数

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <p>You clicked {count2} times</p>
      <button onClick={() => setCount2(count2 + 1)}>Click me</button>
    </div>
  )
}
```

## useContext

> `useReducer` 是 `useState` 的代提方案。当你有一些更负责的数据时可以使用它。（组件本地的redux）

使用语法如下：

```js
/**
 * @state => your state
 * @dispatch
 *  @param {state} 
 *  @param {action}  
 **/
const [state, dispatch] = useReducer(reducer, initialState)
```

### 案例

```js
import React, { Component, useReducer } from 'react'

function TestUseReducer() {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'update':
          return { name: action.payload }
        default:
          return state
      }
    },
    { name: '' }
  )

  const handleNameChange = e => {
    dispatch({ type: 'update', payload: e.target.value })
  }

  return (
    <div>
      <p>你好：{state.name}</p>
      <input onChange={handleNameChange} />
    </div>
  )
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Hello</h1>
        <h2>Start editing to see some magic happen!</h2>
        <TestUseReducer />
      </div>
    )
  }
}

export default App
```

## useCallback

> `useCallback` 和 `useMemo` 有些相似。它接收一个内联函数和一个数组，它返回的是一个记忆化版本的函数。

使用语法如下：

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a), [a])
```

### 案例

```jsx
import React, { Component, useCallback } from 'react'

function TestUseCallback({ num }) {
  const memoizedCallback = useCallback(
    () => {
      console.log('这里监听 num 值的更新重新做一些操作和计算')
      num.forEach(item => item++ )
      return num
    },
    [num]
  )
  console.log('记忆 num > ', memoizedCallback())
  console.log('原始 num > ', num)
  return null
}

const num1 = [1, 2, 3]
const num2 = [4, 5, 6]

class App extends Component {
  state = { num: num1, count: 0 }

  componentDidMount() {
    setInterval(() => {
      this.setState(state => ({
        count: state.count + 1
      }))
    }, 3000)
  }

  handleChangeNum = () => {
    this.setState({ num: num2 })
  }

  render() {
    const { num } = this.state

    return (
      <div className="App">
        <h1>Hello</h1>
        <h2>Start editing to see some magic happen!</h2>
        <button onClick={this.handleChangeNum}>修改传入的Num值</button>
        <TestUseCallback num={num} />
      </div>
    )
  }
}

export default App
```

## useRef

```js
import React, { useRef } from 'react'

function TestUseRef() {
  const inputEl = useRef(null)
  
  const onButtonClick = () => {
    inputEl.current.focus() // 设置useRef返回对象的值
  }

  return (
    <div>
      <p>TestUseRef</p>
      <div>
        <input ref={inputEl} type="text" />
        <button onClick={onButtonClick}>input聚焦</button>
      </div>
    </div>
  )
}

export default TestUseRef
```