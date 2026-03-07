import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: 36,
          background:
            "linear-gradient(180deg, rgb(20,35,28), rgb(31,122,107) 55%, rgb(241,111,66))",
          color: "white",
          borderRadius: 96,
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 38, opacity: 0.76, letterSpacing: 4 }}>HABIT</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 104,
              height: 104,
              borderRadius: 999,
              background: "rgba(255,255,255,0.16)",
              fontSize: 46,
            }}
          >
            86
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -4 }}>LEAGUE</div>
          <div style={{ display: "flex", gap: 14 }}>
            {[82, 61, 94].map((height, index) => (
              <div
                key={index}
                style={{
                  width: 92,
                  height,
                  borderRadius: 28,
                  background: index === 2 ? "rgb(243,182,63)" : "rgba(255,255,255,0.82)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
