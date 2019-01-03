---
title: 'react-router - [译] quickstart'
date: 2018-11-07 10:30:48
categories: React-Router
tags: react-router
---

## Quick start - 快速开始

```jsx
import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

const Index = () => <h2>Home</h2>
const About = () => <h2>About</h2>
const Users = () => <h2>Users</h2>

const AppRouter = () => (
  <Router>
    <div>
      <nav>
        <ul>
          <Link to="/">Home</Link>
          <Link to="/about/">About</Link>
          <Link to="/users/">Users</Link>
        </ul>
      </nav>

      <Route path="/" exact component={Index} />
      <Route path="/about/" component={About} />
      <Route path="/users/" component={Users} />
    </div>
  </Router>
)

export default AppRouter
```
<!--more-->

## Nested Routing -嵌套路由

```jsx
import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

const App = () => (
  <Router>
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about/">About</Link>
        <Link to="/topics">Topics</Link>
      </nav>

      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/topics" component={Topics} />
    </div>
  </Router>
)

const Home = () => <h2>Home</h2>
const About = () => <h2>About</h2>

/**
 * @param props
 * Route 组件中 component 的 props 中会传递 match 属性
 * @example /topics/components
 *          match `isExact`: true ; `params`: {id: "components"} ; `path`: "/topics/:id"; `url`: "/topics/components"
 */
const Topic = ({ match }) => <h3>Requested Param: {match.params.id}</h3>


const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <Link to={`${match.url}/components`}>Components</Link>
    <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
    <Route path={`${match.path}/:id`} component={Topic} />
    <Route
      exact
      path={match.path}
      render={() => <h3>Please select a topic.</h3>}
    />
  </div>
)

export default App
```
