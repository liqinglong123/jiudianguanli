var mongoose = require('mongoose');


var typeSchema = new mongoose.Schema({
    sid:Number,
    leixing : String,
    mianji : String,
    chuangshuliang : String,
    zaocan : String,
    wangluo : String,
    dianshi : String,
    jiage : String,
    fangshuliang : String,
    yushuliang : String
});

typeSchema.statics.getAll = function (callback) {
    this.find({}).exec(function (err, results) {
        callback(results);
    });
};


typeSchema.statics.addStudent = function(json,callback){
    // Type.checkSid(json.sid,function(torf){
    //     if(torf){
            var s = new Type(json);
            s.save(function(err){
                if(err){
                    callback(-2);
                    return;
                }
                callback(1);
            });
        // }else{
        //     callback(-1);
        // }
    // });
}


// typeSchema.statics.checkSid = function(sid,callback){
//     this.find({"sid" : sid} , function(err,results){
//         callback(results.length == 0);
//     });
// }


var Type = mongoose.model("Type",typeSchema);
module.exports = Type;