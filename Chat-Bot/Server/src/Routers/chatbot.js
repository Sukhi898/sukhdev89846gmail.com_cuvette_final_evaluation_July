const express = require("express");
const router = express.Router();
const { fetchForm, saveChat } = require("../Controllers/Chat");

router.get("/form/unique/:id", fetchForm);
router.post("/save-chat", saveChat);

module.exports = router;
