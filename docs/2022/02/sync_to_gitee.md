---
title: 同步 GitHub 仓库到 Gitee 通过 GitHub Action
date: 2022-02-10
tags:
  - GitHub
  - GitHub Action
  - CI/CD
categories:
  - 技文
---

今天看到突然间看到了 [@gyx8899](https://github.com/gyx8899) 的 [Blog](https://gyx8899.gitbook.io) 的[一篇文章](https://gyx8899.gitbook.io/blog/share/syncgithubtogitee)是关于如何用 Github Action 来实现 GitHub 仓库自动同步到 Gitee 上 🔃。

<!-- more -->

在看完文章并将其在我的 [fuck_cqooc](https://github.com/Fatpandac/fuck_cqooc) 和 [Homework](https://github.com/Fatpandac/Homework) 中实践之后，我开始感觉到不对劲了，是那种见到漂亮妹妹的那种不对劲，可能从他成功的把我的 GitHub 仓库同步到我对应的 Gitee 仓库的那一刻开始我就喜欢上他了吧！😍  
后面我将会去看看 GitHub Action 的官方文档 📃，找一些有意思的 Action 玩玩。

下面简单记录一下 [@gyx8899](https://github.com/gyx8899) 的 GitHub Action 使用方法：

- 设置 GitHub 仓库的 Secrets 🔑
  - `GITEE_USER` 仓库对应所有者的 ID
  - `GITEE_PRIVATE_KEY` 对应的 Gitee 公钥的私钥，[配置方法](https://gitee.com/help/articles/4181)
  - `GITEE_TOKEN` [获取链接](https://gitee.com/profile/personal_access_tokens)
- 复制下面代码到对应仓库的 `.github/workflows/[action-file-name].yml`，需要注意当前分支要为远程仓库的默认分支
- 推送到远程 GitHub 仓库即可

```yaml
name: sync -> gitee
on:
  push:
    branches:
      - main
jobs:
  repo-sync:
    env:
      dst_key: ${{ secrets.GITEE_PRIVATE_KEY }}
      dst_token: ${{ secrets.GITEE_TOKEN }}
      gitee_user: ${{ secrets.GITEE_USER }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          persist-credentials: false

      - name: sync github -> gitee
        uses: Yikun/hub-mirror-action@master
        if: env.dst_key && env.dst_token && env.gitee_user
        with:
          src: "github/${{ github.repository_owner }}"
          dst: "gitee/${{ secrets.GITEE_USER }}"
          dst_key: ${{ secrets.GITEE_PRIVATE_KEY }}
          dst_token: ${{ secrets.GITEE_TOKEN }}
          static_list: ${{ github.event.repository.name }}
```

<GiscusComments />
