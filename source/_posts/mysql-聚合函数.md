---
title: mysql - 聚合函数
date: 2018-12-31 16:19:35
categories: MySQL
tags: MySQL
---

## 聚合函数（aggregation function）

> 聚合函数（`aggregation function`）---也就是组函数，在一个行的集合（一组行）上进行操作，对每个组给一个结果。

常用的组函数：

| function                     | return       |
| ---------------------------- | ------------ |
| AVG([distinct] expr)         | 求平均值     |
| COUNT({*  [distinct] } expr) | 统计行的数量 |
| MAX([distinct] expr)         | 求最大值     |
| MIN([distinct] expr)         | 求最小值     |
| SUM([distinct] expr)         | 求累加和     |

<!-- more -->

1. 每个组函数接收一个参数
2. 默认情况下，组函数忽略列值为null的行，不参与计算
3. 有时，会使用关键字distinct剔除字段值重复的条数

注意：

- 当使用组函数的 `select` 语句中没有 `group by` 子句时，中间结果集中的所有行自动形成一组，然后计算组函数；
- 组函数不允许嵌套，例如：`count(max(…))`；
- 组函数的参数可以是列或是函数表达式；
- 一个 `SELECT` 子句中可出现多个聚集函数。


```bash
mysql> select * from users;
+----+----------+------+---------------------+---------------------+
| id | name     | age  | createdAt           | updatedAt           |
+----+----------+------+---------------------+---------------------+
|  1 | guodada  |   18 | 2019-10-04 05:56:52 | 2019-10-04 05:56:52 |
|  2 | guodada2 |   18 | 2019-10-04 05:57:01 | 2019-10-04 05:57:01 |
|  3 | guodada3 | NULL | 2019-10-04 05:58:00 | 2019-10-04 05:58:00 |
+----+----------+------+---------------------+---------------------+
3 rows in set (0.00 sec)
```

## count 函数

① `count(*)`：返回表中满足 `where` 条件的行的数量

```sql
SELECT COUNT(*) AS count FROM users WHERE age > 10 -- count 3
```

② `count(列)`：返回列值非空的行的数量

```sql
SELECT COUNT(age) AS count FROM users -- count 2
```

③ `count(distinct 列)`：返回列值非空的、并且列值不重复的行的数量

```sql
SELECT COUNT(distinct age) AS count FROM users -- count 1
```

④ `count(expr)`：根据表达式统计数据

```sql
SELECT COUNT(age=18) AS count FROM users; -- count 2
```

## max 和 min 函数---统计列中的最大最小值

```sql
SELECT MAX(age) as maxAge FROM users -- maxAge 18
SELECT MIN(age) as minAge FROM users -- minAge 18
```

> 注意：如果统计的列中只有 `NULL` 值，那么 `MAX` 和 `MIN` 就返回 `NULL`

## sum 和 avg 函数---求和与求平均

！！表中列值为 `null` 的行不参与计算

```sql
SELECT AVG(age) as avgAge FROM users -- avgAge 18
SELECT SUM(age) as snmAge FROM users -- sumAge 36
```

注意：要想列值为 `NULL` 的行也参与组函数的计算，必须使用 `IFNULL` 函数对 `NULL` 值做转换。

## 分组聚合查询

分组 SELECT 的基本格式：

`select [聚合函数] 字段名 from 表名 [where 查询条件] [group by 字段名] [having 过滤条件]`

```bash
mysql> select name, count(*) as count from users where age > 10 group by name;
+----------+-------+
| name     | count |
+----------+-------+
| guodada  |     1 |
| guodada2 |     1 |
+----------+-------+
2 rows in set (0.00 sec)
```

通过 `select` 在返回集字段中，这些字段要么就要包含在 `group by` 语句后面，作为分组的依据，要么就要被包含在聚合函数中。我们可以将 `group by` 操作想象成如下的一个过程：首先系统根据 `select` 语句得到一个结果集，然后根据分组字段，将具有相同分组字段的记录归并成了一条记录。这个时候剩下的那些不存在与 `group by` 语句后面作为分组依据的字段就很有可能出现多个值，但是目前一种分组情况只有一条记录，一个数据格是无法放入多个数值的，所以这个时候就需要通过一定的处理将这些多值的列转化成单值，然后将其放在对应的数据格中，那么完成这个步骤的就是前面讲到的聚合函数，这也就是为什么这些函数叫聚合函数了。

- [MySQL最常用分组聚合函数](https://www.cnblogs.com/geaozhang/p/6745147.html#sum-avg)