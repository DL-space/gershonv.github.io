---
title: js - 继承
date: 2018-10-16 09:12:50
categories: Javascript
tags: Javascript
toc: true
comments: true
---

# 继承

- [原型链](#原型链)
  - `prototype` 共享属性/方法，实例之间相互影响
  - 执行对给定对象的浅
    复制 **child.prototype = new Father\(\)**
- [借用构造函数](#借用构造函数)
  - 解决原型中包含引用类型值所带来问题，通过使用 call、apply 在新创建的对象执行构造函数
  - **function Child\(\){ Father.call\(this\) }**
  - 无法实现函数复用
- [组合继承](#组合继承)
  - 使用原型链实现对原型属性和方法的继承，使用构造函数来实现对实例属性的继承。
  - 实现了函数
    复用，又能够保证每个实例都有它自己的属性
  - 组合继承最大的
    问题就是无论什么情况下，都会调用两次超类型构造函数
- [寄生组合式继承](#寄生组合式继承)
  - 使用寄生式继承来继承超类型的原型，然后再将结果指定给子类型
    的原型

继承是 OO 语言中的一个最为人津津乐道的概念。许多 OO 语言都支持两种继承方式：接口继承和实现继承。接口继承只继承方法签名，而实现继承则继承实际的方法。

## 原型链

ECMAScript 中描述了原型链的概念，并将原型链作为实现继承的主要方法。其基本思想是利用原型让一个引用类型继承另一个引用类型的属性和方法。简单回顾一下构造函数、原型和实例的关系：每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个指向原型对象的内部指针。那么，假如我们让原型对象等于另一个类型的实例，结果会怎么样呢？显然，此时的原型对象将包含一个指向另一个原型的指针，相应地，另一个原型中也包含着一个指向另一个构造函数的指针。假如另一个原型又是另一个类型的实例，那么上述关系依然成立，如此层层递进，就构成了实例与原型的链条。这就是所谓原型链的基本概念。

实现原型链有一种基本模式，其代码大致如下。

```js
function SuperType() {
  this.property = true
}

SuperType.prototype.getSuperValue = function() {
  return this.property
}

function SubType() {
  this.Subproperty = false
}

SubType.prototype = new SuperType()

SuperType.prototype.getSubValue = function() {
  return this.subproperty
}

var instance = new SubType()
console.log(instance.getSuperValue())
```

以上代码定义了两个类型： SuperType 和 SubType 。每个类型分别有一个属性和一个方法。它们的主要区别是 SubType 继承了 SuperType ，而继承是通过创建 SuperType 的实例，并将该实例赋给 SubType.prototype 实现的。实现的本质是重写原型对象，代之以一个新类型的实例。换句话说，原来存在于 SuperType 的实例中的所有属性和方法，现在也存在于 SubType.prototype 中了。在确立了继承关系之后，我们给 SubType.prototype 添加了一个方法，这样就在继承了 SuperType 的属性和方法的基础上又添加了一个新方法。这个例子中的实例以及构造函数和原型之间的关系如图

![](/assets/prototype2.png)

通过原型链，本质上扩展了原型搜索机制。在 instance.getSuperValue\(\)调用会经历三个搜索步骤

1. 搜索实例
2. 搜索原型对象
3. 搜索父类原型对象

instance 指向 SubType 的 原 型 ， SubType 的 原 型 又 指 向 SuperType 的 原 型 。 getSuperValue\(\) 方 法 仍 然 还 在 SuperType.prototype 中，但 property 则位于 SubType.prototype 中。

#### **原型链的问题**

原型链这么强大，同样也会造成问题。最主要的问题来自于包含引用类型的原型。引用类型的原型属性会被虽有实例共享，在通过原型来实现继承时，原型会变成另一个类型的实例，原先的实例属性也就顺理成章变成来现在的原型属性。

```js
function SuperType() {
  this.colors = ['red', 'blue', 'green']
}

function SubType() {}
//继承了 SuperType
SubType.prototype = new SuperType()
var instance1 = new SubType()
instance1.colors.push('black')
alert(instance1.colors) //"red,blue,green,black"
var instance2 = new SubType()
alert(instance2.colors) //"red,blue,green,black" ======> 实例 instance2 的 colors 也被更新了
```

还有一个问题，就是不能在创建子类性时，像父类型的构造函数传递参数。所以我们一般很少单独使用原型链。

## 借用构造函数

在解决原型中包含引用类型值所带来问题的过程中，开发人员开始使用一种叫做借用构造函数（constructor stealing）的技术。这种技术的基本思想相当简单，即在子类型构造函数的内部调用超类型构造函数。别忘了，函数只不过是在特定环境中执行代码的对象，  
**因此通过使用 apply\(\) 和 call\(\) 方法也可以在（将来）新创建的对象上执行构造函数**，如下所示：

```js
function SuperType() {
  this.colors = ['red', 'blue', 'green']
}

function SubType() {
  // 继承了 SuperType
  SuperType.call(this)
  // 通过使用 call() 方法 在新创建的 SubType 实例的环境下调用了 SuperType 构造函数
  // 这样一来，就会在新 SubType 对象上执行 SuperType() 函数中定义的所有对象初始化代码
}
var instance1 = new SubType()
instance1.colors.push('black')
alert(instance1.colors) //"red,blue,green,black"
var instance2 = new SubType()
alert(instance2.colors) //"red,blue,green"
```

借用构造函数的问题：如果仅仅是借用构造函数，那么也将无法避免构造函数模式存在的问题——方法都在构造函数中定义，因此函数复用就无从谈起了。而且，在超类型的原型中定义的方法，对子类型而言也是不可见的，结果所有类型都只能使用构造函数模式。考虑到这些问题，借用构造函数的技术也是很少单独使用的。

## 组合继承

将原型链和借用构造函数的
技术组合到一块：其背后的思路是使用原型链实现对原型属性和方
法的继承，而通过借用构造函数来实现对实例属性的继承。这样，既通过在原型上定义方法实现了函数
复用，又能够保证每个实例都有它自己的属性。

```js
function SuperType(name) { //SuperType 构造函数定义了两个属性： name 和 colors
    this.name = name;
    this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function () { // 原型上定义了sayName方法，其实例共享这个方法
    alert(this.name);
};

function SubType(name, age) {
    //继承属性
    SuperType.call(this, name); // 调用 SuperType 构造函数时传入了 name 参数
    this.age = age;             // 定义了它自己的属性 age
}
//继承方法
SubType.prototype = new SuperType();     // 将 SuperType 的实例赋值给 SubType 的原型
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function () { // 在该新原型
上定义了方法 sayAge()
    alert(this.age);
};
var instance1 = new SubType("Nicholas", 29);
instance1.colors.push("black");
alert(instance1.colors);         //"red,blue,green,black"
instance1.sayName();             //"Nicholas";
instance1.sayAge();              //29
var instance2 = new SubType("Greg", 27);
alert(instance2.colors);     //"red,blue,green"
instance2.sayName();         //"Greg";
instance2.sayAge();         //27
```

1. 在这个例子中， SuperType 构造函数定义了两个属性： name 和 colors ，其原型定义了一个方法 sayName
2. SubType 构造函数在调用 SuperType 构造函数时传入了 name 参数，紧接着
   又定义了它自己的属性 age 。
3. 然后，将 SuperType 的实例赋值给 SubType 的原型，然后又在该新原型
   上定义了方法 sayAge\(\)
4. 这样一来，就可以让两个不同的 SubType 实例既分别拥有自己属性——包
   括 colors 属性，又可以使用相同的方法了。

组合继承避免了原型链和借用构造函数的缺陷，融合了它们的优点，成为 JavaScript 中最常用的继承模式。而且， instanceof 和 isPrototypeOf\(\) 也能够用于识别基于组合继承创建的对象。

## 寄生组合式继承

组合继承是 JavaScript 最常用的继承模式；不过，它也有自己的不足。组合继承最大的
问题就是无论什么情况下，都会调用两次超类型构造函数：一次是在创建子类型原型的时候，另一次是
在子类型构造函数内部。没错，子类型最终会包含超类型对象的全部实例属性，但我们不得不在调用子
类型构造函数时重写这些属性。

```js
function SuperType(name) {
  this.name = name
}

SuperType.prototype.sayName = function() {
  console.log(this.name)
}

function SubType(name, age) {
  // 继承了 SuperType
  SuperType.call(this, name) //第二次调用

  this.age = age
}
SubType.prototype = new SuperType() // 第一次调用

var instance1 = new SubType()
console.log(instance1.name)
```

我们不必为了指定子类型的原型调用超类型的构造函数，我们所需要的不过是超类型原型的一个副本而已。本质上，就是使用寄生式继承来继承超类型的原型，然后再将结果指定给子类型
的原型。寄生组合式继承的基本模式如下所示。

```js
function inheritPrototype(subType, superType) {
  var prototype = object(superType.prototype) //创建对象
  prototype.constructor = subType //增强对象
  subType.prototype = prototype //指定对象
}
```

```js
function SuperType(name) {
  this.name = name
  this.color = ['red', 'blue', 'green']
}

SuperType.prototype.sayName = function() {
  console.log(this.name)
}

function SubType(name, age) {
  SuperType.call(this, name)
  this.age = age
}

SubType.prototype = Object.create(SuperType.prototype)

SubType.prototype.constructor = SubType
```
