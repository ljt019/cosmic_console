import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";

export default function Stellarium() {
  const [showRemoteControl, setShowRemoteControl] = useState<boolean>(false);

  function startStellarium() {
    invoke("start_stellarium");

    // Then navigate to the Stellarium remote control screen at localhost:8090 after 15 seconds
    setTimeout(() => {
      setShowRemoteControl(true);
    }, 15000);
  }

  return (
    <div className="flex items-center justify-center h-screen">
      {showRemoteControl ? (
        <StellariumRemoteControlWindow />
      ) : (
        <>
          <Button onClick={startStellarium}>Open Stellarium</Button>
        </>
      )}
    </div>
  );
}

function StellariumRemoteControlWindow() {
  return (
    <iframe
      src="http://localhost:8090"
      className="w-full h-full"
      title="Stellarium Remote Control"
    />
  );
}
