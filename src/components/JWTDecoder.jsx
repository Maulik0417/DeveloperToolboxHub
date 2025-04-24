import React, { useState } from "react";

const JwtDecoder = () => {
  const [jwt, setJwt] = useState("");
  const [decoded, setDecoded] = useState(null);
  const [error, setError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [expectedClaims, setExpectedClaims] = useState({
    iss: "",
    aud: "",
  });

  const base64UrlDecode = (str) => {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) {
      base64 += "=".repeat(4 - pad);
    }
    return atob(base64);
  };

  const decodeJwt = (token) => {
    const parts = token.split(".");
    if (parts.length !== 3) {
      setError("Invalid JWT format. It must have 3 parts.");
      return;
    }

    try {
      const [header, payload, signature] = parts;
      const decodedHeader = JSON.parse(base64UrlDecode(header));
      const decodedPayload = JSON.parse(base64UrlDecode(payload));

      const expirationDate = decodedPayload.exp
        ? new Date(decodedPayload.exp * 1000).toLocaleString()
        : null;

      setDecoded({
        header: decodedHeader,
        payload: decodedPayload,
        expirationDate,
        signature,
      });
      setError("");
    } catch (err) {
      setError("Failed to decode JWT. Please check the token format.");
    }
  };

  const handleChange = (e) => {
    setJwt(e.target.value);
  };

  const handleDecode = () => {
    decodeJwt(jwt);
  };

  const handleClaimValidation = (claim, value) => {
    if (decoded) {
      return decoded.payload[claim] === value;
    }
    return false;
  };

  const handleCopy = (data) => {
    navigator.clipboard.writeText(data).then(() => {
      setCopyMessage("Copied to clipboard!");
      setTimeout(() => setCopyMessage(""), 2000);
    });
  };

  const handleCompact = () => {
    if (decoded) {
      const header = btoa(JSON.stringify(decoded.header))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
      const payload = btoa(JSON.stringify(decoded.payload))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
      return `${header}.${payload}.${decoded.signature}`;
    }
    return "";
  };

  return (
    <div className="container mt-5">
      <h2>🔑 JWT Decoder</h2>
      <div className="form-group">
        <label htmlFor="jwt-input">Enter JWT Token:</label>
        <input
          type="text"
          className="form-control"
          id="jwt-input"
          value={jwt}
          onChange={handleChange}
          placeholder="Paste your JWT here"
        />
        <button onClick={handleDecode} className="btn btn-primary mt-3">
          Decode JWT
        </button>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {decoded && (
        <div className="mt-4">
          <h4>Decoded JWT:</h4>
          <div>
            <h5>Header:</h5>
            <pre>{JSON.stringify(decoded.header, null, 2)}</pre>
            <button
              className="btn btn-secondary"
              onClick={() =>
                handleCopy(JSON.stringify(decoded.header, null, 2))
              }
            >
              Copy Header
            </button>
          </div>

          <div className="mt-4">
            <h5>Payload:</h5>
            <pre>{JSON.stringify(decoded.payload, null, 2)}</pre>
            <button
              className="btn btn-secondary"
              onClick={() =>
                handleCopy(JSON.stringify(decoded.payload, null, 2))
              }
            >
              Copy Payload
            </button>
          </div>

          <div className="mt-4">
            <h5>Expiration:</h5>
            {decoded.expirationDate ? (
              <p>{`Expires on: ${decoded.expirationDate}`}</p>
            ) : (
              <p>No expiration date available.</p>
            )}
          </div>

          {copyMessage && (
            <div className="alert alert-success mt-3">{copyMessage}</div>
          )}

          <div className="mt-4">
            <h5>Compact Token:</h5>
            <pre>{handleCompact()}</pre>
          </div>

          <div className="mt-4">
            <h5>Validate Claims:</h5>
            <div>
              <label>Expected Issuer (iss):</label>
              <input
                type="text"
                className="form-control"
                value={expectedClaims.iss}
                onChange={(e) =>
                  setExpectedClaims({ ...expectedClaims, iss: e.target.value })
                }
                placeholder="Issuer (iss)"
              />
              {handleClaimValidation("iss", expectedClaims.iss) ? (
                <p className="text-success">Issuer matches</p>
              ) : (
                <p className="text-danger">Issuer does not match</p>
              )}
            </div>

            <div className="mt-3">
              <label>Expected Audience (aud):</label>
              <input
                type="text"
                className="form-control"
                value={expectedClaims.aud}
                onChange={(e) =>
                  setExpectedClaims({ ...expectedClaims, aud: e.target.value })
                }
                placeholder="Audience (aud)"
              />
              {handleClaimValidation("aud", expectedClaims.aud) ? (
                <p className="text-success">Audience matches</p>
              ) : (
                <p className="text-danger">Audience does not match</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JwtDecoder;
