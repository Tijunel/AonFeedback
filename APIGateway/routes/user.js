const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require('../middleware/auth');
const User = require("../model/User");

const withAccessAuth = require('../middleware/auth')[0];
const withCompanyAuth = require('../middleware/auth')[1];

router.post("/signup", async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        username,
        email,
        password,
    } = req.body;

    try {
        let user = await User.findOne({ email })
        if (user) return res.status(400).json({ msg: "User Already Exists" });

        user = new User({
            username,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = { password };

        jwt.sign(payload, "CompanySecret", { expiresIn: '10m' }, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { httpOnly: true });
            res.status(200).json({
                name: user.name,
                email: user.email
            });
        });
    } catch (err) {
        res.status(500).send("Error in Saving");
    }
});

router.post("/login", async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User Not Exist" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect Password !" });

        const payload = { password };

        jwt.sign(payload, "CompanySecret", { expiresIn: '30m' }, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { httpOnly: true });
            res.status(200).json({
                email: user.email,
                name: user.name
            });
        });
    } catch (e) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.post("/checkAccessToken", withAccessAuth, (req, res) => {
    res.sendStatus(200);
});

router.post("/checkCompanyToken", withCompanyAuth, (req, res) => {
    res.sendStatus(200);
})

//For logging out, if needed
router.post('/stopSession', (req, res) => {

})

module.exports = router;
