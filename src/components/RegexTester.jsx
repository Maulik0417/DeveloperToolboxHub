import React, { useState, useEffect } from "react";

const RegexTester = () => {
  const [regex, setRegex] = useState("");
  const [testText, setTestText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [flags, setFlags] = useState("g");
  const [replacement, setReplacement] = useState("");
const [replacedText, setReplacedText] = useState("");
const [showModal, setShowModal] = useState(false);
const [loadFromStorage, setLoadFromStorage] = useState(false);
const [saveMessage, setSaveMessage] = useState("");
  
useEffect(() => {
  // Only load from localStorage if loadFromStorage is true
  if (loadFromStorage) {
    const savedRegex = localStorage.getItem("regexPattern");
    const savedTestText = localStorage.getItem("testText");

    if (savedRegex) setRegex(savedRegex);
    if (savedTestText) setTestText(savedTestText);
  }
}, [loadFromStorage]); // Depend on loadFromStorage

  const toggleFlag = (flag) => {
    setFlags((prev) =>
      prev.includes(flag) ? prev.replace(flag, "") : prev + flag
    );
  };

  const handleTestRegex = () => {
    try {
      if (!regex) {
        setError("Please enter a regular expression.");
        setResult(null);
        setReplacedText("");
        return;
      }
  
      const re = new RegExp(regex, flags);
      let matches = [];
      
      if (flags.includes("g")) {
        matches = [...testText.matchAll(re)];
      } else {
        const match = testText.match(re);
        if (match) matches.push(match);
      }
  
      const replaced = testText.replace(re, replacement);
      setResult(matches);
      setReplacedText(replaced);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Invalid regular expression");
      setResult(null);
      setReplacedText("");
    }
  };

  const handleSave = () => {
    localStorage.setItem("regexPattern", regex);
    localStorage.setItem("testText", testText);
    setSaveMessage("Pattern and test case saved!");
    setTimeout(() => setSaveMessage(""), 3000); // hide after 3s
  };

  const handleLoad = () => {
    setLoadFromStorage(true);
  };

  return (
    
    <div className="container mt-4" >
      <h2>Regex Tester</h2>
      <button className="btn btn-outline-info" onClick={() => setShowModal(true)}>
    Syntax Help
  </button>
      <div className="mb-3">
        <label className="form-label">Regular Expression:</label>
        <input
          type="text"
          className="form-control"
          value={regex}
          onChange={(e) => setRegex(e.target.value)}
          placeholder="Enter regex here"
        />
      </div>

      

      <div className="mb-3">
        <label className="form-label">Text to Test:</label>
        <textarea
          className="form-control"
          rows="5"
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder="Enter text here"
        />
      </div>

      <div className="mb-3">
  <label className="form-label">Replacement String (optional):</label>
  <input
    type="text"
    className="form-control"
    value={replacement}
    onChange={(e) => setReplacement(e.target.value)}
    placeholder="Enter replacement string"
  />
</div>

<div className="mb-3">
  <label style={{ marginRight: '20px' }} className="form-label">Flags:</label>

  {[
    { flag: "g", label: "g (global)" },
    { flag: "i", label: "i (ignore case)" },
    { flag: "m", label: "m (multiline)" },
    { flag: "s", label: "s (dotAll)" },
    { flag: "u", label: "u (unicode)" },
    { flag: "y", label: "y (sticky)" }
  ].map(({ flag, label }) => (
    <div key={flag} className="form-check form-check-inline">
      <input
        className="form-check-input"
        type="checkbox"
        checked={flags.includes(flag)}
        onChange={() => toggleFlag(flag)}
        id={`flag${flag.toUpperCase()}`}
      />
      <label className="form-check-label" htmlFor={`flag${flag.toUpperCase()}`}>
        {label}
      </label>
    </div>
  ))}
</div>

      <button className="btn btn-primary" onClick={handleTestRegex}>
        Test Regex
      </button>

      <button className="btn btn-secondary ms-2" onClick={handleSave}>
        Save Regex
      </button>
      <button className="btn btn-warning ms-2" onClick={handleLoad}>
        Load Regex
      </button>


      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {result && result.length > 0 && (
  <div className="mt-3">
    <h4>Matches:</h4>
    {result.map((match, i) => (
      <div key={i} className="mb-2">
        <strong>Match {i + 1}:</strong> {match[0]}
        {match.length > 1 && (
          <ul>
            {match.slice(1).map((group, idx) => (
              <li key={idx}>
                Group {idx + 1}: {group || <em>(no match)</em>}
              </li>
            ))}
          </ul>
        )}
      </div>
    ))}
  </div>
)}
{replacement && replacedText && (
  <div className="mt-3">
    <h4>Replaced Text:</h4>
    <pre>{replacedText}</pre>
  </div>
)}


{showModal && (
  <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Regex Syntax Help</h5>
          <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
        </div>
        <div className="modal-body">
        <h6>Common Syntax</h6>
          <ul>
            <li><code>.</code> — Any character except newline</li>
            <li><code>\d</code> — Digit (0–9)</li>
            <li><code>\w</code> — Word character (a-z, A-Z, 0-9, _)</li>
            <li><code>\s</code> — Whitespace</li>
            <li><code>[abc]</code> — Any of a, b, or c</li>
            <li><code>[^abc]</code> — Not a, b, or c</li>
            <li><code>a*</code> — 0 or more a's</li>
            <li><code>a+</code> — 1 or more a's</li>
            <li><code>a?</code> — 0 or 1 a</li>
            <li><code>(abc)</code> — Capturing group</li>
            <li><code>a|b</code> — a or b</li>
            <li><code>^</code> — Start of string</li>
            <li><code>$</code> — End of string</li>
          </ul>

          <h6 className="mt-4">Regex Flags</h6>
          <ul>
            <li><code>g</code> — Global search (find all matches, not just the first)</li>
            <li><code>i</code> — Case-insensitive search</li>
            <li><code>m</code> — Multi-line mode (<code>^</code> and <code>$</code> match start/end of lines)</li>
            <li><code>s</code> — Allows <code>.</code> to match newline characters</li>
            <li><code>u</code> — Treat pattern as a sequence of Unicode code points</li>
            <li><code>y</code> — Sticky matching (matches starting at the current position only)</li>
          </ul>
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet"
            target="_blank"
            rel="noopener noreferrer"
          >
            View full MDN Regex Cheatsheet
          </a>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{saveMessage && (
  <div className="alert alert-success mt-3" role="alert">
    {saveMessage}
  </div>
)}

    </div>

    
  );
};

export default RegexTester;