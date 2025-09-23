---
title: 自动更新 RSSHub
date: 2022-02-18
tags:
  - fork repo.
  - GitHub
  - Webhook
  - Python
  - RSSHub
categories:
  - 技文
---

前几天已经实现了如何自动的更新 fork 仓库，现在是时候开始考虑如何将 fork 仓库代码同步更新到部署仓库上了!!!  
这时候该 [webhook](https://docs.github.com/en/developers/webhooks-and-events/webhooks/about-webhooks) 登场了， webhook 顾名思义就是一个钩子，当我们有相应的动作发生在对应仓库的时候 webhook 就会启动，访问对应的网址发送请求。

<!-- more -->

依据这种机制我们仅需要一些简单的代码或则不需要代码就可以实现。

1. 编写 webhook 请求 API  
   这里我们有两种方式来实现：

   - 使用你最熟悉的编程语言来实现，在这里我就是用了 Python
     使用 `flask` 来做路由 `gitpython` 来实现与 Git 的交互，一顿操作猛如虎，最终成品如下

   ```Python
   import flask
   from git import Repo
   import os

   REPO_PATH = "/home/Fatpandac/RSSHub"
   YARN_START = f'cd {REPO_PATH} && nohup yarn start > rss.log &'
   KILL_NODE_PS = "ps aux | grep node | awk '{print $2}' | xargs -I{} kill -9 {}"

   def up():
       os.system(KILL_NODE_PS)
       repo = Repo(REPO_PATH)
       repo.git.checkout("master")
       repo.git.pull()
       os.system(YARN_START)

   server = flask.Flask(__name__)

   @server.route('/sync-rsshub', methods=['POST'])
   def update():
       if flask.request.method == 'POST':
           up()

   if __name__ == '__main__':
       server.run(host='0.0.0.0', port=5000)
   ```

   - 还有一种方法就是使用现成的工具了啦，你可以使用类似与 [webhook](https://github.com/adnanh/webhook) 这样的工具，仅需要写一些简单的配置就可以了，具体请查看[官方文档](https://github.com/adnanh/webhook#readme)

2. 设置对应仓库的 webhook
   进入到你需要设置的仓库设置页面即可看到一个 Webhooks 的选项，进入后点击 `Add webhook`，即可看到如下界面：  
   ![Add webhook 界面](/images/gaVNfQHMXT426Ob.png)
   `Playload URL` 填入你刚刚设置的 API 路由地址  
   `Content type` 根据你的需求填写，我这里就选择 json
   其他选项按需选择即可，之后点击绿色的 `Add webhook` 即可，第一次添加会向 API 地址发送请求的。  
   :::tip 如何测试
   如果后续需要对自动化进行测试，可以点击到对应的 webhook 页面找到下面这个内容，点击 `Redeliver` 即可。
   ![Deliveries 界面](/images/I9tTfKNjv2usEWZ.png)
   :::

<GiscusComments />
