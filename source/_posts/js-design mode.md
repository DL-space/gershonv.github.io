---
title: js - 常用的设计模式
date: 2018-11-12 16:33:26
categories: Javascript
tags: 
  - Javascript
  - 设计模式
---

## 发布订阅模式

发布---订阅模式又叫观察者模式，它定义了对象间的一种一对多的关系，让多个观察者对象同时监听某一个主题对象，当一个对象发生改变时，所有依赖于它的对象都将得到通知。

```js
class Bus {
  constructor() {
    this.watchers = {} // 存放事件
  }

  on(event, handler) {
    this.watchers[event] = this.watchers[event] || []
    this.watchers[event].push(handler)
  }

  emit(event, ...args) {
    if (this.watchers[event]) {
      this.watchers[event].forEach(cb => cb(...args))
    }
  }

  off(event, handler) {
    if (event && handler) {
      if (this.watchers[event] && this.watchers[event].length) {
        const index = this.watchers[event].findIndex(cb => Object.is(cb, handler)) // 找到需要退订的函数...
        this.watchers[event].splice(index, 1)
      }
    } else if (event) {
      // 如果仅传入事件名称，则退订此事件对应的所有的事件函数
      this.watchers[event] = []
    } else {
      this.watchers = {}
    }
  }
}

const bus = new Bus()

const fn1 = (...args) => {
  console.log('emit function one, params is: ', ...args)
}

const fn2 = (...args) => {
  console.log('emit function two, params is: ', ...args)
}

bus.on('a', fn1)
bus.on('a', fn2)
bus.emit('a', 1) // emit function one/two, params is:  1 2

bus.off('a', fn1)
bus.emit('a', 2) // emit function two, params is:  2
bus.off('a') // remove all the listeners
```

## 中介者模式

观察者模式通过维护一堆列表来管理对象间的多对多关系，中介者模式通过统一接口来维护一对多关系，且通信者之间不需要知道彼此之间的关系，只需要约定好 API 即可。

```js
// 汽车
class Bus {
  constructor() {
    // 初始化所有乘客
    this.passengers = {}
  }

  // 发布广播
  broadcast(passenger, message = passenger) {
    // 如果车上有乘客
    if (Object.keys(this.passengers).length) {
      // 如果是针对某个乘客发的，就单独给他听
      if (passenger.id && passenger.listen) {
        // 乘客他爱听不听
        if (this.passengers[passenger.id]) {
          this.passengers[passenger.id].listen(message)
        }

        // 不然就广播给所有乘客
      } else {
        Object.keys(this.passengers).forEach(passenger => {
          if (this.passengers[passenger].listen) {
            this.passengers[passenger].listen(message)
          }
        })
      }
    }
  }

  // 乘客上车
  aboard(passenger) {
    this.passengers[passenger.id] = passenger
  }

  // 乘客下车
  debus(passenger) {
    this.passengers[passenger.id] = null
    delete this.passengers[passenger.id]
    console.log(`乘客${passenger.id}下车`)
  }

  // 开车
  start() {
    this.broadcast({ type: 1, content: '前方无障碍，开车！Over' })
  }

  // 停车
  end() {
    this.broadcast({ type: 2, content: '老司机翻车，停车！Over' })
  }
}

// 乘客
class Passenger {
  constructor(id) {
    this.id = id
  }

  // 听广播
  listen(message) {
    console.log(`乘客${this.id}收到消息`, message)
    // 乘客发现停车了，于是自己下车
    if (Object.is(message.type, 2)) {
      this.debus()
    }
  }

  // 下车
  debus() {
    console.log(`我是乘客${this.id}，我现在要下车`, bus)
    bus.debus(this)
  }
}

// 创建一辆汽车
const bus = new Bus()

// 创建两个乘客
const passenger1 = new Passenger(1)
const passenger2 = new Passenger(2)

// 俩乘客分别上车
bus.aboard(passenger1)
bus.aboard(passenger2)

// 2秒后开车
setTimeout(bus.start.bind(bus), 2000)

// 3秒时司机发现2号乘客没买票，2号乘客被驱逐下车
setTimeout(() => {
  bus.broadcast(passenger2, { type: 3, content: '同志你好，你没买票，请下车!' })
  bus.debus(passenger2)
}, 3000)

// 4秒后到站停车
setTimeout(bus.end.bind(bus), 3600)

// 6秒后再开车，车上已经没乘客了
setTimeout(bus.start.bind(bus), 6666)
```

## 代理模式

常用的虚拟代理形式：某一个花销很大的操作，可以通过虚拟代理的方式延迟到这种需要它的时候才去创建（例：使用虚拟代理实现图片懒加载）

图片懒加载的方式：先通过一张 `loading` 图占位，然后通过异步的方式加载图片，等图片加载好了再把完成的图片加载到 `img` 标签里面。

```js
var myImage = (function() {
  var imgNode = document.createElement('img')
  document.body.appendChild(imgNode)
  return function(src) {
    imgNode.src = src
  }
})()

var ProxyImage = (function() {
  var img = new Image()

  img.onload = function() {
    myImage(this.src)
  }
  return function(src) {
    // 占位图片loading
    myImage('http://www.baidu.com/img/baidu_jgylogo3.gif')
    img.src = src
  }
})()

// 调用方式
ProxyImage('https://img.alicdn.com/tps/i4/TB1b_neLXXXXXcoXFXXc8PZ9XXX-130-200.png') // 真实要展示的图片
```

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
