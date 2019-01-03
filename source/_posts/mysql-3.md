---
title: mysql - column 的增删改查
date: 2018-12-30 18:37:33
categories: MySQL
tags: MySQL
---

创建数据

```sql
-- DROP TABLE users; 创建过 users 表可以使用这个语句删除

-- 创建表
CREATE TABLE IF NOT EXISTS users(
  id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(20) NOT NULL,
  password VARCHAR(32) NOT NULL,
  age TINYINT UNSIGNED NOT NULL DEFAULT 10,
  sex TINYINT
);
```

## 插入数据

- INSERT INTO 表名 VALUE
- INSERT INTO 表名 set 列名 = xxx (可以进行子查询)
- INSERT INTO 表名 SELECT ,,,,,,, (将查询结果插入指定的表中)

```sql
-- 插入数据
INSERT users VALUES (NULL, 'TOM', '1234', 22, 1); -- 一个列都不能漏

-- 插入多条数据
INSERT users VALUES (NULL, 'TOM', '1234', 22, 1), (DEFAULT, 'Jhon', '4321', DEFAULT, 1);

-- set方法 与第一种方式的区别是，此方法可以使用子查询，但是一次性只能插入一条记录。
INSERT users SET username='BEN',password='569'; --其余字段有默认值或者允许为空
```

## 更新数据

UPDATA 表名 SET 字段名=值|表达式 WHERE 判断条件 (如省略 where 筛选,则更新所有记录)

```sql
UPDATE users SET age = age + 5;

UPDATE users SET age=age-id,sex=0;

UPDATE users SET age=age+10 where id % 2 =0;
```

## 删除数据

```sql
DELETE FROM tbl_name [WHERE where_condition]
```

## 查找记录

```sql
查找记录：SELECT select_expr [,select_expr ……]
[FROM table_referrnces [WHERE where_condition]
[GROUP BY{col_name | position} [ASC | DESCI],……]
[HAVING where_condition]
[ORDER BY {col_name |expr |position} [ASC | DESCI],……]

-- demo
SELECT id, username FROM users;

-- 别名
SELECT id AS userId, username AS name FROM users;
```

### 查询分组

```sql
SELECT sex FROM users GROUP BY sex  -- 数据库多条记录会被合并，譬如这里只有 1, null
```

- 分组条件 [HAVING where_condotion]

`having` 后的条件必须为聚合函数或者出现在 `select` 所选择的字段中。

```sql
SELECT sex FROM users GROUP BY sex -- 对所有记录分组

-- 报错 having 后的条件必须为聚合函数或者出现在 select 所选择的字段中。
SELECT sex FROM users GROUP by sex  having age>35;

SELECT sex FROM users GROUP BY sex HAVING count(id) > 2;
```

- 排序

```sql
-- 首先按照age升序排列（asc），其次按照id降序排列（desc）
SELECT * FROM users ORDER BY age,id DESC;
```

- 限制返回的数据的数量

1. select \_ from users limit 2 意思为从取前两条记录。
2. select \_ from users limit 3,2 意思为从第 4 条记录开始取两条，而不是从第三条记录开始。
3. ...

### 子查询与链接

```SQL
use test;

CREATE TABLE IF NOT EXISTS tb4(
  goodsId SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  goodsName VARCHAR(20) NOT NULL,
  price FLOAT UNSIGNED
);

INSERT tb4 VALUES (NULL, 'goods1', 12.8), (NULL, 'goods2', 95.8), (NULL, 'goods3', 15.8), (NULL, 'goods2', 50.5);

-- 查找平均值
select avg(price) from tb4;

-- 对平均值四舍五入
select round(avg(price), 2) from tb4; -- 保留两位小数

-- 使用比较
select goodsId, goodsName, price from tb4 where price >= 20;

-- 查找大于平均价格的
select goodsId, goodsName, price from tb4 where price >= (select round(avg(price), 2) from tb4);
```
| 运算符/关键字 |  ANY   |  SOME  |  ALL   |
| :-----------: | :----: | :----: | :----: |
|     >、>=     | 最小值 | 最小值 | 最大值 |
|     <、<=     | 最大值 | 最大值 | 最小值 |
|       =       | 任意值 | 任意值 |        |
|    <>、!=     |        |        | 任意值 |

使用[NOT]EXISTS 的子查询：如果子查询返回任何行，EXISTS 将返回 TURE；否则返回 FALSE.

```sql
select * from tb4 where price >= all (select round(avg(price), 2) from tb4); -- 任意大于平均价格的记录
```


## 数据增删改查-demo（单表）

### INSERT

```sql
CREATE TABLE IF NOT EXISTS goods (
  id SMALLINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(20) NOT NULL,
  price FLOAT UNSIGNED,
  origin VARCHAR(20) DEFAULT 'CHINA'
);


-- 插入单条记录
INSERT goods VALUES(NULL, 'oppo', 5399, DEFAULT);

-- 插入多条记录
INSERT goods VALUES(NULL, 'iphone', 8999, 'US'), (NULL, 'meizu', 6999, DEFAULT);

-- SET 插入
INSERT goods SET name='xiaomi', price=999;

-- SET 插入多条
INSERT INTO goods (goodsName, price) VALUES('ss',25),('bb',125);
```

### SELECT

```sql
SELECT * FROM goods;

SELECT goodsName, price FROM goods;

SELECT goodsName, price FROM goods WHERE price > 1000; -- 加条件筛选
```

### UPDATE

```sql
-- 找到 iphone , 修改名字为 iphonX, 价格 9999
UPDATE goods SET goodsName='iphonX', price=9999 WHERE goodsName='iphone';
```

### DELETE

```SQL
DELETE FROM goods WHERE goodsName='ss'; -- DELETE FROM goods 删除所有
```

多表有 `left join` 、 `inner` 等等，这里不再讲述。