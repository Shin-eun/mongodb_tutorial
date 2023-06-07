const {Schema, model, Types : {ObjectId}} = require("mongoose");

const BarnSchema = new Schema({
    userId : {type : ObjectId, required : true, ref : "user"},
    barnName : {type : String, required : true},
    totalNumber: {type : Number, required : true}
}, {timestamps : true});

const Barn = model("barn", BarnSchema);
module.exports = {Barn};