// backend/routes/user.js
const express = require('express');
const router = express.Router();
const zod = require("zod");
const bcrypt = require("bcrypt");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

const signupBody = zod.object({
    email: zod.string().email(),
    password: zod.string(),
    username: zod.string()
})

router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
        email: req.body.email,
        password: hashedPassword,
        username: req.body.username,
    })
    const userId = user._id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })
})

const signinBody = zod.object({
    email: zod.string().email(),
    password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
        console.log("Signin validation failed:", req.body);
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        });
    }

    const user = await User.findOne({
        email: req.body.email,
    });

    if (user) {
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (isMatch) {
            const token = jwt.sign({
                userId: user._id
            }, JWT_SECRET);

            res.json({
                token: token
            });
            return;
        }
    }

    console.log("Signin failed, user not found:", req.body);
    res.status(411).json({
        message: "Error while logging in"
    });
});

const updateBody = zod.object({
    email: zod.string().optional(),
    password: zod.string().optional(),
    username: zod.string().optional()
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        username: {
            "$regex": filter,
            "$options": "i" // case insensitive
        }
    });

    res.json({
        users: users.map(user => ({
            email: user.email,
            username: user.username,
            _id: user._id
        }))
    });
});

module.exports = router;