---
title: HTTP - 跨域
date: 2018-11-22 14:10:57
categories: HTTP
tags:
  - HTTP
  - 跨域
---

## 什么是跨域

> 跨域，是指浏览器不能执行其他网站的脚本。它是由**浏览器的同源策略**造成的，是浏览器对 JavaScript 实施的安全限制。

我们可以简单的重现浏览器的跨域问题：

- `server.js` 模拟客户端：

```js
const http = require('http')
const fs = require('fs')

http
  .createServer(function(request, response) {
    console.log('request come', request.url)
    const html = fs.readFileSync('demo.html', 'utf8')
    response.writeHead(200, {
      'Content-Type': 'text/html'
    })
    response.end(html)
  })
  .listen(3300) // http://127.0.0.1:3300
```

- `demo.html` 展示的页面：

```html
<body>
  <div>demo.html</div>
  <script>
    const xhr = new XMLHttpRequest()
    xhr.open('GET', 'http://127.0.0.1:6060')
    xhr.send()
  </script>
</body>
```

- `server2.js` 模拟服务端：

```js
const http = require('http')

http
  .createServer(function(request, response) {
    console.log('request come', request.url)
    response.end('server2 response')
  })
  .listen(6060)

console.log('server listening on 6060')
```

打开 `http://127.0.0.1:3300` 即可看到

Access to XMLHttpRequest at '`http://127.0.0.1:6060/`' from origin '`http://127.0.0.1:3300`' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

后续将讲到如何去解决这个问题。

## 常见的跨域场景

> 所谓的同源是指，域名、协议、端口均为相同。

```
URL                                      说明                    是否允许通信
http://www.domain.com/a.js
http://www.domain.com/b.js         同一域名，不同文件或路径           允许
http://www.domain.com/lab/c.js

http://www.domain.com:8000/a.js
http://www.domain.com/b.js         同一域名，不同端口                不允许

http://www.domain.com/a.js
https://www.domain.com/b.js        同一域名，不同协议                不允许

http://www.domain.com/a.js
http://192.168.4.12/b.js           域名和域名对应相同ip              不允许

http://www.domain.com/a.js
http://x.domain.com/b.js           主域相同，子域不同                不允许
http://domain.com/c.js

http://www.domain1.com/a.js
http://www.domain2.com/b.js        不同域名                         不允许
```

跨域的解决方法如下

## JSONP

> `HTML` 标签里，一些标签比如 `script、img` 这样的获取资源的标签是没有跨域限制的

`jsonp` 原生的实现方式（以前面的代码为例）

- `demo.html`

```html
<body>
  <div>demo.html</div>
  <script>
    // 1. 动态创建 script，并引入地址；2. 插入html中；3.通过callback 回调得到数据
    let script = document.createElement('script')
    script.src = 'http://127.0.0.1:6060/login?username=guodada&callback=onBack'
    document.body.appendChild(script)
    function onBack(res) {
      console.log(res)
    }
  </script>
</body>
```

- `server2.js` 服务端：

```js
const http = require('http')
const url = require('url')

http
  .createServer(function(request, response) {
    console.log('request come', request.url)
    const data = { name: 'guodada' } // 需要传递的数据

    const { callback } = url.parse(request.url, true).query // 处理 get 请求, 拿到callback

    response.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' })
    const jsonpCallback = callback + `(${JSON.stringify(data)})` // 相当于 onBack({"name":"guodada"})
    response.end(jsonpCallback)
  })
  .listen(6060)

console.log('server listening on 6060')
```

虽然这种方式非常好用，但是一个最大的缺陷是，只能够实现 `get` 请求

## CORS

### 简介

因为是目前主流的跨域解决方案。`CORS` 是一个 W3C 标准，全称是"跨域资源共享"（`Cross-origin resource sharing`）。它允许浏览器向跨源服务器，发出 `XMLHttpRequest` 请求，从而克服了 `AJAX` 只能同源使用的限制。

`CORS` 需要浏览器和服务器同时支持。目前，所有浏览器都支持该功能，IE 浏览器不能低于 `IE10`。IE8+：IE8/9 需要使用 `XDomainRequest` 对象来支持 `CORS`。

整个 `CORS` 通信过程，都是浏览器自动完成，不需要用户参与。对于开发者来说，`CORS` 通信与同源的 `AJAX` 通信没有差别，代码完全一样。浏览器一旦发现 `AJAX` 请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感觉。因此，实现 `CORS` 通信的关键是服务器。只要服务器实现了 `CORS` 接口，就可以跨源通信。

浏览器将 `CORS` 请求分成两类：简单请求（`simple request`）和非简单请求（`not-so-simple request`）。
只要同时满足以下两大条件，就属于简单请求。

