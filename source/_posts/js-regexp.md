---
title: 正则表达式
date: 2018-08-25 00:39:14
categories: Javascript
tags:
  - Javascript
  - regexp
---

## 匹配出现次数

> 横向模糊指的是，一个正则可匹配的字符串的长度不是固定的，可以是多种情况的。

`{m,n}`，表示连续出现最少 m 次，最多 n 次。

```js
var regx = /ab{2,5}c/
var string = 'abc abbc abbbc abbbbc abbbbbc abbbbbbc'
string.match(regex) // => ["abbc", "abbbc", "abbbbc", "abbbbbc"]
```

## 匹配范围

> 纵向模糊指的是，一个正则匹配的字符串，具体到某一位字符时，它可以不是某个确定的字符，可以有多种
> 可能。

```js
var regex = /a[123]b/g
var string = 'a0b a1b a2b a3b a4b'
console.log(string.match(regex)) // => ["a1b", "a2b", "a3b"]
```

- `[123]` : 匹配 123 中任意一位数

* `[^123]` : 匹配除 1 2 3 之外的任意一个字符

  ```js
  var regx = /[^123]/
  regx.test('12') // false
  regx.test('1234') // true
  ```

* `[a-zA-Z]` : 匹配 26 位字母
* `[0-9]` : 匹配数字范围
* `/.^/` : 不匹配任何东西

### 贪婪匹配与惰性匹配

```js
var regex = /\d{2,5}/g
var string = '123 1234 12345 123456'
console.log(string.match(regex)) // => ["123", "1234", "12345", "12345"]
```

其中正则 `/\d{2,5}/`，表示数字连续出现 2 到 5 次。会匹配 2 位、3 位、4 位、5 位连续数字。

但是其是贪婪的，它会尽可能多的匹配。你能给我 6 个，我就要 5 个。你能给我 3 个，我就要 3 个。
反正只要在能力范围内，越多越好。

我们知道有时贪婪不是一件好事, 而惰性匹配，就是尽可能少的匹配：

```js
var regex = /\d{2,5}?/g
var string = '123 1234 12345 123456'
console.log(string.match(regex)) // => ["12", "12", "34", "12", "34", "12", "34", "56"]
```

其中 `/\d{2,5}?/` 表示，虽然 2 到 5 次都行，当 2 个就够的时候，就不再往下尝试了。

通过在量词后面加个问号就能实现惰性匹配，因此所有惰性匹配情形如下：

| 惰性量词 | 贪婪量词 |
| -------- | -------- |
| {m,n}?   | {m,n}    |
| {m,}?    | {m,}     |
| ??       | ?        |
| +?       | +        |
| \_?      | \_       |

对惰性匹配的记忆方式是：量词后面加个问号，问一问你知足了吗，你很贪婪吗？

## 匹配多项

> 一个模式可以实现横向和纵向模糊匹配。而多选分支可以支持多个子模式任选其一。

具体形式如下：`(p1|p2|p3)`，其中`p1`、`p2`和`p3`是子模式，用`|`（管道符）分隔，表示其中任何之一。

例如要匹配"good"和"nice"可以使用`/good|nice/`。测试如下：

```js
var regex = /good|nice/g
var string = 'good idea, nice try.'
console.log(string.match(regex)) // => ["good", "nice"]
```

但有个事实我们应该注意，比如我用/`good|goodbye/`，去匹配"goodbye"字符串时，结果是"good"：

```js
var regex = /good|goodbye/g
var string = "goodbye"
console.log( string.match(regex) ) // => ["good"]

// 而把正则改成/goodbye|good/，结果是：
var regex2 = /goodbye|good/g
console.log( string.match(regex) ) // => ["goodbye"]
```

也就是说，分支结构也是惰性的，即当前面的匹配上了，后面的就不再尝试了。

## 匹配位置

- `^` : 匹配开头
- `$` : 匹配结尾
- `\b` : 匹配单词边界
- `\B` : 匹配非单词边界
- `(?=p)` : 匹配 p 前面的位置
- `(?!p)` : 匹配 p 后面的位置

1. `^ $`
  ```js
  // 字符串的开头和结尾用"#"替换：
  var result = "hello".replace(/^|$/g, '#')
  console.log(result) // => "#hello#"
  ```
2. `\b \B`
  ```js
  var result = "[JS] Lesson_01.mp4".replace(/\b/g, '#')
  console.log(result) // => "[#JS#] #Lesson_01#.#mp4#"
  ```
3. `(?=p)(?!p)`
   ```js
   var result = "hello".replace(/(?=l)/g, '#') // "he#l#lo"
   var result2 = "hello".replace(/(?!l)/g, '#') // "#h#ell#o#"
   ```

数字的千位分隔符表示法

```js
var result = "12345678".replace(/(?=\d{3}$)/g, ',') // 12,345,678
```

## 分组

我们知道`/a+/`匹配连续出现的“a”，而要匹配连续出现的“ab”时，需要使用`/(ab)+/`。

其中括号是提供分组功能，使量词`+`作用于“ab”这个整体，测试如下：

```js
var regex = /(ab)+/g
var string = 'ababa abbb ababab'
console.log(string.match(regex)) // => ["abab", "ab", "ababab"]
```

### 引用分组

> 这是括号一个重要的作用，有了它，我们就可以进行数据提取，以及更强大的替换操作。

```js
var regex = /(\d{4})-(\d{2})-(\d{2})/
var string = "2017-06-12"

string.replace(regex, ($1, $2, $3) => {
  console.log($1, $2, $3) // 2017-06-12 2017 06
})

var result = string.replace(regex, '$2/$3/$1') // 06/12/2017
```

...

## 实战

1. 0 ≤ x ≤ 50 整数: `/^(\d|[1-4]\d|50)$/g`
2. -1000 ≤ x ≤ 1000 : `/^-?(\d{1,3}|1000)$/`
3. -1000 ≤ x ≤ 2000 : `/^-?(\d{1,3}|1000)$|^(1\d{3}|2000)$/`


### 匹配数字范围




## 参考

[JS正则表达式完整教程（略长）](https://juejin.im/post/5965943ff265da6c30653879#heading-35)
