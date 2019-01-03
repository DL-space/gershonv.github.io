---
title: react 入门
date: 2018-07-28 23:03:29
categories: React
tags: React
toc: true
comments: true 
---

```html
<script src="https://unpkg.com/react@16/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
<!-- 生产环境中不建议使用 -->
<script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script>

<div id="example"></div>
<script type="text/babel">
ReactDOM.render(
    <h1>Hello, world!</h1>,
    document.getElementById('example')
);
</script>
```

- react.min.js - React 的核心库
- react-dom.min.js - 提供与 DOM 相关的功能
- babel.min.js - Babel 可以将 ES6 代码转为 ES5 代码

<!--more-->

## 使用 create-react-app 快速构建 React 开发环境

```
cnpm install -g create-react-app
create-react-app my-app
npm run eject
```

`TodoList`
```jsx
import React, {Component} from 'react';

class TodoList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            list: [],
            inputValue: ''
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleBtnClick = this.handleBtnClick.bind(this)
    }

    handleChange(e) {
        this.setState({
            inputValue: e.target.value
        })
    }

    handleBtnClick() {
        this.setState(
            {
                list: [...this.state.list, this.state.inputValue],
                inputValue: ''
            }
        )
    }

    handleItemClick(index) {
        let list = [...this.state.list]
        list.splice(index, 1)
        this.setState({
            list
        })
    }

    render() {
        return (
            <div>
                <div>
                    <input value={this.state.inputValue} onChange={this.handleChange}/>
                    <button onClick={this.handleBtnClick} className='btn'>add</button>
                </div>
                <ul>
                    {
                        this.state.list.map((item, index) => {
                            return (
                                <li key={index} onClick={this.handleItemClick.bind(this, index)}>{item}</li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}

export default TodoList
```

组件化 
`todoList`

```js
import React, {Component} from 'react';
import TodoItem from './TodoItem'

class TodoList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            list: [],
            inputValue: ''
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleBtnClick = this.handleBtnClick.bind(this)
    }

    handleChange(e) {
        this.setState({
            inputValue: e.target.value
        })
    }

    handleBtnClick() {
        this.setState(
            {
                list: [...this.state.list, this.state.inputValue],
                inputValue: ''
            }
        )
    }

    handleItemClick(index) {
        let list = [...this.state.list]
        list.splice(index, 1)
        this.setState({list})
    }

    render() {
        return (
            <div>
                <div>
                    <input value={this.state.inputValue} onChange={this.handleChange}/>
                    <button onClick={this.handleBtnClick} className='btn'>add</button>
                </div>
                <ul>
                    {
                        this.state.list.map((item, index) => {
                            // return (
                            //     <li key={index} onClick={this.handleItemClick.bind(this, index)}>{item}</li>
                            // )
                            return (
                                <TodoItem
                                    key={index}
                                    content={item}
                                    index={index}
                                    delete={this.handleItemClick.bind(this, index)}
                                />
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}

export default TodoList
```
`todoItem`
``` jsx
import React, {Component} from 'react';
 class TodoItem extends Component {
     constructor(props) {
        super(props)
        this.handleDelete = this.handleDelete.bind(this)
    }
     // 子组件想要和父组件通信，要调用父组件传递过来的方法
     handleDelete(index) {
        this.props.delete(index)
    }
     // 父组件通过属性的形式向子组件传递参数
    // 子组件通过props接受父组件传递过来的参数
     render() {
        return (
            <li onClick={this.handleDelete}>{this.props.content}</li>
        )
    }
}
 export default TodoItem
```