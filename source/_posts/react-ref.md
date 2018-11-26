---
title: react - Ref
date: 2018-11-26 13:36:56
categories: React
tags: React
---

## 什么时候使用 Refs

下面是几个使用 `Refs` 的示例：

- 管理焦点状态(focus)、文本选择(text selection)、或者是媒体播放(media)
- 强制触发动画
- 与第三方的 DOM 库集成

在任何能够通过直接声明完成的事情中应当避免使用 `Refs`。
例如，对于一个 `Dialog` 组件，应当提供一个 `isOpen` 的 `prop` 来控制它，而不是暴露`open()`和 `close()`两个方法去操作。

使用方法：

`Refs` 是使用 `React.createRef()` 创建的，并通过 `ref` 属性附加到 `React` 元素。在构造组件时，通常将 `Refs` 分配给实例属性，以便可以在整个组件中引用它们。

## 在 DOM 元素中使用

> 当在 `refHTML` 元素上使用该属性时，`ref` 在构造函数中创建的属性将 `React.createRef()`接收底层 `DOM` 元素作为其 `current` 属性。

```js
import React, { Component } from 'react'

class App extends Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }

  componentDidMount() {
    this.inputRef.current.focus()
  }

  render() {
    return <input type="text" ref={this.inputRef} />
  }
}

export default App
```

## 在类组件中使用

> 在 `ref` 自定义类组件上使用该属性时，该 `ref` 对象将接收组件的已安装实例作为其 `current`。

```jsx
import React, { Component } from 'react'

class MyComponent extends Component {
  state = { name: 'guodada' }

  render() {
    return null
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef()
  }

  componentDidMount() {
    const MyComponent = this.myRef.current // MyComponent 实例 : MyComponent.state = { name: 'guodada' }
  }

  render() {
    return <MyComponent ref={this.myRef} />
  }
}

export default App
```

## 在函数组件中使用

> 您可能无法 `ref` 在函数组件上使用该属性，因为它们没有实例。

```jsx
import React from 'react'

function MyFunctionComponent() {
  return <input />
}

class Parent extends React.Component {
  constructor(props) {
    super(props)
    this.textInput = React.createRef()
  }
  render() {
    // This will *not* work!
    return <MyFunctionComponent ref={this.textInput} />
  }
}

export default Parent
```

但是，只要引用 `DOM` 元素或类组件，就可以在函数组件中使用该 `ref` 属性：

```jsx
import React, { Component } from 'react'

function MyFunctionComponent() {
  let textInput = React.createRef()

  function handleClick() {
    textInput.current.focus()
  }

  return (
    <div>
      <input ref={textInput} />
      <button onClick={handleClick}>focus</button>
    </div>
  )
}

export default MyFunctionComponent
```
## Callback Refs （推荐使用）

> `React` 还支持另一种设置名为 `callback refs` 的引用的方法，它可以在设置和取消设置引用时提供更细粒度的控制。

```jsx
import React, { Component } from 'react'

class MyComponent extends Component {
  state = { name: 'guodada' }

  render() {
    return null
  }
}

class App extends Component {
  componentDidMount() {
    this.inputRef.focus() // 注意 这里没使用 current
    console.log(this.myRef.state) // 同理这里也不使用 current
  }

  render() {
    return (
      <div>
        <input type="text" ref={el => this.inputRef = el} />
        <MyComponent ref={el => this.myRef = el} />
      </div>
    )
  }
}

export default App
```

## Ref forwarding（转发 ref）

> `Ref forwarding` 是一种自动将 `ref` 通过组件传递给其子节点的技术。对于应用程序中的大多数组件，这通常不是必需的。但是，它对某些类型的组件很有用，特别是在可重用的组件库中。

```jsx
import React from 'react'

const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
))

class App extends React.Component {
  constructor(props) {
    super(props)
    this.buttonRef = React.createRef()
  }

  componentDidMount() {
    const FancyButton = this.buttonRef.current // 访问到 button 的 dom
  }

  render() {
    return <FancyButton ref={this.buttonRef}>click</FancyButton>
  }
}

export default App
```

> 第二个 `ref` 参数仅在使用 `React.forwardRef` 调用定义组件时才存在。常规函数或类组件不接收 `ref` 参数，并且在 `props` 中也不提供 `ref`。
> `Ref` 转发不仅限于 `DOM` 组件。您也可以将 `refs` 转发给类组件实例。

