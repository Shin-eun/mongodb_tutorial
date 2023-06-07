const {Router} = require('express');
const spaceRouter = Router();
const {Space} = require("../modules");

spaceRouter.post("/", async(req, res) => {
    try{
        const {userId, barnId, spaceName} = req.body;
        const totalNumber = 0;
        const space = new Space({userId : userId, barnId: barnId, spaceName : spaceName, totalNumber : totalNumber});
        await space.save();
        return res.send({success : true, space : space})
    }catch(err){
        console.log(err);
        res.status(500).send({err : err.message})
    }
})

spaceRouter.post("/find", async(req, res) => {
    try{
        const {userId, barnId} = req.body;
        const barns = await barn.find({userId : userId, barnId: barnId});
        return res.send({success : true, barns : barns})
    }catch(err){
        console.log(err);
        res.status(500).send({err : err.message})
    }
})

module.exports = {spaceRouter};