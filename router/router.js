var user = require("../models/user.js");
var yuding=require('../models/yuding.js');
var ruzhu=require('../models/ruzhu.js');
var Type=require('../models/type.js');
var Typefh=require('../models/typefh.js');
var url=require("url");
var formidable = require("formidable");
var crypto = require('crypto');


//首页
exports.showIndex=function (req, res) {
    res.render("index");
}

//在线预订
exports.showYuding=function (req, res) {
    res.render("yuding");
}


exports.addYuding = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        yuding.addStudent(fields,function(result){
            res.json({"result" : result});
        });
    });
}

exports.leibiefj=function (req, res) {
        Type.find({}).exec(function(err,results){
            res.json({"result":results});
        });
}
exports.jiagef=function (req, res) {
    Type.find({}).exec(function(err,results){
        res.json({"result":results});
    });
}


//订单查询
exports.showDchaxun=function (req, res) {
    res.render("chaxun");
}
exports.fanghao=function (req, res) {
    Typefh.find({}).exec(function(err,results){
        res.json({"result":results});
    });
}
exports.addRuzhu = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        ruzhu.addStudent(fields,function(result){
            res.json({"result" : result});
        });
    });
}

exports.showupdateFangHao = function(req,res){
    var sid = req.params.sid;
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        // console.log(fields.zhuangtai);
        Typefh.update({"sid":sid},{$set:{"zhuangtai":fields.zhuangtai}},function (err) {
            if(err){
                res.json({"result" : -1});
            }else{
                res.json({"result" : 1});
            }
        })
    });
}

exports.updateTypedx = function(req,res){
    var sid = req.params.sid;
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //更改学生
        yuding.update({"name":sid},{$set:{"comeday":fields.comeday,"goday":fields.goday,"leixing":fields.leixing,"shuliang":fields.shuliang,"name":fields.name,"rename":fields.rename,"phone":fields.phone,"liuyan":fields.liuyan}},function (err) {
            if(err){
                res.json({"result" : -1});
            }else{
                res.json({"result" : 1});
            }
        })
    });
}
exports.showUpdatedx = function(req,res){
    var sid = req.params.sid;
    console.log(sid)
    yuding.find({"name" : sid},function(err,results){
        if(results.length == 0){
            res.json({"result" : -1});
            return;
        }else{
            res.json({"result" : results[0]});
        }
    });
}








//管理员登录
exports.showReg=function (req, res) {
    res.render("reg");
}
exports.doreg=function (req, res,next) {
    var form = new formidable.IncomingForm();
    form.parse(req,function (err, fields, files) {
        var yonghuming=fields.yonghuming;
        var mima=fields.mima;
        user.findUserByName(yonghuming,function (err, doc) {
            if(doc){
                res.json({"result":-1})
                return
            }
            user.adduser(yonghuming,mima,function (err, doc) {
                if(err){
                    res.json({"result":-2})
                    return
                }
                req.session.login=1;
                req.session.yonghuming=yonghuming;
                res.json({"result":1})
            })
        })
    })
}
exports.checkuserexist=function (req, res, next) {
    var queryobj = url.parse(req.url,true).query;
    if(!queryobj.yonghuming){
        res.send("请提供参数");
        return;
    }
    user.findUserByName(queryobj.yonghuming,function (err, doc) {
        if(doc){
            res.json({"result":-1});
        }else{
            res.json({"result":0})
        }
    })
}//检测用户名是否存在
exports.showManage=function (req, res) {
    res.render("manage");
}
// exports.checklogin=function (req, res, next) {
//     var form = new formidable.IncomingForm();
//     form.parse(req,function (err, fields, files) {
//         var yonghuming=fields.yonghuming;
//         var mima=fields.mima;
//         user.findUserByName(yonghuming,function (err, doc) {
//             if(!doc){
//                 res.json({"result":-1});
//                 return;
//             }
//             if(crypto.createHmac("sha256",mima).digest("hex")===doc.mima){
//                 req.session.login=1;
//                 req.session.yonghuming=yonghuming;
//                 res.json({"result":1});
//                 return;
//             }else {
//                 res.json({"result":-2});
//                 return;
//             }
//         })
//     })
// }
exports.checklogin = function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var yonghuming = fields.yonghuming;
        var mima = fields.mima;
        if (err) {
            res.json({"result": -1});
            return;
        }
        if (!yonghuming || !mima) {
            res.json({"result": -4});
            return;
        }
        user.findUserByName(yonghuming, function (err, results) {
            var theadmin = results;
            var sha256 = crypto.createHash("sha256");
            mima = sha256.update(mima).digest("hex").toString();
            if (theadmin.mima == mima) {
                req.session.yonghuming = yonghuming;
                req.session.type = "admin";
                req.session.login = true;
                res.json({"result": 1, "type": "admin"});
            } else {
                res.json({"result": -3});
            }
        })
    })

}


