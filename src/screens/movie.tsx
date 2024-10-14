import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { convertFileSrc } from "@tauri-apps/api/tauri";

export default function Movie() {
  return <Video />;
}

function Video() {
  const [videoSrc, setVideoSrc] = useState("");

  useEffect(() => {
    async function fetchVideoPath() {
      try {
        const assetUrl = await invoke<string>("get_tauri_asset_path", {
          relativePath: "movies/Sols Thesunourlivingstar 4096X4096h265.mp4",
        });

        console.log("Asset URL:", assetUrl);
        setVideoSrc(assetUrl);
      } catch (error) {
        console.error("Error fetching video path:", error);
      }
    }

    fetchVideoPath();
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      {videoSrc ? (
        <video
          src={videoSrc}
          autoPlay
          controls
          style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
          onEnded={() => {
            console.log("Movie Ended");
          }}
        />
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  );
}
