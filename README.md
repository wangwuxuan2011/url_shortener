# 一个基于cloudflare pages/workers的URL短链接生成器

## 介绍

实现短链接的生成，采用了workers和pages分离的方式进行部署

因为是通过截取字符串的方式获取当前域名，所以只支持绑定普通的二级域名的主域名的方式进行部署，例如`xxxx.xx`，类似`com.cn`
结尾的域名不支持，并且不支持子域名

项目支持多个域名直接在cloudflare控制台绑定，无需修改代码

建议使用freenom的免费域名进行部署，很多四位短域名都可以正常注册。但因为freenom容易吞域名，所以项目建议绑定多个域名作为备选域名

## 部署方法

1. Fork本项目
2. 在Cloudflare Pages创建自己的项目
3. 使用Fork的项目进行部署（根目录输入pages）
4. 设置自定义的域名，将pages部署到`url`子域（`url.xxxx.xx`）
5. 在Cloudflare Workers创建自己的项目
6. 复制`workers/index.js`的内容到复制自己的项目中
7. 将其中的`config`根据需要填写
8. 创建一个KV空间，并绑定到workers中，变量名称设置为`KV`
9. 设置自定义的域名，将pages部署到主域（`xxxx.xx`）
10. 部署完成

## 演示站点

[https://0135.cf/](https://0135.cf/)

[https://0366.tk/](https://0366.tk/)
