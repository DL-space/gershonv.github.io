---
title: Sequelize - 使用 model 查询数据
date: 2019-01-03 14:56:03
categories: Sequelize
tags: Sequelize
---

`Sequelize` 中有两种查询：使用 `Model`（模型）中的方法查询和使用 `sequelize.query()` 进行基于 SQL 语句的原始查询。

<!-- more -->

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

定义的 model

```js
const UserModel = sequelize.define(
  'user',
  {
    name: Sequelize.STRING,
    age: Sequelize.INTEGER,
    sex: Sequelize.INTEGER,
    score: Sequelize.INTEGER
  },
  { timestamps: false }
)
```

## 查询多项 (findAll)

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

### 指定筛选条件 (where)

在模型的 `find/finAll` 或 `updates/destroys` 操作中，可以指定一个 `where` 选项以指定筛选条件，

`where` 是一个包含属性/值对对象，sequelize 会根据此对象生产查询语句的筛选条件。

```js
const results = await UserModel.findAll({
  where: {
    age: 18,
    name: 'guodada3'
  }
}) //  SELECT * FROM `users` AS `user` WHERE `user`.`age` = 18 AND `user`.`name` = 'guodada3';

await UserModel.destroy({
  where: { name: 'guodada3' }
}) // DELETE FROM `users` WHERE name = 'guodada3'

// ...
```

#### 复合过滤 / OR / NOT 查询

```js
$and: {a: 5}           // AND (a = 5)
$or: [{a: 5}, {a: 6}]  // (a = 5 OR a = 6)
$gt: 6,                // > 6
$gte: 6,               // >= 6
$lt: 10,               // < 10
$lte: 10,              // <= 10
$ne: 20,               // != 20
$not: true,            // IS NOT TRUE
$between: [6, 10],     // BETWEEN 6 AND 10
$notBetween: [11, 15], // NOT BETWEEN 11 AND 15
$in: [1, 2],           // IN [1, 2]
$notIn: [1, 2],        // NOT IN [1, 2]
$like: '%hat',         // LIKE '%hat'
$notLike: '%hat'       // NOT LIKE '%hat'
$iLike: '%hat'         // ILIKE '%hat' (case insensitive) (PG only)
$notILike: '%hat'      // NOT ILIKE '%hat'  (PG only)
$like: { $any: ['cat', 'hat']}
                       // LIKE ANY ARRAY['cat', 'hat'] - also works for iLike and notLike
$overlap: [1, 2]       // && [1, 2] (PG array overlap operator)
$contains: [1, 2]      // @> [1, 2] (PG array contains operator)
$contained: [1, 2]     // <@ [1, 2] (PG array contained by operator)
$any: [2,3]            // ANY ARRAY[2, 3]::INTEGER (PG only)

$col: 'user.organization_id' // = "user"."organization_id", with dialect specific column identifiers, PG in this example
```

- `$like`: 模糊查询 `%锅` 以 `锅` 结尾的。 `%锅%` 包含 `锅` 的
- `$in: [10, 11]` - 值为 10 或 11

#### demo

```js
// SELECT * FROM `users` AS `user` WHERE `user`.`age` > 18 AND `user`.`name` LIKE '%5';
const results = await UserModel.findAll({
  where: {
    age: { $gt: 18 },
    name: { $like: '%5' }
  }
})

// SELECT * FROM `users` AS `user` WHERE (`user`.`age` < 1000 OR `user`.`age` IS NULL) AND `user`.`name` LIKE '%5';
const results = await UserModel.findAll({
  where: {
    age: {
      $in: [15, 20],
      $or: { $lt: 1000, $eq: null }
    },
    name: { $like: '%5' }
  }
})
```

## 查询单项

```js
// find
const result = await UserModel.find({
  where: { id: 1 }
})
console.log(result.name, result.get('name')) // guodada0 guodada0

// findOne
const result = await UserModel.findOne({
  where: { id: 1 }
})
console.log(result.name, result.get('name')) // guodada0 guodada0

// findById
const result = await UserModel.findById(1)
console.log(result.name, result.get('name')) // guodada0 guodada0

// findByPk
const result = await UserModel.findByPk(1)

//...
```

