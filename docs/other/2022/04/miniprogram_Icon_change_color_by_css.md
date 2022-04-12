---
title: 微信小程序开发使用 CSS 更换 SVG 颜色
date: 2022-04-13
tags:
 - CSS
 - Icon
 - 小程序
categories:
 - 技文
---
最近在折腾微信小程序，写✍🏻️一个关于个人图书管理的小程序应用。

在二十一世纪的今天几乎所有的应用都是有 Icon 的，Icon 的存在降低了用户的学习成本以及操作的速度，在很多时候我们人类对于文字的阅读能力相较于图像来说时*略差*的，所以应用程序的操作按钮基本都会附带上一个具有近似表达的 Icon，固然在小程序的开发中也得用上 Icon。

从2019年10月开始苹果正实的在 iOS13 中加入了深色模式「Dark Mode」，这也标志这手机系统拥有深色模式将是一个大趋势。

深色模式的加入使得我们在开发一个应用程序的时候需要考虑到应用的深色模式下的适配，这样我们才能开发出比较好的产品，所以在我的这个小程序中我尝试了适配深色模式，但是遇到了一个问题，那就是 Icon 的颜色变化，如果我们不需要对深色模式进行适配的话，我们仅需要单一颜色的 Icon 就可以解决了，但是适配深色模式我们就需要对 Icon 进行相应的颜色调整。

这时候我能想到的解决方案就是使用两种颜色的 Icon 保存到程序中，根据当前颜色模式的不同而展示不同颜色的 Icon 但是这种解决方案存在一个问题就是当图片文件变多的时候会很占用空间而一个小程序的最大空间仅能为 2M，如果大于这个空间就需要考虑进行分包加载了！

于是我就开始摸索一个能直接使用修改 Icon 颜色的方案。

<!-- more -->

方案一，打算使用自定义组件来解决这个问题的但是最终还是因为一些[官方 bug](https://developers.weixin.qq.com/community/develop/doc/00048ee375c788967bf73837c56800?highLine=mask)而无法实现。使用自定义组件通过传递文件路径读取文件修改文件内的颜色参数 `fill` 从而达到修改 SVG 颜色的目的。

因为方案一以失败告终，最后通过不断的寻找找到了另一个方案，[方案二](https://blog.csdn.net/Originally_M/article/details/106473475) 来自[最初都是小白](https://blog.csdn.net/Originally_M?type=blog)。

步骤：

1. 进入 [https://icomoon.io](https://icomoon.io) 点击下图所指处

   ![image-20220413012356493](https://s2.loli.net/2022/04/13/EBKNw3ilDahuTX5.png)

2. 按步骤如下

   - 点击 1 箭头所指处导入本地需要生成的 Icon 文件
   - 点击 2 箭头所指处选择需要生成的 Icon
   - 点击 3 箭头所指处生成对应的文件

   ![image-20220413012712640](https://s2.loli.net/2022/04/13/ZSTq2JGlHDnO9Rk.png)

3. 对 Icon 命名后点击右下角的 Download 

   ![image-20220413012905720](https://s2.loli.net/2022/04/13/JZkbDuhxKTtAUsH.png)

4. 之后将下载的压缩包进行解压得到如下文件内容

   ![image-20220413013107181](https://s2.loli.net/2022/04/13/9nT8bgUSKj5frkN.png)

5. 转码 base64，打开 [https://transfonter.org](https://transfonter.org) 点击 `Add fonts` 将上一步骤解压的文件夹中 `fonts` 文件夹下的 `icomon.ttf` 文件夹导入

   ![image-20220413013508624](https://s2.loli.net/2022/04/13/hLVx4XrKvSk7mRc.png)

6. 进行如下配置后即可点击 `Convert`，之后再点击 `Download` 下载，即可完成转码

   ![image-20220413013637050](https://s2.loli.net/2022/04/13/yUMBw8bWv9IHTKq.png)

7. 将上一步骤下载的文件夹解压，之后把解压后的文件夹中的 stylesheet.css 粘贴到 app.wxss  中，再把第四步解压的文件中的 style.css 里从 `[class^="icon-"], [class*=" icon-"] {` 开始的内容也粘贴到 app.wxss 中

8. 之后在微信小程序中如下引用对应的 `class` ，使用 `color` 属性即可进行颜色的修改即可,**注意**这时候 Icon 是以文字的形式引用进来的，所以要调整图标的大小时候应该使用的是 `font-size` 属性进行调整，示例如下：

   ```html
   // wxml结构文件:
     <view class="icon-add"></view>
   ```

   ```css
   // wxss样式文件：
   .icon-copy {
     font-size: 30px;
     color: #000000;
   }
   ```

**补充：**

有时候我们需要在自定义组件中也使用到该图标，我们仅需要将 `[class^="icon-"], [class*=" icon-"]` 中的内容粘贴到需要的图标 `class` 内，再将其粘贴到需要使用的自定义组件的 wxss 中即可，如下

```css
.icon-add:before {
  font-family: 'icomoon' !important;
  speak: never;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  content: "\e900";
}
```

