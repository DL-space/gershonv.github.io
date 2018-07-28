---
title: ES6-Class
date: 2018-07-16 22:19:09
categories: Javascript
tags: 
    - Javascript
    - ES6
toc: true
comments: true  
---
## 简介
JavaScript 语言中，生成实例对象的传统方法是通过构造函数。下面是一个例子。
```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
};

var p = new Point(1, 2);
```
ES6 提供了更接近传统语言的写法，引入了 Class（类）这个概念，作为对象的模板。通过`class`关键字，可以定义类。
```js
//定义类
class Point {
  constructor(x, y) {
    this.x = x; // this 代表实例对象
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
```
- `constructor`: 构造方法，类的默认方法，通过new命令生成对象实例时，自动调用该方法。
  - 一个类必须有constructor方法，如果没有显式定义，一个空的constructor方法会被默认添加。
- `this`: 关键对象

> 定义“类”的方法的时候，前面不需要加上function这个关键字，直接把函数定义放进去了就可以了。另外，方法之间不需要逗号分隔，加了会报错。

ES6 的类，完全可以看作构造函数的另一种写法。
```js
class Point {
  // ...
}

typeof Point // "function" ==> 类的数据类型就是函数
Point === Point.prototype.constructor // true ==> 类本身就指向构造函数

// 定义与使用
class Bar {
  doStuff() {
    console.log('stuff');
  }
}

var b = new Bar(); // new 默认执行Bar类的 constructor 方法，该方法默认返回实例对象 即this
b.doStuff() // "stuff"
```

构造函数的`prototype`属性，在 ES6 的“类”上面继续存在。事实上，类的所有方法都定义在类的`prototype`属性上面。

```js
class Point {
  constructor() {
    // ...
  }

  toString() {
    // ...
  }

  toValue() {
    // ...
  }
}

// 等同于
Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
};
```
在类的实例上面调用方法，其实就是调用原型上的方法。
```js
class B {}
let b = new B();

b.constructor === B.prototype.constructor // true
```
由于类的方法都定义在`prototype`对象上面，所以类的新方法可以添加在`prototype`对象上面。Object.assign方法可以很方便地一次向类添加多个方法。

```js
class Point {
  constructor(){
    // ...
  }
}

Object.assign(Point.prototype, {
  toString(){},
  toValue(){}
});

// prototype对象的constructor属性，直接指向“类”的本身，这与 ES5 的行为是一致的
Point.prototype.constructor === Point // true

Object.keys(Point.prototype) // [] ==> 类的内部所有定义的方法，都是不可枚举的（non-enumerable）这一点与 ES5 的行为不一致
```
类的属性名，可以采用表达式。
```js
let methodName = 'getArea';

class Square {
  constructor(length) {
    // ...
  }

  [methodName]() {
    // ...
  }
}
```

## 类的实例对象
与 ES5 一样，实例的属性除非显式定义在其本身（即定义在`this`对象上），否则都是定义在原型上（即定义在`class`上）。
```js
//定义类
class Point {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }

}

var point = new Point(2, 3);

point.toString() // (2, 3)

point.hasOwnProperty('x') // true
point.hasOwnProperty('y') // true
point.hasOwnProperty('toString') // false
point.__proto__.hasOwnProperty('toString') // true
```
`hasOwnProperty`: 查找对象原型上是否有某属性 （上面代码表示 `toString` 保存在`Point`类中，point 是通过原型链获得 `toString` 方法） 

## Class 表达式
与函数一样，类也可以使用表达式的形式定义。
```js
const MyClass = class Me { 
  getClassName() {
    return Me.name; // 内部可以使用到这个类Me
  }
};

// 这个类的名字是MyClass而不是Me，Me只在 Class 的内部代码可用，指代当前类
let inst = new MyClass();
inst.getClassName() // Me
Me.name // ReferenceError: Me is not defined
```
如果类的内部没用到的话，可以省略`Me`，也就是可以写成下面的形式。
```js
const MyClass = class { /* ... */ };
```
采用 Class 表达式，可以写出立即执行的 Class。
```js
let person = new class {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
}('张三');

person.sayName(); // "张三"
```
## 私有方法和私有属性
私有方法是常见需求，但 `ES6` 不提供，只能通过变通方法模拟实现。

在命名上加以区别: 
```js
lass Widget {

  // 公有方法
  foo (baz) {
    this._bar(baz);
  }

  // 私有方法
  _bar(baz) {
    return this.snaf = baz;
  }

  // ...
}
// 不保险的，在类的外部，还是可以调用到这个方法
```

