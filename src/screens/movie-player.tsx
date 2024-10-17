import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useLocation } from "react-router-dom";
import { walkInOff } from "@/api/lights/walkInOff";

export default function Movie() {
  return <Video />;
}

function Video() {
  const [videoSrc, setVideoSrc] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    // Parse query parameters
    const params = new URLSearchParams(location.search);
    const relativePath = params.get("path");

    if (!relativePath) {
      console.error("No video path specified.");
      return;
    }

    async function fetchVideoPath() {
      try {
        const path = await invoke<string>("get_tauri_asset_path", {
          relativePath,
        });

        console.log("Fetched video path:", path);

        // Normalize Windows paths by replacing backslashes with forward slashes
        const normalizedPath = path.replace(/\\/g, "/");

        // Use Tauri's convertFileSrc to create a safe URL
        const fileUrl = convertFileSrc(normalizedPath);

        console.log("Converted file URL:", fileUrl);

        setVideoSrc(fileUrl);
      } catch (error) {
        console.error("Error fetching video path:", error);
      }
    }

    fetchVideoPath();

    walkInOff();
  }, [location.search]);

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-black">
      {videoSrc ? (
        <video
          src={videoSrc}
          autoPlay
          controls
          style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
          onEnded={() => {
            console.log("Movie Ended");
            // Optionally, you can close the window or perform other actions here
          }}
        />
      ) : (
        <p className="text-white">Loading video...</p>
      )}
    </div>
  );
}
