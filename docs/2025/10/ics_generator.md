---
title: 课表转化成 ics 文件导入 iCalendar
date: 2025-10-12
tags:
  - ics
  - iCalendar
categories:
  - 杂文
---

在学校的时候一直有一个需求就是要把课表转到日历里面方便查看，那时候都是通过脚本
实现的，现在有朋友也想需要但是要他来跑脚本改里面的代码可能有点麻烦，索性就写一个
网页来实现吧！

<!-- more -->

技术栈就选择了 react + shadcn + tailwindcss 然后就一把梭哈实现下面这个网站

[ics.fatpandac.com](https://ics.fatpandac.com)

<iframe src="https://ics.fatpandac.com" style="border: none; width: 100%; height: 500px; pointer-events: none;" />

在这个网站上面填写相关的信息然后点击 `Preview` 就可以预览填写信息生成的日历内容，
方便提前发现填写信息是否正确，确认之后点击 `Export` 导出即可得到一个 ics 文件
里面就是根据填写信息生成的日历了，之后用日历打开就可以！

其中生成 ics 文件的代码如下:

```ts
const ics = generateIcs(data.events, preinfo as PreinfoData);
const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
const url = URL.createObjectURL(blob);
const link = document.createElement("a");
link.href = url;
link.download = "timetable.ics";
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
URL.revokeObjectURL(url);
```

<GiscusComments />
