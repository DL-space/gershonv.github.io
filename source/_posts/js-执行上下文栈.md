---
title: '[转] JavaScript深入之执行上下文栈 '
date: 2018-11-14 14:18:00
categories: Javascript
tags:
  - Javascript
  - Javascript 深入系列
  - 执行上下文栈
---

## 顺序执行？

如果要问到 JavaScript 代码执行顺序的话，想必写过 JavaScript 的开发者都会有个直观的印象，那就是顺序执行，毕竟：

```js
var foo = function() {
  console.log('foo1')
}

foo() // foo1

var foo = function() {
  console.log('foo2')
}

foo() // foo2
```

然而去看这段代码：

```js
function foo() {
  console.log('foo1')
}

foo() // foo2

function foo() {
  console.log('foo2')
}

foo() // foo2
```

打印的结果却是两个 `foo2`。
刷过面试题的都知道这是因为 JavaScript 引擎并非一行一行地分析和执行程序，而是一段一段地分析执行。当执行一段代码的时候，会进行一个“准备工作”，比如第一个例子中的变量提升，和第二个例子中的函数提升。

但是本文真正想让大家思考的是：这个“一段一段”中的“段”究竟是怎么划分的呢？

到底 JavaScript 引擎遇到一段怎样的代码时才会做“准备工作”呢？

## 可执行代码

这就要说到 JavaScript 的可执行代码(`executable code`)的类型有哪些了？
其实很简单，就三种，全局代码、函数代码、eval 代码。


