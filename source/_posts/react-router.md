---
title: react-router
date: 2018-07-29 11:38:35
categories: React
tags: React
toc: true
comments: true 
---

`react-router`是做SPA(不是你想的SPA)时，控制不同的url渲染不同的组件的js库。用`react-router`可以方便开发，不需要手动维护url和组件的对应关系。开发时用`react-router-dom`，`react-router-dom`里面的组件是对`react-router`组件的封装。


## SPA 的原理
单页应用的原理用两种，一种是通过hash的变化，改变页面，另一种是通过url的变化改变页面。
- hash
    - window.location.hash='xxx' 改变hash
    - window.addEventListener('hashchange',fun) 监听hash的改变
- url
    - history.pushState(obj,title,'/url') 改变url
    - window.addEventListener('popstate',fun) 当浏览器向前向后时，触发该事件。

## 安装
React Router被拆分成三个包：`react-router`,`react-router-dom`和`react-router-native`。`react-router`提供核心的路由组件与函数。其余两个则提供运行环境（即浏览器与`react-native`）所需的特定组件。

进行网站（将会运行在浏览器环境中）构建，我们应当安装`react-router-dom`。`react-router-dom`暴露出`react-router`中暴露的对象与方法，因此你只需要安装并引用`react-router-dom`即可。

```
npm install --save react-router-dom
```

### React-Router-dom的核心组件

- **Router**
    - `Router`是一个外层，最后`render`的是它的子组件，不渲染具体业务组件
    - 分为`HashRouter`(通过改变hash)、`BrowserRouter`(通过改变url)、`MemoryRouter`
    - `Router`负责选取哪种方式作为单页应用的方案`hash`或`browser`或其他的，把`HashRouter`换成`BrowserRouter`，代码可以继续运行
    - `Router`的`props`中有一个`history`的对象，`history`是对`window.history`的封装，`history`的负责管理与浏览器历史记录的交互和哪种方式的单页应用。`history`会作为`childContext`里的一个属性传下去。
- **Route**
    - 负责渲染具体的业务组件，负责匹配url和对应的组件
    - 有三种渲染的组件的方式：`component`(对应的组件)、`render`(是一个函数，函数里渲染组件)、`children`(无论哪种路由都会渲染)
- **Switch**
    - 匹配到一个Route子组件就返回不再继续匹配其他组件。
- **Link**
    - 跳转路由时的组件，调用history.push把改变url。

## 路由器(Router)
在你开始项目前，你需要决定你使用的路由器的类型。对于网页项目，存在`<BrowserRouter>`与`<HashRouter>`两种组件。当存在服务区来管理动态请求时，需要使用`<BrowserRouter>`组件，而`<HashRouter>`被用于静态网站。

- `HashRouter`和`BrowserRouter`是对Router的封装，传入Router的history对象不同
- Router中要创建`childContext`，`history`是`props`的`history`，`location`是`history`里的`location`，`match`是Route组件里匹配url后的结果
- `history`的`listen`传入函数，`url`改变后重新渲染