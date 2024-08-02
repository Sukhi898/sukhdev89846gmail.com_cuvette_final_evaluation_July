import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { IoSendSharp } from "react-icons/io5";
import "./Chatbot.css";

const Chatbot = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputFields, setInputFields] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [hiClicked, setHiClicked] = useState(false);
  const [buttonColor, setButtonColor] = useState("#0042da");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(
          `https://formbot-api-nwz1.onrender.com/forms/unique/${id}`
        );
        const { formData } = response.data;
        console.log("API Response:", formData);

        if (formData.length > 0) {
          const extractedTheme = formData[0].theme;
          setTheme(extractedTheme);

          const initialMessages = [];
          let step = 0;

          while (step < formData.length && formData[step].type === "bubble") {
            const cleanedText = formData[step].inputValue.replace(
              /[0-9]+$/,
              ""
            );
            initialMessages.push({
              key: formData[step].key,
              text: cleanedText,
              from: "bot",
            });
            step++;
            break;
          }

          setMessages(initialMessages);
          setInputFields(formData);
          setCurrentStep(step);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchFormData();
  }, [id]);

  useEffect(() => {
    const setBackgroundColor = () => {
      const body = document.body;
      switch (theme) {
        case "dark":
          body.style.backgroundColor = "rgb(23, 25, 35)";
          break;
        case "tail-blue":
          body.style.backgroundColor = "rgb(80, 140, 155)";
          break;
        default:
          body.style.backgroundColor = "white";
      }
    };

    setBackgroundColor();
  }, [theme]);

  const handleInputChange = (e, index) => {
    const newInputFields = [...inputFields];
    newInputFields[index].inputValue = e.target.value;
    setInputFields(newInputFields);
  };

  const handleSendMessage = async () => {
    const currentInput = inputFields[currentStep];
    if (!currentInput.inputValue.trim()) return;

    const updatedInputFields = [...inputFields];
    updatedInputFields[currentStep].greyedOut = true;
    setInputFields(updatedInputFields);

    try {
      await axios.post("http://localhost:5000/api/save-chat", {
        linkId: id,
        message: currentInput.inputValue,
      });
    } catch (error) {
      console.error("Error saving chat:", error);
    }

    const nextStep = currentStep + 1;
    if (nextStep < inputFields.length) {
      const nextElement = inputFields[nextStep];
      if (nextElement.type === "bubble") {
        const cleanedText = nextElement.inputValue.replace(/[0-9]+$/, "");
        setMessages((prevMessages) => [
          ...prevMessages,
          { key: nextElement.key, text: cleanedText, from: "bot" },
        ]);
        setCurrentStep(nextStep + 1);
      } else {
        setCurrentStep(nextStep);
      }
    }
  };

  const handleHiClick = () => {
    setHiClicked(true);
    setButtonColor("#ff6600");

    setTimeout(() => {
      const nextStep = currentStep;
      if (nextStep < inputFields.length) {
        const nextElement = inputFields[nextStep];
        if (nextElement.type === "bubble") {
          const cleanedText = nextElement.inputValue.replace(/[0-9]+$/, "");
          setMessages((prevMessages) => [
            ...prevMessages,
            { key: nextElement.key, text: cleanedText, from: "bot" },
          ]);
          setCurrentStep(nextStep + 1);
        } else {
          setCurrentStep(nextStep);
        }
      }
    }, 500);
  };

  const getPlaceholderText = (value) => {
    const cleanedValue = value.replace(/[0-9]+$/, "");

    const placeholders = {
      phone: "Enter your phone number",
      video: "Enter video URL",
      text: "Enter your response",
      rating: "Rate from 1 to 5",
      email: "Enter your email address",
      number: "Enter a number",
      date: "Select a date",
      buttons: "",
    };

    return placeholders[cleanedValue] || "Enter your response";
  };

  const renderInputField = (index) => {
    const { value, greyedOut } = inputFields[index];
    const placeholderText = getPlaceholderText(value);

    return (
      <input
        type={
          value === "date" ? "date" : value === "number" ? "number" : "text"
        }
        value={inputFields[index].inputValue || ""}
        onChange={(e) => handleInputChange(e, index)}
        placeholder={placeholderText}
        className={greyedOut ? "greyed-out" : ""}
        disabled={greyedOut}
      />
    );
  };

  return (
    <div id="chat-area">
      <div id="chat-box">
        {messages.map((msg, index) => (
          <div className={`message ${msg.from}`} key={index}>
            <img src="/BotLogo.png" alt="BotIcon" />
            <div className={`text ${msg.from}`}>{msg.text}</div>
          </div>
        ))}
        <div className="user-response">
          <div
            id="Hi"
            onClick={handleHiClick}
            style={{ backgroundColor: buttonColor }}
          >
            Hi
          </div>
          <div id="pointer"></div>
        </div>
        {hiClicked && (
          <div className="input-container">
            {currentStep < inputFields.length && renderInputField(currentStep)}
            <IoSendSharp
              className="send-button"
              onClick={handleSendMessage}
              style={{ color: buttonColor }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
