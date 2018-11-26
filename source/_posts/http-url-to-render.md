---
title: HTTP - 浏览器输入 url 后 http 请求返回的完整过程
date: 2018-11-23 16:08:53
categories: HTTP
tags: HTTP
---

## 示意图

![](https://user-gold-cdn.xitu.io/2018/11/20/167306e21f25ced5?w=1234&h=443&f=png&s=181984)

## 检查缓存

> 缓存就是把你之前访问的 web 资源，比如一些 js，css，图片什么的保存在你本机的内存或者磁盘当中。

浏览器获取了这个 `url`，当然就去解析了，它先去缓存当中看看有没有，从 浏览器缓存-系统缓存-路由器缓存 当中查看，
如果有从缓存当中显示页面， 如果没有缓存则进行 `DNS` 解析

浏览器缓存相关链接：[HTTP - 缓存机制](https://gershonv.github.io/2018/11/23/http-cache/)

这里重点介绍 浏览器中 [HTTP - 缓存机制](https://gershonv.github.io/2018/11/23/http-cache/)， 因为个人对系统缓存以及路由器缓存认识较少

![](https://user-gold-cdn.xitu.io/2018/8/13/16531214dfa218be?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

- 缓存是否到时: `Cache-Control: max-age=xxx`
- 缓存是否过期：`Expires` （如果设置）
- 资源是否发生修改: `ETag`
  - `If-None-Match` => 304 未修改
- 文件的修改时间: `Last-Modified`
  - `If-Modified-Since` => 304 未修改

## DNS 解析

> 在发送 `http` 之前，需要进行 `DNS` 解析即域名解析。
> `DNS` 解析:域名到 `IP` 地址的转换过程。域名的解析工作由 `DNS` 服务器完成。解析后可以获取域名相应的 `IP` 地址

根据 URL 找到对应的 IP 地址。这一步通常被称为 DNS 轮询，这里面是有缓存机制的。缓存的顺序依次为：浏览器缓存->操作系统缓存->路由器缓存->DNS 提供商缓存->DNS 提供商轮询。

## 创建 TCP 链接

[TCP 三次握手四次挥手](https://gershonv.github.io/2018/11/21/http-TCP/)

- 第一次握手： `client` => `server`
  - `SYN = 1` （SYN 代表发起一个新连接）； `Sequence Number` = 1 （请求的标记）
- 第二次握手：`server` => `client`
  - `SYN = 1` （SYN 代表发起一个新连接）；`Sequence Number` = Y （请求的标记）
  - `acknowledgment number` = 1 （确认序号，只有 `ACK` 标志位为 1 时，确认序号字段才有效）
  - `ACK` = 1 确认序号字段有效
- 第三次握手：`client` => `server`
  - `acknowledgment number` = Y + 1 => 确认序号为 Y + 1
  - `ACK` = 1 确认序号字段有效

这样 TCP 连接就建立了。
在此之后，浏览器开始向服务器发送 `http` 请求，请求数据包。请求信息包含一个头部和一个请求体。

## 发送请求

相关链接：[HTTP - 导学](https://gershonv.github.io/2018/11/20/http-导学/)

## 响应请求

浏览器对于每一种请求类型的处理方式是不一样的，像 `text/html`、`application/JavaScript`、`text/plain` 等等这些是可以直接呈现的，而对于不能呈现的类型，浏览器会将该资源下载到本地。

那么浏览器在确认这个 response 的状态不是 301（跳转）或者 401（未授权）或其它需要做特殊处理的状态，之后开始进入呈现过程。

`Renderer` 进程开始解析 `css rule tree` 和 `dom tree`，这两个过程是并行的，所以一般我会把 link 标签放在页面顶部。

解析绘制过程中，当浏览器遇到 `link` 标签或者 ` script``、img ` 等标签，浏览器会去下载这些内容，遇到时候缓存的使用缓存，不适用缓存的重新下载资源。

`css rule tree` 和 `dom tree` 生成完了之后，开始合成 `render tree`，这个时候浏览器会进行 `layout`，开始计算每一个节点的位置，然后进行绘制。

绘制结束后，关闭 `TCP` 连接，过程有四次挥手。
