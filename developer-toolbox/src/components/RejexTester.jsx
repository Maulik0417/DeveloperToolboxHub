import React, { useState } from "react";

const RegexTester = () => {
  const [regex, setRegex] = useState("");
  const [testText, setTestText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [flags, setFlags] = useState("g");

  const toggleFlag = (flag) => {
    setFlags((prev) =>
      prev.includes(flag) ? prev.replace(flag, "") : prev + flag
    );
  };

  const handleTestRegex = () => {
    try {
      const re = new RegExp(regex, flags);
      const matches = testText.match(re);
      setResult(matches);
      setError("");
    } catch (err) {
      setError("Invalid regular expression or flags");
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

      <div className="mb-3">
  <label style={{ marginRight:'20px'}} className="form-label">Flags:</label>
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      checked={flags.includes("g")}
      onChange={() => toggleFlag("g")}
      id="flagG"
    />
    <label className="form-check-label" htmlFor="flagG">g (global)</label>
  </div>
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      checked={flags.includes("i")}
      onChange={() => toggleFlag("i")}
      id="flagI"
    />
    <label className="form-check-label" htmlFor="flagI">i (ignore case)</label>
  </div>
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      checked={flags.includes("m")}
      onChange={() => toggleFlag("m")}
      id="flagM"
    />
    <label className="form-check-label" htmlFor="flagM">m (multiline)</label>
  </div>
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      checked={flags.includes("s")}
      onChange={() => toggleFlag("s")}
      id="flagS"
    />
    <label className="form-check-label" htmlFor="flagS">s (dotAll)</label>
  </div>
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