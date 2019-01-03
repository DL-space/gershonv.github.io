---
title: react-router - 常用知识
date: 2018-11-07 10:37:43
categories: React-Router
tags: react-router
---

## 组件-Router

```jsx
// 用于导航的历史对象
<Router history={history}></Router>

// 一个使用了 HTML5 history API 的高阶路由组件，保证你的 UI 界面和 URL 保持同步
<BrowserRouter
    basename="/calendar" // 添加一个基准URL
    forceRefresh={false} // 当浏览器不支持 HTML5 的 history API 时强制刷新页面
    getUserConfirmation={getConfirmation()} // 导航到此页面前执行的函数
    keyLength={12} // 设置它里面路由的 location.key 的长度。默认是6
></BrowserRouter>

<HashRouter></HashRouter>
// Hash history 不支持 location.key 和 location.state。
// 另外由于该技术只是用来支持旧版浏览器，因此更推荐大家使用 BrowserRouter
```
<!--more-->

### forceRefresh: bool

如果为 `true`，路由器将在页面导航时使用完整页面刷新。您可能只想在不支持 `HTML5` 历史记录 `API` 的浏览器中使用它。

```jsx
const supportsHistory = 'pushState' in window.history
<BrowserRouter forceRefresh={!supportsHistory}/>
```

### getUserConfirmation: func

用于确认导航的函数，默认使用 `window.confirm`。例如，当从 /a 导航至 /b 时，会使用默认的 `confirm` 函数弹出一个提示，用户点击确定后才进行导航，否则不做任何处理。译注：需要配合 `<Prompt>` 一起使用。

```jsx
// this is the default behavior
const getConfirmation = (message, callback) => {
  const allowTransition = window.confirm(message)
  callback(allowTransition)
}

<BrowserRouter getUserConfirmation={getConfirmation}/>
```

### keyLength: number

The length of location.key. Defaults to 6.

## 组件-Switch

如果你访问 `/about`，那么组件 About User Nomatch 都将被渲染出来，因为他们对应的路由与访问的地址 `/about` 匹配

```jsx
// render all
<Route path="/about" component={About}/>
<Route path="/:user" component={User}/>
<Route component={NoMatch}/>
```

**`<Switch>`只渲染出第一个与当前访问地址匹配的 `<Route>` 或 `<Redirect>`**

```jsx
// Renders the first child <Route> or <Redirect> that matches the location.
<Switch>
  <Route exact path="/" component={Home} />
  <Route path="/about" component={About} />
  <Route path="/:user" component={User} />
  <Route component={NoMatch} />
</Switch>
```

## 组件-Route

```jsx
<Route
 path="/" // url路径
 exact  // bool 严格匹配 ’/link’与’/’是不匹配的，但是在false的情况下它们是匹配的
 component={IndexPage} // 渲染的组件
/>

<Route
 path="/" // url路径
 exact  // bool 严格匹配 ’/link’与’/’是不匹配的，但是在false的情况下它们是匹配的
 render={() => <div>Home</div>} // 内联渲染
/>
```

> <Route> 渲染一些内容有以下三种方式：component / render / children

### Route 渲染方式

#### component

指定只有当位置匹配时才会渲染的 `React` 组件，该组件会接收 `route props` 作为属性。

```jsx
const User = ({ match }) => {
  return <h1>Hello {match.params.username}!</h1>
}

<Route path="/user/:username" component={User} />
```

当你使用 `component`（而不是 `render` 或 `children`）时，`Router` 将根据指定的组件，使用 `React.createElement` 创建一个新的 `React` 元素。这意味着，如果你向 `component` 提供一个内联函数，那么每次渲染都会创建一个新组件。这将导致现有组件的卸载和新组件的安装，而不是仅仅更新现有组件。当使用内联函数进行内联渲染时，请使用 `render` 或 `children`（见下文）。

#### render: func

使用 `render` 可以方便地进行内联渲染和包装，而无需进行上文解释的不必要的组件重装。

你可以传入一个函数，以在位置匹配时调用，而不是使用 `component` 创建一个新的 `React` 元素。`render` 渲染方式接收所有与 `component` 方式相同的 `route props`。

```jsx
// 方便的内联渲染
<Route path="/home" render={() => <div>Home</div>} />

// 包装
const FadingRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    <FadeIn>
      <Component {...props} />
    </FadeIn>
  )} />
)

<FadingRoute path="/cool" component={Something} />
```

