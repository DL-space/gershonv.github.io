---
title: 'react-router - [译] Basic Components'
date: 2018-11-07 10:37:36
categories: React
tags: 
  - React
  - react-router
---

## Routers

> At the core of every React Router application should be a router component. For web projects, react-router-dom provides <BrowserRouter> and <HashRouter> routers. Both of these will create a specialized history object for you. Generally speaking, you should use a <BrowserRouter> if you have a server that responds to requests and a <HashRouter> if you are using a static file server.

每个 `React Router` 应用程序的核心应该是路由器组件。对于 Web 项目，`react-router-dom` 提供`<BrowserRouter>`和`<HashRouter>`路由器。
这两个都将为您创建一个专门的历史对象。

**一般来说，如果您有响应请求的服务器，则应使用`<BrowserRouter>`;如果使用静态文件服务器，则应使用`<HashRouter>`。**

`Router` 组件本身只是一个容器，真正的路由要通过 `Route` 组件定义:

## Route Matching

There are two route matching components: `<Route>` and `<Switch>.`

> Route matching is done by comparing a <Route>'s path prop to the current location’s pathname. When a <Route> matches it will render its content and when it does not match, it will render null. A <Route> with no path will always match.

1. 路由匹配是通过将`<Route>`的路径 `prop` 与当前位置的路径名进行比较来完成的。
2. 当`<Route>`匹配时，它将呈现其内容，当它不匹配时，它将呈现为 `null`。
3. 没有路径的`<Route>`将始终匹配。

> The <Switch> is not required for grouping <Route>s, but it can be quite useful. A <Switch> will iterate over all of its children <Route> elements and only render the first one that matches the current location. This helps when multiple route’s paths match the same pathname, when animating transitions between routes, and in identifying when no routes match the current location (so that you can render a “404” component).

`<Switch>` 组件用于包裹 `<Route>` 组件, `<Switch>` 将迭代其所有子 `<Route>` 元素，并仅渲染与当前位置匹配的第一个子元素。
当多个路径的路径匹配相同的路径名，动画路径之间的转换，以及识别何时没有路径与当前位置匹配（这样您可以渲染“404”组件）时，这会有所帮助。

```jsx
import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

const About = () => <h1>About</h1>
const Home = () => <h1>Home</h1>
const NoFound = () => <h1>NoFound</h1>

/**
 * @desc Switch 组件包裹，匹配第一个匹配到路由的组件
 * 1. 没有 exact 属性，则永远都能匹配到第一个组件，不会匹配到下面的路由
 * 2. 都匹配不中时，匹配到最后一个组件。可以作为404
 */
const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route component={NoFound} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
```

## Route Rendering Props

对于给定<Route>的组件呈现方式，您有三个 prop 选项：component，render 和 children。

> component should be used when you have an existing component (either a React.Component or a stateless functional component) that you want to render. render, which takes an inline function, should only be used when you have to pass in-scope variables to the component you want to render. You should not use the component prop with an inline function to pass in-scope variables because you will get undesired component unmounts/remounts.

- `component`: 在你需要呈现现有的组件，应使用该属性。
- `render`: 采用内联函数，当你需要传递变量给渲染的组件时，才使用。

```jsx
// 正确的使用方式
const name = 'guodada'
<Route exact path="/" component={Home} />
<Route
  path="/about"
  render={props => <About {...props} name={name} />}/>

// incorrect
<Route
  path="/about"
  component={props => <About {...props} name={name} />}/>
```

### children - 使用在嵌套路由中

```jsx
import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

const Home = () => <h1>Home</h1>

class App extends React.Component {
  render() {
    return (
      <div>
        <header>我是 header</header>
        {this.props.children}
        <footer>我是 footer</footer>
      </div>
    )
  }
}

const Routes = () => (
  <Router>
    <Switch>
      <Route
        path="/"
        render={props => (
          <App {...props}>
            <Route path="/home" component={Home} />
          </App>
        )}
      />
    </Switch>
  </Router>
)

export default Routes
```

上面代码中，用户访问/home 时，会先加载 App 组件，然后在它的内部再加载 Home 组件

上面代码中，App 组件的 this.props.children 属性就是子组件。

子路由也可以不写在 Router 组件里面，单独传入 Router 组件的 routes 属性。

```jsx
const routes = (
  <Route path="/" component={App}>
    <Route path="/home" component={Home} />
    <Route path="/about" component={About} />
  </Route>
)

<Router routes={routes} history={browserHistory} />
```

## Navigation - 导航

> React Router provides a <Link> component to create links in your application. Wherever you render a <Link>, an anchor (<a>) will be rendered in your application’s HTML.

`React Router` 提供了一个`<Link>`组件来在您的应用程序中创建链接。无论何处呈现<Link>，锚点（<a>）都将在应用程序的 HTML 中呈现

```jsx
import { NavLink } from 'react-router-dom'

// location = { pathname: '/react' }
<NavLink to="/react" activeClassName="hurray">
  React
</NavLink>
```
