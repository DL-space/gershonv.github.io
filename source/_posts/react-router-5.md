---
title: react-router - 实践系列
date: 2018-11-07 10:37:49
categories: React
tags: 
  - React
  - react-router
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

### Redirect(Auth)

```jsx
import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom'

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100) // fake async
  },
  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}

/**
 * @class Login - 登录组件
 * 接受参数 this.props.location.state.from
 * 如果登录成功 redirectToReferrer = true, 则跳转回之前的页面 <Redirect to={from} />
 */
class Login extends Component {
  state = { redirectToReferrer: false }

  login = () => {
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true })
    })
  }

  render() {
    let { from } = this.props.location.state || { from: { pathname: '/' } }
    let { redirectToReferrer } = this.state

    if (redirectToReferrer) return <Redirect to={from} />

    return (
      <div>
        <p>You must log in to view the page at {from.pathname}</p>
        <button onClick={this.login}>Log in</button>
      </div>
    )
  }
}

/**
 * @class AuthRoute - 权限高阶路由组件
 * 通过 fakeAuth.isAuthenticated 控制是否重定向到 /login
 * 传递参数 { from: props.location }
 */
const AuthRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      fakeAuth.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      )
    }
  />
)

/**
 * @func AuthStatus - 显示登录状态的组件
 * @desc 通过 withRouter 包裹，获得 this.props.history 用于跳转
 *       登录成功，显示 login succeeds，并显示注销按钮
 *       未登录，显示 You are not logged in.
 */
const AuthStatus = withRouter(
  ({ history }) =>
    fakeAuth.isAuthenticated ? (
      <p>
        login succeeds
        <button
          onClick={() => {
            fakeAuth.signout(() => history.push('/'))
          }}>
          Sign out
        </button>
      </p>
    ) : (
      <p>You are not logged in.</p>
    )
)

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Link to="/auth">Auth Page</Link>
          <AuthStatus />
          <Route path="/login" component={Login} />
          <AuthRoute path="/auth" component={() => <h2>Auth page</h2>} />
        </div>
      </Router>
    )
  }
}

export default App
```

## NotFound

```jsx
import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={() => <h2>Home</h2>} />
          <Route component={() => <h2>404, not found</h2>} />
        </Switch>
      </Router>
    )
  }
}
export default App
```

## 何时使用 Switch

```jsx
import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

// 输入地址 /article 可以发现 两个组件同时都被命中，这是我们不希望出现的
// 这个时候可以使用Switch，他只会命中第一个命中的路由
class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/article" component={() => <p>article</p>} />
          <Route path="/:name" component={() => <p>:name</p>} />
        </div>
      </Router>
    )
  }
}
export default App
```

## 实现 sidebar

```jsx
import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

// 路由表
const routes = [
  {
    path: '/',
    exact: true,
    component: () => <h1>Home</h1>
  },
  {
    path: '/bubblegum',
    component: () => <h1>bubblegum</h1>
  },
  {
    path: '/shoelaces',
    component: () => <h1>shoelaces</h1>
  }
]

class App extends Component {
  render() {
    const sideBarStyle = {
      padding: '10px',
      width: '40%',
      background: '#f0f0f0'
    }
    return (
      <Router>
        <div style={{ display: 'flex' }}>
          <div style={sideBarStyle}>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/bubblegum">Bubblegum</Link>
              </li>
              <li>
                <Link to="/shoelaces">Shoelaces</Link>
              </li>
            </ul>
          </div>
          <div style={{ flex: 1, padding: '10px' }}>
            {routes.map((route, index) => (
              <Route key={index} {...route} />
            ))}
          </div>
        </div>
      </Router>
    )
  }
}

export default App
```

## route config - 定义路由表，实现子路由

```jsx
import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

// 路由表
const routes = [
  {
    path: '/sandwiches',
    component: () => <h2>Sandwiches</h2>
  },
  {
    path: '/tacos',
    component: Tacos,
    routes: [
      {
        path: '/tacos/bus',
        component: () => <h3>sub Bus</h3>
      },
      {
        path: '/tacos/cart',
        component: () => <h3>sub cart</h3>
      }
    ]
  }
]

function Tacos({ routes }) {
  return (
    <div>
      <h2>Tacos</h2>
      <ul>
        <li>
          <Link to="/tacos/bus">Bus</Link>
        </li>
        <li>
          <Link to="/tacos/cart">Cart</Link>
        </li>
      </ul>

      {routes.map((route, i) => (
        <RouteWithSubRoutes key={i} {...route} />
      ))}
    </div>
  )
}

const RouteWithSubRoutes = route => (
  <Route
    path={route.path}
    render={props => <route.component {...props} routes={route.routes} />}
  />
)

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/tacos">Tacos</Link>
            </li>
            <li>
              <Link to="/sandwiches">Sandwiches</Link>
            </li>
          </ul>
          <hr />
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
        </div>
      </Router>
    )
  }
}

export default App
```

## render
