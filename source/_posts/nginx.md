---
title: nginx
date: 2019-03-02 00:10:37
categories: React
tags: 
  - nginx
  - linux
---

##  安装

```bash
yum list | grep nginx # 查看yum是否已经存在 会出现一些列表~

# 自行配置yum源
vim /etc/yum.repos.d/nginx.repo

## 新增

[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/OS/OSRELEASE/$basearch/
gpgcheck=0
enabled=1

## 赋值完成后，你需要修改一下对应的操作系统和版本号，因为我的是centos和7的版本，所以改为这样。
baseurl=http://nginx.org/packages/centos/7/$basearch/

# 安装
yum install nginx

# check
nginx -v
```

## Nginx基本配置文件详讲

查看 nginx 安装在哪里

```bash
rpm -ql nginx
```

```bash
cd /etc/nginx # 我这里可以直接进入 nginx 目录
ls
conf.d  fastcgi_params  koi-utf  koi-win  mime.types  modules  nginx.conf  scgi_params uwsgi_params  win-utf
```

### nginx.conf

```bash
vim nginx.conf # 打开 nginx.conf 文件

#运行用户，默认即是nginx，可以不进行设置
user  nginx;
#Nginx进程，一般设置为和CPU核数一样
worker_processes  1;   
#错误日志存放目录
error_log  /var/log/nginx/error.log warn;
#进程pid存放位置
pid        /var/run/nginx.pid;
events {
    worker_connections  1024; # 单个后台进程的最大并发数
}
http {
    include       /etc/nginx/mime.types;   #文件扩展名与类型映射表
    default_type  application/octet-stream;  #默认文件类型
    #设置日志模式
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    access_log  /var/log/nginx/access.log  main;   #nginx访问日志存放位置
    sendfile        on;   #开启高效传输模式
    #tcp_nopush     on;    #减少网络报文段的数量
    keepalive_timeout  65;  #保持连接的时间，也叫超时时间
    #gzip  on;  #开启gzip压缩
    include /etc/nginx/conf.d/*.conf; #包含的子配置项位置和文件
```

### /conf.d/default.conf

```bash
server {
    listen       80;
    server_name  localhost;

    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;  #服务默认启动目录
        index  index.html index.htm; #默认访问文件
    }

    #error_page  404              /404.html; # 配置404页面

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}
```

## Nginx 服务启动、停止、重启

```bash
nginx # 直接启动

ps aux | grep nginx # 查看 nginx 运行状态

# root     32253  0.0  0.1  46540  2200 ?        Ss   Mar01   0:00 nginx: master process nginx
# nginx    32314  0.0  0.1  46980  2584 ?        S    00:07   0:00 nginx: worker process
# root     32347  0.0  0.0 112648   968 pts/0    R+   00:30   0:00 grep --color=auto nginx

# 在重新编写或者修改Nginx的配置文件后，都需要作一下重新载入，这时候可以用 Nginx 给的命令
nginx -s reload
```

比如我们部署 react 项目

```bash
cd /etc/nginx/conf.d
ls 
default.conf

# 新建一个 conf 文件
vim blog.conf

## 输入
server {
    listen 8001;

    server_name localhost; 

    root /projects/react-blog/build; # 项目地址

    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_buffers 32 4k;
    gzip_comp_level 9;
    gzip_min_length 200;
    gzip_types text/css text/xml application/javascript;
    gzip_vary on;
}

### ps 阿里云服务器访问墙（安全组）需要开一个 8001 端口 

## 修改好了 重启 nginx
nginx -s reload

## 访问 你的地址 ~~ 可以看到 nginx 已经定位到你的静态资源啦
IP:8001 
```

```bash
nginx  -s stop # 立即停止服务
nginx -s quit # 从容停止服务 这种方法较stop相比就比较温和一些了，需要进程完成当前工作后再停止。
killall nginx # 直接杀死进程

# 重启Nginx服务
systemctl restart nginx.service

# Nginx启动后会监听80端口，从而提供HTTP访问，如果80端口已经被占用则会启动失败。我么可以使用netstat -tlnp命令查看端口号的占用情况。
netstat -tlnp
```

## 配置 域名

```bash
# /conf.d

vim blog.conf

server {
    listen 80;

    server_name guodada.fun;

    root /projects/react-blog/build;

    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_buffers 32 4k;
    gzip_comp_level 9;
    gzip_min_length 200;
    gzip_types text/css text/xml application/javascript;
    gzip_vary on;
}

nginx -s reload 

# 访问 guodada.fun 就可以看到效果啦
```