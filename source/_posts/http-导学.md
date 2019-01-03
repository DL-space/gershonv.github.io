---
title: HTTP - 导学
date: 2018-11-20 19:31:23
categories: HTTP
tags: HTTP
---

## 经典五层网络模型

![](https://user-gold-cdn.xitu.io/2018/11/20/16730e533ec09d3a?w=1360&h=947&f=png&s=282764)

在每一台电脑，每个服务器都有这这几个网络模型层级来维护整个网络数据传输过程。

### 一张图了解 TCP/IP 五层网络模型

![](https://user-gold-cdn.xitu.io/2018/11/20/167316845f6dde61?w=1255&h=629&f=jpeg&s=180804)

- **物理层**：将信息编码成电流脉冲或其它信号用于网上传输；（电线、光缆等）
- **数据链路层**：数据链路层通过物理网络链路供数据传输。可以简单的理解为：规定了 0 和 1 的分包形式，确定了网络数据包的形式。
- **网络层**：网络层负责在源和终点之间建立连接;（路由器等）
- **传输层**： 敲重点！
  > 传输层向用户提供可靠的端对端(`End-to-End`)服务。 常用的（`TCP／IP`）协议 、`UDP` 协议；
- **应用层**：敲重点！
  > 为应用软件提供了很多服务，帮我们实现了 `HTTP` 协议，我们只要按照规则去使用 `HTTP` 协议；它构建于 `TCP` 协议之上；屏蔽了网络传输相关细节。

重点在 **应用层** 和 **传输层** 上：`http` 是在应用层上去实现的，而 `http` 协议基于传输层的 `TCP` `UDP` 协议。

<!--more-->

## HTTP 发展历史

### HTTP/0.9

> 1. `HTTP/0.9` 只支持一种方法—— `Get`，请求只有一行
> 2. 没有 `header` 等描述数据的信息
> 3. 服务器发送完毕，就关闭 `TCP` 连接

### HTTP/1.0

> 1. 请求与响应支持 `header`，增加了`状态码`，响应对象的一开始是一个响应状态行
> 2. 协议版本信息需要随着请求一起发送，支持 `HEAD`，`POST` 方法

### HTTP/1.1

在 `HTTP/1.0` 上增加了一些功能来优化网络链接的过程：

1. **持久连接**
   > `HTTP/1.0` 版本里一个 HTTP 请求就要在客户端和服务端之间创建一次 `TCP` 连接，在服务器返回完内容后就关闭了。相对来说消耗比较高。
2. **pipeline**
   > 我们可以在同个连接里发送多个请求，但是服务端要对这些请求都是要按照顺序进行内容的返回。
   > 前一个请求等待时间较长，后一个请求处理较快，后一个请求也不能进行内容响应，需要等前一个请求完成后才可响应下次请求，这也是**串行/并行**的概念，而这个在 `HTTP/2.0` 中做了优化
3. **host 和其他一些命令**
   > 有了 `host` 之后可以在同一台服务器（物理服务器）同时跑多个不同的 web 服务 ，比如说 `node.js` 的服务、`java` 的服务。
4. **引入更多缓存控制机制**：如 `etag`，`cache-control`
5. ...

### HTTP/2.0

1. 使用二进制分帧层
   > 在 `HTTP/1.1` 中大部分的数据传输都是以字符串方式进行的，`HTTP/2.0` 则在应用层与传输层之间增加一个二进制分帧层。
   > 同样因为这个好处，`pipeline` 在同个连接里发送多个请求不再需要按照顺序来返回处理。
2. 头部压缩
   > 头信息压缩：在 `HTTP/1.1` 里面，我们每次发送和返回请求 `http header` 都是必须要进行完整的发送和返回的，占用带宽。
   > 使用首部表来跟踪和存储之前发送的键值对，对于相同的内容，不会再每次请求和响应时发送。
3. 服务端推送
   > 在 `HTTP/2.0` 中，服务器可以向客户发送请求之外的内容，比如正在请求一个页面时，服务器会把页面相关的 `logo`，`CSS` 等文件直接推送到客户端，而不会等到请求来的时候再发送，因为服务器认为客户端会用到这些东西。这相当于在一个 `HTML` 文档内集合了所有的资源。
4. ...

## HTTP 的三次握手

[http-tcp 的三次握手四次挥手](https://gershonv.github.io/2018/11/20/http-TCP/)

## URI-URL 和 URN

![](http://ww4.sinaimg.cn/mw690/6941baebgw1evu0o8swewj20go0avq3e.jpg)

- `URI` : `Uniform Resource Identifier`/统一资源标志符
  - `URL` 和 `URN` 都是 `URI` 的子集
    > 统一资源标识符（`URI`）提供了一个简单、可扩展的资源标识方式。
- `URL` : `Uniform Resource Locator`/统一资源定位器
  - URL 是 Internet 上用来描述信息资源的字符串，主要用在各种 WWW 客户程序和服务器程序上。
  - 采用 URL 可以用一种统一的格式来描述各种信息资源，包括文件、服务器的地址和目录等。
  ```js
  ;`http://user:pass@host.com:80/path?query=string#hash` // @example url 的组成
  /**
   * http:// ===> 协议，类似的还有 ftp、https 等
   * user:pass@host.com:80 ===> 存有该资源的主机IP地址（有时也包括端口号）
   * /path ===> 主机资源的具体地址。如目录和文件名等。
   */
  ```
- `URN` : 永久统一资源定位符
  - 在资源移动之后还能被找到

## HTTP 报文

### 请求行

> 声明 请求方法 、主机域名、资源路径 & 协议版本

请求行的组成 = 请求方法 + 请求路径 + 协议版本

```js
GET /test/hi-there.txt HTTP/1.0
// 请求行的组成 = 请求方法 + 请求路径 + 协议版本
```

![](https://user-gold-cdn.xitu.io/2018/9/10/165c0f27ea8bff3b?imageslim)

### 请求头

> 声明 客户端、服务器 / 报文的部分信息

1. 请求和响应报文的通用 Header
   ![](https://user-gold-cdn.xitu.io/2018/9/10/165c0f27eb051d58?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
2. 常见请求 Header
   ![](https://user-gold-cdn.xitu.io/2018/9/10/165c0f27ebf1b79f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 请求体

> 存放 需发送给服务器的数据信息

![](https://user-gold-cdn.xitu.io/2018/9/10/165c0f28437eb63d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

除此外还有响应报文，略

## 创建一个简单的 http 服务

```js
const http = require('http')

http
  .createServer(function(request, response) {
    console.log('request come', request.url)
    response.end('123')
  })
  .listen(8888)
```
