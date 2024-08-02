const axios = require("axios");
const Chat = require("../Models/Chatbot.js");

const FORM_APP_URL = "https://formbot-api-nwz1.onrender.com";

const fetchForm = async (req, res) => {
  try {
    const formResponse = await axios.get(
      `${FORM_APP_URL}/forms/unique/${req.params.id}`
    );
    const form = formResponse.data;

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.json(form);
  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const saveChat = async (req, res) => {
  try {
    const { linkId, message } = req.body;

    if (!linkId || !message) {
      return res
        .status(400)
        .json({ message: "linkId and message are required" });
    }

    const newChat = new Chat({ linkId, message });
    await newChat.save();

    res.status(201).json({ message: "Chat saved successfully" });
  } catch (error) {
    console.error("Error saving chat:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { fetchForm, saveChat };
