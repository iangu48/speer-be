require('dotenv').config()

const express = require('express');
const router = express.Router();
const {check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/User')

router.post("/signup",
    [
        check("username", "Please enter a unique username").not().isEmpty(),
        check("password", "Please enter a valid password").isLength({min: 6})
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            next(errors.array())
            return
        }

        const { username, password } = req.body;
        try {
            let user = await User.findOne({username});
            if (user) {
                return res.status(400).json({
                    msg: "Username in use"
                });
            }

            user = new User({ username, password });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = { user: { id: user.id} };

            jwt.sign(
                payload,
                process.env.JWT_SECRET, {
                    expiresIn: 3600
                },
                (err, token) => {
                    if (err)
                        next(err);
                    res.status(200).json({ token });
                }
            );
        } catch (err) {
            next(err)
        }
    }
);



router.post("/login",
    [
        check("username", "Please enter a valid username").not().isEmpty(),
        check("password", "Please enter a valid password").isLength({ min: 6 })
    ],
    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            next(errors.array())
        }

        const { username, password } = req.body;
        try {
            let user = await User.findOne({ username });
            if (!user)
                return res.status(400).json({ message: "User does not exist" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({ message: "Incorrect password" });

            const payload = { user: { id: user.id } };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: 3600 },
                (err, token) => {
                    if (err)
                        next(err);
                    res.status(200).json({ token });
                }
            );
        } catch (err) {
            next(err);
        }
    }
);


module.exports = router;
