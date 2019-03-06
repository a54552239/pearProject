# pearProject

基于Vue.js实现的项目管理系统

相关资料：https://www.yuque.com/vilson/ef1m6t

需要配合[后端接口](https://github.com/a54552239/pearProjectApi)使用，链接：https://github.com/a54552239/pearProjectApi

有不明白的地方的可以加群：275264059，或者联系我，QQ：545522390
### 演示地址
> [https://beta.vilson.xyz](https://beta.vilson.xyz)

### 登陆 ###
账号：123456 密码：123456
### 界面截图
![1](https://static.vilson.xyz/overview/1.png)

![1](https://static.vilson.xyz/overview/2.png)

![1](https://static.vilson.xyz/overview/3.png)

![1](https://static.vilson.xyz/overview/4.png)

![1](https://static.vilson.xyz/overview/5.png)

![1](https://static.vilson.xyz/overview/6.png)

![1](https://static.vilson.xyz/overview/7.png)

![1](https://static.vilson.xyz/overview/8.png)

![1](https://static.vilson.xyz/overview/9.png)

![1](https://static.vilson.xyz/overview/10.png)

![1](https://static.vilson.xyz/overview/11.png)

![1](https://static.vilson.xyz/overview/12.png)

![1](https://static.vilson.xyz/overview/13.png)
### 安装步骤 ###
```
PHP >= 7.0.0 (推荐PHP7.2版本)
Mysql >= 5.5.0 (需支持innodb引擎)
PDO PHP Extension
Node.js
Composer
```
- 可以直接下载[phpstudy](http://phpstudy.php.cn/phpstudy/PhpStudy20180211.zip)部署环境
1. 下载后端接口文件，解压到站点根目录（或使用Git: git clone https://github.com/a54552239/pearProjectApi）
2. 安装后端依赖
    1. 进入接口文件目录
    2. 方式一：Composer
    3. 方式二：下载[vendor.zip](https://vilson-static.oss-cn-shenzhen.aliyuncs.com/common/vendor.zip)，直接解压到项目根目录，覆盖原有的vender文件夹
3. 下载前端项目
4. 安装node.js
    1. 地址：http://nodejs.cn/download/ 根据情况选择版本
    2. 安装npm淘宝镜像
        1. 运行cmd
        2. 输入：npm install -g cnpm --registry=https://registry.npm.taobao.org
5. 前端部署
    1. 进入前端项目目录，运行cmd命令行
    2. 安装依赖：cnpm install
        1.如果接口端口不是默认端口，需修改./src/config.js，将PROD_URL的值改为接口的访问地址
    3. 启动项目：npm run serve
    4. 根据提示填写数据库信息进行安装
        ![1](https://static.vilson.xyz/help/pearproject/3.png)
6. 打包项目（有必要的话）
    1. 修改./src/config/config.js，修改PRO_URL地址
    2. 修改./vue.config.js，将publicPath 值改为‘/’。如果有CDN的话改为CDN地址
    3. 运行cmd，输入 npm run build
    4. 运行dist目录下的index.html，或者将dist目录下的文件部署到服务器上
7. 跨域支持
    1. 默认开启跨域，如需关闭，须进行以下操作
        1. 修改./src/config.js，将crossDomain 值改为‘false’
        2. 修改./vue.config.js，将DEV_URL的值改为接口的访问地址
        3. 重启启动项目
8. 消息推送
    1. 后端
        1. 进入application/common/Plugins/GateWayWorker
        2. 修改config.php，修改 SERVER_ADDRESS 的值为内网IP地址。端口号根据情况需改，注意服务器要放行对应的端口
        3. 如果是HTTPS协议，需要开启SSL支持
        4. Windows环境下，直接运行start_for_win.bat文件
        5. Linux环境下，运行 bash start.sh 启动服务，运行 bash stop.sh 终止服务
    2. 前端
        1. 进入 src/config/config.js
        2.WS_URI 地址修改为相应的ip地址。如果使用https，不能写ip需要写域名 
        
### 鼓励一下 ###
<img src="https://static.vilson.xyz/pay/wechat.png" alt="Sample"  width="150" height="150">

<img src="https://static.vilson.xyz/pay/alipay2.png" alt="Sample"  width="150" height="150">


