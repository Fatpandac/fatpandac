---
title: 使用 Github Action 自动化发布 Release
date: 2022-06-02
tags:
  - GitHub
  - GitHub Action
categories:
  - 技文
---

最近在维护一个自己的开源项目 [fuck_cqooc](https://github.com/Fatpandac/fuck_cqooc) 这是一个用于刷重庆高校在线平台的网课的工具，毕竟大家都知道的很多时候我们是没有这么多精力去看这些网课的，还有就是一般这些网课也是为了完成任务而任务的，基本上来说水平就是那样和念 PPT 没有多大区别，在这上面花费时间看起来并不是那么的合理的。

<!-- more -->

扯远了，说回正题。

在我编写这个程序的时候我遇到了一个问题，我每次更新一次版本之后都会去编译出一个可执行文件来，以便直接使用，当然你也可以直接通过 Python 来运行，但是对于这个程序的大多数受众来说，一个可以直接使用的程序，是远要比配置环境、安装 Python、执行脚本来的更好的，所以在每次版本更新我都得编译出一个 Mac 和 Win 版本，同时还要上传并且发布到 Release 上去。

在这个过程中就存在着一些不太好的事情。

> 程序员应该学会抗拒一些反复或是重复性的工作！

正如上面这句话所说的，我们应该反对一些重复性的工作，这些工作没有什么重要的意义反而很占用时间。

对于编译来说每一次的编译命令及其过程都是重复的几乎不会有什么差异，同时编译过程的等待也是索然无味的，所以这个过程我得想办法去除掉。

还有一个问题就是在上传的过程中，众所周知因为一些因素的影响，国内访问 GitHub 是很不稳定的，上传文件那就更不用说了，在发布 v0.0.2-beta 版本的时候我上传了一个打包好的 Win 文件花费了我将近一个小时到半个小时，从那一刻开始也就让我下定决心要去实现一个自动化发布了。

在一定的了解后我决定使用 GitHub Action 来完成，毕竟在 GitHub 上面已经有了很多完整的案例了，并且通过 GitHub 本身来上传编译后的包也会变得快速多了，于是在多次尝试后写下了如下 GitHub Action 配置文件。

```yaml
name: Release fuckcqooc
on:
  push:
    tags:
      - "**"
  workflow_dispatch:

jobs:
  release:
    runs-on: windows-latest
    outputs:
      upload_url: ${{ steps.create_release.outputs.upload_url }}
    steps:
      - name: Create Release
        id: create_release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GAYHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: 🎉 ${{ github.ref }}
          draft: true
          prerelease: true
  windowsbuild:
    name: build windows
    needs: release
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@master
      - name: Set up Python 3.7
        uses: actions/setup-python@v1
        with:
          python-version: 3.7
      - name: install pyinstaller
        run: |
          pip3 install pyinstaller
      - name: setup env
        run: |
          pip3 install -r requirements.txt
      - name: build app
        run: |
          pyinstaller -F -w fuck_cqooc.pyw
      - name: build package
        run: |
          cd dist && tar -zcvf fuckcqooc_win.tar.gz fuck_cqooc.exe
      - name: upload
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GAYHUB_TOKEN }}
        with:
          upload_url: ${{ needs.release.outputs.upload_url }}
          asset_path: dist/fuckcqooc_win.tar.gz
          asset_name: fuckcqooc_${{ github.ref }}_win.tar.gz
          asset_content_type: application/gzip
  macosbuild:
    name: build macos
    needs: release
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@master
      - name: Set up Python 3.7
        uses: actions/setup-python@v1
        with:
          python-version: 3.7
      - name: install pyinstaller
        run: |
          pip3 install pyinstaller
      - name: setup env
        run: |
          pip3 install -r requirements.txt
      - name: build app
        run: |
          pyinstaller -F -w fuck_cqooc.pyw
      - name: build package
        run: |
          cd dist && tar -zcvf fuckcqooc_macos.tar.gz fuck_cqooc.app
      - name: upload
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GAYHUB_TOKEN }}
        with:
          upload_url: ${{ needs.release.outputs.upload_url }}
          asset_path: dist/fuckcqooc_macos.tar.gz
          asset_name: fuckcqooc_${{ github.ref }}_macos_x86_64.tar.gz
          asset_content_type: application/gzip
```

通过上面的配置文件就可以实现一个自动发布会的 Action，该 Action 会在推送 `tag` 之后自动激活，并编译出相应环境下的程序，并创建一个 Release 草稿，我仅需要在 Action 运行结束后确认修改 Release 草稿内的内容发布即可。但是其中还是有点小遗憾的，因为 GitHub Action 还没有 Mac arm 的虚拟环境所以还不能自动化打包出 arm 的程序，等待 GitHub 支持 arm 的虚拟环境后，仅需要复制修改为相应的环境及可。

<CommentAndBack />
