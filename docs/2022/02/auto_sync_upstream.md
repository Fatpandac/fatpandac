---
title: Fork 仓库通过 Github Action 自动同步 Upstream
date: 2022-02-14
tags:
  - fork repo.
  - GitHub
  - GitHub Action
categories:
  - 技文
---

前几天使用 Github Action 实现了 Github 仓库同步到 Gitee。  
之后发现 Github Action 还可以应用到其他地方，我第一个想到的就是实现自动同步 Upstream，于是在我的一番寻找 🔍 最后找到了一个叫 [merge-upstream](https://github.com/exions/merge-upstream) 来自 [exions](https://github.com/exions) 的 Action 库。  
他的使用十分的简单仅需要简单的配置即可。

<!-- more -->

以我使用、参加的开源项目 [RSSHub](https://github.com/DIYgod/RSSHub) 为例，在我自己 fork 的 [RSSHub](https://github.com/Fatpandac/RSSHub) 仓库上我创建了一个 [Action - merge-upstream.yml](https://github.com/Fatpandac/RSSHub/blob/action/merge_upstream/.github/workflows/merge-upstream.yml) 定时每天 7:00 的时候自动同步 Upstream。这样就可以方便我的使用保证其中的路由都是最新的，同时还可以方便我在开发新路由的时候省区一些不必要的操作。  
在这我的创建步骤如下：

- 创建一个新的分支名为 `action/merge_upstream`
  - 将 `action/merge_upstream` 分支设置为默认分支，因为 Github Action 只能运行在默认分支下的 Action
  - 在分支内新建一个 Action，每天七点同步代码到 `master` 分支 【[如何创建 Action](https://docs.github.com/cn/actions/quickstart)】

这样每天上午七点钟 🕖（北京时间）就会自动运行同步 Upstream 代码，也就不需要每次都要手动的更新了。  
😨 但是需要**注意**的一点是这个 Action 有一个问题就是在 Upstream 中 `.github/workflows` 的文件有变更的时候，自动同步会失败，这样就需要手动来同步了，目前我还没有找到对应的解决办法，等待后续填坑 🕳 吧。

最后还可以将其添加到你自己的开源项目中方便别人即使同步你的代码变更，仅需要简单的修改即可。  
例如在我的开源项目 [fuck_cqooc](https://github.com/Fatpandac/fuck_cqooc) 中所示，代码如下：

```yaml
name: Scheduled Merge Remote Action

on:
  schedule:
    - cron: "0 23 * * *" # run every hour

env:
  target_branch: ${{ secrets.target_branch && secrets.target_branch || 'master' }}

jobs:
  merge-upstream:
    if: github.repository_owner != 'Fatpandac'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        with:
          ref: ${{ env.target_branch }} # set the branch to merge to
          fetch-depth: 0
      - name: Merge Upstream ${{ env.target_branch }}
        uses: exions/merge-upstream@v1
        with:
          upstream: Fatpandac/fuck_cqooc # set the upstream repo
          upstream-branch: master # set the upstream branch to merge from
          branch: ${{ env.target_branch }} # set the branch to merge to
```

在配置的第 7-8 行添加了 `env`，并判断 `secrets` 是否有设置 `target_branch`，这样就可以实现默认同步更新到 `master` 仓库如果有设置 `secrets.target_branch` 则就按设置来。  
在第 12 行添加了一个判断用来判断当前仓库是不是 fork 仓库，使得该 Action 只有在 fork 仓库中才能正常运作。  
这样其他人在 fork 了你的仓库后只要开启了这个 Action 则每天上午七点（北京时间）就会自动更新代码。
