import React, { useState, useEffect, useCallback } from "react";
import Ajv from "ajv";
import { JSONPath } from "jsonpath-plus";
import addFormats from "ajv-formats";

const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [formatted, setFormatted] = useState("");
  const [error, setError] = useState(null);
  const [pretty, setPretty] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [schema, setSchema] = useState("");
  const [validationError, setValidationError] = useState(null);
  const [jsonPathQuery, setJsonPathQuery] = useState("");
  const [jsonPathResult, setJsonPathResult] = useState([]);
  const [schemaValid, setSchemaValid] = useState(null);

  const handleFormat = useCallback(() => {
    const ajv = new Ajv();
    addFormats(ajv);
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

      // Validate schema if provided
      if (schema.trim()) {
        const validate = ajv.compile(JSON.parse(schema));
        const valid = validate(obj);
        if (!valid) {
          setValidationError(validate.errors);
          setSchemaValid(false); // Set invalid schema status
        } else {
          setValidationError(null);
          setSchemaValid(true); // Set valid schema status
        }
      } else {
        setValidationError(null);
        setSchemaValid(null); // Clear schema validation status if no schema is provided
      }
    } catch (e) {
      setError(`❌ Invalid JSON: ${e.message}`);
      setFormatted("");
      setSchemaValid(null); // Reset schema validity when JSON is invalid
    }
  }, [input, pretty, schema]);

  // Effect hook to revalidate when input or schema changes
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

  const handleJsonPathQuery = () => {
    if (formatted.trim()) {
      try {
        const obj = JSON.parse(formatted);
        const result = JSONPath({ path: jsonPathQuery, json: obj });
        setJsonPathResult(result);
      } catch (e) {
        setError(`❌ Invalid JSON for Path: ${e.message}`);
      }
    }
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

      <div className="mb-3">
        <label className="form-label">Enter JSON Schema:</label>
        <textarea
          className="form-control"
          rows={5}
          value={schema}
          onChange={(e) => setSchema(e.target.value)}
          placeholder="e.g., { 'type': 'object', 'properties': { 'name': { 'type': 'string' }, 'age': { 'type': 'number' } } }"
        ></textarea>
      </div>

      {validationError && (
        <div className="alert alert-danger">
          <h5>Schema Validation Errors:</h5>
          <pre>{JSON.stringify(validationError, null, 2)}</pre>
        </div>
      )}

      {/* Banner for schema validity */}
      {schemaValid === true && (
        <div className="alert alert-success">✅ JSON matches the schema!</div>
      )}
      {schemaValid === false && (
        <div className="alert alert-danger">
          ❌ JSON does not match the schema!
        </div>
      )}

      <div className="d-flex flex-wrap gap-2 mb-3">
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
          Export JSON
        </button>
        <label className="btn btn-outline-dark mb-0">
          Load JSON File
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

      {/* JSON Path Explorer */}
      <div className="mb-3">
        <label className="form-label">Enter JSONPath Query:</label>
        <input
          type="text"
          className="form-control"
          value={jsonPathQuery}
          onChange={(e) => setJsonPathQuery(e.target.value)}
          placeholder="e.g., $.name"
        />
        <button className="btn btn-info mt-2" onClick={handleJsonPathQuery}>
          Explore JSON Path
        </button>
      </div>

      {jsonPathResult.length > 0 && (
        <div className="mt-4">
          <h5>JSONPath Results:</h5>
          <pre>{JSON.stringify(jsonPathResult, null, 2)}</pre>
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
