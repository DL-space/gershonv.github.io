---
title: react-router 实践系列
date: 2018-11-07 10:37:49
categories: React
tags: react-router
---

## 简单使用

```jsx
import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from 'react-router-dom'

const Home = () => (
  <div>
    <h2>主页</h2>
    <Link to="/article/1">文章1</Link>
  </div>
)

const Mine = () => <h2>我的</h2>

class Article extends Component {
  handleClick = () => {
    // 坑点： this.props.history.push('home') 会跳转到路径 /article/home
    this.props.history.push('/home')
  }

  render() {
    const { match } = this.props
    return (
      <div>
        <h2>文章</h2>
        <ul>
          <li>路由传参： {match.params.topicId}</li>
        </ul>
        <button onClick={this.handleClick}>go Home</button>
      </div>
    )
  }
}

/**
 * 坑点1： You should not use <Link> outside a <Router> @desc Link 组件不要在 Router 组件外使用
 * 坑点2： A <Router> may have only one child element @desc Router 组件只能有一个子元素
 * 坑点3： /article/:topicId 匹配不到 /Article 组件， /article/123 可以
 */
class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <div>
            <NavLink to="/" activeClassName="active">
              首页
            </NavLink>
            <NavLink to="/article" activeClassName="active">
              文章
            </NavLink>
            <NavLink to="/mine" activeClassName="active">
              我的
            </NavLink>
            <hr />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/article/:topicId" component={Article} />
              <Route path="/mine" component={Mine} />
            </Switch>
          </div>
        </Router>
      </div>
    )
  }
}

export default App
```

## url 跳转 + 传参

### 路由跳转

```jsx
<Route path="/article/:topicId" component={Article} />

// html
<Link to="/article/1">文章1</Link>

// js 方式
this.props.history.push('/article/1')

// Article 组件 接收参数
this.props.match.params.topicId
```

### 通过 query

前提：必须由其他页面跳过来，参数才会被传递过来

```jsx
// 不需要配置路由表。路由表中的内容照常
<Route path="/article" component={Article} />

// html
<Link to={{ pathname: '/article', query: { topicId: 2 } }}>文章2</Link>

// js 方式
this.props.history.push({ pathname : '/article' ,query : { topicId: 2} })

// Article 组件 接收参数
this.props.location.query.topicId //建议不用 刷新页面时 丢失
```

### 通过 state

同 `query` 差不多，只是属性不一样，而且 `state` 传的参数是加密的，`query` 传的参数是公开的，在地址栏

```jsx
// 不需要配置路由表。路由表中的内容照常
<Route path="/article" component={Article} />

// html
<Link to={{ pathname: '/article', state: { topicId: 2 } }}>文章2</Link>

// js 方式
this.props.history.push({ pathname: '/article', state: { topicId: 2 } })

// Article 组件 接收参数
this.props.location.state.topicId
```

## 重定向

```jsx
// 通过from匹配路由重定向
<Switch>
  <Redirect from="/users/:id" to="/users/profile/:id" />
  <Route path="/users/profile/:id" component={Profile} />
</Switch>

// 通过render重定向
<Route exact path="/" render={() => (
  loggedIn ? (
    <Redirect to="/dashboard"/>
  ) : (
    <PublicHomePage/>
  )
)}/>
```
