const { Schema, model, Types} = require("mongoose");

const SpaceSchema = new Schema({
    userId : {type : Types.ObjectId, required : true, ref : "user"},
    barnId : {type : Types.ObjectId, required : true, ref : "barn"},
    spaceName : {type : String, required : true},
    totalNumber: {type : Number, required : true}
}, {timestamps : true});

const Space = model("space", SpaceSchema);
module.exports = {Space}