1. 请求方式为 `HEAD`、`POST` 或者 `GET`
2. HTTP 的头信息不超出以下几种字段：
   - `Accept`
   - `Accept-Language`
   - `Content-Language`
   - `Last-Event-ID`
   - Content-Type：只限于三个值 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`

### 简单请求

> 对于简单请求，浏览器直接发出 `CORS` 请求。具体来说，就是在头信息之中，增加一个 `Origin` 字段。 下面是一个例子，浏览器发现这次跨源 `AJAX` 请求是简单请求，就自动在头信息之中，添加一个 `Origin` 字段。

`server2.js`

```js
const http = require('http')

http
  .createServer(function(request, response) {
    console.log('request come', request.url)

    response.writeHead(200, {
      'Access-Control-Allow-Origin': 'http://127.0.0.1:3300', // 只有 http://127.0.0.1:3300 才能访问
      'Access-Control-Allow-Credentials': true, // 允许携带 cookie
      'Content-Type': 'text/html; charset=utf-8'
    })

    response.end('hello cors')
  })
  .listen(6060)

console.log('server listening on 6060')
```

- `demo.html`

```html
<body>
  <div>demo.html</div>
  <script>
    const xhr = new XMLHttpRequest()
    xhr.withCredentials = true // server: 'Access-Control-Allow-Credentials': true

    xhr.open('GET', 'http://127.0.0.1:6060')
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send()
  </script>
</body>
```

- `Access-Control-Allow-Origin` : 该字段是必须的。它的值要么是请求时 `Origin` 字段的值，要么是一个`*`，表示接受任意域名的请求
- `Access-Control-Allow-Credentials`: 表示是否允许发送 `Cookie`
- `Access-Control-Expose-Headers`: CORS 请求时，`XMLHttpRequest` 对象的 `getResponseHeader()`方法只能拿到 6 个基本字段：`Cache-Control`、`Content-Language`、`Content-Type`、`Expires`、`Last-Modified`、`Pragma`。如果想拿到其他字段，就必须在 `Access-Control-Expose-Headers` 里面指定。

#### withCredentials 属性

上面说到，CORS 请求默认不发送 `Cookie` 和 `HTTP` 认证信息。如果要把 `Cookie` 发到服务器，一方面要服务器同意，指定 `Access-Control-Allow-Credentials` 字段。

否则，即使服务器同意发送 `Cookie`，浏览器也不会发送。或者，服务器要求设置 `Cookie`，浏览器也不会处理。 但是，如果省略 `withCredentials` 设置，有的浏览器还是会一起发送 `Cookie`。这时，可以显式关闭 `withCredentials`。

需要注意的是，如果要发送 `Cookie`，`Access-Control-Allow-Origin` 就不能设为星号，必须指定明确的、与请求网页一致的域名。同时，`Cookie` 依然遵循同源政策，只有用服务器域名设置的 `Cookie` 才会上传，其他域名的 `Cookie` 并不会上传，且（跨源）原网页代码中的 `document.cookie` 也无法读取服务器域名下的 `Cookie`。

### 非简单请求

> 非简单请求是那种对服务器有特殊要求的请求，比如请求方法是 `PUT` 或 `DELETE`，或者 `Content-Type` 字段的类型是 `application/json`。

非简单请求的 `CORS` 请求，会在正式通信之前，增加一次 `HTTP` 查询请求，称为"预检"请求（`preflight`）。

浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些 `HTTP` 动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的 `XMLHttpRequest` 请求，否则就报错。

- `demo.html`

```js
// 部分代码
const xhr = new XMLHttpRequest()
xhr.withCredentials = true // 允许携带 cookie

xhr.open('PUT', 'http://127.0.0.1:6060') // 使用 put 请求，server：'Access-Control-Request-Method': 'PUT'
xhr.setRequestHeader('X-Test-Cors', '123') // 设置预检头
xhr.send()
```

- `server2.js`

```js
const http = require('http')

http
  .createServer(function(request, response) {
    response.writeHead(200, {
      'Access-Control-Allow-Origin': 'http://127.0.0.1:3300', // 只有 http://127.0.0.1:3300 才能访问
      'Access-Control-Allow-Credentials': true, // 允许携带 cookie
      'Access-Control-Allow-Headers': 'X-Test-Cors', // 预检， 如果请求头中有 X-Test-Cors 才通过
      'Access-Control-Allow-Methods': 'POST, PUT, DELETE', // 支持
      'Access-Control-Max-Age': '1000' // 指定本次预检请求的有效期，单位为秒
    })

    response.end('hello cors')
  })
  .listen(6060)

console.log('server listening on 6060')
```

- `Access-Control-Allow-Methods`: 返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求。
- `Access-Control-Allow-Headers`: 如果浏览器请求包括 `Access-Control-Request-Headers` 字段，则 `Access-Control-Allow-Headers` 字段是必需的。
- `Access-Control-Max-Age`: 用来指定本次预检请求的有效期，单位为秒。

`CORS` 与 `JSONP` 的使用目的相同，但是比 `JSONP` 更强大。`JSONP` 只支持 `GET` 请求，`CORS` 支持所有类型的 `HTTP` 请求。`JSONP` 的优势在于支持老式浏览器，以及可以向不支持 `CORS` 的网站请求数据。
