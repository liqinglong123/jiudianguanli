var express=require("express");
var router=require("./router/router.js");
var session=require("express-session");
var mongoosse=require("mongoose");
mongoosse.connect("mongodb://localhost/hotel");

var app=express();
app.set("view engine","ejs");
app.use(express.static("static"));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));



//系统首页
app.get("/",router.showIndex);//展示系统首页
//在线预订
app.get("/yuding",router.showYuding);//展示前端顾客预订页面
app.post('/yuding', router.addYuding);//客户预定
app.get('/leibief', router.leibiefj);//获取房间类别
app.get("/jiagef",router.jiagef);//获取类别相应价格

//订单查询
app.get("/chaxun",router.showDchaxun);//展示前端订单查询页面
app.get('/fanghao', router.fanghao);//得到房间号
app.post('/ruzhu', router.addRuzhu);//提交订单办理入住
app.post ('/fanghaotype/:sid',router.showupdateFangHao);//修改房间状态  已入住

app.post    ('/typedx/:sid'	, router.updateTypedx);//更改
app.get     ('/typedx/:sid'	, router.showUpdatedx);

//管理员登录
app.get("/reg",router.showReg);//管理员登录页面
app.post("/doreg",router.doreg);//注册
app.get("/checkuserexist",router.checkuserexist);//检验
app.get("/manage",router.showManage);//登录
app.post("/checklogin", router.checklogin);//检验登录


//大堂入住
app.get("/datang",router.showdatang);//展示大堂入住页面
//订单入住
app.get("/dingdan",router.showdingdan);//展示订单入住页面
app.get("/yudingchaxun",router.yudingchaxun);//查找前端订单


//退房管理
app.get("/tuiroom",router.showtuiroom);//展示退房页面
app.get("/tuifangcx",router.tuifangcx);//退房查询
app.post ('/tuifang/:sid',router.showupdateTuiFang);//更改房间信息 未入住
app.post ('/yituifang/:sid',router.showupdateYiTuiFang);//更改入住记录信息 已退房
app.delete('/tuifang/:sid', router.showTFdelete);//删除订单



//记录查询
app.get("/comroot",router.showcomroot);//入住记录查询页面
app.get("/ruzhu",router.showRuzhuxinxi);//查询信息


//新建房间  房间信息增删改查
app.get("/addroom",router.showaddroom);//展示房间信息页面
app.post('/doaddfh', router.doAddfh);//增加
app.get('/doaddfh', router.getAllfh);
app.post    ('/fhtype/:sid'	, router.updateTypefh);//更改
app.get     ('/fhtype/:sid'	, router.showUpdatefh);
app.delete('/doaddfh/:sid', router.deletefh);//删除


//房类管理
app.get("/leiroot",router.showleiroot);//展示房间类型
app.post('/doadd', router.doAdd);//增加
app.get('/doadd', router.getAll);
app.post    ('/rtype/:sid'	, router.updateType);//更改
app.get     ('/rtype/:sid'	, router.showUpdate);
app.delete('/doadd/:sid', router.delete);//删除
app.get("/shuleibie",router.shuleibie);//

//修改密码
app.get("/uodatamima",router.showuodatamima);//修改密码页面
app.post("/changepw", router.changepw);
app.get("/name", router.showadmin);



//房间
app.get("/room",router.showroom);//修改密码页面

app.listen(3500);

























