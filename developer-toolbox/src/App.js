import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ApiTester from "./components/ApiTester";
import Home from "./components/Home";
import RegexTester from "./components/RejexTester";

function App() {
  return (
    <Router>
      <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <div className="container">
    <Link className="navbar-brand" to="/">Dev Toolbox</Link>
    <div className="collapse navbar-collapse">
      <ul className="navbar-nav ms-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/api-tester">REST API Tester</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/regex-tester">Regex Tester</Link> 
        </li>
      </ul>
    </div>
  </div>
</nav>

        <div className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/api-tester" element={<ApiTester />} />
            <Route path="/regex-tester" element={<RegexTester />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;