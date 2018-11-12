---
title: ES6 - async await
date: 2018-11-12 12:02:26
categories: Javascript
tags:
  - Javascript
  - ES6
---

## async 函数

> `async` 函数是什么？一句话，它就是 `Generator` 函数的语法糖。`async` 函数就是将 `Generator` 函数的星号（\*）替换成 `async`，将 `yield` 替换成 `await`，仅此而已

```js
function getSomething() {
  return 'something'
}

async function testAsync() {
  return 'Hello async'
}

async function test() {
  const v1 = await getSomething() // 普通值
  const v2 = await testAsync() // Promise对象
  console.log(v1, v2)
}

test()
  .then(() => {
    console.log('调用该函数时，会立即返回一个Promise对象')
  })
  .catch(e => {})
```

## async 函数的实现原理

`async` 函数的实现原理，就是将 `Generator` 函数和自动执行器，包装在一个函数里。

```js
async function fn(args) {
  // ...
}

// 等同于

function fn(args) {
  return spawn(function*() {
    // ...
  })
}
```

所有的 `async` 函数都可以写成上面的第二种形式，其中的 `spawn` 函数就是自动执行器。
下面给出 `spawn` 函数的实现，基本就是前文自动执行器的翻版。

```js
function spawn(genF) {
  return new Promise(function(resolve, reject) {
    const gen = genF()
    let next
    function step(nextF) {
      let next
      try {
        next = nextF()
      } catch (err) {
        return reject(err)
      }
      if (next.done) return resolve(next.value)
      Promise.resolve(next.value).then(
        v => step(() => gen.next(v)), 
        e => gen.throw(e)
      )
    }
    step(() => gen.next(undefined))
  })
}
```
