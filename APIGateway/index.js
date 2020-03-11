const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const user = require("./routes/user");
const access = require("./routes/access");
const forum = require("./routes/forum");
const feedback = require("./routes/feedback");
const InitiateMongoServer = require("./config/db")

InitiateMongoServer();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'xCufvwEyu14Tuu7l',
    resave: true,
    saveUninitialized: true,
    secure: true
}));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({ message: "API Working" });
});

app.use("/user", user);
app.use("/access", access);
app.use("/forum", forum);
app.use("/feedback", feedback);

app.listen(PORT, (req, res) => {
    console.log(`Server Listening on Port ${PORT}`)
});