> 警告：<Route component> 优先于 <Route render>，因此不要在同一个 <Route> 中同时使用两者。

#### children: func

有时候不论 `path` 是否匹配位置，你都想渲染一些内容。在这种情况下，你可以使用 `children` 属性。除了不论是否匹配它都会被调用以外，它的工作原理与 `render` 完全一样。

`children` 渲染方式接收所有与 `component` 和 `render` 方式相同的 `route props`，除非路由与 `URL` 不匹配，不匹配时 `match` 为 `null`。这允许你可以根据路由是否匹配动态地调整用户界面。如下所示，如果路由匹配，我们将添加一个激活类：

```jsx
const ListItemLink = ({ to, ...rest }) => (
  <Route path={to} children={({ match }) => (
    <li className={match ? 'active' : ''}>
      <Link to={to} {...rest} />
    </li>
  )} />
)

<ul>
  <ListItemLink to="/somewhere" />
  <ListItemLink to="/somewhere-else" />
</ul>
```

这对动画也很有用：

```jsx
<Route children={({ match, ...rest }) => (
  {/* Animate 将始终渲染，因此你可以利用生命周期来为其子元素添加进出动画 */}
  <Animate>
    {match && <Something {...rest} />}
  </Animate>
)} />
```

> 警告：`<Route component>` 和`<Route render>` 优先于 `<Route children>`，因此不要在同一个 `<Route>` 中同时使用多个。

### Route props

三种渲染方式都将提供相同的三个路由属性：

- `match`
- `location`
- `history`

#### match: object

```jsx
const Topics = ({ match }) => (
  <div>
    <Link to={`${match.url}/rendering`}>Rendering with React</Link>
    <Route path={`${match.url}/:topicId`} component={Topic} />
  </div>
)
```

**match 对象包含了 `<Route path>` 如何与 URL 匹配的信息，具有以下属性：**

- `params`: object 路径参数，通过解析 URL 中的动态部分获得键值对
- `isExact`: bool 为 true 时，整个 URL 都需要匹配
- `path`: string 用来匹配的路径模式，用于创建嵌套的 <Route>
- `url`: string URL 匹配的部分，用于嵌套的 <Link>

在以下情境中可以获取 match 对象

- 在 Route component 中，以 `this.props.match` 获取
- 在 Route render 中，以 `({match}) => ()` 方式获取
- 在 Route children 中，以 `({match}) => ()` 方式获取 uter 中，以 `this.props.match` 的方式获取 `matchPath` 的返回值

#### location: object

`location` 是指你当前的位置，将要去的位置，或是之前所在的位置

```jsx
{
  key: 'ac3df4', // not with HashHistory!
  pathname: '/somewhere'
  search: '?some=search-string',
  hash: '#howdy',
  state: {
    [userDefined]: true
  }
}
```

在以下情境中可以获取 `location` 对象

- 在`Route component` 中，以 this.props.location 获取
- 在 `Route render` 中，以 ({location}) => () 方式获取
- 在 `Route children` 中，以 ({location}) => () 方式获取
- 在 `withRouter` 中，以 this.props.location 的方式获取

可以在不同情境中使用 location：

```jsx
<Link to={location} />
<NaviveLink to={location} />
<Redirect to={location />
history.push(location)
history.replace(location)
```

#### history: object

history 对象通常具有以下属性和方法：

- `length`: number 浏览历史堆栈中的条目数
- `action`: string 路由跳转到当前页面执行的动作，分为 PUSH, REPLACE, POP
- `location`: object 当前访问地址信息组成的对象
- `push(path, [state])` 在历史堆栈信息里加入一个新条目。
- `replace(path, [state])` 在历史堆栈信息里替换掉当前的条目
- `go(n)` 将 history 堆栈中的指针向前移动 n。
- `goBack()` 等同于 go(-1)
- `goForward` 等同于 go(1)
- `block(prompt)` 阻止跳转

### 属性

#### path: string

可以是 path-to-regexp 能够理解的任何有效的 URL 路径。

```jsx
<Route path="/users/:id" component={User} />
```

没有定义 `path` 的 `<Route>` 总是会被匹配。【常用于搭建 404 页面】

#### exact: bool

如果为 true，则只有在 path 完全匹配 location.pathname 时才匹配。

