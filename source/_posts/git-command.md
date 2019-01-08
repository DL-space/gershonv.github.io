---
title: git 实用指南
date: 2018-07-10 21:30:04
categories: 开发工具
tags: Git
---

## commit 规范速查

- `feat`：新功能（feature）
- `fix`：修补 bug
- `docs`：文档（documentation）
- `style`： 格式（不影响代码运行的变动）
- `refactor`：重构（即不是新增功能，也不是修改 bug 的代码变动）
- `test`：增加测试
- `chore`：构建过程或辅助工具的变动
- `revert`: 撤销以前的 commit
 
 ```bash
 revert: feat(pencil): add 'graphiteWidth' option
 ```

<!--more-->

## 本地创建、连接远程仓库

```bash
# 创建并连接远程仓库
mkdir git-demo

cd git-demo/

git init

# 连接远程仓库
git remote add origin https://github.com/gershonv/git-demo.git
```

## 新建文件并推向远端

```bash
# 创建 a.js
touch a.js

# 添加到暂存区（见下文）
git add .

# commit 记录（见下文）
git commit -m 'feat: 新增 a.js 文件'

# 推向远端 master 分支（见下文）
git push origin master
```

- git add
  - `git add [file1 file2 file3...]`: 添加多个文件
  - `git add .` : 暂存所有文件

## git status

![](https://user-gold-cdn.xitu.io/2019/1/8/1682b86ab859defb?w=505&h=412&f=png&s=45734)

M - 被修改，A - 被添加，D - 被删除，R - 重命名，?? - 未被跟踪

## 撤销操作

### 撤销 git add

```bash
# 新建 b.js 文件
touch b.js

git add .

git statis

# 撤销 git add
git reset head b.js
```

- `git reset head` : 如果后面什么都不跟的话 就是上一次 add 里面的全部撤销了
- `git reset head file`: 对某个文件进行撤销了

### 撤销本地修改

```bash
# 修改文件
vim a.js

# 插入数据
shift + i

# 保存退出
shift + : wq

# 加入暂存区
git add .

git commit -m 'refactor: 修改 a.js 文件'

# 撤销修改
git checkout -- a.js
```

### 撤销 git commit

```bash
# 查看 commit 记录
git log

# 重置到某个节点。
git reset --hard ea794cf0dcf934b594
```

## 分支

### 新建分支并推向远程

```bash
# 新建并切换本地分支
git checkout -b dev

# 查看当前分支
git branch

# 查看远程分支
git branch -r

# 推送到远程
git push origin dev
```

### 合并分支

```bash
# 开发完 dev 分支后
git checkout master

# 合并 dev 分支到主分支
git merge dev

# 推送
git push origin master
```

### 分支管理

```bash
# 查看所有分支 远程+本地
git branch -a

# 删除远程分支
git push origin -d dev

# 删除本地分支
git checkout master
git branch -d dev
```