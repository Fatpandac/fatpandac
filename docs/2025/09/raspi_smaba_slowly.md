---
title: 树莓派 samba 传输速度慢排查
date: 2025-09-20
tags:
  - Rasberry Pi
  - NAS
categories:
  - 杂文
---

最近放弃使用 PC 主机了，所以又开始折腾起来树莓派了，买了一个硬盘柜接树莓派开 samba 服务存储下载的视频并提供给 Apple TV 的 infuse 观看。  
不过遇到一个问题就是树莓派的 samba 网络传输速度有点不太理想只有 10MB/s！于是就开始了排查...

<!-- more -->

排查的步骤如下：

1. 排查是不是磁盘传输速度限制，通过如下命令：

```bash
hdparm -t /dev/sda  # 这里的 /dev/sda 改成对应的磁盘位置即可

# 之后再运行这段，就可以知道硬盘的传输速度了
dd if=/dev/zero of=/mnt/data/test bs=1M count=1024 oflag=direct
```

2. 排查是不是网络传输速度限制，通过`iperf3`工具，如下命令：

```bash
# 如果没有安装先通过下面命令安装
sudo apt install iperf3
# 通过这个命令在树莓派上启动服务端
iperf3 -s

# 通过下面这个命令在另一台电脑上运行就可以知道网络传输的速度
iperf3 -c <树莓派的 IP 地址> -t 30 -P 4
```

通过上面的排查，确定我遇到的问题是网络导致的，因为我树莓派使用的是 Wi-Fi 连接，最后改成网线成功解决。  
查个题外话 infuse 对 kmv 的支持好像不是很好对于其他的格式读取速度有点低。
