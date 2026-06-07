import https from "https";

/**
 * Sends a self-ping to the server to prevent it from sleeping on Render.
 * @param {string} url - The URL to ping.
 * @param {number} interval - The interval in minutes.
 */
const keepAlive = (url, interval = 20) => {
  if (!url) {
    console.warn("⚠️ Keep-alive: No URL provided. Self-pinging disabled.");
    return;
  }

  console.log(`🚀 Keep-alive: Self-pinging initialized for ${url} every ${interval} minutes.`);

  setInterval(() => {
    https
      .get(url, (res) => {
        console.log(`📡 Keep-alive: Ping sent to ${url}. Status Code: ${res.statusCode}`);
      })
      .on("error", (err) => {
        console.error(`❌ Keep-alive: Error pinging ${url}:`, err.message);
      });
  }, interval * 60 * 1000);
};

export default keepAlive;
