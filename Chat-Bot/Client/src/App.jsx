import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chatbot from "./Components/Chatbot";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/form/unique/:id" element={<Chatbot />} />
<Route path="/other-route" component={OtherComponent} />
        <Route path="/" exact component={HomeComponent} />
        <Route component={NotFoundComponent} /> 
      </Routes>
    </Router>
  );
};

export default App;
