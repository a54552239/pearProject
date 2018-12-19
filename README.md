# vue-projectManage
基于Vue.js实现的项目管理系统

需要配合[后端接口](https://github.com/a54552239/projectManageApi)使用，链接：https://github.com/a54552239/projectManageApi

有不明白的地方的可以加群：275264059，或者联系我，QQ：545522390
### 演示地址
> [https://project.vilson.xyz](https://project.vilson.xyz)

### 登陆 ###
账号：admin 密码：123456
### 界面截图
![1](https://static.vilson.xyz/1.png)
![1](https://static.vilson.xyz/2.png)
![1](https://static.vilson.xyz/3.png)
![1](https://static.vilson.xyz/4.png)
![1](https://static.vilson.xyz/5.png)
![1](https://static.vilson.xyz/6.png)
![1](https://static.vilson.xyz/7.png)
![1](https://static.vilson.xyz/8.png)

### 完整部署步骤 ###
```
需要环境：php 5.6或者以上版本
```
- 可以直接下载[phpstudy](http://phpstudy.php.cn/phpstudy/PhpStudy20180211.zip)部署环境
- 接口文档：站点地址/public/docs.php
1. 下载后端接口，解压到网站目录
 ![1](https://static.vilson.xyz/help/图片1.png)
 2. 安装依赖
    1. 进入项目目录
    2. 方式一：Composer
    ![1](https://static.vilson.xyz/help/图片2.png)
    ![1](https://static.vilson.xyz/help/图片3.png)
    ![1](https://static.vilson.xyz/help/图片4.png)
    3. 方式二：下载[vendor.zip](https://static.vilson.xyz/help/vendor.zip)，直接解压到项目根目录，覆盖原有的vender文件夹
3. 将data目录下面的最新版本的sql文件（project_sql.sql）导入数据库
4. 修改config目录下的dbs.php文件，配置数据库信息
5. 访问项目，如：http://localhost/ApiForProjectManage/public 出现如下提示则表示部署成功
![1](https://static.vilson.xyz/help/图片5.png)
6. 下载前端项目
![1](https://static.vilson.xyz/help/图片6.png)
7. 安装node.js
    1. 地址：http://nodejs.cn/download/ 根据情况选择版本
    2. 安装npm淘宝镜像
        1. 运行cmd
        2. 输入：npm install -g cnpm --registry=https://registry.npm.taobao.org
8. 安装项目
    1. 进入项目目录，运行cmd
    ![1](https://static.vilson.xyz/help/图片7.png)
    2. 安装依赖：cnpm install
    ![1](https://static.vilson.xyz/help/图片8.png)
    3. 启动项目：npm run dev
    ![1](https://static.vilson.xyz/help/图片9.png)
9. 打包项目（有必要的话）
    1. 修改/src/assets/js/config.js，修改PRO_URL地址
    ![1](https://static.vilson.xyz/help/图片11.png)
    2. 修改config/index.js，将assetsPublicPath 值改为‘/’。如果有CDN的话改为CDN地址
    ![1](https://static.vilson.xyz/help/图片12.png)
    3. 运行cmd，输入 npm run build
    4. 运行dist目录下的index.html，或者将dist目录下的文件部署到服务器上
10. 部署消息推送
    1. 推送项目内成员的操作动态
    ![1](https://static.vilson.xyz/help/图片13.png)
    2. 进入后端接口目录
    3. 修改  
    src\App\Plugins\GateWayWorker\start_register.php   
    src\App\Plugins\GateWayWorker\start_gateway.php   
    src\App\Plugins\GateWayWorker\start_businessworker.php  
    src\App\Plugins\MessageService.php  
    4. 将以上4个文件中的ip地址修改为内网ip地址
    5. Windows环境下，直接运行gate_start_for_win.bat文件
    ![1](https://static.vilson.xyz/help/图片14.png)
    6. Linux环境下，运行 bash start.sh 启动服务，运行 bash stop.sh 终止服务
    7. 进入前端目录
    8. 修改 src/components/socket.vue，将initWebSocket 函数内的ws地址修改为相应的ip地址。如果使用wss，不能写ip需要写域名  
    ![1](https://static.vilson.xyz/help/图片15.png)
    9. 注意服务器要放行对应的端口（默认2345、2346）  
    10. 部署成功
    ![1](https://static.vilson.xyz/help/图片16.png)
11. 使用七牛云存储
    1. 进入后端目录 ./config/constant.php
    2. 将USE_QINIU的值修改为true
    3. 将APP_URL的值修改为网站地址
    4. 进入后端目录  ./config/app.php
    5. 将Qiniu需改改为对应的值
12. 跨域支持
    1. 进入后端目录 ./config/app.php
    2. 修改cors下的whitelist（域名白名单），添加支持跨域的站点
     

        

