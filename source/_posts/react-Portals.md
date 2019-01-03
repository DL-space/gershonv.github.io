---
title: react - Portals
date: 2018-11-26 17:00:32
categories: React
tags: React
---

`Portals` 指定挂载组件到某个节点，适用于 `modal`、`toolTip`...

我们不希望 `modal` 组件的节点出现在 `root` 根节点中。。。。

```js
ReactDOM.createPortal(child, container)
```

- `child` : The first argument (child) is any renderable React child，such as an element, string, or fragment
  即可渲染的 react 组件
- `container` : a DOM element

<!--more-->

## 用法

通常，如果你的组件的 render 方法返回一个元素时，它作为最接近的父节点的子节点挂载到 DOM 中：

```jsx
render() {
  // React mounts a new div and renders the children into it
  return (
    <div>
      {this.props.children}
    </div>
  )
}
```

但是，有时候要把子节点插入 DOM 中的不同位置时，是有用的：

```jsx
render() {
  // React does *not* create a new div. It renders the children into `domNode`.
  // `domNode` is any valid DOM node, regardless of its location in the DOM.
  return ReactDOM.createPortal(
    this.props.children,
    domNode,
  )
}
```

使用 `portals` 的典型场景是如果一个父组件有一个 `overflow:hidden` 或者是 `z-index` 的样式，但是你需要子节点在视觉上 `break out` （打破）这个父容器，比如 对话框，选项卡或者提示工具等

下面代码实现一个 `model` 组件

## App.jsx

```jsx
import React, { Component } from 'react'

import Modal from './Modal'

class App extends Component {
  state = { show: false }

  showModal = () => {
    this.setState({ show: !this.state.show })
  }

  closeModal = () => {
    this.setState({ show: false })
  }

  render() {
    return (
      <div className="App">
        <button onClick={() => this.setState({ show: true })}>open Modal</button>

        <Modal show={this.state.show} onClose={this.closeModal}>
          This message is from Modal
        </Modal>
      </div>
    )
  }
}

export default App
```

## Modal.jsx

```jsx
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

const backdropStyle = {
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  padding: 50
}

const modalStyle = {
  backgroundColor: '#fff',
  borderRadius: 5,
  border: '1px solid #eee',
  maxWidth: 500,
  minHeight: 300,
  maring: '0 auto',
  padding: 30,
  position: 'relative'
}

const footerStyle = {
  position: 'absolute',
  bottom: 20
}

// 在此前，页面需要创建一个 dom 元素 其中 id 为modal-root
const modalRoot = document.getElementById('modal-root')

class Modal extends Component {
  constructor(props) {
    super(props)
    this.el = document.createElement('div')
  }

  onKeyUp = e => {
    // 鼠标信息 http://keycode.info/
    // 按下 esc
    if (e.which === 27 && this.props.show) {
      this.props.onClose()
    }
  }

  componentDidMount() {
    document.addEventListener('keyup', this.onKeyUp)
    modalRoot.appendChild(this.el)
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.onKeyUp)
    modalRoot.removeChild(this.el)
  }

  render() {
    if (!this.props.show) return null

    const modalUI = (
      <div style={backdropStyle}>
        <div style={modalStyle}>
          {this.props.children}

          <div style={footerStyle}>
            <button onClick={this.props.onClose}>Close</button>
          </div>
        </div>
      </div>
    )
    // createPortal 挂载到 this.el 的元素中
    return ReactDOM.createPortal(modalUI, this.el)
  }
}

export default Modal
```
