var mongoose = require('mongoose');


var typefhSchema = new mongoose.Schema({
    sid:Number,
    leixing : String,
    weizhi : String,
    miaoshu : String,
    zhuangtai : String
});


typefhSchema.statics.addStudent = function(json,callback){
    // Typefh.checkSid(json.sid,function(torf){
    //     if(torf){
            var s = new Typefh(json);
            s.save(function(err){
                if(err){
                    callback(-2);
                    return;
                }
                callback(1);
            });
    //     }else{
    //         callback(-1);
    //     }
    // });
}


// typefhSchema.statics.checkSid = function(sid,callback){
//     this.find({"sid" : sid} , function(err,results){
//         callback(results.length == 0);
//     });
// }


var Typefh = mongoose.model("Typefh",typefhSchema);
module.exports = Typefh;