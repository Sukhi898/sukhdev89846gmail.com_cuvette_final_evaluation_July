import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chatbot from "./Components/Chatbot";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/form/unique/:id" element={<Chatbot />} />
      </Routes>
    </Router>
  );
};

export default App;
