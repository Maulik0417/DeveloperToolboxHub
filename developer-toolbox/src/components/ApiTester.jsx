// src/components/ApiTester.jsx
import React, { useState } from "react";
import axios from "axios";

const ApiTester = () => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState("");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendRequest = async () => {
    try {
      setLoading(true);
      setError("");
      setResponse(null);

      const config = {
        method,
        url,
        headers: headers ? JSON.parse(headers) : {},
        data: ["POST", "PUT", "PATCH"].includes(method) ? JSON.parse(body || "{}") : undefined,
      };

      const res = await axios(config);
      setResponse(res);
    } catch (err) {
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
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
        <label>Headers (JSON):</label>
        <textarea
          rows={3}
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          placeholder='{"Authorization": "Bearer token"}'
          style={{ width: "100%" }}
        />
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
          <code>{JSON.stringify(response.data, null, 2)}</code>
        </div>
      )}
    </div>
  );
};

export default ApiTester;