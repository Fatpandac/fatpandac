---
title: eventBus 实现
date: 2023-12-08
tags:
  - JavaScript
categories:
  - 小样
---

来实现一个 EventBus 玩玩吧

<!-- more -->

EventBus 是一种机制，允许不同的组件在不了解彼此的情况下进行通信。组件可以向 EventBus 发送事件，而不必担心谁会处理这些事件，或者有多少其他组件会处理这些事件。

![EventBus](/images/EventBus-Publish-Subscribe.png)

通过上面这个图可见 EventBus 主要有有两个接口一个用于发布消息，一个用于绑定事件订阅消息。在 EventBus 中发布的消息要能找到对应的订阅者这就要求我们对订阅以及发布都要有一个标识，通过上面的分析我们就可以得到下面这个简单的 EventBus

```js
const channels = new Map();

// 在调用函数创建 EventBus 的时候传入 key 用于标识
export function eventBus(key) {
  function on(callback) {
    // 通过标识注册对应的回调函数
    const callbacks = channels.get(key) || [];

    channels.set(key, [...callbacks, callback]);
  }

  function emit(message) {
    // 通过标识找到对应的回调函数并发送信息
    const callbacks = channels.get(key);

    if (callbacks) callbacks.map((callback) => callback(message));
  }

  return {
    on,
    emit,
  };
}
```

上面的版本已经可以实现基本的通信了，我们还可以给这个 EventBus 添加 _关闭_ 以及 _订阅只接收一次_

```js
// 实现只订阅一次
function once(callback) {
  function _on_listen(...args) {
    const callbacks = channels.get(key) || [];
    // 注销掉该回调函数
    const filtedCallbacks = callbacks.filter((item) => item !== _on_listen);
    channels.set(key, filtedCallbacks);

    //调用 once 绑定的回调函数
    callback(...args);
  }

  on(_on_listen);
}

// 删除对应 key 以及回调
function close() {
  if (channels.has(key)) channels.delete(key);
}
```

这样就实现了一个简易的 EventBus 了

查看[源码](https://github.com/Fatpandac/DemoPlayground/tree/main/packages/eventBus)，体验 <a href="/demo/eventBus.html">Demo</a>
![演示视频 GIF](/images/eventBus.gif)
