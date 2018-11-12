---
title: js-常用的设计模式
date: 2018-11-12 16:33:26
categories: Javascript
tags: Javascript
---

## 单例模式

> 单例模式的定义：保证一个类仅有一个实例，并提供一个访问它的全局访问点。实现的方法为先判断实例存在与否，如果存在则直接返回，如果不存在就创建了再返回，这就确保了一个类只有一个实例对象。

```js
class CreateUser {
  constructor(name) {
    this.name = name
    this.instance = null
  }

  getName() {
    return this.name
  }
}

// 代理实现单例模式
var ProxyMode = (function() {
  var instance = null
  return function(name) {
    if (!instance) {
      instance = new CreateUser(name)
    }
    return instance
  }
})()

const instanceA = new ProxyMode('instanceA') // { name: 'instanceA', instance: null }
const instanceB = new ProxyMode('instanceB') // { name: 'instanceA', instance: null }

console.log(instanceA === instanceB) // true
```

### 优点

1. 可以用来划分命名空间，减少全局变量的数量。
2. 使用单体模式可以使代码组织的更为一致，使代码容易阅读和维护。
3. 可以被实例化，且实例化一次。

适用场景：一个单一对象。比如：弹窗，无论点击多少次，弹窗只应该被创建一次。


// ...暂时不做更新

- []()