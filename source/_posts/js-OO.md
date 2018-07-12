---
title: js-OO
date: 2018-07-11 19:34:36
comments: true #是否可评论
categories: Javascript
tags: 
   - Javascript
   - 面对对象
toc: true
keywords: 面对对象
---
`router` 是hash改变
`loaction.href`是页面跳转

css
```css
animation:mymove 5s infinite;
@keyframes mymove {
from {top:0px;}
to {top:200px;}
}
```
```js
JSON.stringify(obj)==JSON.stringify(obj2);//true
JSON.stringify(obj)==JSON.stringify(obj3);//fals
```
html

```html
<style>
body{
    display: flex;
}
.left{
    background-color: rebeccapurple;
    height: 200px;
    flex: 1;
}
.right{
    background-color: red;
    height: 200px;
    width: 100px;
}
</style>
<body>
    <div class="left"></div>
    <div class="right"></div>
</body>
```

## 理解对象
#### 对象的数据属性
数据属性包含一个数据值的位置。在这个位置可以读取和写入值。数据属性有 4 个描述其行为的 特性。
- [[Configurable]] ：表示能否通过 delete 删除属性从而重新定义属性，能否修改属性的特 性，或者能否把属性修改为访问器属性。像前面例子中那样直接在对象上定义的属性，它们的 这个特性默认值为 true 。
- [[Enumerable]] ：表示能否通过 for-in 循环返回属性。像前面例子中那样直接在对象上定 义的属性，它们的这个特性默认值为 true 。
- [[Writable]] ：表示能否修改属性的值。像前面例子中那样直接在对象上定义的属性，它们的 个特性默认值为 true 。
- [[Value]] ：包含这个属性的数据值。
	
- 对象的访问器属性
	- configurable enumerable
	- get set

> 定义对象属性的方法 Object.defineProperty(对象, 对象的属性, 属性的描述符)
> 读取对象属性的方法 Object.getOwnPropertyDescriptor(对象, 对象的属性)

