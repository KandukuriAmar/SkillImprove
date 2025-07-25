const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
const User = require('./Models/Users');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");

const Routings = require("./Routers/Routings");
const AdminRoutings = require('./Routers/AdminRoutings');
const homeMiddleware = require("./middlewares/homeMiddleware");

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
)

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET_KEY,
    callbackURL: "http://localhost:9000/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = await User.create({
                googleId: profile.id,
                fullname: profile.displayName,
                email: profile.emails[0].value,
            });
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}
))

passport.serializeUser((user, done) => {
    console.log("user id: ", user._id);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log("user id: ", user._id);
    done(null, user);
});

app.get("/oauth", (req, res) => {
    res.render("oauthh.html");
})

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));


app.get("/profile", (req, res) => {
    res.json(req.user);
})

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
})

app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
    console.log(req);
    // Issue JWT and redirect to frontend login page with token
    console.log("req.user id: ", req.user._id);
    console.log("req.user email: ", req.user.email);
    console.log("req.user fullname: ", req.user.fullname);

    const token = jwt.sign({
            id: req.user._id,
            email: req.user.email,
            fullname: req.user.fullname,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' },
    )
    res.redirect(`http://localhost:5173/login?token=${token}`);
})

app.get("/", (req, res) => {
    res.send("hiiii");
})

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB successfully');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
})

app.use("/api/", Routings);
app.use("/admin", AdminRoutings);

app.get('/', homeMiddleware, (req, res) => {
    res.status(201).json({ message: 'Welcome to the home page user:', user: req.user });
})

app.listen(process.env.PORT, () =>{
    console.log(`Server is running on port ${process.env.PORT}`);
})