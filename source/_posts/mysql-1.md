---
title: mysql - 基础篇
date: 2018-12-29 10:18:35
categories: MySQL
tags: MySQL
---

## 数据库操作

启动 `mysql`, `mac` 可通过 `brew` 安装 `mysql` 后启动。 `window` 需要手动配置

```js
// mac
mysql.server start

// window
net start mysql

// 登录 -u 用户名 root 超级用户 -p 密码
mysql -uroot -p

// 退出
mysql > \q

// 切换到 learn 数据库
mysql > use learn
```

MySQL 语句规范

- 关键字与函数名称全部大写
- 数据库名称，表名称，字段名称全部小写
- SQL 语句必须以分号结尾

```js
// 创建数据库 默认编码 utf-8
CREATE DATABASE IF NOT EXISTS t1;

// 创建 gbk 编码的数据库
CREATE DATABASE IF NOT EXISTS t2 CHARACTER SET gbk;

//显示创建数据库 t1 的指令
SHOW CREATE DATABASE t1;

// 查看数据库
SHOW DATABASES;

// 删除数据库
DROP DATABASE IF EXISTS t1;
```

## 数据类型

### 整型

| MySQL 数据类型 | 含义     | （有符号）                   |
| -------------- | -------- | ---------------------------- |
| tinyint(m)     | 1 个字节 | 范围(-128~127)               |
| smallint(m)    | 2 个字节 | 范围(-32768~32767)           |
| mediumint(m)   | 3 个字节 | 范围(-8388608~8388607)       |
| int(m)         | 4 个字节 | 范围(-2147483648~2147483647) |
| bigint(m)      | 8 个字节 | 范围(+-9.22\*10 的 18 次方)  |

比如我们存储年龄，范围为 0-100 ，此时我们可以使用 `TINYINT` 存储


### 浮点型(float和double)

| MySQL数据类型 | 含义                                           |
| ------------- | ---------------------------------------------- |
| float(m,d)    | 单精度浮点型 8位精度(4字节)  m总个数，d小数位  |
| double(m,d)   | 双精度浮点型 16位精度(8字节)  m总个数，d小数位 |

设一个字段定义为float(6,3)，如果插入一个数123.45678,实际数据库里存的是123.457，但总个数还以实际为准，即6位。整数部分最大是3位，如果插入数12.123456，存储的是12.1234，如果插入12.12，存储的是12.1200.


### 字符串(char,varchar,_text)

| MySQL数据类型 | 含义                            |
| ------------- | ------------------------------- |
| char(n)       | 固定长度，最多255个字符         |
| varchar(n)    | 固定长度，最多65535个字符       |
| tinytext      | 可变长度，最多255个字符         |
| text          | 可变长度，最多65535个字符       |
| mediumtext    | 可变长度，最多2的24次方-1个字符 |
| longtext      | 可变长度，最多2的32次方-1个字符 |


`char`和`varchar`：

1.`char(n)` 若存入字符数小于n，则以空格补于其后，查询之时再将空格去掉。所以char类型存储的字符串末尾不能有空格，`varchar`不限于此。 

2.`char(n)` 固定长度，char(4)不管是存入几个字符，都将占用4个字节，`varchar`是存入的实际字符数+1个字节（n<=255）或2个字节(n>255)，

所以`varchar`(4),存入3个字符将占用4个字节。 


3.char类型的字符串检索速度要比`varchar`类型的快。
`varchar`和`text`： 

1.`varchar`可指定n，`text`不能指定，内部存储`varchar`是存入的实际字符数+1个字节（n<=255）或2个字节(n>255)，`text`是实际字符数+2个字

节。 

2.`text`类型不能有默认值。 

3.`varchar`可直接创建索引，`text`创建索引要指定前多少个字符。`varchar`查询速度快于`text`,在都创建索引的情况下，`text`的索引似乎不起作用。

 

5.二进制数据(_Blob)

1._BLOB和_text存储方式不同，_TEXT以文本方式存储，英文存储区分大小写，而_Blob是以二进制方式存储，不分大小写。

2._BLOB存储的数据只能整体读出。 

3._TEXT可以指定字符集，_BLO不用指定字符集。

### 日期时间类型

| MySQL数据类型 | 含义                          |
| ------------- | ----------------------------- |
| date          | 日期 '2008-12-2'              |
| time          | 时间 '12:25:36'               |
| datetime      | 日期时间 '2008-12-2 22:06:44' |
| timestamp     | 自动存储记录修改时间          |

## 数据类型的属性

| MySQL关键字        | 含义                     |
| ------------------ | ------------------------ |
| NULL               | 数据列可包含NULL值       |
| NOT NULL           | 数据列不允许包含NULL值   |
| DEFAULT            | 默认值                   |
| PRIMARY KEY        | 主键                     |
| AUTO_INCREMENT     | 自动递增，适用于整数类型 |
| UNSIGNED           | 无符号                   |
| CHARACTER SET name | 指定一个字符集           |