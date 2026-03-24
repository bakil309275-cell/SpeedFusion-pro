
import React from "react";

export default function Home() {
  return (
    <div style={{ backgroundColor: "#001f3f", color: "white", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#0070f3" }}>SpeedFusion Pro</h1>
      <p>ÌÇÑí ÊåíÆÉ ãäÕÉ ŞíÇÓ ÇáÓÑÚÉ...</p>
      <div style={{ border: "2px solid #0070f3", padding: "20px", borderRadius: "10px" }}>
        <p>ÇáÍÇáÉ: ãÊÕá ÚÈÑ Toshiba</p>
        <button style={{ backgroundColor: "#0070f3", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }}>
          ÇÈÏÃ İÍÕ ÇáÓÑÚÉ
        </button>
      </div>
    </div>
  );
}
