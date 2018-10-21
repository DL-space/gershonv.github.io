---
title: koa2-基础知识
date: 2018-10-21 20:20:25
categories: koa2
tags: koa2
toc: true
comments: true 
---
## 起步

```
npm i koa -S
```

```js
const Koa = require('koa')

const app = new Koa()

app.use(async ctx => {
  ctx.body = 'hello koa'
})

app.listen(3000, () => {
  console.log('app listen on http://127.0.0.1:3000')
})
```

## 接收 get / post 请求

### get => ctx.query

```js
app.use(async ctx => {
  /**
   * test: http://localhost:3000/?username=guodada
   * url: /?username=guodada
   * query: {username: "guodada"}
   * querystring: username=guodada
   * request: { header, method, url}
   */
  let { url, request, query, querystring } = ctx
  ctx.body = { url, request, query, querystring }
})
```

- `query`：返回的是格式化好的参数对象。
- `querystring`：返回的是请求字符串。

### post => ctx.request.body

对于 `POST` 请求的处理，`Koa2` 没有封装方便的获取参数的方法，需要通过解析上下文 `context` 中的原生 `node.js` 请求对象 `req` 来获取。

```js
// 将 useraname=guodada&age=22 解析为 { "useraname": "guodada", "age":  22 }
const parseQueryStr = queryStr => {
  let queryData = {}
  let queryStrList = queryStr.split('&')
  for (let [index, queryStr] of queryStrList.entries()) {
    let itemList = queryStr.split('=')
    queryData[itemList[0]] = decodeURIComponent(itemList[1])
  }
  return queryData
}

// 解析 post 得到的数据
const parsePostData = ctx => {
  return new Promise((resolve, reject) => {
    try {
      let postString = ''
      ctx.req.on('data', chunk => {
        postString += chunk
      })
      ctx.req.on('end', chunk => {
        // postString : useraname=guodada&age=22
        let parseData = parseQueryStr(postString)
        resolve(parseData)
      })
    } catch (error) {
      reject(error)
    }
  })
}

// 测试用例：post : { "useraname": "guodada", "age":  22 }
app.use(async ctx => {
  if (ctx.method === 'POST') {
    const data = await parsePostData(ctx)
    ctx.body = data
  }
})
```

### koa-bodyparser

上面解析 `post` 数据就是 `koa-bodyparser` 中间件函数的雏形，不需要我们写，直接使用这个中间件就可以了

```
npm i koa-bodyparser -S
```

```js
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')

const app = new Koa()

app.use(bodyParser())

app.use(async ctx => {
  ctx.body = ctx.request.body
})

//...
```

## koa-router

主要是通过 `ctx.request.url` 获取地址栏输入的路径，根据路径不同进行跳转。这里不做实现。使用已有的中间件 `koa-router`

```
npm install koa-router -S
```

```js
const Router = require('koa-router')
const router = new Router()

router.get('/', function(ctx, next) {
  ctx.body = 'Hello index'
})

app
  .use(router.routes()) // 作用：启动路由
  .use(router.allowedMethods()) // 作用：这是官方推荐用法，我们可以看到 router.allowedMethods() 用在路由匹配
// router.routes() 之后，所以在所有路由中间件最后调用，此时根据 ctx.status 设置 response 响应头
```

### 路由层级

```js
const router = new Router()
const page = new Router()

// page 路由
page
  .get('/info', async ctx => {
    ctx.body = 'url: /page/info'
  })
  .get('/todo', async ctx => {
    ctx.body = 'url: /page/todo'
  })

router.use('/page', page.routes(), page.allowedMethods())

app.use(router.routes()).use(router.allowedMethods())

// 输入 localhost:3000/page/info 可以去到 page 的路由...
```

## cookie

`koa` 的上下文（`ctx`）直接提供了 `cookie` 读取和写入的方法

- `ctx.cookies.get(name,[optins])`:读取上下文请求中的 cookie。
- `ctx.cookies.set(name,value,[options])`：在上下文中写入 cookie。

```js
app.use(async ctx => {
  ctx.cookies.set('username', 'guodada', {
    domain: '127.0.0.1', // 写cookie所在的域名
    path: '/', // 写cookie所在的路径
    maxAge: 1000 * 60 * 60 * 24, // cookie有效时长
    expires: new Date('2018-12-31'), // cookie失效时间
    httpOnly: false, // 是否只用于http请求中获取 默认是 true
    overwrite: false // 是否允许重写 默认是 false
  })
  ctx.body = ctx.cookies.get('username') // guodada
})
```

## koa-static 静态资源中间件

```js
const path = require('path')
const static = require('koa-static')
const staticPath = './static'

app.use(static(
  path.join( __dirname,  staticPath)
))
```

我们 新建 `static/baidu.png`, 地址输入 `localhost:3000/baidu.png` 就可以直接访问静态资源了。