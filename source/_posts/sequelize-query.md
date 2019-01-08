---
title: Sequelize - 使用 model 查询数据
date: 2019-01-03 14:56:03
categories: Sequelize
tags: Sequelize
---

`Sequelize` 中有两种查询：使用 `Model`（模型）中的方法查询和使用 `sequelize.query()` 进行基于 SQL 语句的原始查询。

下面是事先创建好的数据：

```sql
mysql> select * from users;
+----+----------+------+------+-------+---------------------+---------------------+
| id | name     | age  | sex  | score | createdAt           | updatedAt           |
+----+----------+------+------+-------+---------------------+---------------------+
|  1 | guodada0 |   15 |    0 |    60 | 2019-01-07 02:37:46 | 2019-01-07 02:37:46 |
|  2 | guodada1 |   16 |    1 |    80 | 2019-01-07 02:37:46 | 2019-01-07 02:37:46 |
|  3 | guodada2 |   17 |    0 |    55 | 2019-01-07 02:37:46 | 2019-01-07 02:37:46 |
|  4 | guodada3 |   18 |    1 |    87 | 2019-01-07 02:37:46 | 2019-01-07 02:37:46 |
|  5 | guodada4 |   19 |    0 |    73 | 2019-01-07 02:37:46 | 2019-01-07 02:37:46 |
|  6 | guodada5 |   20 |    1 |    22 | 2019-01-07 02:37:46 | 2019-01-07 02:37:46 |
+----+----------+------+------+-------+---------------------+---------------------+
6 rows in set (0.00 sec)
```

## Attributes - 属性与查询字段

查询时，如果只需要查询模型的部分属性，可以在通过在查询选项中指定 `attributes` 实现。该选项是一个数组参数，在数组中指定要查询的属性即可，这些要查询的属性就表示要在数据库查询的字段：

```js
Model.findAll({
  attributes: ['foo', 'bar']
})
```

### base demo

```js
const UserModel = sequelize.define('user', {
  name: Sequelize.STRING,
  age: Sequelize.INTEGER,
  sex: Sequelize.INTEGER,
  score: Sequelize.INTEGER
})

sequelize.sync().then(async () => {
  try {
    const results = await UserModel.findAll({
      attributes: ['name', 'age', 'score']
    })
    results.map(user => {
      console.log(user.name, user.age, user.score) // guodada0 15 60 | guodada1 16 80...
    })
  } catch (err) {
    console.log(err)
  }
})

// SELECT `name`, `age`, `score` FROM `users` AS `user`;
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

```js
Model.findAll({
  attributes: [[sequelize.fn('COUNT', sequelize.col('hats')), 'no_hats']]
}) // SELECT COUNT(hats) AS no_hats ...
```

在使用聚合函数时，要给聚合字段指定一个别名。如，在上例中我们为聚合函数指定了别名`'no_hats'`，这样我们就能在查询的回调函数实例中通过 `instance.get('no_hats')`来访问聚合统计的结果。

demo

```js
const results = await UserModel.findAll({
  attributes: [[sequelize.fn('SUM', sequelize.col('score')), 'scoreSum']]
})

console.log(results[0].get('scoreSum')) // 377
```

### include/exclude

当需要查询所有字段并对某一字段使用聚合查询时，而只需要以对象的形式传入 `attributes` 并添加 `include` 子属性即可。

```JS
// 拽定全查询字段比较麻烦
Model.findAll({
  attributes: ['id', 'foo', 'bar', 'baz', 'quz', [sequelize.fn('COUNT', sequelize.col('hats')), 'no_hats']]
})

// 这样会比较简短，且在你添加/删除属性后不会出错
Model.findAll({
  attributes: { include: [[sequelize.fn('COUNT', sequelize.col('hats')), 'no_hats']] }
})

// SELECT id, foo, bar, baz, quz, COUNT(hats) AS no_hats ...
```

全部查询时，可以通过 `exclude` 子属性来排除不需要查询的字段：

```js
Model.findAll({
  attributes: { exclude: ['baz'] }
})

// SELECT id, foo, bar, quz ...
```

## Where - 指定筛选条件