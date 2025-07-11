---
title: 虚拟列表
date: 2025-07-11
tags:
  - Vue
  - CSS
categories:
  - 小样
---

数据的展示越来越多，数据量越来越大，一个列表里面可能存在成成千上万的 item，
如果每一个 item 都完全渲染那么对于性能的消耗还是十分大的，那么不用渲染每一个 item
而是根据屏幕滚动判断当前哪些 item 需要显示再展示，这将会大大的降低 DOM 操作的性能
损耗，从而实现大数据的展示，这种实现就是虚拟列表。

<!-- more -->

在实现虚拟列表之前先大致理解一下虚拟列表的大致逻辑，虚拟列表就相当于在一个只有有限
个数 item 的 list 里面通过模拟滚动效果替换每一个 item DOM 里面的内容来实现 list 列
表的滚动。从而通过使用少数的 DOM 避免 DOM 的重复操作来提高列表的滚动效率，提升滚动
的流畅度。

所以要实现虚拟列表需要得到列表的高度、每一个 item 的高度，以及当前滚动到的 item。
相关的计算如下：
计算当前页面可以展示多少个 item 项，那么就可以用 `列表高度/(item 的高度 + padding 的高度)`
这样就可以计算出来当前这个 list 可以展示多少个 item，得到这个 item 的个数。

```js
function calcItemCount() {
  if (!listRef.value || !itemRef.value || !itemHeight.value) return 0;

  const visibleHeight = listRef.value.clientHeight;
  return Math.ceil(visibleHeight / (itemHeight.value + 4)) + 1;
}
```

为了可以让这个 list 可以滚动那么我们还需要一个 space 这样的元素来撑开里面的内容使得其可以滚动，
这时候就需要去计算这个 space 的大小，这个 space 的大小实际上和这个容器滑动了多少个 item
有关系，它的计算 `itemHeight * showItemList[0].index`(item 的高度乘以当前列表第一个 item 的 index)。

```js
const paddingHeight = computed(() => {
  if (showItems.value[0].index === 0) return { height: "0px" };

  return {
    height: `${showItems.value[0].index * itemHeight.value - 10}px`,
  };
});
```

之后还要计算每一个 item 的实际位置，这里面涉及到两种方式的实现，有 transform 和 top 这两种实现方式
每一种的实现方式是不一样的，使用 transform 的话每一个 item 的 transformY 就等于 `item.index * 4`(也就
相当于计算了每一 item 偏移 4px 的 padding)，如果使用 top 则每一个 item 的 top 值就等于
`item.index * (item.height + 4)` 相当与计算了每一 item 占用的高度包括 padding。使用 transform 的表现
会比使用 top 的表现更好一些，因为 transform 是 GPU 加速的，而 top 会导致浏览器重新计算布局。

```js
// transform 计算
function transformPos(item) {
  return {
    transform: `translateY(${item.index * 4}px)`,
  };
}

// top 计算
function topPos(item) {
  return {
    top: `${item.index * (itemHeight.value + 4) + 16}px`,
    width: "calc(100% - 64px)",
  };
}
```

体查看[源码](https://github.com/Fatpandac/DemoPlayground/tree/main/packages/virtualList)，验 <a href="/demo/virtualList.html">Demo</a>
![演示视频 GIF](/images/virtual_list.gif)
