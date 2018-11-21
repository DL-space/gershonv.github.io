---
title: http-TCP 三次握手四次挥手
date: 2018-11-21 09:47:17
categories: HTTP
tags: HTTP
---

## TCP 的三次握手

> `HTTP` 请求与 `TCP` 链接之间的关系，在客户端向服务端请求和返回的过程中，是需要去创建一个 `TCP connection`，因为 `HTTP` 是不存在链接这样一个概念的，它只有请求和响应这样一个概念，请求和响应都是一个数据包，中间要通过一个传输通道，这个传输通道就是在 `TCP` 里面创建了一个从客户端发起和服务端接收的一个链接，`TCP` 链接在创建的时候是有一个三次握手(三次网络传输)这样一个消耗在的。

下面是 `TCP` 报文格式图：

![](https://user-gold-cdn.xitu.io/2018/11/21/1673405dad1eced0?w=500&h=380&f=jpeg&s=32339)
↓↓↓↓
![](https://user-gold-cdn.xitu.io/2018/11/21/1673405e30495223?w=1046&h=402&f=png&s=27889)

有几个字段需要重点介绍下：

1. Seq 序号: `sequeence number`，用来标识从 TCP 源端向目的端发送的字节流，发起方发送数据时对此进行标记。
2. 确认序号：`acknowledgment number`，只有 ACK 标志位为 1 时，确认序号字段才有效，`Ack=Seq+1`。
3. 标志位：共 6 个，即 URG、ACK、PSH、RST、SYN、FIN 等，具体含义如下：
   - `URG`：紧急指针（urgent pointer）有效。
   - `ACK`：确认序号有效。
   - `PSH`：接收方应该尽快将这个报文交给应用层。
   - `RST`：重置连接。
   - `SYN`：发起一个新连接。
   - `FIN`：释放一个连接。

### 第一次握手

> 客户端发送一个 `TCP` 的 `SYN` 标志位置 1 的包指明客户打算连接的服务器的端口，以及初始序号 X,保存在包头的序列号(`Sequence Number`)字段里。

- **简单记忆： 建立连接，等待服务器确认**

![](https://user-gold-cdn.xitu.io/2017/11/9/6b568a608edadc13bc9be7721b00e48a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

- `Sequeence Number` = X => 标识字节流字段为 X
- `SYN` = 1 => 发起一个新连接，序号为 1

### 第二次握手

> 服务器发回确认包(ACK)应答。即 SYN 标志位和 ACK 标志位均为 1 同时，将确认序号(Acknowledgement Number)设置为客户的 I S N 加 1 以.即 X+1。

- **简单记忆： 服务器收到请求后确认联机**

![](https://user-gold-cdn.xitu.io/2017/11/9/02f7809aa0b7b0b5db477e180f408535?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

- `Sequeence Number` = Y => 标识字节流字段为 Y
- `acknowledgment number` = X + 1 => 确认序号为 X + 1
- `SYN` = 1 => 发起一个新连接，序号为 1
- `ACK` = 1 => 确认序号有效

### 第三次握手

> 客户端再次发送确认包(ACK)SYN 标志位为 0,ACK 标志位为 1.并且把服务器发来 ACK 的序号字段+1,放在确定字段中发送给对方.并且在数据段放写 ISN 的+1

- **简单记忆：检查 ACK 是否正确, 若正确则建立连接。**

![](https://user-gold-cdn.xitu.io/2017/11/9/c052d0061d70d359e1ac0b5fc48d844a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

- `acknowledgment number` = Y + 1 => 确认序号为 Y + 1
- `ACK` = 1 => 确认序号有效

## TCP 四次挥手

`TCP`的连接的拆除需要发送四个包，因此称为四次挥手(`four-way handshake`)。客户端或服务器均可主动发起挥手动作，在 socket 编程中，任何一方执行 close()操作即可产生挥手操作。

![](https://user-gold-cdn.xitu.io/2017/11/9/8c7874fafe233c9278509e40e906055c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 为什么建立连接是三次握手，而关闭连接却是四次挥手呢？

这是因为服务端在 `LISTEN` 状态下，收到建立连接请求的 `SYN` 报文后，把 `ACK` 和 `SYN` 放在一个报文里发送给客户端。
而关闭连接时，当收到对方的 `FIN` 报文时，仅仅表示对方不再发送数据了但是还能接收数据，己方也未必全部数据都发送给对方了，所以己方可以立即 `close`，也可以发送一些数据给对方后，再发送 `FIN` 报文给对方来表示同意现在关闭连接，因此，己方 `ACK` 和 `FIN` 一般都会分开发送。
