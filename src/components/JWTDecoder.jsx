import React, { useState } from "react";

const decodeBase64Url = (str) => { try { const base64 = str.replace(/-/g, "+").replace(/_/g, "/"); const json = atob(base64); return JSON.stringify(JSON.parse(json), null, 2); } catch { return null; } };

const copyToClipboard = (text) => { navigator.clipboard.writeText(text).then(() => { alert("Copied to clipboard!"); }); };

const JwtDecoder = () => { const [token, setToken] = useState(""); const [header, setHeader] = useState(""); const [payload, setPayload] = useState(""); const [signature, setSignature] = useState(""); const [error, setError] = useState(""); const [expired, setExpired] = useState(false);

const handleDecode = (value) => { setToken(value); setError(""); setExpired(false); setHeader(""); setPayload(""); setSignature("");

if (!value) return;

const parts = value.trim().split(".");
if (parts.length !== 3) {
  setError("Invalid JWT format. Expected 3 parts separated by dots.");
  return;
}

const [headerPart, payloadPart, sig] = parts;
const decodedHeader = decodeBase64Url(headerPart);
const decodedPayload = decodeBase64Url(payloadPart);

if (!decodedHeader || !decodedPayload) {
  setError("Could not decode Base64 content.");
  return;
}

setHeader(decodedHeader);
setPayload(decodedPayload);
setSignature(sig);

try {
  const payloadObj = JSON.parse(atob(payloadPart.replace(/-/g, "+").replace(/_/g, "/")));
  if (payloadObj.exp) {
    const currentTime = Math.floor(Date.now() / 1000);
    if (payloadObj.exp < currentTime) {
      setExpired(true);
    }
  }
} catch (e) {
  setError("Invalid payload structure.");
}

};

return ( <div className="container mt-5"> <h2 className="mb-3">🔐 JWT Decoder</h2> <textarea className="form-control mb-3" placeholder="Paste JWT here..." rows={4} value={token} onChange={(e) => handleDecode(e.target.value)} /> {error && <div className="alert alert-danger">{error}</div>}

  {header && (
    <div className="mb-3">
      <h5 className="d-flex align-items-center justify-content-between">
        Header
        <button onClick={() => copyToClipboard(header)} className="btn btn-sm btn-outline-secondary">Copy</button>
      </h5>
      <pre className="bg-light p-2 rounded">{header}</pre>
    </div>
  )}

  {payload && (
    <div className="mb-3">
      <h5 className="d-flex align-items-center justify-content-between">
        Payload {expired && <span className="badge bg-danger">Expired</span>}
        <button onClick={() => copyToClipboard(payload)} className="btn btn-sm btn-outline-secondary">Copy</button>
      </h5>
      <pre className="bg-light p-2 rounded">{payload}</pre>
    </div>
  )}

  {signature && (
    <div className="mb-3">
      <h5 className="d-flex align-items-center justify-content-between">
        Signature
        <button onClick={() => copyToClipboard(signature)} className="btn btn-sm btn-outline-secondary">Copy</button>
      </h5>
      <pre className="bg-light p-2 rounded">{signature}</pre>
    </div>
  )}
</div>

); };

export default JwtDecoder;