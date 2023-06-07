const {Router} = require("express");
const userRouter = Router();
const mongoose = require("mongoose");
const {User} = require("../modules");


userRouter.get("/", async (req, res) => {
    try {
        const users = await User.find({}); //조건없이 다 불러오기
     return res.send({ success: true, users: users });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

userRouter.get("/:deviceCode", async (req, res) => {
    try {
        const {deviceCode} = req.params;
        const user = await User.findOne({deviceCode : deviceCode});
        return res.send({ success: true, user : user });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

userRouter.post("/", async (req, res) => {
    try {
        let { deviceCode, barnName } = req.body;
        if (!deviceCode && !barnName) return res.status(400).send({ err: "deviceCode or barnName is required" });
        const user = new User({ deviceCode: deviceCode, barnName : barnName });
        await user.save();
        return res.send({ success: true, user: user });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

module.exports = {
    userRouter
}