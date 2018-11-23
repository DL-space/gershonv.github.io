---
title: HTTP - 缓存机制
date: 2018-11-23 09:23:23
categories: HTTP
tags: HTTP
---

## 缓存实现的步骤

- 首先是当用户请求资源时，会判断是否有缓存，如果没有，则会向原服务器请求资源。
- 如果有缓存，则会进入强缓存的范畴，判断缓存是否新鲜
  - 如果缓存新鲜，则会直接返回缓存副本给客户端。
  - 如果缓存不新鲜了，则表示强缓存失败，将会进入到**协商缓存**。
- 协商缓存将判断是否存在 `Etag` 和 `Last-Modified` 首部
  - 如果未发生变化，则表示命中了协商缓存，会重定向到缓存副本，将资源返回给客户端
  - 否则的话表示协商缓存未命中，服务器会返回新的资源。

![](https://user-gold-cdn.xitu.io/2018/11/4/166de9f3ae4b1f20?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 强缓存

> 服务端告知客户端缓存时间后，由客户端判断并决定是否使用缓存。

强缓存是通过 `Expires` 首部或 `Cache-Control: max-age` 来实现的。

- `Expires`: 响应头，代表该资源的过期时间。
- `Cache-Control`: 请求/响应头，缓存控制字段，精确控制缓存策略。

`server.js` - demo

```js
const http = require('http')

http
  .createServer(function(request, response) {
    response.writeHead(200, {
      'Content-Type': 'text/javascript',
      'Conche-Control': 'max-age=2000, public' // 缓存时间 2000s；public: 资源允许被中间服务器缓存
    })
    response.end("console.log('script loaded')")
  })
  .listen(3301)

console.log('http://127.0.0.1:3301')
```

### Expires(HTTP/1.0)

`Expires` 和 `Cache-Control: max-age` 都是用来标识资源的过期时间的首部。

由于 `expires` 是一个绝对时间，如果人为的更改时间，会对缓存的有效期造成影响，使缓存有效期的设置失去意义。因此在 `http1.1` 中我们有了 `expires` 的完全替代首部 `cache-control：max-age`

### Cache-Control(HTTP/1.1)

除了可以设置 `max-age` 相对过期时间以外，还可以设置成如下几种值：

- `public`，资源允许被中间服务器缓存。

  > 浏览器请求服务器时，如果缓存时间没到，中间服务器直接返回给浏览器内容，而不必请求源服务器。

- `private`，资源不允许被中间代理服务器缓存

  > 浏览器请求服务器时，中间服务器都要把浏览器的请求透传给服务器。

- `no-cache`，浏览器不做缓存检查。

  > 每次访问资源，浏览器都要向服务器询问，如果文件没变化，服务器只告诉浏览器继续使用缓存（304）。

- `no-store`，浏览器和中间代理服务器都不能缓存资源。
  > 每次访问资源，浏览器都必须请求服务器，并且，服务器不去检查文件是否变化，而是直接返回完整的资源。
- `must-revalidate`，可以缓存，但是使用之前必须先向源服务器确认。
- `proxy-revalidate`，要求缓存服务器针对缓存资源向源服务器进行确认。
- `s-maxage`：缓存服务器对资源缓存的最大时间。

`Cache-Control` 对缓存的控制粒度更细，包括缓存代理服务器的缓存控制。

## 协商缓存

> 由服务端决定并告知客户端是否使用缓存。

协商缓存机制下，浏览器需要向服务器去询问缓存的相关信息，进而判断是重新发起请求、下载完整的响应，还是从本地获取缓存的资源。
协商缓存是通过请求头 `Last-Modified` 或 `Etag` 来实现的。

- `Last-Modified` 标识的是文档最后修改时间
- `Etag` 则是以文档内容来进行编码的。

### Last-Modified

> 响应头，资源最近修改时间，由服务器告诉浏览器。

`Last-Modified` （上次修改时间）主要配合 `If-Modified-Since` 或者 `If-Unmodified-Since` 使用， 对比上次修改时间以验证资源是否需要更新

If-Modified-Since: 请求头

![](https://user-gold-cdn.xitu.io/2018/11/4/166de151763c87aa?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

- 首次请求资源时，服务器在返回资源的同时，会在 `Response Headers` 中写入 `Last-Modified` 首部，表示该资源在服务器上的最后修改时间。
- 当再次请求该资源时，会在 `Request Headers` 中写入 `If-Modified-Since` 首部，此时的 `If-Modified-Since` 的值是首次请求资源时所返回的 `Last-Modified` 的值。
- 服务器接收到请求后，会根据 `If-Modified-Since` 的值判断资源在该日期之后是否发生过变化。
- 如果没有，则会返回 `304 Not Modified`;如果变化了，则会返回变化过后的资源，同时更新 `Last-Modified` 的值。

1. 资源未更新 network 面板截图
   ![](https://user-gold-cdn.xitu.io/2018/11/23/1673e75620b00e06?w=848&h=520&f=png&s=224745)

2. 资源发生更新 network 面板截图
   ![](https://user-gold-cdn.xitu.io/2018/11/23/1673e7991fe685a1?w=935&h=484&f=png&s=245226)
   可以看到 `Last-Modified` 和 `If-Modified-Since` 标识的时间不一样

- `server.js` - demo

```js
const http = require('http')

http
  .createServer(function(request, response) {
    response.writeHead(200, {
      'Content-Type': 'text/javascript',
      'Conche-Control': 'max-age=2000, public', // 缓存时间 2000s；public: 资源允许被中间服务器缓存
      'Last-Modified': '123'
    })
    response.end("console.log('script loaded')")
  })
  .listen(3301)

console.log('http://127.0.0.1:3301')
```

### Etag

> 响应头，资源标识，由服务器告诉浏览器。

`Etag` 和 `If-None-Match` 配合使用， （文件内容对比）对比资源的签名来决定是否使用缓存。

- `server.js` - demo

```js
const http = require('http')

http
  .createServer(function(request, response) {
    const etag = request.headers['if-none-match']
    if (etag === '777') {
      response.writeHead(304, {
        'Content-Type': 'text/javascript',
        'Cache-Control': 'max-age=120, no-cache', // 缓存时间 120s；no-cache: 浏览器不做缓存检查
        'Last-Modified': '123',
        Etag: '777'
      })
      response.end()
    } else {
      // etag change
      response.writeHead(200, {
        'Content-Type': 'text/javascript',
        'Conche-Control': 'max-age=120, no-cache', // 缓存时间 120s；no-cache: 浏览器不做缓存检查
        'Last-Modified': '123',
        Etag: '777'
      })
      response.end("console.log('script loaded')")
    }
  })
  .listen(3301)

console.log('http://127.0.0.1:3301')
```

## 总结与缓存方案

![](https://user-gold-cdn.xitu.io/2018/8/13/16531214dfa218be?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

1. 服务器和浏览器约定资源过期时间 `Cache-Control: expires=xxx`
2. 服务器告诉浏览器资源上次修改时间 `Last-Modified`
3. 增加相对时间的控制 `Cache-Control: max-age=xxx`
4. 增加文件内容对比，引入`Etag`

缓存优先级

> `Pragma` > `Cache-Control` > `Expires` > `ETag` > `Last-Modified`

参考与相关链接：

- [浅谈 HTTP 缓存](https://juejin.im/post/5bdeabbbe51d4505466cd741#heading-25)
- [面试精选之 http 缓存](https://juejin.im/post/5b3c87386fb9a04f9a5cb037#heading-0)
