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
      {},
      `
            var _hmt = _hmt || [];
            (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?d47c012aa2838250165b44d65f898c3b";
            var s = document.getElementsByTagName("script")[0]; 
            s.parentNode.insertBefore(hm, s);
            })();
        `,
    ],
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
    vssueConfig: {
      platform: "github",
      owner: "Fatpandac",
      repo: "Fatpandac",
      clientId: "8e36e2379dcd999afc37",
      clientSecret: process.env.clientSecret,
    },
    logo: "/logo.png",
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
      "vuepress-plugin-medium-zoom",
      {
        selector: ".theme-reco-content img",
        delay: 1000,
        options: {
          margin: 24,
          background: "#ffffffe6",
          scrollOffset: 0,
        },
      },
    ],
  ],
};
