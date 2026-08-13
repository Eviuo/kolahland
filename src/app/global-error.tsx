"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fa" dir="rtl">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Tahoma, sans-serif",
          backgroundColor: "#F7F6F2",
          color: "#0E0F0D",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 420 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#A9863D", letterSpacing: "0.05em" }}>خطای غیرمنتظره</p>
          <h1 style={{ marginTop: 8, fontSize: 26, fontWeight: 800 }}>کلاه‌لند موقتاً در دسترس نیست</h1>
          <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.9, color: "#8C8879" }}>
            مشکلی در بارگذاری سایت پیش آمد. تیم فنی ما در حال بررسی است. لطفاً چند لحظه دیگر دوباره تلاش کنید.
          </p>
          <button
            onClick={() => reset()}
            style={{
              marginTop: 24,
              backgroundColor: "#0E0F0D",
              color: "#F7F6F2",
              border: "none",
              borderRadius: 999,
              padding: "12px 28px",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            تلاش مجدد
          </button>
        </div>
      </body>
    </html>
  );
}
