---
title: HTTP - keep-alive
date: 2018-11-23 14:16:16
categories: HTTP
tags: HTTP
---

## HTTP 协议是无状态的

`HTTP` 协议是无状态的，指的是协议对于事务处理没有记忆能力，服务器不知道客户端是什么状态。也就是说，打开一个服务器上的网页和你之前打开这个服务器上的网页之间没有任何联系。`HTTP` 是一个无状态的面向连接的协议，无状态不代表 `HTTP` 不能保持 `TCP` 连接，更不能代表 `HTTP` 使用的是 `UDP` 协议（无连接）。

## 什么是长连接、短连接？

在 `HTTP/1.0` 中，默认使用的是短连接。也就是说，浏览器和服务器每进行一次 `HTTP` 操作，就要经过[三次握手](https://gershonv.github.io/2018/11/21/http-TCP/)建立一次连接，但任务结束就中断连接。

客户端浏览器访问的某个 `HTML` 或其他类型的 `Web` 页中包含有其他的 `Web` 资源，如 JavaScript 文件、图像文件、CSS 文件等；当浏览器每遇到这样一个 Web 资源，就会建立一个 HTTP 会话。但从  `HTTP/1.1` 起，默认使用长连接，用以保持连接特性。使用长连接的 HTTP 协议，会在响应头有加入这行代码：

```js
'Connection': 'keep-alive'
```

## 实战

- `test.html`

```html
<body>
  <img src="/test1.jpg" alt="" /> <img src="/test2.jpg" alt="" />
  <img src="/test3.jpg" alt="" /> <img src="/test4.jpg" alt="" />
  <img src="/test5.jpg" alt="" /> <img src="/test6.jpg" alt="" />
  <img src="/test7.jpg" alt="" /> <img src="/test11.jpg" alt="" />
  <img src="/test12.jpg" alt="" /> <img src="/test13.jpg" alt="" />
  <img src="/test14.jpg" alt="" /> <img src="/test15.jpg" alt="" />
  <img src="/test16.jpg" alt="" /> <img src="/test17.jpg" alt="" />
  <img src="/test111.jpg" alt="" /> <img src="/test112.jpg" alt="" />
  <img src="/test113.jpg" alt="" /> <img src="/test114.jpg" alt="" />
  <img src="/test115.jpg" alt="" /> <img src="/test116.jpg" alt="" />
</body>
```

- `server.js`

```js
const http = require('http')
const fs = require('fs')

http
  .createServer(function(request, response) {
    console.log('request come', request.url)

    const html = fs.readFileSync('test.html', 'utf8')
    const img = fs.readFileSync('test.jpg')
    if (request.url === '/') {
      response.writeHead(200, {
        'Content-Type': 'text/html'
      })
      response.end(html)
    } else {
      response.writeHead(200, {
        'Content-Type': 'image/jpg',
        Connection: 'keep-alive' // or close HTTP/1.1 起 默认 keep-alive
      })
      response.end(img)
    }
  })
  .listen(8888)

console.log('server listening on 8888')
```
