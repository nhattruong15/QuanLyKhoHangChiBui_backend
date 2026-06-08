import https from "https";

/**
 * Gửi self-ping tới server để Render không bị sleep.
 * Chỉ gửi trong khung giờ 18:00 → 00:30 (giờ Việt Nam, UTC+7).
 * Interval: mỗi 15 phút.
 * @param {string} url - URL cần ping.
 */
const keepAlive = (url) => {
  if (!url) {
    console.warn("⚠️ Keep-alive: Không có URL. Đã tắt self-ping.");
    return;
  }

  const INTERVAL_MINUTES = 15;

  console.log(
    `🚀 Keep-alive: Khởi động. Sẽ ping ${url} mỗi ${INTERVAL_MINUTES} phút trong khung 18:00–00:30 (UTC+7).`
  );

  setInterval(() => {
    // Lấy giờ hiện tại theo UTC+7
    const now = new Date();
    const utc7Hour = (now.getUTCHours() + 7) % 24;
    const utc7Minute = now.getUTCMinutes();

    // Chuyển sang số phút trong ngày để so sánh dễ hơn
    const currentMinutes = utc7Hour * 60 + utc7Minute;
    const startMinutes = 18 * 60;       // 18:00 → 1080
    const endMinutes = 24 * 60 + 30;    // 00:30 hôm sau → 1470

    // Khung giờ: 18:00–23:59 (>= 1080) HOẶC 00:00–00:30 (<= 30)
    const isInWindow =
      currentMinutes >= startMinutes || currentMinutes <= 30;

    if (!isInWindow) {
      console.log(
        `⏭️  Keep-alive: Ngoài khung giờ (${String(utc7Hour).padStart(2, "0")}:${String(utc7Minute).padStart(2, "0")} UTC+7). Bỏ qua.`
      );
      return;
    }

    https
      .get(url, (res) => {
        console.log(
          `📡 Keep-alive: Ping thành công → ${url} [${res.statusCode}] lúc ${String(utc7Hour).padStart(2, "0")}:${String(utc7Minute).padStart(2, "0")} UTC+7`
        );
      })
      .on("error", (err) => {
        console.error(`❌ Keep-alive: Lỗi ping ${url}:`, err.message);
      });
  }, INTERVAL_MINUTES * 60 * 1000);
};

export default keepAlive;
