import { ImageResponse } from "next/og"

export const alt = "Benedict Frimpong Boateng, AI engineer and software developer in Accra"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/** The link preview: the site's opening line on its warm paper, with the road line and the route colour. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #f7ecdf 0%, #f4f3ef 45%, #e9efe9 100%)",
          color: "#1c1917",
          padding: "72px 88px",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", left: 64, top: 0, bottom: 0, width: 4, background: "#c2410c" }} />
        <div style={{ position: "absolute", left: 56, top: 92, width: 20, height: 20, borderRadius: 999, background: "#c2410c" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", paddingLeft: 32 }}>
          <div style={{ fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: "#57534e" }}>accra, ghana</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 124, fontWeight: 700, letterSpacing: -5, lineHeight: 1 }}>hi, i&apos;m benedict.</div>
            <div style={{ fontSize: 40, color: "#44403c", marginTop: 28 }}>ai engineer and software developer</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", fontSize: 28, color: "#57534e" }}>
            <span>work · projects · resume</span>
            <span style={{ marginLeft: "auto", fontSize: 44, fontWeight: 700, color: "#1c1917" }}>
              bfb<span style={{ color: "#c2410c" }}>.</span>
            </span>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
