---
title: 为单个文件夹提供不同的 git 配置
date: 2023-08-29
tags:
  - git
categories:
  - 技文
---

最近有一个需求，因为工作的需要，公司使用的是 GitLab 而我一直都是使用的 GitHub 还有就是对于公司的仓库要配置公司内对应的邮箱以及名称，这时候就需要为克隆下来的公司的仓库单独配置邮件和名称，一般都会使用下面的命令来实现对于单个仓库的独立 Git 配置，但是这样解决方法有点繁琐,因为这样的话我们每一次克隆一个公司的新项目都要我们设置一下这两个命令如果你还要设置 GPG 的话那么就是三个命令了，仓库多起来是有点繁琐的，也不是很方便。

<!-- more -->

```shell
git config user.name <name>
git config user.email <email>
git config user.signingkey <signingkey>
```

为了解决这个问题实现一次配置使用终身，可以将一个文件夹当做工作仓库的存放处，之后通过在 `~/.gitconfig` 中配置对应的判断条件，当处在工作路径下的时候就使用对应的 `.gitconfig` 配置。

下面假设我的工作路径为 `~/work`，为了实现可以通过判断工作路径使用对应的 `.gitconfig` 所以可以使用 [includeIf](https://git-scm.com/docs/git-config#_conditional_includes)

首先我们要在自己的 home 下面的 `.gitconfig` 添加下面的判断

```shell
[includeIf "gitdir:~/work/"]
  path = ~/work/.gitconfig
```

注意：上面的 `gitdir:~/work/` 路径一定要以 `/` 结尾

之后再回到 `~/work` 路径下添加一个 `.gitconfig` 文件，然后在里面写上你先要再公司仓库使用的配置如下

```shell
[user]
	name = <在公司使用的名称>
	email = <在公司使用的邮箱>
	signingkey = <在公司使用的签名>
[core]
    edit = nvim
    paper = delta
	  editor = nvim
	  autocrlf = input
[commit]
    gpgsign = true
```

配置完上面内容之后可以克隆项目到 `~/work` 这个文件夹下面之后进入项目使用 `git config --list` 查看刚刚的配置是否生效
