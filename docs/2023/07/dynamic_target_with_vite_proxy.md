---
title: Vite 代理实现动态变更 target 及目标地址
date: 2023-07-27
tags:
  - Vite
  - Proxy
categories:
  - 技文
---

最近在写一个 [bilibili](https://bilibili.com) 的第三方客户端 [biilii](https://biilii.fatpandac.com) 使用的构建工具是 [Vite](https://cn.vitejs.dev/guide/)，遇到一个问题获取到的视频的地址因为使用的分布式存储得到的链接的服务器地址并不是唯一的，这时候就得需要给代理配置动态目标，在查找一些资料后没有发现相关的操作于是就自己摸索了一下方法

<!-- more -->

要实现这个想法，首先当然是要去看对应部分的源码看看它到底是如何工作的，这样才能知道该如何处理。
于是我就打开了 Vite 的 GitHub 仓库找到[对应的代码](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/server/middlewares/proxy.ts)，这一个文件就是代理服务器相关的代码了，在这里我们可以看出配置通过（L8）的 `Object.keys(options)` 遍历后生成对应的 proxy 代理服务器 和 相关的配置 保存到了 proxies 中，期间还运行了配置当中（L18）的 configure 方法（这个是后续的关键），函数的最后（L33）返回了 `viteProxyMiddleware` 其中会吧 proxies 当中匹配的对应代理服务器以及配置取出，最后（L46）使用 `proxy.web(req, res, options)` 运行代理

```ts{8,18,33,46}
export function proxyMiddleware(
  httpServer: http.Server | null,
  options: NonNullable<CommonServerOptions['proxy']>,
  config: ResolvedConfig,
): Connect.NextHandleFunction {
  const proxies: Record<string, [HttpProxy.Server, ProxyOptions]> = {}

  Object.keys(options).forEach((context) => {
    let opts = options[context]
    if (!opts) {
      return
    }

    if (typeof opts === 'string') { ... }
    const proxy = httpProxy.createProxyServer(opts) as HttpProxy.Server

    if (opts.configure) {
      opts.configure(proxy, opts)
    }

    proxy.on('error', (err, req, originalRes) => { ... })

    proxy.on('proxyReqWs', (proxyReq, req, socket, options, head) => { ... })

    proxy.on('proxyRes', (proxyRes, req, res) => { ... })

    proxies[context] = [proxy, { ...opts }]
  })

  if (httpServer) { ... }

  // Keep the named function. The name is visible in debug logs via `DEBUG=connect:dispatcher ...`
  return function viteProxyMiddleware(req, res, next) {
    const url = req.url!
    for (const context in proxies) {
      if (doesProxyContextMatchUrl(context, url)) {
        const [proxy, opts] = proxies[context]
        const options: HttpProxy.ServerOptions = {}

        if (opts.bypass) { ... }

        debug?.(`${req.url} -> ${opts.target || opts.forward}`)
        if (opts.rewrite) {
          req.url = opts.rewrite(req.url!)
        }
        proxy.web(req, res, options)
        return
      }
    }
    next()
  }
}
```

通过上面的分析可以得出我们可以在 `configure` 当中去修改 `opts` 当中的 `target` 修改过后的 `opts` 会在最后传入 `proxy.web(req, res, options)` 当中运行，我们只要根据 `configure` 提供的 `proxy` 获取对应的 URL 这样我们就可以实现根据 URL 来动态的修改 `target`，实现代理分布式的资源链接

其中 URL 要保留有服务器地址以备后续匹配出目标地址并更换 `target` 的值，如 `https://cn-sxxa-cm-11-04.bilivideo.com/path/to/video` 则替换为使用 `/bilivideo/cn-sxxa-cm-11-04.bilivideo.com/path/to/video` 请求，具体代码如下：

```ts
export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: 3000,
    proxy: {
      "/bilivideo": {
        target: "https://cn-sxxa-cm-01-04.bilivideo.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bilivideo\/.*?\//, ""),
        configure: (proxy, options) => {
          proxy.on("proxyReq", (proxyReq) => {
            // 在这里通过正则匹配获取目标服务器地址
            const target = proxyReq.path.match(/\/bilivideo\/(.*?)\//)![1];
            if (target) options.target = `https://${target}/`;
          });
        },
      },
    },
  },
});
```

通过上述方法就可以实现 Vite 代理根据 URL 来动态变更 `target` 配置了

<GiscusComments />
