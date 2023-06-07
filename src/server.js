const express = require('express');
const app = express();
const { userRouter , barnRouter, cattleRouter } = require("./routes");
const mongoose = require("mongoose");
const {MONGO_URI} = process.env;



const server = async () => {
    try {

        if (!MONGO_URI) throw new Error("MONGO_URI is required!!!")

        await mongoose.connect(MONGO_URI);
        app.use(express.json());

        app.use("/user", userRouter);
        app.use("/barn", barnRouter);
        app.use("/cattle", cattleRouter);

        app.listen(4000, function () {
            console.log("server port 4000")
        });

    } catch (err) {
        console.log(err);
    }

}

server();