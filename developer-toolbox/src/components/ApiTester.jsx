// src/components/ApiTester.jsx
import React, { useState } from "react";
import axios from "axios";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

  const sendRequest = async () => {
    const start = performance.now();
    try {
      setLoading(true);
      setError("");
      setResponse(null);

      const config = {
        method,
        url,
        headers: parseHeadersArrayToObject(headers),
        data: ["POST", "PUT", "PATCH"].includes(method) ? JSON.parse(body || "{}") : undefined,
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

 
    const newHistory = [{ url, method, headers: parseHeadersArrayToObject(headers), body }, ...history].slice(0, 10);
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
    <div style={{ padding: "1rem", maxWidth: "700px", margin: "0 auto" }}>
      <h2>REST API Tester</h2>

      <div>
        <label>URL:</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/endpoint"
          style={{ width: "100%" }}
        />
      </div>

      <div>
        <label>Method:</label>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div>
    <label>Headers:</label>
    {headers.map((h, i) => (
      <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.25rem" }}>
        <input
          type="text"
          placeholder="Key"
          value={h.key}
          onChange={(e) => updateHeader(i, "key", e.target.value)}
          style={{ flex: 1 }}
        />
        <input
          type="text"
          placeholder="Value"
          value={h.value}
          onChange={(e) => updateHeader(i, "value", e.target.value)}
          style={{ flex: 2 }}
        />
      </div>
    ))}
    <button type="button" onClick={addHeaderRow} style={{ marginTop: "0.25rem" }}>
      + Add Header
    </button>
  </div>

  <div style={{ marginTop: "1rem" }}>
  <h3>History</h3>
  <ul>
    {history.map((h, i) => (
      <li key={i}>
        <button
          onClick={() => {
            setUrl(h.url);
            setMethod(h.method);
            setHeaders(Object.entries(h.headers || {}).map(([key, value]) => ({ key, value })));
            setBody(h.body || "");
          }}
        >
          {h.method} {h.url}
        </button>
      </li>
    ))}
  </ul>
</div>


      {(method === "POST" || method === "PUT" || method === "PATCH") && (
        <div>
          <label>Body (JSON):</label>
          <textarea
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{"key": "value"}'
            style={{ width: "100%" }}
          />
        </div>
      )}

      <button onClick={sendRequest} disabled={loading} style={{ marginTop: "1rem" }}>
        {loading ? "Sending..." : "Send Request"}
      </button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {response && (
        <div style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>
          <h4>Response ({response.status}):</h4>
          <p>Time: {response.duration} ms</p>
          <p>Size: {response.size} bytes</p>
          <button onClick={copyToClipboard} style={{ marginBottom: "0.5rem" }}>
          📋 Copy Response
          </button>
          <SyntaxHighlighter language="json" style={oneDark}>
          {JSON.stringify(response.data, null, 2)}
          </SyntaxHighlighter>
        </div>

        
      )}
    </div>
  );
};

export default ApiTester;