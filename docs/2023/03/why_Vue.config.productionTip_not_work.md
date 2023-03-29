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

要想弄清楚为什么在 Chrome 上没有生效我们可以通过开发者工具去查看他们的调用情况。

**先看 Safari 的情况**：

![Safari 情况](/images/SCR-20230324-pyjp.png)

在 Safari 上可以看到，`Vue.config.productionTip` 这段代码是在 `setTimeout` 回调执行之前执行的，这也就导致了在 Safari 上配置了 `Vue.config.productionTip = false` 生效了，因为在运行这一段代码之前 Vue 还没有运行输出生产提示的代码。

**然后看看 Chrome 的情况**：

![Chrome 情况](/images/SCR-20230324-spms.png)

可以看见在 Chrome 上面 `Vue.config.productionTip` 这段代码是在 `setTimeout` 回调执行之后才执行的，这也就导致了在 Chrome 上配置了 `Vue.config.productionTip = false` 也没有生效，因为在运行这一段代码之前 Vue 已经运行了输出生产提示代码，并根据对应的属性判断做出了对应的输出。

所以出现这个问题的原因就是因为 Chrome 和 Safari 对于 `setTimeout` 的实现不同导致的。

如果希望在 Chrome 上也能生效的话可以尝试将 `Vue.config.productionTip = false` 放到 `head` 标签里面去执行，这样就可以在 `setTimeout` 回调执行之前就已经执行了这一段代码，但是这也不是每一次都会成功的，因为 Chrome 中 `setTimeout` 的执行时机是不确定的，所以这个问题还是需要 Vue 官方去解决的。

```html{9-11}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hello vue!</title>
    <script type="application/javascript" src="./js/vue.js"></script>
    <script>
      Vue.config.productionTip = false;
    </script>
  </head>
  <body>
  </body>
</html>
```

<CommentAndBack url="https://news.ycombinator.com/item?id=35351631" />