```jsx
<Route exact path="/one" component={OneComponent} />
// url: /one/two 不可以匹配到 OneComponent
// 若是没加 exact， 则路径为 /one/two 或 /one/two... 都可以匹配到该组件
```

#### strict: bool

如果为 `true`，则具有尾部斜杠的 `path` 仅与具有尾部斜杠的 `location.pathname` 匹配。当 `location.pathname` 中有附加的 `URL` 片段时，`strict` 就没有效果了。

```jsx
<Route strict path="/one/" component={OneComponent} />
// url /one 不匹配
// url /one/ 或 /one/two 匹配
```

> 警告：可以使用 `strict` 来强制规定`location.pathname` 不能具有尾部斜杠，但是为了做到这一点，`strict` 和 `exact` 必须都是 `true`。

#### sensitive: bool

如果为 `true`，进行匹配时将区分大小写。

## 组件-Redirect

使用 `<Redirect>` 会导航到一个新的位置。新的位置将覆盖历史堆栈中的当前条目，例如服务器端重定向`（HTTP 3xx）`。

```jsx
import { Route, Redirect } from 'react-router-dom'

<Route
  exact
  path="/"
  render={() => (loggedIn ? <Redirect to="/dashboard" /> : <PublicHomePage />)}
/>
```

### to: string

要重定向到的 `URL`，可以是 `path-to-regexp` 能够理解的任何有效的 `URL` 路径。所有要使用的 `URL` 参数必须由 `from` 提供。

```jsx
<Redirect to="/somewhere/else" />
```

### to: object

要重定向到的位置，其中 `pathname` 可以是 `path-to-regexp` 能够理解的任何有效的 `URL` 路径。

```jsx
<Redirect
  to={{
    pathname: '/login',
    search: '?utm=your+face',
    state: {
      referrer: currentLocation
    }
  }}
/>
```

上例中的 `state` 对象可以在重定向到的组件中通过 `this.props.location.state` 进行访问。而 `referrer` 键（不是特殊名称）将通过路径名 `/login` 指向的登录组件中的 `this.props.location.state.referrer`进行访问。

### push: bool

如果为 true，重定向会将新的位置推入历史记录，而不是替换当前条目。

```jsx
<Redirect push to="/somewhere/else" />
```

### from: string

要从中进行重定向的路径名，可以是 `path-to-regexp` 能够理解的任何有效的 `URL` 路径。所有匹配的 `URL` 参数都会提供给 `to`，必须包含在 `to` 中用到的所有参数，`to` 未使用的其它参数将被忽略。

只能在 `<Switch>`组件内使用 `<Redirect from>`，以匹配一个位置。

```jsx
<Switch>
  <Redirect from="/old-path" to="/new-path" />
  <Route path="/new-path" component={Place} />
</Switch>
```

```jsx
// 根据匹配参数进行重定向
<Switch>
  <Redirect from="/users/:id" to="/users/profile/:id" />
  <Route path="/users/profile/:id" component={Profile} />
</Switch>
```

> 译注：经过实践，发现以上“根据匹配参数进行重定向”的示例存在 bug，没有效果。to 中的 :id 并不会继承 from 中的 :id 匹配的值，而是直接作为字符串显示到浏览器地址栏！！！

### exact: bool

### strict: bool

## 组件-link

```jsx
// to为string
<Link to='/courses?sort=name'/>

// to为obj
<Link to={{
  pathname: '/courses',
  search: '?sort=name',
  hash: '#the-hash',
  state: { fromDashboard: true }
}}/>

// replace
<Link to="/courses" replace />
// replace(bool)：为 true 时，点击链接后将使用新地址替换掉访问历史记录里面的原地址；
// 为 false 时，点击链接后将在原有访问历史记录的基础上添加一个新的纪录。默认为 false；
```

## 组件-NavLink

```jsx
<NavLink to="/about" exact>About</NavLink>

<NavLink
  to="/faq"
  activeClassName="selected"
>FAQs</NavLink>

<NavLink
  to="/faq"
  activeStyle={{
    fontWeight: 'bold',
    color: 'red'
   }}
>FAQs</NavLink>

<NavLink
  to="/events/123"
  isActive={oddEvent}
>Event 123</NavLink>
```

## 参考

- [React Router 中文文档（一）](https://segmentfault.com/a/1190000014294604#articleHeader2)
- [react-浅析 react-router4](https://blog.segmentfault.net/a/1190000016610898#articleHeader5)