## 查找并创建 (findOrCreate)

`findOrCreate` 可用于检测一个不确定是否存在的元素，如果存在则返回记录，不存在时会使用提供的默认值新建记录。

```js
UserModel.findOrCreate({
  where: { name: 'guodada' },
  defaults: {
    age: 23,
    sex: 1,
    score: 99
  }
}).spread((user, created) => {
  console.log(user.get('name')) // guodada
  console.log(created) // 是否创建
})

// INSERT INTO `users` (`id`,`name`,`age`,`sex`,`score`)
// VALUES (DEFAULT,'guodada',23,1,99);
```

## 分页查询 (findAndCountAll)

`findAndCountAll` - 结合了 `findAll` 和 `count`

处理程序成功将始终接收具有两个属性的对象：

- `count` - 一个整数，总数记录匹配 `where` 语句和关联的其它过滤器
- `rows` - 一个数组对象，记录在 `limit` 和 `offset` 范围内匹配 `where` 语句和关联的其它过滤器

```js
const result = await UserModel.findAndCountAll({
  where: {
    age: {
      $gte: 18 // 大于等于18
    }
  },
  offset: 1, // 偏移量，可以理解为当前页数
  limit: 15 // 可以理解为 pageSize , 一页有多少数据
})

// count 记录数 | row 记录
console.log(result.count, result.rows[0].get())

// SELECT * FROM `users` AS `user` WHERE `user`.`age` >= 18 LIMIT 1, 15;
```

### 支持 include

它支持 `include`。 只有标记为 `required` 的 `include` 将被添加到计数部分：

假设你想找 `User` 中 发布过 `article` 的记录

```js
const UserModel = sequelize.define(
  'user',
  {
    name: Sequelize.STRING,
    age: Sequelize.INTEGER,
    sex: Sequelize.INTEGER,
    score: Sequelize.INTEGER
  },
  { timestamps: false }
)

const ArticleModel = sequelize.define('article', {
  title: Sequelize.STRING,
  content: Sequelize.STRING
})

UserModel.hasMany(ArticleModel) // 关联模型
ArticleModel.belongsTo(UserModel, {
  constraints: false
})

const result = await UserModel.findAndCountAll({
  include: [{ model: ArticleModel, required: true }],
  offset: 1,
  limit: 5
})

console.log(result.count) // 3
```

`result.row`:

```json
{
  "count": 3,
  "rows": [
    {
      "id": 1,
      "name": "guodada0",
      "age": 15,
      "sex": 0,
      "score": 60,
      "article": {
        "id": 1,
        "title": "title1",
        "content": "aaa",
        "userId": 1,
        "createdAt": "2019-01-07T08:51:13.000Z",
        "updatedAt": "2019-01-07T08:51:13.000Z"
      }
    }
    //...
  ]
}
```

因为 `ArticleModel` 的 `include` 有 `required` 设置，这将导致内部连接，并且只有具有 `ArticleModel` 的用户将被计数。
如果我们从 `include` 中删除 `required`，那么有和没有 `ArticleModel` 的用户都将被计数。
在 `include` 中添加一个 `where` 语句会自动使它成为 required：

```js
const result = await UserModel.findAndCountAll({
  include: [{ model: ArticleModel }]
})

console.log(result.count) // 7

const result = await UserModel.findAndCountAll({
  include: [{ model: ArticleModel, where: { userId: 2 } }]
})

console.log(result.count) // 2
```

## 聚合查询

[mysql-聚合函数](https://gershonv.github.io/2018/12/31/mysql-聚合函数/)

`Sequelize` 提供了聚合函数，可以直接对模型进行聚合查询：

- `aggregate(field, aggregateFunction, [options])`-通过指定的聚合函数进行查询
- `sum(field, [options])`-求和
- `count(field, [options])`-统计查询结果数
- `max(field, [options])`-查询最大值
- `min(field, [options])`-查询最小值

### 