//后台酒店管理首页
exports.showjiuIndex=function (req, res) {
    res.render("houtaiindex");
}



//大堂入住
exports.showdatang=function (req, res) {
    res.render("datang");
}



//订单入住
exports.showdingdan=function (req, res) {
    res.render("dingdan");
}
exports.yudingchaxun=function (req, res) {
    yuding.find({}).exec(function(err,results){
        res.json({"result":results});
    });
}









//退房管理
exports.showtuiroom=function (req, res) {
    res.render("tuiroom");
}
exports.tuifangcx=function (req, res) {
    ruzhu.find({}).exec(function(err,results){
        res.json({"result":results});
    });
}
exports.showupdateTuiFang = function(req,res){
    var sid = req.params.sid;
    // console.log(sid)
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        // console.log(fields.zhuangtai);
        Typefh.update({"sid":sid},{$set:{"zhuangtai":fields.zhuangtai}},function (err) {
            if(err){
                res.json({"result" : -1});
            }else{
                res.json({"result" : 1});
            }
        })
    });
}
exports.showupdateYiTuiFang = function(req,res){
    var sid = req.params.sid;
    console.log(sid)
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        console.log(fields.zhuangtai);
        ruzhu.update({"sid":sid},{$set:{"zhuangtai":fields.zhuangtai}},function (err) {
            if(err){
                res.json({"result" : -1});
            }else{
                res.json({"result" : 1});
            }
        })
    });
}
exports.showTFdelete=function(req,res){
    var sid= req.params.sid;
    yuding.find({'name':sid},function (err, results) {
        if (err||results.length==0){
            res.json({"result":-1});
            return;
        }
        results[0].remove(function (err) {
            if (err){
                res.json({'result':-1});
                return;
            }
            res.json({'result':1})
        })
    })
}


//记录查询
exports.showcomroot=function (req, res) {
    res.render("comroot");
}
exports.showRuzhuxinxi=function (req, res) {
    ruzhu.find({}).exec(function(err,results){
        res.json({"result":results});
    });
}






//新建房间
exports.showaddroom=function (req, res) {
    res.render("addroom");
}
exports.doAddfh = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        Typefh.addStudent(fields,function(result){
            res.json({"result" : result});
        });
    });
}
exports.getAllfh=function (req, res) {
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize =5;
    Typefh.count({},function(err,count){
        Typefh.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
}
exports.updateTypefh = function(req,res){
    var sid = req.params.sid;
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //更改学生
        Typefh.update({"sid":sid},{$set:{"leixing":fields.leixings,"weizhi":fields.weizhis,"miaoshu":fields.miaoshus,"zhuangtai":fields.zhuangtais}},function (err) {
            if(err){
                res.json({"result" : -1});
            }else{
                res.json({"result" : 1});
            }
        })
    });
}
exports.showUpdatefh = function(req,res){
    var sid = req.params.sid;
    console.log(sid)
    Typefh.find({"sid" : sid},function(err,results){
        if(results.length == 0){
            res.json({"result" : -1});
            return;
        }else{
            res.json({"result" : results[0]});
        }
    });
}
exports.deletefh=function(req,res){
    var sid= req.params.sid;
    Typefh.find({'sid':sid},function (err, results) {
        if (err||results.length==0){
            res.json({"result":-1});
            return;
        }
        results[0].remove(function (err) {
            if (err){
                res.json({'result':-1});
                return;
            }
            res.json({'result':1})
        })
    })
}