将私有方法移出模块，因为模块内部的所有方法都是对外可见的:
```js
class Widget {
  foo (baz) {
    bar.call(this, baz);
  }

  // ...
}

function bar(baz) {
  return this.snaf = baz;
}
```
上面代码中，foo是公有方法，内部调用了bar.call(this, baz)。这使得bar实际上成为了当前模块的私有方法。

利用`Symbol`值的唯一性，将私有方法的名字命名为一个`Symbol`值:
```js
onst bar = Symbol('bar');
const snaf = Symbol('snaf');

export default class myClass{

  // 公有方法
  foo(baz) {
    this[bar](baz);
  }

  // 私有方法
  [bar](baz) {
    return this[snaf] = baz;
  }

  // ...
};
```
上面代码中，bar和snaf都是Symbol值，导致第三方无法获取到它们，因此达到了私有方法和私有属性的效果。

## this 的指向
类的方法内部如果含有`this`，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能报错。
```js
class Logger {
  printName(name = 'there') {
    // this 默认指向 Logger
    this.print(`Hello ${name}`);
  }

  print(text) {
    console.log(text);
  }
}

const logger = new Logger();
const { printName } = logger;
printName(); // TypeError: Cannot read property 'print' of undefined
// this会指向该方法运行时所在的环境，因为找不到print方法而导致报错。
```

解决办法
- 在构造方法中绑定`this`
```js
class Logger {
  constructor() {
    this.printName = this.printName.bind(this);
  }

  // ...
}
```
- 箭头函数
```js
class Logger {
  constructor() {
    this.printName = (name = 'there') => {
      this.print(`Hello ${name}`);
    };
  }
  // ...
}
```
- 使用`Proxy`，获取方法的时候，自动绑定`this`
```js
unction selfish (target) {
  const cache = new WeakMap();
  const handler = {
    get (target, key) {
      const value = Reflect.get(target, key);
      if (typeof value !== 'function') {
        return value;
      }
      if (!cache.has(value)) {
        cache.set(value, value.bind(target));
      }
      return cache.get(value);
    }
  };
  const proxy = new Proxy(target, handler);
  return proxy;
}

const logger = selfish(new Logger());
```

## getter setter
与 ES5 一样，在“类”的内部可以使用`get`和`set`关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。
```js
class MyClass {
  constructor() {
    // ...
  }
  get prop() {
    return 'getter';
  }
  set prop(value) {
    console.log('setter: '+value);
  }
}

let inst = new MyClass();

inst.prop = 123;
// setter: 123

inst.prop
// 'getter'
```
存值函数和取值函数是设置在属性的 Descriptor 对象上的

## Class 的 Generator 方法
todo // 对Generator不熟悉，待下次理解了在写

## Class 的静态方法 
静态方法：不会被实例继承，而是直接通过类来调用。
> 类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用

```js
class Foo {
  static classMethod() {
    return 'hello';
  }
}

Foo.classMethod() // 'hello'

var foo = new Foo();
foo.classMethod()
// TypeError: foo.classMethod is not a function
```
> 注意，如果静态方法包含`this`关键字，这个`this`指的是类，而不是实例。
```js
class Foo {
  static bar () {
    this.baz();
  }
  static baz () {
    console.log('hello');
  }
  baz () {
    console.log('world');
  }
}

Foo.bar() // hello
```

**父类的静态方法，可以被子类继承。**
```js
class Foo {
  static classMethod() {
    return 'hello';
  }
}

class Bar extends Foo {
}

Bar.classMethod() // 'hello'
```

**静态方法也是可以从`super`对象上调用的**
```js
class Foo {
  static classMethod() {
    return 'hello';
  }
}

class Bar extends Foo {
  static classMethod() {
    return super.classMethod() + ', too';
  }
}

Bar.classMethod() // "hello, too"
```
## Class 的静态属性和实例属性 
静态属性：`Class` 本身的属性，即`Class.propName`，而不是定义在实例对象（`this`）上的属性。
```js
class Foo {
}

Foo.prop = 1;
Foo.prop // 1
```
>  ES6 明确规定，Class 内部只有静态方法，没有静态属性


写法无效如下：
```js
// 以下两种写法都无效
class Foo {
  // 写法一
  prop: 2

  // 写法二
  static prop: 2
}

Foo.prop // undefined
```

类的实例属性
类的实例属性可以用等式，写入类的定义之中
```js
class MyClass {
  myProp = 42;

  constructor() {
    console.log(this.myProp); // 42
  }
}
```

类的静态属性
类的静态属性只要在上面的实例属性写法前面，加上`static`关键字就可以了。
```js
class MyClass {
  static myStaticProp = 42;

  constructor() {
    console.log(MyClass.myStaticProp); // 42
  }
}
var p = new MyClass(); // p 中实例属性没有 myStaticProp 
```