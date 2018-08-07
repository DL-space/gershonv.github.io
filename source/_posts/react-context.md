---
title: react-context
date: 2018-08-02 23:40:30
categories: React
tags: React
toc: true
comments: true 
---
---
## 前言
官方描述
> In Some Cases, you want to pass data through the component tree without having to pass the props down manuallys at every level. you can do this directly in React with the powerful "context" API.

简单说就是，当你不想在组件树中通过逐层传递`props`或者`state`的方式来传递数据时，可以使用`Context`来实现**跨层级**的组件数据传递。

## API
如果要`Context`发挥作用，需要用到两种组件，一个是`Context`生产者(`Provider`)，通常是一个父节点，另外是一个`Context`的消费者(`Consumer`)，通常是一个或者多个子节点。所以`Context`的使用基于生产者消费者模式。

### React.createContext
```js
const {Provider, Consumer} = React.createContext(defaultValue);
```
### Provider
```js
<Provider value={/* some value */}>
```
React 组件允许 `Consumers` 订阅 `context` 的改变。
接收一个 `value` 属性传递给 `Provider` 的后代 `Consumers`。一个 `Provider` 可以联系到多个 `Consumers`。`Providers` 可以被嵌套以覆盖组件树内更深层次的值。

### Consumer
```js
<Consumer>
  {value => /* render something based on the context value */}
</Consumer>
```



