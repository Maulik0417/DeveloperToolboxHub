const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 5000; // You can use any available port

app.use(cors());
app.use(express.json()); // To parse JSON bodies

// API Test endpoint
app.post("/apiTest", async (req, res) => {
  const { url, method, headers, body } = req.body;

  try {
    const config = {
      method: method || "GET",
      url: url,
      headers: headers || {},
      data: body || {},
    };

    const apiResponse = await axios(config);
    res.status(200).json(apiResponse.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});