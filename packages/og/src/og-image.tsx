import { logoDataUri } from "./logo";

export interface OgImageProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function OgImage({ eyebrow, title, description }: OgImageProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "rgb(10,10,10)",
        overflow: "hidden",
        position: "relative",
        fontFamily: "Geist",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -120,
          top: 40,
          width: 760,
          height: 760,
          background: "radial-gradient(circle, rgba(245,166,35,0.16) 0%, transparent 62%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 320,
          background: "linear-gradient(to left, rgb(10,10,10) 0%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 160,
          background: "linear-gradient(to bottom, rgb(10,10,10) 0%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 160,
          background: "linear-gradient(to top, rgb(10,10,10) 0%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 620,
          background:
            "linear-gradient(to right, rgb(10,10,10) 55%, rgba(10,10,10,0.7) 78%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          padding: "80px 96px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src={logoDataUri()} alt="mangowm" style={{ width: 44, height: 44 }} />
          <span
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "rgba(255,255,255,0.72)",
            }}
          >
            mangowm
          </span>
        </div>
        <div
          style={{
            marginTop: "auto",
            marginBottom: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 0,
            maxWidth: 760,
          }}
        >
          {eyebrow ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div
                style={{
                  width: 3,
                  height: 18,
                  background: "#F5A623",
                  borderRadius: 2,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  color: "rgba(255,255,255,0.62)",
                  textTransform: "uppercase",
                }}
              >
                {eyebrow}
              </span>
            </div>
          ) : null}
          <p
            style={{
              fontWeight: 800,
              fontSize: 80,
              letterSpacing: "-0.04em",
              margin: 0,
              lineHeight: 1.1,
              color: "#fff",
              lineClamp: 2,
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </p>
          {description ? (
            <p
              style={{
                fontSize: 28,
                color: "rgba(255,255,255,0.58)",
                letterSpacing: "-0.02em",
                margin: 0,
                marginTop: 20,
                fontWeight: 400,
                lineClamp: 2,
                textOverflow: "ellipsis",
              }}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
