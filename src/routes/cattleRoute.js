const { Router } = require("express");
const cattleRouter = Router();
const { isValidObjectId } = require("mongoose");
const { Cattle, User, Space, Barn } = require("../modules");
const { handleAddMonth } = require("../utiles/date");

cattleRouter.post("/", async (req, res) => {
    try {
        const body = req.body;
        const {
            userId,
            barnId,
            spaceId,
            cattleNumber,
            cattleGnder,
            arrivalDate,
            shipDate,
            matingDate,
            brucellaDate,
            diarrheaDate,
            inoculationEDate,
        } = body;

        console.log('typeof cattleNumber ', typeof cattleNumber)
        if (!isValidObjectId(userId)) return res.status(400).send({ err: "userId is invalid" });
        if (!isValidObjectId(barnId)) return res.status(400).send({ err: "barnId is invalid" });
        if (!isValidObjectId(spaceId)) return res.status(400).send({ err: "spaceId is invalid" });
        if (typeof cattleNumber !== "string") return res.status(400).send({ err: "cattleNumber is required" });

        const [user, barn, space] = await Promise.all([
            User.findById(userId),
            Barn.findById(barnId),
            Space.findById(spaceId),
        ])

        if (!user || !barn || !space) return res.status(400).send({ err: "user and barn, space does not exist" });

        if (matingDate) {
            body.childbirthDate = handleAddMonth(matingDate, 10)
        }
        if (brucellaDate) {
            body.brucellaRedate = handleAddMonth(brucellaDate, 6)
        }
        if (diarrheaDate) {
            body.diarrheaRedate = handleAddMonth(diarrheaDate, 1)
        }
        if (inoculationEDate) {
            body.inoculationERedate = handleAddMonth(inoculationEDate, 1)
        }

        const cattle = new Cattle({ ...body, barnName: barn.barnName, spaceName: space.spaceName });

        await Promise.all([
            cattle.save(),
            Space.updateOne(
                { _id: spaceId },
                { $inc: { totalNumber: 1 } }
            ),
            Barn.updateOne(
                { _id: barnId },
                { $inc: { totalNumber: 1 } }
            )
        ]);

        return res.send({ success: true, cattle: cattle })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err: err.message });
    }
});

cattleRouter.get("/:cattleId", async (req, res) => {
    try {
        const { cattleId } = req.params;
        if (!isValidObjectId(cattleId)) return res.status(400).send({ err: "cattleId is invalid" });

        const cattle = await Cattle.findById(cattleId);
        return res.send({ success: true, cattle: cattle });
    } catch (err) {
        console.log(err);
        res.status(500).send({ err: err.message })
    }
})

cattleRouter.get("/", async (req, res) => {
    try {
        let { page } = req.query;
        page = page ? parseInt(page) : 0;
        const cattles = await Cattle.find({})
            .sort({ createdAt: -1 }) //최신순으로 정렬
            .skip(page * 10)
            .limit(10);
        return res.send({ cattles })

    } catch (err) {
        console.log(err);
        res.status(500).send({ err: err.message })
    }
})

cattleRouter.put("/:cattleId", async (req, res) => {
    try {
        const { cattleId } = req.params;
        const body = req.body;
        const {
            cattleNumber,
            cattleGnder,
            arrivalDate,
            shipDate,
            matingDate,
            brucellaDate,
            diarrheaDate,
            inoculationEDate,
        } = body;

        if (!isValidObjectId(cattleId)) return res.status(400).send({ err: "cattleId is invalid" });

        if (matingDate) {
            body.childbirthDate = handleAddMonth(matingDate, 10)
        }
        if (brucellaDate) {
            body.brucellaRedate = handleAddMonth(brucellaDate, 6)
        }
        if (diarrheaDate) {
            body.diarrheaRedate = handleAddMonth(diarrheaDate, 1)
        }
        if (inoculationEDate) {
            body.inoculationERedate = handleAddMonth(inoculationEDate, 1)
        }

        const cattle = await Cattle.findByIdAndUpdate(cattleId,
            {
                $set: {
                    cattleNumber: cattleNumber,
                    cattleGnder: cattleGnder,
                    arrivalDate: arrivalDate,
                    shipDate: shipDate
                },
                $addToSet: {
                    matingDate: matingDate,
                    brucellaDate: brucellaDate,
                    diarrheaDate: diarrheaDate,
                    inoculationEDate: inoculationEDate,
                    childbirthDate: body.childbirthDate,
                    brucellaRedate: body.brucellaRedate,
                    diarrheaRedate: body.diarrheaRedate,
                    inoculationERedate: body.inoculationERedate,
                }
            }, { new: true });
        return res.send({ success: true, cattle: cattle });

    } catch (err) {
        console.log(err);
        res.status(500).send({ err: err.message })
    }
})

cattleRouter.delete("/:cattleId", async (req, res) => {
    try {
        const { cattleId } = req.params;
        const { userId,
            barnId,
            spaceId } = req.body;

        if (!isValidObjectId(userId)) return res.status(400).send({ err: "userId is invalid" });
        if (!isValidObjectId(barnId)) return res.status(400).send({ err: "barnId is invalid" });
        if (!isValidObjectId(spaceId)) return res.status(400).send({ err: "spaceId is invalid" });
        if (!isValidObjectId(cattleId)) return res.status(400).send({ err: "cattleId is invalid" });

        const [cattle] = await Promise.all([
            await Cattle.findOneAndDelete({ _id: cattleId }),
            Space.updateOne(
                { _id: spaceId },
                { $inc: { totalNumber: -1 } }
            ),
            Barn.updateOne(
                { _id: barnId },
                { $inc: { totalNumber: -1 } }
            )
        ]);

        return res.send({ success: true, cattle: cattle });
    } catch (err) {
        console.log(err);
        res.status(500).send({ err: err.message })
    }
})

module.exports = {
    cattleRouter
}

// 날짜 정보들은 갱신될것이라서 리스트로 작업해될듯  2023-06-20