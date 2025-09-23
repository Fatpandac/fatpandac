---
title: 为什么 Vue.config.productionTip 没有生效
date: 2023-03-23
tags:
  - Vue
  - JavaScript
  - Chrome
  - Safari
categories:
  - 技文
---

最近遇到一个关于 Vue 的问题，代码如下：

<!-- more -->

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hello vue!</title>
    <script type="application/javascript" src="./js/vue.js"></script>
  </head>
  <body>
    <script>
      Vue.config.productionTip = false;
    </script>
  </body>
</html>
```

通过查看 Vue2 的[对应文档](https://v2.cn.vuejs.org/v2/api/index.html#productionTip)可以知道其中的 `Vue.config.productionTip` 参数配置可以阻止 vue 在启动时生成生产提示。

## 问题分析

但实际在 Chrome 运行上面代码的时候得到的结果并不是我们想要的，Vue 还是会输出生产提示，所以这个是什么问题呢？

如果我们把这个代码放到 Safari 上面运行的话又是另一个结果了，在 Safari 上运行这一段代码可以看到 `Vue.config.productionTip = flase` 这段配置代码神奇的工作了，这又是为什么呢？

在翻看对应的源码之后似乎有了答案，在[源码](https://github.com/vuejs/vue/blob/a9ca2d85193e435e668ba25ace481bfb176b0c6e/src/platforms/web/runtime/index.ts#L46-L73)中关于输出生产提示的代码如下：

```ts{2,27}
if (inBrowser) {
  setTimeout(() => {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue)
      } else if (__DEV__ && process.env.NODE_ENV !== 'test') {
        // @ts-expect-error
        console[console.info ? 'info' : 'log'](
          'Download the Vue Devtools extension for a better development experience:\n' +
            'https://github.com/vuejs/vue-devtools'
        )
      }
    }
    if (
      __DEV__ &&
      process.env.NODE_ENV !== 'test' &&
      config.productionTip !== false &&
      typeof console !== 'undefined'
    ) {
      // @ts-expect-error
      console[console.info ? 'info' : 'log'](
        `You are running Vue in development mode.\n` +
          `Make sure to turn on production mode when deploying for production.\n` +
          `See more tips at https://vuejs.org/guide/deployment.html`
      )
    }
  }, 0)
}
```

可以看出 Vue 把生产提示的输出放到了一个设置延时为零的 `setTimeout` 函数里面回调了，这么做有什么用呢？

> `setTimeout(f,0)` 的作用就是吧 `f` 放到运行队列的最后执行，使得 `f` 变为异步执行。

所以在上面的生产提示代码也就被放到了最后去执行，但这样仅仅是解释了为什么在 Safari 上我们可以看到 `Vue.config.productionTip` 生效，但是在 Chrome 为什么不生效呢？

## 查找原因

要想弄清楚为什么在 Chrome 上没有生效我们可以通过开发者工具去查看他们的调用情况。

::: tip
为了得到一个干净的环境，屏蔽掉插件以及其他的干扰，我们可以使用无痕模式打开 preformace(Chrome)/时间线(Safari) 面板，这样就可以得到一个干净的环境了。
:::

**先看 Safari 的情况**：

![Safari 情况](/images/SCR-20230324-pyjp.png)

在 Safari 上可以看到，`Vue.config.productionTip` 这段代码是在 `setTimeout` 回调执行之前执行的，这也就导致了在 Safari 上配置了 `Vue.config.productionTip = false` 生效了，因为在运行这一段代码之前 Vue 还没有运行输出生产提示的代码。

**然后看看 Chrome 的情况**：

在 Chrome 上会出现两种情况，第一种情况是在页面第一次加载的时候，还有一种情况是在刷新页面（不是强制刷新）的时候，在这两种情况只有第一种不会生效。

1. 页面第一次加载的时候

![Chrome 页面第一次加载的情况](/images/SCR-20230402-tyjp.png)

在第一次加载的时候 Chrome 需要请求 Vue.js 的代码，在 Vue.js 请求完成之后 Chrome 就直接运行了 Vue.js 的代码，之后在这个 task 结束之后在 Vue.js 中设置的 `setTimeout` 就被执行了，之后才是解析 HTML 代码运行里面的 `Vue.config.productionTip = false` 这段代码，所以这样就会导致在 Chrome 上面配置了 `Vue.config.productionTip = false` 没有生效。

2. 刷新页面的时候

![Chrome 刷新页面的情况](/images/SCR-20230402-ucnb.png)

在在刷新页面的时候 Chrome 因为之前已经获取到了 Vue.js 的代码了，所以在这一次的时候就不会再去获取 Vue.js 的代码了，而是直接从缓存中读取，所以这一次 Vue.js 的代码运行是和解析 HTML 代码是同步的，在解析 HTML 代码的时候就也执行了 `Vue.config.productionTip = false` 这段代码，所以这一次就会生效，最后在这个 task 结算之后才会执行 `setTimeout` 回调，所以在刷新页面的情况下 Chrome 上配置了 `Vue.config.productionTip = false` 是生效的。

所以出现这个问题的原因就是因为 Chrome 和 Safari 对于 HTML 解析和 JS 代码执行的时机不一样，所以导致了这个问题。

## 解决方案

如果希望在 Chrome 中正常的运行 `Vue.config.productionTip = false` 这段代码，可以通过在 `<script>` 标签中添加 `onload` 属性来解决这个问题。

`onload` 属性会在脚本加载完成之后执行，所以我们可以在 `onload` 属性中设置 `Vue.config.productionTip = false` 这段代码，这样就可以保证在 Vue.js 的代码中设置的 `setTimeout` 被执行之前就已经设置了 `Vue.config.productionTip = false` ，所以就可以保证在 Chrome 中也可以正常的运行了。

使用 `onload` 属性的代码后的 Chrome preformace 面板的情况如下图所示：

![Chrome 使用 onload 属性的情况](/images/SCR-20230403-boea.png)

```html{8}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hello vue!</title>
    <script type="application/javascript" src="./js/vue.js" onload="Vue.config.productionTip = false"></script>
  </head>
  <body>
  </body>
</html>
```

## 附件 📎

1. <a href="/files/chrome-vue.json" download>Chrome 第一次加载和刷新页面的 preformace 导出文件</a>
2. <a href="/files/safari-vue.json" download>Safari 时间线的导出文件</a>
3. <a href="/files/chrome-vue-with-onload.json" download>Chrome 使用 onload 属性的 preformace 导出文件</a>

<GiscusComments />
