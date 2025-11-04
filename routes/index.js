const express = require("express");
const router = express.Router();

// HOME PAGE
router.get("/", (req, res) => {
    res.render("index", { title: "Home" });
})

// PROFILE
router.get("/profile", (req, res) => {
    res.render("profile", { title: "Your profile - TimeShift Arcade"});
})

// PROFILE CONFIGURATION
router.get("/profile_config", (req, res) => {
    res.render("profile_config", { title: "Profile configuration - TimeShift Arcade"});
})

// GAME VIEWER
router.get("/gameview", (req, res) => {
    res.render("game", { title: "Gamename - TimeShift Arcade"});
})

module.exports = router;