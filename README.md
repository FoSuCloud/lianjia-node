
## 创建项目
1. npm init 创建项目
2. 安装express框架 用来作为node应用后台
`npm install express --save`
3. `npm install -g express-generator` 安装插件来快速生成express骨架
4. 使用pug（原名为jade）为模板引擎 `express --view=pug myapp`
5. 安装项目依赖： npm install 
6. 启动项目 `set DEBUG=myapp:* & npm start`; (只有初次启动弄才需要使用set)
* 然后打开http://localhost:3000/
* 参考[https://www.expressjs.com.cn/starter/installing.html]

## node调试
*  使用vscode进行调试，在本地ide进行单点调试

## 热更新
* 使用nodemon进行热更新
* 安装`npm install -g nodemon`
* 创建nodemon.json文件
```json
{
    "restartable": "rs",
    "ignore": [".git", ".svn", "node_modules/**/node_modules"],
    "verbose": true,
    "execMap": {
        "js": "node --harmony"
    },
    "watch": [],
    "env": {
        "NODE_ENV": "development"
    },
    "ext": "ejs js json"
}
```
* 在package.json文件中添加nodemon命令`"nodemon": "nodemon ./bin/www"`
* 最后和vscode调试结合起来，使用`create JavaScript debug terminal`

## 数据库
* 使用mongodb数据库，安装`npm i mongoose  -S`
* 参考文档： [http://www.mongoosejs.net/docs/index.html]
