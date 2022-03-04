const moment = require("moment");
module.exports = {
    "title": "Fatpandac",
    "description": "Fatpandac's blog",
    "dest": "public",
    "theme": "reco",
    "locales": {
        "/": {
          lang: "zh-CN",
        },
    },
    "head": [
    ['link', { rel: 'icon', href: '/favicon.png' }]
    ],
    "themeConfig": {
        "noFoundPageByTencent": false,
        "nav": [
            {
                "text": "主页",
                "link": "/",
                "icon": "reco-home"
            },
            {
                "text": "TimeLine",
                "link": "/timeline/",
                "icon": "reco-date"
            },
            {
                "text": "Contact",
                "icon": "reco-message",
                "items": [
                    {
                    "text": "GitHub",
                    "link": "https://github.com/Fatpandac",
                    "icon": "reco-github"
                    },
                    {
                    "text": "Twitter",
                    "link": "https://twitter.com/Fatpandac",
                    "icon": "reco-twitter"
                    },
                    {
                        "text": "Email",
                        "link": "mailto:i@fatpandac.com",
                        "icon": "reco-mail"
                    }
                ]
            }
        ],
        "type": "blog",
        "subSidebar": "auto",
        "blogConfig": {
            "category": {
                "location": 2,
                "text": "类别"
            },
            "tag": {
                "location": 3,
                "text": "标签"
            },
        },
        "friendLink": [
            {
                title: 'EpLiar',
                desc: 'I don\'t know how to code',
                logo: "https://avatars.githubusercontent.com/u/23559565?v=4",
                link: 'https://epliar.com'
            },
        ],
        "logo": "/logo.png",
        "search": true,
        "searchMaxSuggestions": 10,
        "lastUpdated": "Last Updated",
        "author": "Fatpandac",
        "authorAvatar": "/avatar.png",
        "startYear": "2022",
        "favicon": "/favicon.png",
    },
    "markdown": {
        "lineNumbers": true
    },
    plugins: [
        // 文章最后更新时间转换
        [
            "@vuepress/last-updated",
            {
                transformer: (timestamp, lang) => {
                  moment.locale(lang);
                  return moment(timestamp).format("YYYY-MM-DD HH:mm:ss");
                },
            },
        ],
        // 图片缩放
        [
            '@vuepress/medium-zoom',
            {
                selector: 'img.zoom-custom-imgs',
                options: {
                    margin: 16
                }
            }
        ],
        // 音乐播放器
        [
            "meting",
            {
                meting: {
                    server: "netease",
                    type: "playlist",
                    mid: "7273467940",
                },
                aplayer: {
                    fixed: true,
                    mini: true,
                    autoplay: true,
                    listFolded: true,
                    theme: "#f9bcdd",
                    order: "random",
                    volume: 0.3,
                    lrcType: 0,
                },
                mobile: {
                    cover: false,
                },
            },
        ],
        // 代码复制
        [
            "vuepress-plugin-nuggets-style-copy",
            {
                copyText: "复制代码",
                tip: {
                  content: "复制成功!",
                },
            },
        ],
        // 拼音链接
        [
            'permalink-pinyin', 
            {
                lowercase: true, // Converted into lowercase, default: true
                separator: '-' // Separator of the slug, default: '-'
            }
        ],
        // 评论
        [
            '@vuepress-reco/comments',
            {
                solution: 'valine',
                options: {
                    appId: 'OxeWoeP8Lx2qvTiCxJWATBYI-gzGzoHsz',
                    appKey: 'dP2Jzs4j04wb9MibrIpcwm5d',
                    avatar: 'monsterid',
                    placeholder: '请输入内容...',
                    enableQQ: true,
                    visitor: true,
                }
            }
        ],
        // sitemap
        [
            'sitemap',
            {
                hostname: 'https://fatpandac.com',
            }
        ],
        // progress
        [
            'reading-progress',
            {
                readingDir: ['/docs/']
            }
        ],
        // code copy
        [
            'vuepress-plugin-code-copy',
            true
        ]
    ],
}
