const mongoose = require("mongoose");

//데이터 형식 정의하는 곳

const UserSchema = new mongoose.Schema({
    deviceCode : {type :String , required : true, unique : true},
    barnName :  {type :String , required : true},
}, {timestamps : true}); //timestamps 시간 알 수 있음

const User = mongoose.model('user', UserSchema);  //user 컬렉션을 만들꺼고 형식은 이래 ~
module.exports = {User} //위부에서 가져다 쓰려고 ~