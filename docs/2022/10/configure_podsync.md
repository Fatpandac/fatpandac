---
title: 配置 Podsync 并修复 bug “failed to execute youtube-dl signal killed”
date: 2022-10-23
tags:
  - Podsync
  - Youtube
categories:
  - 技文
---

在使用 YouTube 的时候会订阅一些频道，有些频道的视频是那种可以完全不用看只要听就可以的，在之前我有开通会员来使用后台播放的功能，但是对于我来说会员的使用率还是太低了，我基本上一天也就会看一个节目而已，所以我在上次到期之后就没有续费了，但是我还是想要看那些节目但是又不想挂着让手机一直亮屏浪费多余的电（不环保 🐶），于是我就想是不是可以将一个视频提取出来他的音频然后生成一个播客的订阅源，这样我就可以在后台收听这些内容了。

<!-- more -->

于是搜索了一下找到了一个叫做 Podsync 的程序，这个程序可以实现我的想法，将一个 YouTube 频道转变为一个可以订阅且根据 YouTube 频道更新一起更新的播客。

[![Podsync Logo](/images/podsync_logo.png)](https://github.com/mxpv/podsync)

翻阅了 Readme 之后开始了安装配置，我一开始选择了使用 Docker 的安装方式因为这个安装方式不需要安装配置其他环境，在拉取下来镜像之后开始创建容器，但是在创建容器之前还得做准备工作创建一个配置文件，创建一个 toml 文件，其内容如下：

```toml
[server]
	port = 8080
	data_dir = "~/data/podsync/"
	hostname = "https://podsync.example.com"

[tokens]
	youtube = "AIzaSyBEfG3YkddyiqT-htAa5xOE4VwLMFzPtZE"

[feeds]
	[feeds.wangjian]
	url = "https://www.youtube.com/channel/UC8UCbiPrm2zN9nZHKdTevZA"
	format = "audio"
	filters = {
	not_title="shorts"
	}
	update_period = "2h"

[downloader]
	self_update = true
```

`[server]` 下面有 `port` 和 `data_dir` 两个内容，这两个分别是出口端口和下载的视频内容存放文件夹路径，`hostname` 则是设置自己的域名如果不设置这个域名将不能正确的访问到对应的音频源，也就无法正常使用播客订阅

`[token]` 是 YouTube 的 API token 可以通过下面这个方法来申请取得

[https://github.com/mxpv/podsync/blob/main/docs/how_to_get_vimeo_token.md](https://github.com/mxpv/podsync/blob/main/docs/how_to_get_vimeo_token.md)

`[feeds]` 下面是用来写需要订阅的频道，它们以 `[feed.channel_name]` 这样的形式来命名，`channel_name` 不能出现重复它们是唯一的，在 `[feed.channel_name]` 的 `url` 写上订阅的频道链接，`format` 写上输出的格式如果想要订阅的是音频的话写上 `audio` 视频则写上 `video`，同时你还能通过 `filters` 参数根据一定条件过滤掉对应内容， `update_period` 设置更新时间。

`[downloader]` 用来配置下载器，将 `self_update` 设置为 `true` 可以实现 downloader 的自动更新。

还有更多的配置内容可以查看该链接：

[https://github.com/mxpv/podsync/blob/main/config.toml.example](https://github.com/mxpv/podsync/blob/main/config.toml.example)

在配置完这些内容之后就可以创建容器来，使用如下命令创建：

```bash
docker run \
  -p 8080:8080 \
  -v $(pwd)/data:/app/data/ \
  -v $(pwd)/config.toml:/app/config.toml \
  mxpv/podsync:latest
```

创建成功之后我以为就可以正常运行了，可惜不行，运行中出现了错误，显示错误 `failed to execute youtube-dl: signal: killed` ，于是我开始尝试查找这个错误的解决办法，我显示到对应的 GitHub 仓库的 issues 上查找但是并未找到对应的结果，之后我又使用 Google 来查找最后还是没有找到有效的解决办法。

于是我只能自己摸着石头过河，显示下载源码下来编译使用放弃 Docker 但是还是一样出现对应的问题。

我仔细看了下报错是关于 youtube-dl 这个依赖的，于是我单独使用这个依赖来下载视频，发现这个下载器下载的速度十分的慢只有几十 kb，之后我到这个依赖的仓库上看了下有没有人提关于下载慢的 issues，没想到还真有，看到其中有一个评论建议换另一个下载器 yt-dlp，于是我尝试使用推荐的这个下载器来下载视频，发现这个下载器可以跑到满速下载，我想可能是不是因为这个下载器速度不行的问题，于是我开始考虑换掉 Podsync 依赖的下载器 youtube-dl。

在 Podsync 的源代码中搜索了一会后发现了[下载器相关的代码](https://github.com/mxpv/podsync/blob/main/pkg/ytdl/ytdl.go?rgh-link-date=2022-10-24T13%3A14%3A35Z#L61)，我将代码中对应的内容替换为 yt-dlp 如下：

![Diff code](/images/Eg9dnTcE7SVw.png)

之后再次运行，总算是可以正常运行了！成功生成了下列内容包括订阅文件 xml！

![Genarate files](/images/4kwzerTX3SzN.png)
