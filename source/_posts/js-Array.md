---
title: 数组常用操作
date: 2018-07-08 20:26:08
comments: true #是否可评论
tags:
   - Javascript
   - Array
toc: true
categories: Javascript
keywords: 
- Array
- Javascript
---
### 合并数组

#### concat

```javascript
var a = [1, 2, 3]
var b = [3, 4, 5]
var c = a.concat(b)
```
concat方法连接a、b两个数组后，a、b两个数组的数据不变，同时会返回一个新的数组。这样当我们需要进行多次的数组合并时，会造成很大的内存浪费，所以这个方法肯定不是最好的。

#### for循环
```javascript
for (var key in b){
    a.push(key);
}
```
这样的写法可以解决第一种方案中对内存的浪费，但是会有另一个问题：丑！这么说不是没有道理，如果能只用一行代码就搞定，岂不快哉~

#### apply
```javascript
a.push.apply(a,b)
```
调用a.push这个函数实例的apply方法，同时把，b当作参数传入，这样a.push这个方法就会遍历b数组的所有元素，达到合并的效果。
另外，还要注意两个小问题：
以上3种合并方法并没有考虑过a、b两个数组谁的长度更小。所以好的做法是预先判断a、b两个数组哪个更大，然后使用大数组合并小数组，这样就减少了数组元素操作的次数！

#### 扩展符
```javascript
var a = [...[1, 2, 3], ...[5, 6]]
```

### JSON数组常用操作

#### json数组去重
```javascript
/*
 * JSON数组去重
 * @param: [array] json Array
 * @param: [string] 唯一的key名，根据此键名进行去重
 */
function unique_JSON_Array(array, key) {
  let result = [array[0]]
  for (let i = 0; i < array.length; i++) {
    let item = array[i]
    let repeat = false
    for (let j = 0; j < result.length; j++) {
      if (item[key] === result[j][key]) {
        repeat = true
        break
      }
    }
    if (!repeat) {
      result.push(item)
    }
  }
  return result
}
```
