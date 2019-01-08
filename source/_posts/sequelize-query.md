---
title: Sequelize - 使用 model 查询数据
date: 2019-01-03 14:56:03
categories: Sequelize
tags: Sequelize
---

`Sequelize` 中有两种查询：使用 `Model`（模型）中的方法查询和使用 `sequelize.query()` 进行基于 SQL 语句的原始查询。

下面是事先创建好的数据：

```bash
mysql> select * from users;
+----+----------+------+------+-------+
| id | name     | age  | sex  | score |
+----+----------+------+------+-------+
|  1 | guodada0 |   15 |    0 |    60 |
|  2 | guodada1 |   16 |    1 |    80 |
|  3 | guodada2 |   17 |    0 |    55 |
|  4 | guodada3 |   18 |    1 |    87 |
|  5 | guodada4 |   19 |    0 |    73 |
|  6 | guodada5 |   20 |    1 |    22 |
+----+----------+------+------+-------+
6 rows in set (0.00 sec)
```

## findAll - 搜索数据库中的多个元素

```js
const result = await UserModel.findAll() // result 将是所有 UserModel 实例的数组

// the same as
const result = await UserModel.all()

//...
```

### 限制字段

查询时，如果只需要查询模型的部分属性，可以在通过在查询选项中指定 `attributes` 实现。该选项是一个数组参数，在数组中指定要查询的属性即可，这些要查询的属性就表示要在数据库查询的字段：

```js
Model.findAll({
  attributes: ['foo', 'bar']
})
```

### 字段重命名

查询属性（字段）可以通过传入一个嵌套数据进行重命名：

```js
Model.findAll({
  attributes: ['foo', ['bar', 'baz']]
})

// SELECT foo, bar AS baz ...
```

demo

```js
const results = await UserModel.findAll({
  attributes: [['name', 'username'], 'age', 'score']
})

// [{"username":"guodada0","age":15,"score":60},{"username":"guodada1","age":16,"score":80} ...]
ctx.body = results

// 访问查询结果 通过 instance.get('xxx')
console.log(results[0]['username'], results[0].get('username')) // undefind, 'guodada0'
```

### 通过 sequelize.fn 方法进行聚合查询

[mysql-聚合函数](https://gershonv.github.io/2018/12/31/mysql-聚合函数/)
