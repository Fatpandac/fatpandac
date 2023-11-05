require("dotenv").config({ path: "./.env.local" });
const moment = require("moment");

module.exports = {
  title: "Fatpandac",
  description: "Fatpandac's blog",
  dest: "public",
  theme: "reco",
  locales: {
    "/": {
      lang: "zh-CN",
    },
  },
  head: [
    ["link", { rel: "icon", href: "/favicon.png" }],
    [
      "script",
      {
        async: "",
        src: "https://www.googletagmanager.com/gtag/js?id=G-10D6YDNQ9J",
      },
    ],
    [
      "script",
      {},
      `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'G-10D6YDNQ9J');
            `,
    ],
    [
      "script",
      {},
      `
      function replaceIcon() {document.querySelector('a.home-link').innerHTML = '<div style="width:30px;height:30px;padding:5px;"><svg width="100%" height="100%" viewBox="0 0 371 310" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 244.5C33.6667 180.5 136 29 221 5.99997C233.5 1.29695 63 244.5 191.5 299C216 309.391 278.6 316 321 228C345 170 295 133 263 151C226.758 171.386 250 250 366 207" stroke="black" stroke-width="10" stroke-linecap="round"/></svg></div>'};
      window.onload = replaceIcon
      `,
    ],
  ],
  themeConfig: {
    noFoundPageByTencent: false,
    nav: [
      {
        text: "主页",
        link: "/",
        icon: "reco-home",
      },
      {
        text: "实验室",
        icon: "iconfont icon-lab",
        items: [
          {
            text: "DocSearch",
            link: "https://docsearch.fatpandac.com",
          },
          {
            text: "fuckcqooc",
            link: "https://fuckcqooc.fatpandac.com",
          },
          {
            text: "hackcqooc",
            link: "https://hackcqooc.fatpandac.com",
          },
        ],
      },
      {
        text: "时间线",
        link: "/timeline/",
        icon: "reco-date",
      },
      {
        text: "订阅",
        link: "https://t.me/fatpandac_space",
        icon: "reco-bokeyuan",
      },
      {
        text: "联系",
        icon: "reco-message",
        items: [
          {
            text: "GitHub",
            link: "https://github.com/Fatpandac",
            icon: "reco-github",
          },
          {
            text: "Twitter",
            link: "https://twitter.com/Fatpandac",
            icon: "reco-twitter",
          },
          {
            text: "Telegram",
            link: "https:/t.me/fatpandac",
            icon: "iconfont icon-telegram",
          },
          {
            text: "Email",
            link: "mailto:i@fatpandac.com",
            icon: "reco-mail",
          },
        ],
      },
    ],
    type: "blog",
    subSidebar: "auto",
    blogConfig: {
      category: {
        location: 2,
        text: "类别",
      },
      tag: {
        location: 3,
        text: "标签",
      },
    },
    friendLink: [
      {
        title: "EpLiar",
        desc: "I don't know how to code",
        logo: "https://avatars.githubusercontent.com/u/23559565?v=4",
        link: "https://epliar.com",
      },
    ],
    search: true,
    searchMaxSuggestions: 10,
    lastUpdated: "Last Updated",
    author: "Fatpandac",
    authorAvatar: "/avatar.png",
    startYear: "2022",
    favicon: "/favicon.png",
  },
  plugins: [
    [
      "@vuepress/last-updated",
      {
        transformer: (timestamp, lang) => {
          moment.locale(lang);
          return moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
        },
      },
    ],
    [
      "permalink-pinyin",
      {
        lowercase: true, // Converted into lowercase, default: true
        separator: "-", // Separator of the slug, default: '-'
      },
    ],
    [
      "sitemap",
      {
        hostname: "https://fatpandac.com",
      },
    ],
    [
      "reading-progress",
      {
        readingDir: ["/docs/"],
      },
    ],
    ["vuepress-plugin-code-copy", true],
    [
      "vuepress-plugin-clean-urls",
      {
        normalSuffix: "",
        indexSuffix: "/",
        notFoundPath: "/404.html",
      },
    ],
    [
      "register-components",
      {
        componentsDir: ".vuepress/components",
      },
    ],
  ],
};
