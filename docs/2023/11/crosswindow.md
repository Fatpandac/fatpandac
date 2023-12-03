---
title: 跨越浏览器窗口的 Div
date: 2023-11-25
tags:
  - Vue
  - Browser API
categories:
  - 小样
---

事情的起因是从这个[推文](https://twitter.com/_nonfigurativ_/status/1727322594570027343)开始的，这个推文展示了打开两个不同的浏览器窗口，窗口的网页显示着两个粒子球，之后作者把两个粒子球靠在一起，神奇的现象就出现了，两个粒子球中的粒子出现了相互吸引的现象在两个球之间形成了一个连线，这种打破第四面墙的效果实在太神奇了。

<!-- more -->

于是我决定去实现一个，浏览更多的相关推文之后大概知道使用的是什么技术以及原理，下面就动手实现吧 let's do it.

首先实现一个可以拖拽的 Div，这里为了方便我就直接使用了 [Vueuse](https://vueuse.org) 里的 [useDraggable](https://vueuse.org/core/usedraggable/#usedraggable) 这样可以快速的实现一个可以拖拽的 Div 了。

Div 可以拖拽之后要实现的就是可以跨窗口拖拽了，要实现跨窗口拖拽其实就是把一个窗口上的 Div 位置信息更新同步到另一个窗口上，这时候可以使用 localStorage 但使用这个需要去频繁的读写有点小麻烦，这时候就可以使用现代浏览器提供给我们的 API 实现跨窗口通信了，那就是 [BroadcastChannel](https://developer.mozilla.org/zh-CN/docs/Web/API/BroadcastChannel) 通过它就可以实现跨窗口通信了，例子如下：

```js
// 创建一个 BroadcastChannel 的实例并提供一个 频道名称 用于后续订阅
const bc = new BroadcastChannel("crosswindow");

// 使用 postMessage 即可进行广播
bc.postMessage("Hello World");

// 绑定 onmessage 事件即可获取广播事件信息
bc.onmessage = (ev) => {
  console.log(ev.data);
};
```

现在已经解决了跨窗口通信的问题，现在就可以直接上代码了:

```vue
<script setup>
import { onDeactivated, onMounted, ref, watch } from "vue";
import { useDraggable } from "@vueuse/core";

const bc = new BroadcastChannel("crosswindow");

const oldX = ref(window.screenX);
const oldY = ref(window.screenY);
const el = ref();
const { x, y, style } = useDraggable(el, {
  initialValue: { x: 40, y: 40 },
});

let interval = null;

onMounted(async () => {
  interval = setInterval(function () {
    oldX.value = window.screenX;
    oldY.value = window.screenY;
  }, 500);
});

onDeactivated(() => {
  clearInterval(interval);
});

watch([x, y], (value) => {
  // 还原为相对显示器的位置
  const newValue = [oldX.value + value[0], oldY.value + value[1]];

  bc.postMessage(newValue);
});

bc.onmessage = (ev) => {
  const [passX, passY] = ev.data;

  // 在这里还原为相对当前窗口的位置
  x.value = passX - oldX.value;
  y.value = passY - oldY.value;
};
</script>

<template>
  <div
    class="h-screen w-screen flex justify-center items-center select-none overflow-hidden"
  >
    <span>{{ oldX }}</span>
    <span>{{ oldY }}</span>
    <span>[{{ x }}, {{ y }}]</span>
  </div>
  <div
    class="h-40 w-40 bg-blue-300 fixed cursor-grab"
    ref="el"
    :style="style"
  ></div>
</template>
```

到目前位置我们已经可以实现 Div 的跨页面拖拽了，如果还想要更加真实的效果可以使用 [window.getScreenDetails()](https://developer.mozilla.org/en-US/docs/Web/API/Window/getScreenDetails) 来获取当前显示器的大小，并计算窗口是否挨着或是重叠。

查看[源码](https://github.com/Fatpandac/DemoPlayground/tree/main/packages/crosswindow)，体验 <a href="/demo/crosswindow.html">Demo</a>
![演示视频 GIF](/images/crosswindow.gif)
