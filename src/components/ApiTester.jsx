import React, { useState } from "react";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const parseHeadersArrayToObject = (headersArray) => {
  const headers = {};
  headersArray.forEach(({ key, value }) => {
    if (key.trim()) headers[key.trim()] = value;
  });
  return headers;
};

const ApiTester = () => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [body, setBody] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("apiRequestHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const copyToClipboard = () => {
    if (response?.data) {
      navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
    }
  };

  const generateCurlCommand = () => {
    let curl = `curl -X ${method}`;
    headers.forEach(({ key, value }) => {
      if (key && value) curl += ` -H "${key}: ${value}"`;
    });
    if (["POST", "PUT", "PATCH"].includes(method) && body) {
      try {
        const parsedBody = JSON.stringify(JSON.parse(body));
        curl += ` -d '${parsedBody}'`;
      } catch {}
    }
    curl += ` "${url}"`;
    return curl;
  };

  const exportRequests = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "api_requests.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importRequests = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          const valid = imported.filter(
            (req) => req.url && req.url.startsWith("http")
          );
          const updated = [...history, ...valid];
          setHistory(updated);
          localStorage.setItem("apiRequestHistory", JSON.stringify(updated));
          alert("Requests imported successfully!");
        }
      } catch {
        alert("Invalid file format");
      }
    };
    reader.readAsText(file);
  };

  const sendRequest = async () => {
    if (!url || !url.startsWith("http")) {
      alert("Please enter a valid URL (starting with http or https)");
      return;
    }
    const start = performance.now();
    try {
      setLoading(true);
      setError("");
      setResponse(null);

      const config = {
        method,
        url,
        headers: parseHeadersArrayToObject(headers),
        data: ["POST", "PUT", "PATCH"].includes(method)
          ? JSON.parse(body || "{}")
          : undefined,
      };

      const res = await axios(config);
      const duration = performance.now() - start;
      const sizeInBytes = JSON.stringify(res.data).length;

      setResponse({
        data: res.data,
        status: res.status,
        duration: Math.round(duration),
        size: sizeInBytes,
      });
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data || err.message || "Request failed";
      setError(`Status ${status || "Unknown"}: ${JSON.stringify(message)}`);
    } finally {
      setLoading(false);
    }

    const newHistory = [
      { url, method, headers: parseHeadersArrayToObject(headers), body },
      ...history,
    ].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem("apiRequestHistory", JSON.stringify(newHistory));
  };

  const updateHeader = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const addHeaderRow = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">🔧 REST API Tester</h2>

      <div className="mb-3">
        <label className="form-label">📤 Import Requests:</label>
        <input
          className="form-control"
          type="file"
          accept=".json"
          onChange={importRequests}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">URL:</label>
        <input
          className="form-control"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/endpoint"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Method:</label>
        <select
          className="form-select"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Headers:</label>
        {headers.map((h, i) => (
          <div className="row g-2 mb-2" key={i}>
            <div className="col">
              <input
                className="form-control"
                placeholder="Key"
                value={h.key}
                onChange={(e) => updateHeader(i, "key", e.target.value)}
              />
            </div>
            <div className="col">
              <input
                className="form-control"
                placeholder="Value"
                value={h.value}
                onChange={(e) => updateHeader(i, "value", e.target.value)}
              />
            </div>
          </div>
        ))}
        <button
          className="btn btn-outline-secondary btn-sm"
          type="button"
          onClick={addHeaderRow}
        >
          + Add Header
        </button>
      </div>

      {(method === "POST" || method === "PUT" || method === "PATCH") && (
        <div className="mb-3">
          <label className="form-label">Body (JSON):</label>
          <textarea
            className="form-control"
            rows="5"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{"key": "value"}'
          />
        </div>
      )}

      <button
        className="btn btn-primary mb-4"
        onClick={sendRequest}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Request"}
      </button>

      {error && <div className="alert alert-danger">❌ Error: {error}</div>}

      {response && (
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">✅ Response ({response.status})</h5>
            <p>⏱ Time: {response.duration} ms</p>
            <p>📦 Size: {response.size} bytes</p>
            <div className="mb-2">
              <button
                className="btn btn-outline-secondary btn-sm me-2"
                onClick={copyToClipboard}
              >
                📋 Copy Response
              </button>
              <button
                className="btn btn-outline-secondary btn-sm me-2"
                onClick={() =>
                  navigator.clipboard.writeText(generateCurlCommand())
                }
              >
                📋 Copy curl
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={exportRequests}
              >
                ⬇️ Export Requests
              </button>
            </div>
            <SyntaxHighlighter language="json" style={oneDark}>
              {JSON.stringify(response.data, null, 2)}
            </SyntaxHighlighter>
          </div>
        </div>
      )}

      <div className="mt-4">
        <h4>📜 Request History</h4>
        <ul className="list-group">
          {history.map((h, i) => (
            <li key={i} className="list-group-item">
              <button
                className="btn btn-link"
                onClick={() => {
                  setUrl(h.url);
                  setMethod(h.method);
                  setHeaders(
                    Object.entries(h.headers || {}).map(([key, value]) => ({
                      key,
                      value,
                    }))
                  );
                  setBody(h.body || "");
                }}
              >
                {h.method} {h.url}
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => {
            setHistory([]); // Clear history from state
            localStorage.removeItem("apiRequestHistory"); // Remove from localStorage
          }}
          style={{
            marginTop: "1rem",
            backgroundColor: "#f44336",
            color: "white",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Clear History
        </button>
      </div>
    </div>
  );
};

export default ApiTester;
