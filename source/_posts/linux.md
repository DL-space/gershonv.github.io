---
title: linux - centos 下的配置
date: 2019-02-21 13:28:26
tags:
  - linux
  - centos
categories: linux
---

## prev

```bash
yum -y install gcc gcc-c++ autoconf pcre-devel make automake
yum -y install wget httpd-tools vim
```

## 安装 node npm

```bash
cd /
mkdir soft && cd soft
wget https://nodejs.org/dist/v10.15.1/node-v10.15.1-linux-x64.tar.xz
tar -xvf node-v10.15.1-linux-x64.tar.xz # 解压
ln -s /soft/node-v10.15.1-linux-x64/bin/node /usr/local/bin/node
ln -s /soft/node-v10.15.1-linux-x64/bin/npm /usr/local/bin/npm

node -v
npm -v
```

## 安装 nginx

```bash
vim /etc/yum.repos.d/nginx.repo

## 编辑 nginx.repo

## click i to insert
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/centos/7/$basearch/
gpgcheck=0
enabled=1
## esc shift+: wq enter 保存

yum install nginx

nginx -v
```

rpm 是 linux 的 rpm 包管理工具，-q 代表询问模式，-l 代表返回列表，这样我们就可以找到 nginx 的所有安装位置了。

## nginx

```bash
nginx # 启动 nginx

ps aux|grep nginx # 查看 nginx 是否运行

curl localhost # 出现nginx的欢迎页面

## 查看 Nginx 的安装目录
rpm -ql nginx
```

停止 nginx...

```bash
nginx -s quit # 从容停止服务 需要进程完成当前工作后再停止
nginx  -s stop # 立即停止服务 这种方法比较强硬，无论进程是否在工作，都直接停止进程
killall nginx # killall 方法杀死进程
systemctl stop nginx.service # systemctl 停止

# 重启 Nginx 服务
systemctl restart nginx.service

# 重新载入配置文件 在重新编写或者修改Nginx的配置文件后，都需要作一下重新载入
nginx -s reload

# 查看端口号
netstat -tlnp
```
