const http = require("http");
const https = require("https");

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const PORT = process.env.PORT || 3000;

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

function sendCors(res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

const server = http.createServer(function(req, res) {
  sendCors(res);

  // Preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", service: "kalai-pezhai-proxy" }));
    return;
  }

  // Only accept POST to /api/generate
  if (req.method !== "POST" || req.url !== "/api/generate") {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  if (!ANTHROPIC_API_KEY) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "API key not configured" }));
    return;
  }

  let body = "";
  req.on("data", function(chunk) { body += chunk.toString(); });
  req.on("end", function() {
    let payload;
    try {
      payload = JSON.parse(body);
    } catch(e) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid JSON" }));
      return;
    }

    const postData = JSON.stringify({
      model: payload.model || "claude-sonnet-4-20250514",
      max_tokens: Math.min(payload.max_tokens || 4000, 8000),
      system: payload.system || "",
      messages: payload.messages || []
    });

    const options = {
      hostname: "api.anthropic.com",
      port: 443,
      path: "/v1/messages",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Length": Buffer.byteLength(postData)
      }
    };

    const apiReq = https.request(options, function(apiRes) {
      let data = "";
      apiRes.on("data", function(chunk) { data += chunk; });
      apiRes.on("end", function() {
        res.writeHead(apiRes.statusCode, { "Content-Type": "application/json" });
        res.end(data);
      });
    });

    apiReq.on("error", function(e) {
      res.writeHead(502, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Upstream error: " + e.message }));
    });

    apiReq.write(postData);
    apiReq.end();
  });
});

server.listen(PORT, function() {
  console.log("Kalai Pezhai proxy running on port " + PORT);
});
