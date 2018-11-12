---
title: ES6 - generator
date: 2018-11-12 11:24:35
categories: Javascript
tags:
  - Javascript
  - ES6
---

## 基本概念

> `Generator` 函数是 ES6 提供的一种异步编程解决方案。语法上，首先可以把它理解成，`Generator` 函数是一个状态机，封装了多个内部状态。

形式上，`Generator` 函数是一个普通函数，但是有两个特征。一是，`function` 关键字与函数名之间有一个星号；二是，函数体内部使用 `yield` 表达式，定义不同的内部状态。

```js
// 该函数有三个状态：hello，world 和 return 语句（结束执行）
function* helloWorldGenerator() {
  yield 'hello'
  yield 'world'
  return 'ending'
}

var hw = helloWorldGenerator()

// 只有调用 next() 函数才会执行

hw.next() // { value: 'hello', done: false }
hw.next() // { value: 'world', done: false }
hw.next() // { value: 'ending', done: true }
hw.next() // { value: undefined, done: true }

hw // {}

// yield表达式如果用在另一个表达式之中，必须放在圆括号里面
function* demo() {
  console.log('Hello' + yield) // SyntaxError
  console.log('Hello' + yield 123) // SyntaxError

  console.log('Hello' + (yield)) // OK
  console.log('Hello' + (yield 123)) // OK
}
```

`Generator` 函数的调用方法与普通函数一样，也是在函数名后面加上一对圆括号
不同的是，调用 `Generator` 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象

总结一下：

- 调用 `Generator` 函数，返回一个遍历器对象，代表 `Generator` 函数的内部指针。
- 以后，每次调用遍历器对象的 next 方法，就会返回一个有着 `value` 和 `done` 两个属性的对象。
  - `value` 属性表示当前的内部状态的值，是 yield 表达式后面那个表达式的值
  - `done` 属性是一个布尔值，表示是否遍历结束。
