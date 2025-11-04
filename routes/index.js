const express = require("express");
const router = express.Router();

// HOME PAGE
router.get("/", (req, res) => {
    res.render("index", { title: "Home" });
})

// GAME LIST
router.get("/gamelist", (req, res) => {
    res.render("gamelist", { title: "Your games - Timeshift Arcade" });
})

// GAME VIEWER
router.get("/gameview", (req, res) => {
    res.render("game", { title: "Gamename - Timeshift Arcade"});
})

module.exports = router;