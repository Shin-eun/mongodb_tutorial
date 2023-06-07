const {Schema, model, Types} = require("mongoose");

const CattleSchema = new Schema({
    userId : {type : Types.ObjectId, required : true, ref : "user"},
    barnId : {type : Types.ObjectId, required : true, ref : "barn"},
    spaceId : {type : Types.ObjectId, required : true, ref : "space"},
    cattleNumber : {type : String, required : true, unique : true},
    cattleGnder : {type : String, required : false},
    arrivalDate : {type : Array, required : false},
    shipDate : {type : Array, required : false},
    matingDate : {type : Array, required : false},
    childbirthDate : {type : Array, required : false},
    brucellaDate : {type : Array, required : false},
    brucellaRedate : {type : Array, required : false},
    diarrheaDate : {type : Array, required : false},
    diarrheaRedate : {type : Array, required : false},
    inoculationEDate : {type : Array, required : false},
    inoculationERedate : {type : Array, required : false}
}, {timestamps : true});

const Cattle = model("cattle", CattleSchema);
module.exports = {Cattle}