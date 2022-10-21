---
title: 移除 brew python 的 pip3 安装警告
date: 2022-03-13
tags:
 - brew
 - pip3
 - python3
categories:
 - 技文
---

再使用 brew 安装的 Python3 的时候使用 pip3 安装库的时候总是看到下面👇🏻烦人的警🛑  
![pip3 在 brew 上烦人的警告](/kupj1b65xzZSh2q.png)

<!-- more -->

于是在走马观花的看了下提示的 issue 之后找到了以下两个修复方法：  
1. 继续使用 Python3.10 以下的版本，需要修改 pip 如下的源码
[需要移除的代码](https://github.com/pypa/pip/blob/ec8edbf5df977bb88e1c777dd44e26664d81e216/src/pip/_internal/locations/__init__.py#L383-L392)   
```python
deprecated(
    reason=(
        "Configuring installation scheme with distutils config files "
        "is deprecated and will no longer work in the near future. If you "
        "are using a Homebrew or Linuxbrew Python, please see discussion "
        "at https://github.com/Homebrew/homebrew-core/issues/76621"
    ),
    replacement=None,
    gone_in=None,
)
```
仅需将本地对应文件的上述代码删除即可，这种方法仅仅是屏蔽⛔️警告的输出，治标不治本  
2. 切换 brew 的 python 版本到 `3.10` 以上
假设本地存在 `3.9` 和 `3.10` 的情况，其他情况同理
```shell
brew unlink python@3.9
brew unlink python@3.10
brew link -overwrite python@3.10
# 可能会提示将对应路径添加到环境中，照做就好
fish_add_path /opt/homebrew/opt/python@3.10/bin
```
完成上述操作即可实现 brew 默认 python 版本的切换🔄了！
尝试一下安装⬇️  `rich`
![切换到 python3.10 后，pip 安装 rich](/ZPWnmdzQj1qU72c.png)
很好👍🏻没有任何警🛑   

