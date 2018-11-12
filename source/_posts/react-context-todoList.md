---
title: react-context 实现 todoList
date: 2018-11-09 23:56:25
categories: React
tags:
  - React
  - react-router
---

`src/context/TodoContext.js`

```jsx
import React, { Component } from 'react'

export const TodoContext = React.createContext()

export class TodoProvider extends Component {
  state = {
    todoList: []
  }

  addTodo = text => {
    const todoList = [...this.state.todoList, { id: Math.random(), text }]
    this.setState({ todoList })
  }

  deleteTodo = id => {
    const todoList = this.state.todoList.filter(todo => todo.id !== id)
    this.setState({ todoList })
  }

  clearTodos = () => {
    this.setState({ todoList: [] })
  }

  render() {
    return (
      <TodoContext.Provider
        value={{
          todoList: this.state.todoList,
          addTodo: this.addTodo,
          deleteTodo: this.deleteTodo,
          clearTodos: this.clearTodos
        }}>
        {this.props.children}
      </TodoContext.Provider>
    )
  }
}
```

`App.jsx`

```jsx
import React, { Component } from 'react'

import { TodoContext, TodoProvider } from './context/TodoContext'

class App extends Component {
  state = {
    text: ''
  }

  render() {
    const { todoList, addTodo, deleteTodo, clearTodos } = this.props
    const { text } = this.state
    return (
      <div>
        <h2>TodoList</h2>
        <div>
          <input
            type="text"
            placeholder="请输入内容"
            onChange={e => this.setState({ text: e.target.value })}
          />
          <button onClick={e => addTodo(text)}>AddTodo</button>
          <button onClick={clearTodos}>clearTodos</button>
        </div>
        <ul>
          {todoList.map(todo => (
            <li key={todo.id}>
              {todo.text}
              <button onClick={e => deleteTodo(todo.id)}>delete</button>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

const Hoc = WrappedComponent =>
  class extends Component {
    render() {
      return (
        <TodoProvider>
          <TodoContext.Consumer>
            {ctx => <WrappedComponent {...ctx} />}
          </TodoContext.Consumer>
        </TodoProvider>
      )
    }
  }

export default Hoc(App)
```