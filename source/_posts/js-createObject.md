---
title: js创建对象的几种方式（工厂模式、构造函数模式、原型模式）
date: 2018-10-16 09:11:46
categories: Javascript
tags: Javascript
toc: true
comments: true
---

# 创建对象的模式

- [工厂模式](#工厂模式)
  - 做法：**内部创建一个对象，并未对象属性赋值并且返回**
  - 缺点：解决创建多个相识对象的问题，但不能识别创建的对象的类型
- [构造函数模式](#构造函数模式)
  - 做法：**直接将属性和方法赋值给 this 对象，没有 return 语句**
  - 缺点：对象不是共用方法和属性，每 new 一次对象就要创建一个内存，超出性能消耗
- [原型模式](#原型模式)
  - 做法：**通过 prototype 为对象添加属性**
  - 缺点：每个实例都共享属性方法，实例中修改对象属性会影响到其他实例
- [组合使用构造函数模式和原型模式](#组合使用构造函数模式和原型模式)
  - 做法：**构造函数模式用于定义实例属性，而原型模式用于定义共用方法**
  - 构造函数与原型混成，使用较为广泛
- [动态原型模式](#动态原型模式)
  - 过检查某个应该存在的方法是否有效，来决定是否需要初始化原中的某个属性
- 寄生构造函数模式...

## 前言

js 面向对象第一步是什么？答：创建对象。创建对象有很多中方式，我们最常用的是对象字面量来创建对象，`var obj = {}`，你看我这不就创建了一个对象了吗，我还干嘛要继续了解那些奇葩的方法呢？这么想的人活该单身，多掌握些找对象只有好处没有坏处哈。正经的，高阶上有这么一句话，使用对象字面量创建单个对象，有个明显的缺点，**使用同一个接口创建很多对象，会产生大量重复的代码。**为了解决这个问题，我们需要了解下面?这些方式。

## 工厂模式

```js
function createPerson(name, age, job) {
  var o = new Object()
  o.name = name
  o.age = age
  o.job = job
  o.sayName = function() {
    alert(this.name)
  }
  return o
}
var person1 = createPerson('Nicholas', 29, 'Software Engineer')
var person2 = createPerson('Greg', 27, 'Doctor')
```

工厂模式虽然解决了创建多个相似对象的问题，但却没有解决对象识别的问题法识别创建的对象的类型。因为全部都是 Object，没有区分度，不像 Date、Array 等，因此出现了构造函数模式

## 构造函数模式

```js
function Person(name) {
  this.name = name
  this.showName = function() {
    alert(this.name)
  }
}
var p1 = new Person('haha')
p1.showName()
var p2 = new Person('hehe')
p2.showName()
```

我们注意到， Person\(\) 中的代码  
除了与 createPerson\(\) 中相同的部分外，还存在以下不同之处：

- 没有显式地创建对象；
- 直接将属性和方法赋给了 this 对象；
- 没有 return 语句。

此外，还应该注意到函数名 Person 使用的是大写字母 P。按照惯例，构造函数始终都应该以一个  
大写字母开头，而非构造函数则应该以一个小写字母开头。这个做法借鉴自其他 OO 语言，主要是为了  
区别于 ECMAScript 中的其他函数；因为构造函数本身也是函数，只不过可以用来创建对象而已。  
要创建 Person 的新实例，必须使用 new 操作符。以这种方式调用构造函数实际上会经历以下 4  
个步骤：

1. 创建一个新对象；
2. 将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象）；
3. 执行构造函数中的代码（为这个新对象添加属性）；
4. 返回新对象。

**举个例子**

```js
function Person(name) {
  this.name = name
  this.showName = function() {
    alert(this.name)
  }
  console.log(this)
}
new Person('haha') //Person
Person('haha') //window
```

我们会发现当用 New 去调用一个函数的时候，this 的指向会不一样。其实 New 主要做了下面这些事，不过下面写的只是大概的行为，并不是内部源码

```js
function Person(name) {
  var obj = {} //声明一个空对象obj
  obj._proto_ = Person.prototype
  //把这个对象的_proto_属性指向构造函数的原型对象,这样obj就可以调用Person原型对象下的所有方法 ，这里原型先知道结论，下面会讲。
  Person.apply(obj) //用apply方法让this指向obj对象
  this.name = name //obj对象添加属性，方法
  this.showName = function() {
    alert(this.name)
  }
  return obj //返回这个对象
}
```

**函数构造模式存在的问题：**

```js
alert(p1.showName == p2.showName) //false
```

**可见这两个对象并不是共用一个方法**，每 new 一次，系统都会新创建一个内存，这两个对象各自有各自的地盘，但他们具有相同的功能，还不共用，肯定不是我们所希望的。所以就有了下一种方法，原型+构造模式 ==&gt;原型模式

## 原型模式

我们创建的每个函数都有一个 `prototype` （原型）属性，**这个属性是一个指针，指向一个对象**，而这个对象的用途是包含可以由特定类型的**所有实例共享的属性和方法**。如果按照字面意思来理解，那  
么 prototype 就是通过调用构造函数而创建的那个对象实例的原型对象。使用原型对象的好处是可以  
让所有对象实例共享它所包含的属性和方法。换句话说，不必在构造函数中定义对象实例的信息，而是  
可以将这些信息直接添加到原型对象中，如下面的例子所示。

```js
function Person(name) {
  this.name = name
}
Person.prototype.showName = function() {
  alert(this.name)
}
var p1 = new Person('haha')
p1.showName()
var p2 = new Person('hehe')
p2.showName()
alert(p1.showName == p2.showName) //true
```

测试为 true，可见 showName\(\)方法是共享的，也就是说他们共用一个内存，更进一步的说它们存在引用关系，也就是说你更改了 p1 的 showName 也会影响 p2 的 showName，而这个问题正是我们很少看到有人单独使用原型模式的原因所在。

## 组合使用构造函数模式和原型模式

创建自定义类型的最常见方式，就是组合使用构造函数模式与原型模式。构造函数模式用于定义实  
例属性，而原型模式用于定义方法和共享的属性。结果，每个实例都会有自己的一份实例属性的副本，  
但同时又共享着对方法的引用，最大限度地节省了内存。另外，这种混成模式还支持向构造函数传递参  
数；可谓是集两种模式之长。

```js
function Person(name, age, job) {
  this.name = name
  this.age = age
  this.job = job
  this.friends = ['Shelby', 'Court']
}
Person.prototype = {
  constructor: Person,
  sayName: function() {
    alert(this.name)
  }
}
var person1 = new Person('Nicholas', 29, 'Software Engineer')
var person2 = new Person('Greg', 27, 'Doctor')
person1.friends.push('Van')
alert(person1.friends) //"Shelby,Count,Van"
alert(person2.friends) //"Shelby,Count"
alert(person1.friends === person2.friends) //false
alert(person1.sayName === person2.sayName) //true
```

在这个例子中，实例属性都是在构造函数中定义的，而由所有实例共享的属性 constructor 和方  
法 sayName\(\) 则是在原型中定义的。而修改了 person1.friends （向其中添加一个新字符串），并不  
会影响到 person2.friends ，因为它们分别引用了不同的数组。

种构造函数与原型混成的模式，是目前在 ECMAScript 中使用最广泛、认同度最高的一种创建自定义类型的方法。可以说，这是用来定义引用类型的一种默认模式。

## 动态原型模式

有其他 OO 语言经验的开发人员在看到独立的构造函数和原型时，很可能会感到非常困惑。动态原型模式正是致力于解决这个问题的一个方案，它把所有信息都封装在了构造函数中，而通过在构造函数中初始化原型（仅在必要的情况下），又保持了同时使用构造函数和原型的优点。换句话说，可以通过检查某个应该存在的方法是否有效，来决定是否需要初始化原型。来看一个例子。

```js
function Person(name, age, job) {
  //属性
  this.name = name
  this.age = age
  this.job = job
  // 方法
  if (typeof this.sayName != 'function') {
    Person.prototype.sayName = function() {
      alert(this.name)
    }
  }
}
var friend = new Person('Nicholas', 29, 'Software Engineer')
friend.sayName()
```

注意构造函数代码中 if 判断语句的部分。这里只在 sayName\(\) 方法不存在的情况下，才会将它添加到原  
型中。这段代码只会在初次调用构造函数时才会执行。此后，原型已经完成初始化，不需要再做什么修  
改了。不过要记住，这里对原型所做的修改，能够立即在所有实例中得到反映。因此，这种方法确实可  
以说非常完美。其中， if 语句检查的可以是初始化之后应该存在的任何属性或方法——不必用一大堆  
if 语句检查每个属性和每个方法；只要检查其中一个即可。对于采用这种模式创建的对象，还可以使  
用 instanceof 操作符确定它的类型。

> 使用动态原型模式时，不能使用对象字面量重写原型。如果  
> 在已经创建了实例的情况下重写原型，那么就会切断现有实例与新原型之间的联系。

```js
function Person() {}
var friend = new Person()
Person.prototype = {
  constructor: Person,
  sayName: function() {
    alert(this.name)
  }
}
friend.sayName() //error
```

## 寄生构造函数模式

....
