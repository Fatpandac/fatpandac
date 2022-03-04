---
title: 屏蔽 React 仓库上发表不正当言论者
date: 2022-03-04
tags:
 - GitHub
 - React
categories:
 - 杂文
---

今天在 React 的 GitHub 仓库的 issues 上看到了很多人发表了很多不正当言论的 issues，很是无语💬，屎💩都喷到国外去了……

***于是决定写✍🏻️一个脚本来屏蔽掉这些人***

<!-- more -->

感谢 [@sxzz](https://github.com/sxzz) 提供的[数据](https://raw.githubusercontent.com/sxzz/github-block-tool/main/analyze.json)，于是就有了下面的脚本👇🏻

```Python
import requests
import json

github_token = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
headers = { 'Authorization': 'token ' + github_token }

data_url = 'https://raw.githubusercontent.com/sxzz/github-block-tool/main/analyze.json'
get_data = lambda : json.loads(requests.get(data_url).text)

get_user_name = lambda data: list(map(lambda x: x['username'], data))
block_user = lambda user_name: requests.put(f'https://api.github.com/user/blocks/{user_name}',
                                            headers=headers)

def main():
    user_name = get_user_name(get_data())
    for name in user_name:
        status = block_user(name).status_code
        if (status == 204):
            print(f'@{name} is blocked')
        elif (status == 404):
            print(f'@{name} is not exist')
        elif (status == 422):
            print(f'@{name} is already blocked')
        else:
            print(f'@{name} with status code {status}')

if __name__ == '__main__':
    main()
```

**最终屏蔽了以下账户，如有误杀劳烦您[请联系我](mailto:i@fatpandac.com?subject=被误杀)，先说声抱歉🙏🏻**

[文件链接](https://gist.github.com/Fatpandac/61b82660e13b9f58d072938c93b3c947#file-blocker-txt)
