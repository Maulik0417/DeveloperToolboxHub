import React, { useState } from "react";

const RegexTester = () => {
  const [regex, setRegex] = useState("");
  const [testText, setTestText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleTestRegex = () => {
    try {
      const re = new RegExp(regex);
      const matches = testText.match(re);
      setResult(matches);
      setError("");
    } catch (err) {
      setError("Invalid regular expression");
      setResult(null);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Regex Tester</h2>
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

      <button className="btn btn-primary" onClick={handleTestRegex}>
        Test Regex
      </button>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {result && (
        <div className="mt-3">
          <h4>Matches:</h4>
          {result.length > 0 ? (
            <pre>{JSON.stringify(result, null, 2)}</pre>
          ) : (
            <p>No matches found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RegexTester;