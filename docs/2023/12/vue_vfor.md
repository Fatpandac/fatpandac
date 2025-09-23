---
title: Vue3 v-for 的实现
date: 2023-12-05
tags:
  - Vue
categories:
  - 技文
---

前段时间在写一个动画的时候无意中发现 v-for 居然可以直接使用 `Array(8)` 进行循环，这就有意思了 🤔

<!-- more -->

还是老样子遇到这种问题第一时间当然是去看[源码](https://github.com/vuejs/core/blob/9ea2b868be765ca8b6a766004a3b6dfff03b76d3/packages/runtime-core/src/helpers/renderList.ts#L53C1-L96C2)了，从 Vue3 的源码中可以找到这一部分关于 v-for 的实现代码：

```ts
export function renderList(
  source: any,
  renderItem: (...args: any[]) => VNodeChild,
  cache?: any[],
  index?: number
): VNodeChild[] {
  let ret: VNodeChild[];
  const cached = (cache && cache[index!]) as VNode[] | undefined;

  if (isArray(source) || isString(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, undefined, cached && cached[i]);
    }
  } else if (typeof source === "number") {
    if (__DEV__ && !Number.isInteger(source)) {
      warn(`The v-for range expect an integer value but got ${source}.`);
    }
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, undefined, cached && cached[i]);
    }
  } else if (isObject(source)) {
    if (source[Symbol.iterator as any]) {
      ret = Array.from(source as Iterable<any>, (item, i) =>
        renderItem(item, i, undefined, cached && cached[i])
      );
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached && cached[i]);
      }
    }
  } else {
    ret = [];
  }

  if (cache) {
    cache[index!] = ret;
  }
  return ret;
}
```

从上面的源码一步步的看：

**首先**如果循环的数据是一个数组或是字符串的话，就会通过他们的长度 new 一个新的数组再循环相依长度次数渲染每一个节点放入该数组中，就是这样所以才会有了我一开始遇到的问题 `Array(8)` 也可以 v-for 渲染  
**紧接**着如果不是数组或字符串而是一个数字的话 v-for 一样也是可以渲染的，不过只能传入 _整数_ 或 _小数位为零的数_ 要不然无法正常 `new Array()`，以及在开发模式会给出警告 `The v-for range expect an integer value but got ${source}.`  
**再者**如果你 v-for 的是一个对象的话也是可以的这会先判断你传入的数据有没有实现迭代器如果实现了就会使用 `Array.from` 去遍历渲染节点，没有则会使用 `Object.keys` 获取到 keys 再 new 一个和 keys 相同长度的数组并渲染节点放入。

v-for 的实现就是上面这样了，所以对于 v-for 你可以传入数组、字符串、对象 以及 整数和小数位为零的数

所以如果你需要使用 v-for 来实现多个相同的元素的话，我认为最便捷的方法是 `v-for='_ in 8'`

<GiscusComments />
