##安装
npm install @angular/cli

##使用

### ng new ng generate 创建项目及组件

参数分类
开发辅助(--dry-run)
修改项目的默认值(--perfix)
--skip-install 跳过安装依赖包
--routing 新增router模块

ng set --global packageManager = cnpm

ng g compoment test 
ng g service test app.module  注册到模块里


### ng serve 同步编译，同步更新

编译到92%有个优化
--port 指定端口

### ng test 测试

### ng build 打包发布

请求数量和文件大小减少
aot 使用angular框架压缩 浏览器编译过程提前编译好
prod 去掉调试功能的注释 hash码保证修改后文件名修改



npm uninstall -g angular-cli
npm cache clean
npm install -g @angular/cli@latest
    Depending on your system, you may need to prefix the above commands with sudo.

    Also, most likely you want to also update your local project version, because inside your project directory it will be selected with higher priority than the global one:

rm -rf node_modules
npm uninstall --save-dev angular-cli
npm install --save-dev @angular/cli@latest
npm install




package.json
运行类库
编译类库

amber cli -> angular cli <- webpack


http://www.debugrun.com/a/wRXOuAa.html