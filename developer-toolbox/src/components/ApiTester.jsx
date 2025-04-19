import React, { useState } from "react";
import axios from "axios";

const ApiTester = () => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState("");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleRequest = async () => {
    try {
      setError(null);
      setResponse(null);

      const config = {
        method: method,
        url: "https://us-central1-your-project-id.cloudfunctions.net/apiTest", // This will be the URL of your Cloud Function
        headers: headers ? JSON.parse(headers) : {},
        data: body ? JSON.parse(body) : {},
      };

      const res = await axios(config);
      setResponse(res.data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>REST API Tester</h2>
      <div>
        <label>URL:</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter API URL"
        />
      </div>
      <div>
        <label>Method:</label>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>
      <div>
        <label>Headers (JSON format):</label>
        <textarea
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          placeholder='{"Content-Type": "application/json"}'
        />
      </div>
      <div>
        <label>Body (JSON format):</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder='{"key": "value"}'
        />
      </div>
      <button onClick={handleRequest}>Send Request</button>

      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      {response && (
        <div>
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ApiTester;