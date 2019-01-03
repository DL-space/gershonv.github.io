---
title: mysql - 对 table 的操作
date: 2018-12-30 13:15:47
categories: MySQL
tags: MySQL
---

## 创建表

```sql
mysql.server start // net start mysql

mysql -uroot -p // login

use test // 进入数据库

CREATE TABLE [IF NOT EXISTS] table_name (
  column_name data_type,
  // ...
)
```
<!--more-->

### demo1 

创建 `tb1` 表

```sql
CREATE TABLE IF NOT EXISTS tb1 (
  username VARCHAR(20) NOT NULL,
  age TINYINT UNSIGNED,
  salary FLOAT(8, 2) UNSIGNED
);

SHOIW TABLES; --查看数据库中的表

SHOW COLUMNS FROM tb1; --查看数据表中的结构
```

| Field | Type  | Null | Key | Default | Extra |
| :---: | :---: |:--: | :-: | :-----: | :---: |
| username |     varchar(20)     | YES  |     |  null   |       |
|   age    | tinyint(3) unsigned | YES  |     |  null   |       |
|  salary  | float(8,2) unsigned | YES  |     |  null   |       |

- username: 用户的名字往往是字符型，字符数据量小，所以数据类型定为 `VARCHAR(20)`, `NOT NULL` 不能为空
- age: 年龄不能为负值且为整型，数据类型定为 `TINYINT`
- salary: `FLOAT(8, 2)` 整数八位 - 小数有两位，非负值

### demo2

```sql
CREATE TABLE IF NOT EXISTS tb3(
  id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(20) NOT NULL UNIQUE KEY,
  sex ENUM ('1','2','3') DEFAULT '3'
);

-- AUTO_INCREMENT: 自增字段，必须为主键 `PRIMARY KEY`，保证记录的唯一性.
-- UNIQUE KEY: 唯一
-- DEFAULT: 默认
```


| Field | Type  | Null | Key | Default | Extra |
| :---: | :---: |:--: | :-: | :-----: | :------------: |
|    id    |    smallint(5)    |  NO  | PRI |  null   | auto_increment |
| username |    varchar(20)    |  NO  |     |  null   |                |
|   sex    | enum('1','2','3') | YES  |     |    3    |                |


## 约束

- 约束保证数据的完整性和一致性。
- 约束表现为表级约束和列级约束。
- 约束类型包括
  - `NOT NULL` 非空
  - `PRIMARY KEY` 主键
  - `UNIQUE` 唯一
  - `DEFAULT` 默认
  - `FOREIGN KEY` 外键 (foreign key)

> 外键约束：保持数据一致性，完整性，实现一对多或者多对一的关系

> 表级约束：针对两个或者两个以上的字段来使用

> 列级约束：只针对某一个字段来使用

### 外键约束

1.  父表和子表必须使用相同的存储引擎，而且禁止使用临时表
2.  数据表的存储引擎只能为 InnoDB
3.  外键列和参照列必须具有相似的数据类型。其中数字的长度或是否有符号位必须相同；而字符的长度则可以不同。
4.  外键列和参照列必须创建索引。如果外键列不存在索引的话，MySQL 将自动创建索引。

```sql
-- 身份表
CREATE TABLE IF NOT EXISTS provinces (
  id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  pname VARCHAR(20) NOT NULL
);

-- 用户表
CREATE TABLE IF NOT EXISTS users (
   id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
   username VARCHAR(10) NOT NULL,
   pid SMALLINT UNSIGNED,
   FOREIGN KEY(pid) REFERENCES provinces(id) -- 设置 pid 外键 references provinces 表的 id
);

-- 外键列和参照列必须具有相似的数据类型: pid BIGINT， 是创建不成功的。保证数据类型相同是第一步
-- 数字的长度或是否有符号位必须相同：pid SMALLINT, 同样创建不成功。有符号位位必须相同。pid SMALLINT UNSIGNED 就满足条件了
-- 外键列和参照列必须创建索引:, 我们没有创建，MySQL 自动创建了索引。

-- 主键在创建的同时，会自动创建索引。
SHOW INDEXES FROM provinces\G; -- Seq_in_index: 1
```

1. 我们创建了父表 `provinces`, 子表 `users`
2. 外键列：pid , 参照列 id


## 对 table column 的操作

列的增加、删除，约束的添加、约束的删除。

```sql
-- 添加单列
alter table tbl_name add [column] col_name col_difinition[first|after col_name]

-- 解释：first 插入第一列，after col_name 插入某一列后面。省略不写，加在最后列

-- 添加多列
alter table tbl_name add [column] (col_name col_difinition,...)

-- 删除列
alter table tbl_name drop[column] col_name1,col_name2;


-- demo
ALTER TABLE users ADD age TINYINT NOT NULL DEFAULT 10;
ALTER TABLE users ADD password VARCHAR(32) NOT NULL AFTER username;
ALTER TABLE users DROP password, DROP username;
```

```sql
-- 修改数据表【添加或删除约束】：

ALTER TABLE table_name ADD [CONSTRAINT [symbol]] PRIMARY KEY [index_type](index_col_name,...) -- 这是添加主键约束(只能有一个)

ALTER TABLE table_name ADD [CONSTRAINT [symbol]] UNIQUE [INDEX/KEY] [index_name] [index_type] (index_col_name,...); --这是添加唯一约束(可以有多个)

ALTER TABLE table_name ADD [CONSTRAINT [symbol]] FOREIGN KEY [index_name] (index_col_name,...) reference_definition; --这是添加外键约束(可以有多个)

ALTER TABLE table_name ALTER [COLUMN] col_name {SET DEFAULT literal(这个literal的意思是加上的default)/DROP DEFAULT} --添加或删除默认约束

ALTER TABLE table_name DROP PRIMARY KEY; -- 删除主键约束

ALTER TABLE table_name DROP {INDEX/KEY} index_name; --删除唯一约束

ALTER TABLE table_name DROP FOREIGN KEY fk_symbol; --删除外键约束


-- demo
CREATE TABLE IF NOT EXISTS users2 (
  username VARCHAR(10) NOT NULL,
  pid SMALLINT UNSIGNED
);

ALTER TABLE users2 ADD id SMALLINT UNSIGNED;

-- 添加主键约束
ALTER TABLE users2 ADD CONSTRAINT PRIMARY KEY(id);

-- 添加唯一约束
ALTER TABLE users2 ADD UNIQUE (username);

-- 添加外键
ALTER TABLE users2 ADD FOREIGN KEY (pid) REFERENCES provinces (id);

-- 添加默认约束
ALTER TABLE users2 ADD age TINYINT UNSIGNED NOT NULL;

ALTER TABLE users2 ALTER age SET DEFAULT 22;

-- 删除默认约束
ALTER TABLE users2 ALTER age DROP DEFAULT;

-- 删除主键约束
ALTER TABLE users2 DROP PRIMARY KEY;

-- 删除唯一约束
ALTER TABLE users2 DROP INDEX username;

-- 删除外键约束
SHOW CREATE TABLE users2 --  CONSTRAINT `users2_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `provinces` (`id`)

ALTER TABLE users2 DROP FOREIGN key users2_ibfk_1;
```