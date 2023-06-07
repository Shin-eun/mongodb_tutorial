const {Router} = require('express');
const barnRouter = Router();
const {Barn, User, Cattle, Space} = require("../modules");
const {isValidObjectId} = require("mongoose");
const {spaceRouter} = require("./spaceRoute");

//barn 하위로 주소 주기위해 /barn/space
barnRouter?.use("/space", spaceRouter);

barnRouter.post("/", async(req, res) => {
    try{
        const {userId, barnName} = req.body;
        console.log('userId', isValidObjectId(userId), typeof userId)
        let totalNumber = 0;
        if(typeof barnName !== "string") return res.status(400).send({err : "barnName is required"});
        if(typeof totalNumber !== "number") return res.status(400).send({err : "totalNumber must be a number"});
        if(!isValidObjectId(userId)) return res.status(400).send({err : "userId is invalid"});

        let user = await User.findOne({_id : userId});
        console.log('user', user)
        if(!user) return res.status(400).send({err : "user does not exist"});

        const barn = new Barn({userId : userId, barnName: barnName, totalNumber : totalNumber});
        await barn.save();
        return res.send({success : true, barn : barn});
    }catch(err){
        console.log(err);
        res.status(500).send({err : err.message})
    }
})

barnRouter.get("/:userId", async(req, res) => {
    try{
        const {userId} = req.params;
        const barns = await Barn.find({userId : userId});
        return res.send({ success: true, barns : barns });
    }catch(err){
        console.log(err);
        res.status(500).send({err : err.message})
    }
})

barnRouter.patch("/:barnId", async(req, res) => {
    try{
        const {barnId} = req.params;
        if(!isValidObjectId(barnId)) return res.status(400).send({err : "barnId is invalid"});

        const {barnName} = req.body;
        if(typeof barnName !== "string") return res.status(400).send({err : "barnName is required"});

        const barn = await Barn.findOneAndUpdate(
            {_id : barnId},
            {barnName},
            {new : true} //바뀐 결과값을 보고싶다.
        );

        return res.send({success : true, barn : barn})
    }catch(err){
        console.log(err);
        res.status(500).send({err : err.message})
    }
})

barnRouter.delete("/:barnId", async(req, res) => {
    try{
        const {barnId} = req.params;
        if(!isValidObjectId(barnId)) return res.status(400).send({err : "barnId is invalid"});

        const [barn] = await Promise.all([
            await Barn.findOneAndDelete({ _id : barnId }),
            Cattle.deleteMany({"barnId" : barnId}),
            Space.deleteMany({"barnId" : barnId}),
        ]);

        return res.send({success : true, barn : barn})
    }catch(err){
        console.log(err);
        res.status(500).send({err : err.message})
    }
})

module.exports = {barnRouter};