---
title: Mac 本地 MySQL 启动成功但无法连接
author: Licodeao
publishDate: "2024-3-6"
img: /assets/articles/db.png
img_alt: Mac 下本地 MySQL 启动成功但无法连接
description: |
  本地 MySQL 启动成功但 MySQL 客户端无法连接
categories:
  - MySQL
tags:
  - MySQL
---

最近在忙着毕设，由于要写后端，所以需要在本地搭建 MySQL 方便开发。但是在搭建的过程中遇到了匪夷所思的问题：本地 MySQL 服务启动成功了，但是 MySQL 客户端如 Navicat / MySQL Workbench 死活都连接不上。第一次遇到这个问题，故记录一下。前排提示：和操作系统有关系...😇

![image-20240306225418592](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240306225418592.png)

看到这个，很明显本地 MySQL 是启动成功了，尝试使用 MySQL 客户端连接本地 MySQL 服务：

![image-20240306225658417](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240306225658417.png)

发现连接失败，第一反应是端口是否是不一致的，查看本地 MySQL 服务的端口：

![image-20240306225835152](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240306225835152.png)

发现本地 MySQL 服务的端口竟然是 0，难道 MySQL 安装后没有生产默认的配置文件吗？进入 `/etc` 目录看看：

![image-20240306230105389](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240306230105389.png)

发现确实没有默认的配置文件，最终查了一圈才明白：在 Mac 系统下，MySQL 的默认配置文件不再是 `my.ini` ，而是 `my.cnf` ，并且 MySQL 安装后默认没有 `my.cnf` 文件，这才导致了本地 MySQL 服务的端口为 0，这个端口号表示了 MySQL 是无网络状态下启动的，可以通过以下命令查看：

![image-20240306230426266](https://typora-licodeao.oss-cn-guangzhou.aliyuncs.com/typoraImg/image-20240306230426266.png)

所以，问题找到了，是因为本地 MySQL 服务的端口和 MySQL 客户端指定的端口不一致。当然，想要一劳永逸地解决掉这个麻烦，还是得写个配置文件才行。记住了，在 Mac 系统下，配置文件是 `my.cnf`。

```ini title="my.cnf"
[client]
default-character-set=utf8
#password   = your_password
port        = 3306
socket      = /tmp/mysql.sock
[mysqld]
character-set-server=utf8
init_connect='SET NAMES utf8
port =3306
socket = /tmp/mysql.sock
skip-external-locking
key_buffer_size = 16M
max_allowed_packet = 1M
table_open_cache = 64
sort_buffer_size = 512K
net_buffer_length = 8K
read_buffer_size = 256K
read_rnd_buffer_size = 512K
myisam_sort_buffer_size = 8M
character-set-server=utf8
init_connect='SET NAMES utf8'
#skip-networking
log-bin=mysql-bin
binlog_format=mixed
server-id = 1
# server-id = 2
# The replication master for this slave - required
#master-host = <hostname>
# The username the slave will use for authentication when connecting
# to the master - required
#master-user = <username>
# The password the slave will authenticate with when connecting to
# the master - required
#master-password = <password>
# The port the master is listening on.
# optional - defaults to 3306
#master-port = <port>
# binary logging - not required for slaves, but recommended
#log-bin=mysql-bin
# Uncomment the following if you are using InnoDB tables
#innodb_data_home_dir = /usr/local/mysql/data
#innodb_data_file_path = ibdata1:10M:autoextend
#innodb_log_group_home_dir = /usr/local/mysql/data
# You can set .._buffer_pool_size up to 50 - 80 %
# of RAM but beware of setting memory usage too high
#innodb_buffer_pool_size = 16M
#innodb_additional_mem_pool_size = 2M
# Set .._log_file_size to 25 % of buffer pool size
#innodb_log_file_size = 5M
#innodb_log_buffer_size = 8M
#innodb_flush_log_at_trx_commit = 1
#innodb_lock_wait_timeout = 50
[mysqldump]
quick
max_allowed_packet = 16M
[mysql]
no-auto-rehash
# Remove the next comment character if you are not familiar with SQL
#safe-updates
default-character-set=utf8
[myisamchk]
key_buffer_size = 20M
sort_buffer_size = 20M
read_buffer = 2M
write_buffer = 2M
[mysqlhotcopy]
interactive-timeout
```

保存文件后，通过 `sudo chmod 664` 修改文件权限。重新启动 MySQL 后，问题就解决了。
