const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const user = require("./routes/user");
const access = require("./routes/access");
const forum = require("./routes/forum");
const feedback = require("./routes/feedback");
const cors = require("cors");
const InitiateMongoServer = require("./config/db");

InitiateMongoServer();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: "xCufvwEyu14Tuu7l",
    resave: true,
    saveUninitialized: true,
    secure: true
}));
app.use(cookieParser());

app.get("/api", (req, res) => {
    res.json({ message: "API Working" });
});

app.use("/api/user", user);
app.use("/api/access", access);
app.use("/api/forum", forum);
app.use("/api/feedback", feedback);

//Define web routes
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get("/", (req, res) => {res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));});
app.get("/home", (req, res) => {res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));});
app.get("/access", (req, res) => {res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));});
app.get("/signIn", (req, res) => {res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));});
app.get("/signUp", (req, res) => {res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));});
app.get("/accessDash", (req, res) => {res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));});
app.get("/dashboard", (req, res) => {res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));});

//Start Server
app.listen(PORT, () => {
    console.log(`Server Listening on Port ${PORT}`)
});
