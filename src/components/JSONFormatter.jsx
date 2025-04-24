import React, { useState, useEffect, useCallback } from "react";

const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [formatted, setFormatted] = useState("");
  const [error, setError] = useState(null);
  const [pretty, setPretty] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const handleFormat = useCallback(() => {
    if (!input.trim()) {
      setFormatted("");
      setError(null);
      return;
    }

    try {
      const obj = JSON.parse(input);
      const output = pretty
        ? JSON.stringify(obj, null, 2)
        : JSON.stringify(obj);
      setFormatted(output);
      setError(null);
    } catch (e) {
      setError(`❌ Invalid JSON: ${e.message}`);
      setFormatted("");
    }
  }, [input, pretty]);

  useEffect(() => {
    handleFormat();
  }, [handleFormat]);

  const handleCopy = () => {
    navigator.clipboard.writeText(formatted);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setInput(evt.target.result);
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const blob = new Blob([formatted], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">JSON Formatter & Validator</h2>

      <div className="mb-3">
        <label className="form-label">Paste or type your JSON here:</label>
        <textarea
          className="form-control"
          rows={10}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='e.g., { "name": "John", "age": 30 }'
        ></textarea>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        {/* <button className="btn btn-primary" onClick={handleFormat}>
          Format JSON
        </button> */}
        <button
          className={`btn btn-${pretty ? "secondary" : "outline-secondary"}`}
          onClick={() => setPretty((prev) => !prev)} // Toggle the state here
        >
          {pretty ? "Minified View" : "Pretty View"}
        </button>
        <button
          className="btn btn-success"
          onClick={handleCopy}
          disabled={!formatted}
        >
          Copy
        </button>
        <button
          className="btn btn-outline-info"
          onClick={handleDownload}
          disabled={!formatted}
        >
          Export
        </button>
        <label className="btn btn-outline-dark mb-0">
          Load File
          <input
            type="file"
            accept=".json"
            hidden
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {formatted && (
        <div className="mt-4">
          <label className="form-label">Formatted Output:</label>
          <pre className="bg-light p-3 rounded border">{formatted}</pre>
        </div>
      )}

      {/* Toast Notification */}
      <div
        className={`toast-container position-fixed bottom-0 end-0 p-3`}
        style={{ zIndex: 9999 }}
      >
        <div
          className={`toast align-items-center text-white bg-success ${
            showToast ? "show" : "hide"
          }`}
        >
          <div className="d-flex">
            <div className="toast-body">Copied to clipboard!</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonFormatter;
