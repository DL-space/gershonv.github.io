---
title: JavaScript 面试考题系列
date: 2018-11-12 11:24:35
categories: interview
tags:
  - Javascript
---

## 函数柯里化

```js
// 实现
sum(1, 2, 3, 4, 5).valueOf() // 15
sum(1, 2, 3, 4)(5).valueOf() // 15
sum(1, 2)(3, 4)(5).valueOf() // 15
```

```js
function sum() {
  let arg = [...arguments] // 建立args,利用闭包特性，不断保存arguments
  let adder = function() {
    let _adder = function() {
      arg.push(...arguments)
      return _adder
    }
    _adder.valueOf = () => arg.reduce((prev, next) => prev + next)
    return _adder
  }
  return adder(...arg)
}
```

- [柯里化与反柯里化](https://juejin.im/post/5b561426518825195f499772)
