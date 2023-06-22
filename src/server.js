const express = require('express');
const app = express();
const cors = require('cors')
const { userRouter , barnRouter, cattleRouter } = require("./routes");
const mongoose = require("mongoose");
const {MONGO_URI, PORT} = process.env;



const server = async () => {
    try {

        if (!MONGO_URI) throw new Error("MONGO_URI is required!!!")
        if (!PORT) throw new Error("PORT is required!!!")

        await mongoose.connect(MONGO_URI);

        const whitelist = ["http://localhost:8080", "http://localhost:3000"];
        const corsOptions = {
            origin: function (origin, callback) { 
                if (whitelist.indexOf(origin) !== -1) { // 만일 whitelist 배열에 origin인자가 있을 경우
                    callback(null, true); // cors 허용
                } else {
                    callback(new Error("Not Allowed Origin!")); // cors 비허용
                }
            },
        };

        app.use(cors({
            origin: '*', // 모든 출처 허용 옵션. true 를 써도 된다.
        }))
        app.use(express.json());

        app.use("/user", userRouter);
        app.use("/barn", barnRouter);
        app.use("/cattle", cattleRouter);

        app.listen(PORT, function () {
            console.log(`server port ${PORT}`)
        });

    } catch (err) {
        console.log(err);
    }

}

server();