//删除房间
// exports.showdelroot=function (req, res) {
//     res.render("delroot");
// }



//房类管理
// exports.showleiroot=function (req, res) {
//     res.render("leiroot");
// }

exports.showleiroot=function(req,res){
    Type.getAll(function(data){
        for(let i=0;i<data.length;i++){
            let name=data[i];
            Typefh.count({"leixing":name.leixing},function(err,count){
                Typefh.count({"zhuangtai":"未入住","leixing":name.leixing},function(err,count_b){
                    console.log(count_b);
                    name.fangshuliang=count;
                    name.yushuliang=count_b;
                    name.save(function(err){
                    })
                })
            })
        }
        res.render("leiroot");
        return;
    })
}

exports.doAdd = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        Type.addStudent(fields,function(result){
            res.json({"result" : result});
        });
    });
}
exports.getAll=function (req, res) {
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize =5;
    Type.count({},function(err,count){
        Type.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
}
exports.updateType = function(req,res){
    var sid = req.params.sid;
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        //更改学生
        Type.update({"sid":sid},{$set:{"leixing":fields.leixings,"mianji":fields.mianjis,"chuangshuliang":fields.chuangshuliangs,"zaocan":fields.zaocans,"wangluo":fields.wangluos,"dianshi":fields.dianshis,"jiage":fields.jiages,"fangshuliang":fields.fangshuliangs,"yushuliang":fields.yushuliangs}},function (err) {
            if(err){
                res.json({"result" : -1});
            }else{
                res.json({"result" : 1});
            }
        })
    });
}
exports.showUpdate = function(req,res){
    var sid = req.params.sid;
    console.log(sid)
    Type.find({"sid" : sid},function(err,results){
        if(results.length == 0){
            res.json({"result" : -1});
            return;
        }else{
            res.json({"result" : results[0]});
        }
    });
}
exports.delete=function(req,res){
    var sid= req.params.sid;
    Type.find({'sid':sid},function (err, results) {
        if (err||results.length==0){
            res.json({"result":-1});
            return;
        }
        results[0].remove(function (err) {
            if (err){
                res.json({'result':-1});
                return;
            }
            res.json({'result':1})
        })
    })
}




//修改密码
exports.showuodatamima=function (req, res) {
    res.render("uodatamima");
}
// 修改密码
exports.changepw = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {
        console.log(fields)
        user.changepw(fields.yonghuming, fields.mima, function (info) {
            res.end(info);
        });
    });
};
// 修改密码页面显示姓名
exports.showadmin = function (req, res) {
    user.getAll(function (results) {
        res.json({"results": results});
    })
};



//房间
exports.showroom=function (req, res) {
    res.render("room");
}




exports.shuleibie=function (req, res) {
    Typefh.find({}).exec(function(err,results){
        res.json({"result":results});
    });
}




// exports.showleiroot=function(req,res){
//     //显示类别档案
//     // if (req.session.login!=1) {
//     //     res.send('你没有<a href="/login">登录</a>');
//     //     return;
//     // }
//     Type.getAll(function(data){
//         for(let i=0;i<data.length;i++){
//             let name=data[i];
//             Typefh.count({"leixing":name.leixing},function(err,count){
//                 // Typefh.count({"zhuagtai":"未入住","leixing":name.leixing},function(err,count_b){
//                     console.log(count);
//                     name.fangshuliang=count;
//                     // name.yushuliang=count;
//                     name.save(function(err){
//                     })
//                 // })
//             })
//         }
//         res.render("leiroot");
//         return;
//     })
//
//
// }




