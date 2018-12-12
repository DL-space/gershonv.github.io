---
title: 随笔 - 如何用es6+写出优雅的js代码
date: 2018-12-12 09:59:21
categories: 开发随笔
---

兼容 IE ？不存在的好吗。

其实使用新语法配合 `babel` 的转码，已经可以解决这一些问题了。既然如此，那就多使用新语法去探索一下怎么更好的去写代码吧。

下面分享个人开发中常用的 js 写法技巧，希望对各位有所帮助。

## 使用 let / const

`var` 命令会发生”变量提升“现象，即变量可以在声明之前使用，值为 `undefined`。这种现象多多少少是有些奇怪的。

个人认为，对声明的变量确定后面不会发生更改时，即使性能上没有太大提升差异在，但使用 `const`, 代码的可读性也会增强很多。

- `const` 实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。
- `let` 变量指向的内存地址，保存的只是一个指向实际数据的指针

补充 `const` 定义的变量不是数据不可变，而是保存的引用地址不能发生改变。例子如下：

```js
const person = { age: 22 }
person.age = 1

console.log(person.age) // 1
```

详情看 [let 和 const 命令](http://es6.ruanyifeng.com/#docs/let)

## 解构赋值

`ES6` 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（`Destructuring`）。

好处就是：解决了访问多层嵌套的对象或数组的命名，减少代码量

声明多个变量:

```js
let [age, name, sex] = [22, 'guodada', 1]
console.log(age, name, sex) // 22, guodada, 1
```

使用在对象中：

```js
const obj = {
  name: {
    firstName: 'guo',
    lastName: 'dada'
  }
}
// 如果我们多处使用 firstName， 那就不必要每个地方都写 obj.name.firstName, 这样极大提升coding效率
const { firstName, lastName } = obj.name

// 等同于
const firstName = obj.name.firstName
const lastName = obj.name.lastName
```

使用在函数中:

```js
// 在参数中结构赋值，获取参数, 当参数多的使用时候十分方便
function Destructuring({ name, age }) {
  return { name, age } // 相当于 { name: name, age: age } , 可以简写
}

const params = { name: 'guodada', age: 22 }
Destructuring(params)
```

更多用法见 [变量的解构赋值](http://es6.ruanyifeng.com/#docs/destructuring)

ES6 允许在对象之中，直接写变量。这时，属性名为变量名, 属性值为变量的值。

```js
function f(x, y) {
  return { x, y }
}

// 等同于
function f(x, y) {
  return { x: x, y: y }
}

f(1, 2) // Object {x: 1, y: 2}
```

## 扩展符的运用

es6 扩展符有很多用法，他可以使你的代码更加简洁，易懂。这里就举例常用的用法

在对象中的用法：

```js
let obj = {
  name: 'guodada',
  age: 22,
  sex: 1
}

// 复制对象。扩展符为浅复制！！！
const copy = { ...obj }

// 修改对象属性值(生成新对象) 相当于 Object.assgin({}, obj, { age: 18 })
const newObj = { ...obj, age: 18 }

// 结合结构赋值
let { sex, ...z } = obj
z // { name: 'guodada', age: 22 }
```

在数组中的用法：

```js
const arr = [1, 2, 3]
const arr2 = [4, 5, 6, 4]

// 复制数组。扩展符为浅复制！！！
const newArr = [...arr] // ...[1, 2, 3] => 相当于展开数组：1, 2, 3

// 合并数组
const conbineArr = [...arr, ...arr2]

// 结合求最大值函数
Math.max(...arr)

// 结合 Set 实现数组去重。注意：json 等对象数组不可用
[...new Set(arr2)] // [4, 5, 6]
```

扩展符的其他用法请自行查资料。

## 数组用法

```js
const arr = [1, 2, 3, 4]

Array.isArray(arr) // 判断是否为数组

arr.includes(2) // true 判断数组中是否包含某项

arr.findIndex(d => d === 3) // 2 找出第一个符合条件的数组成员并返回数组下标, 找不到返回 -1

arr.find(d => d === 3) // 3 找出第一个符合条件的数组成员并返回, 找不到返回 undefined

// es5 其他还有 filter map forEach 等，这里不做举例。
arr.every(d => d > 2) // false 每一项都满足条件则返回 true

arr.some(d => d > 2) // true 只要有一项满足条件则返回 true
```

`find/findIndex` : 找出第一个符合条件的数组成员之后不再匹配，一定程度下优化查找。
`includes`: 返回 `true/false`, 相较于 `indexOf`, 实用多了

- `flat()` : 扁平化数组，常用于将数组转化为一维数组

  ```js
  const arr = [1, 2, [3, 4]]

  arr.flat() // [1, 2, 3, 4] 扁平化数组, 默认展开一层。

  const arr2 = [1, 2, [3, 4, [5, 6]]]

  arr2.flat() // [1, 2, 3, 4, [5, 6]]
  arr2.flat(2) // [1, 2, 3, 4, 5, 6] flat(3) 也是展开两层...
  ```

- `flatMap()`: 在数组执行 `map` 方法后执行 `flat`, 用的不多，其实可以写 `map` 后写 `flat` 更好懂点。

  ```js
  ;[2, 3, 4].flatMap(x => [x, x * 2]) //  [ 2, 4, 3, 6, 4, 8 ]
  // 1. [2, 3, 4].map(d => [d, d * 2]) => [[2, 4], [3, 6], [4, 8]]
  // 2. [[2, 4], [3, 6], [4, 8]].flat()
  ```

补充常用的对象转数组的用法：

```js
const obj = { name: 'guodada' }

Object.keys(obj) // ['name']
Object.values(obj) // ['guodada']
Object.entries(obj) // [['name', 'guodada']]
```

## 模板字符串

用的挺多的，注意不兼容 `IE` !

```js
const name = 'guodada'

const newStr = `welcome ${name}` // welcome guodada

// the same as
const newStr = 'welcome ' + name
```

## 使用 async / await

`async/await` 实际上就是 `generator` 的语法糖, 主要用来解决异步问题，具体网上很多文章都有介绍，这里就不做多的解释吧。

```js
async function test() {
  const data = await axios.get('https://randomuser.me/api/')
  console.log(data)
}
// 等同于
function test() {
  axios.get('https://randomuser.me/api/').then(res => console.log(res)) // axios 也是 promise 对象
}

// 结合try/catch
async function test() {
  try {
    const data = await axios.get('https://randomuser.me/api/')
    console.log(data)
  } catch (err) {
    console.log(err)
  }
}
```

ps 虽然好用，但是有时候适用场景不好，比如我们在拉取列表和用户信息需要同时进行时，`await` 后才执行下一条语句，这不是我们希望看到的。解决方法如下：

```js
// 结合 Promise.all
await Promise.all([anAsyncCall(), thisIsAlsoAsync(), oneMore()])
```

传送门：[async 函数](http://es6.ruanyifeng.com/#docs/async)

## 利用 class 封装代码

主要是抽离代码逻辑，使得代复用性加强。同时，`class` 的形式会让结构变得更加清晰，譬如：

```js
class MyForm {
  /**
   * @func defaultLimit - 默认表单输入限制条件, value 为空时返回 true
   * @param {Number} type - 代表表单类型的节点！
   * @param {String} value - 需要被验证的值
   * @return Boolean
   *
   * 根据 type 属性对输出进行验证
   * 1 0≤x≤50 整数
   * 2 -1000≤x≤2000 整数
   * 3 1≤x 整数
   * 4 0≤x≤10
   */
  static defaultLimit(type, value) {
    const typeLimitMap = {
      1: /^(\d|[1-4]\d|50)$/g,
      2: /^-?(\d{1,3}|1000)$|^(-|1\d{3}|2000)$/,
      3: /^[1-9]\d*$/,
      4: value => value <= 10 && value >= 0 // 0≤ x ≤ 10 可以为小数
    }
    if (!typeLimitMap[type] || !value) return true
    if (typeof typeLimitMap[type] === 'function') return typeLimitMap[type](value)
    else return typeLimitMap[type].test(value)
  }

  /**
   * @func translateLimit - 转换操作符
   * @param {String} operator - 运算符
   * @param {*} value - 被匹配的值
   * @param {*} compareValue - 匹配的值
   * @return Boolean
   * 'eq': '='
   * 'ne': '≠'
   * 'gt': '>'
   * 'lt': '<'
   * 'ge': '≥'
   * 'le': '≤'
   */
  static translateLimit(operator, value, compareValue) {
    const type = {
      eq: value === compareValue,
      ne: value !== compareValue,
      gt: value > compareValue,
      lt: value < compareValue,
      ge: value >= compareValue,
      le: value <= compareValue
    }
    if (!Object.keys(type).includes(operator) || !value || value === '-') return true
    return type[operator]
  }

  // ...
}

export default MyForm
```

使用：

```js
import MyForm from './MyForm'

MyForm.defaultLimit(1, 20)
```

- `static` ：静态属性，类可以直接调用
- `constructor` : 实例化类的时候调用，即 `new MyForm()`, 这里没用到

更多知识请阅 [Class 的基本语法](http://es6.ruanyifeng.com/#docs/class)

## 优化 if/else 语句

> 当逻辑或`||`时，找到为 `true` 的分项就停止处理，并返回该分项的值，否则执行完，并返回最后分项的值。
>
> 当逻辑与`&&`时，找到为 `false` 的分项就停止处理，并返回该分项的值。

```js
const a = 0 || null || 3 || 4
console.log(a) // 3

const b = 3 && 4 && null && 0
console.log(b) // null
```

减少 `if / else`地狱般的调用

```js
const [age, name, sex] = [22, 'guodada', 1]

if (age > 10) {
  if (name === 'guodada') {
    if (sex > 0) {
      console.log('all right')
    }
  }
}

// 使用 &&
if (age > 10 && name === 'guodada' && sex > 0) {
  console.log('all right')
}

// 或者(太长了不推荐)
age > 10 && name === 'guodada' && sex > 0 && console.log('all right')
```

提一下 `react` 的坑点, 在 `render` 中

```js
render(){
  const arr = []
  return arr.length && null
}
// 渲染出 0 ！
// Boolean / undefind / null / NaN 等才不会渲染。我们可以使用 !! 强制转化为 boolean 解决这个问题
return !!arr.length && null

// 使用 && 控制组件的渲染
this.state.visible && <Modal />
```

使用 `Array.includes` 来处理多重条件：

```js
const ages = [18, 20, 12]

if (age === 18 || age === 12) {
  console.log('match')
}

// better
if ([18, 12].includes(age)) {
  console.log('match')
}
```

如果是较少的判断逻辑则可以使用三元运算符：

```js
const age = 22
const isAdult = age >= 18 ? true : false // 这里可以简写为 const isAdult = age > 18

const type = age >= 18 ? 'adult' : 'child'
```

## 优化 switch/case 语句

`switch/case` 比 `if/else` 代码结构好点，但也和它一样有时十分冗长。

这里以自己实际项目中代码举例：
有时我们可能需要对不同类型的字段进行不一样的正则验证，防止用户错误地输入。譬如

```js
const [type, value] = [1, '20']
/**
 * 根据 type 属性对输出进行验证
 * 1 0≤x≤50 整数
 * 2 -1000≤x≤2000 整数
 * 3 1≤x 整数
 */

function func1(type, value) {
  if (type === 1) {
    return /^(\d|[1-4]\d|50)$/.test(value)
  } else if (type === 2) {
    return /^-?(\d{1,3}|1000)$|^(-|1\d{3}|2000)$/.test(value)
  } else if (type === 3) {
    return /^[1-9]\d*$/.test(value)
  } else {
    return true
  }
}

func1(type, value)

// 使用 switch/case
function fun2(type, value) {
  switch (type) {
    case 1:
      return /^(\d|[1-4]\d|50)$/.test(value)
    case 2:
      return /^-?(\d{1,3}|1000)$|^(-|1\d{3}|2000)$/.test(value)
    case 3:
      return /^[1-9]\d*$/.test(value)
    default:
      return true
  }
}

func2(type, value)
```

我们如何巧妙的解决这个代码冗长的问题呢，如下：

```js
function func3(type, value) {
  const limitMap = {
    1: /^(\d|[1-4]\d|50)$/g,
    2: /^-?(\d{1,3}|1000)$|^(-|1\d{3}|2000)$/,
    3: /^[1-9]\d*$/
  }
  return limitMap[type].test(value)
}
```

利用对象去匹配属性值，可以减少你的代码量，也使你的代码看起来更加简洁。你也可以使用 `Map` 对象去匹配。

```js
function func4(type, value) {
  const mapArr = [[1, /^(\d|[1-4]\d|50)$/g], [2, /^-?(\d{1,3}|1000)$|^(-|1\d{3}|2000)$/], [3, /^[1-9]\d*$/]]
  const limitMap = new Map(mapArr)
  return limitMap.get(type).test(value)
}
```

`Map` 是一种键值对的数据结构对象，它的匹配更加严格。它会区分开你传递的是字符串还是数字，譬如：

```js
limitMap.get(1) // /^(\d|[1-4]\d|50)$/g
limitMap.get('1') // undefined
```

更多详见 [Set 和 Map 数据结构](http://es6.ruanyifeng.com/#docs/set-map)

## 其他

- 函数参数默认值
  ```js
  function func(name, age = 22) {}
  // 等同于
  function func(name, age) {
    age = age || 22
  }
  ```
- 使用 `===` 代替 `==`。其实大家都懂这个的。。。
- 箭头函数，es6 最常用的语法。
- return boolean
  ```js
  const a = 1
  return a === 1 ? true : false
  // 多此一举了，其实就等于
  return a === 1
  ```

敬请各位补充。交流才能进步，相视一笑，嘿嘿。

- [github](https://github.com/gershonv/my-code-store) - star 一下人生更美好
- [blog](https://gershonv.github.io/categories/) - 欢迎交流
