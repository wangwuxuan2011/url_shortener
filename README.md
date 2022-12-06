# 一个基于cloudflare pages/workers的URL短链接生成器

## 介绍

实现短链接的生成，采用了workers和pages分离的方式进行部署

## 部署方法

1. Fork本项目
2. 在Cloudflare Pages创建自己的项目
3. 使用Fork的项目进行部署（根目录输入pages）
4. 在Cloudflare Workers创建自己的项目
5. 复制`workers/index.js`的内容到复制自己的项目中
6. 将其中的`config`根据需要填写，`index_url`为你的Cloudflare Pages的地址，`workers_url`为你的Cloudflare Workers的地址
7. 创建一个KV空间，并绑定到workers中，变量名称设置为`KV`
8. 部署完成

## 演示站点

[https://0135.cf/](https://0135.cf/)
