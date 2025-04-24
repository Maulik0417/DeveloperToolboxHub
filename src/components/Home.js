import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">Developer Toolbox</h1>
        <p className="lead">
          Your all-in-one hub for developer utilities and debugging tools.
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">REST API Tester</h5>
              <p className="card-text text-muted">
                Test HTTP requests with custom headers, body data, and more.
              </p>
              <Link to="/api-tester" className="btn btn-primary mt-auto">
                Launch
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Regex Tester</h5>
              <p className="card-text text-muted">
                Test and validate regular expressions with ease.
              </p>
              <Link to="/regex-tester" className="btn btn-primary mt-auto">
                Launch
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">JWT Decoder</h5>
              <p className="card-text text-muted">
                Decode and inspect your JWTs, Explore headers, payloads, and
                more
              </p>
              <Link to="/jwt-decoder" className="btn btn-primary mt-auto">
                Launch
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">JSON Formatter</h5>
              <p className="card-text text-muted">
                A handy tool to format, minify, and verify JSON with real-time error checking.
              </p>
              <Link to="/json-formatter" className="btn btn-primary mt-auto">
                Launch
              </Link>
            </div>
          </div>
        </div>

        {/* Placeholder for future tools */}
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">More Tools Coming Soon</h5>
              <p className="card-text text-muted">
                New utilities will appear here as they’re built.
              </p>
              <button className="btn btn-outline-secondary mt-auto" disabled>
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
