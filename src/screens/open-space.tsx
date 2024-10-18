import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";

export default function OpenSpace() {
  const [showRemoteControl, setShowRemoteControl] = useState<boolean>(false);

  function startOpenSpace() {
    invoke("start_open_space");

    // Then navigate to the Stellarium remote control screen at localhost:8090 after 15 seconds
    setTimeout(() => {
      setShowRemoteControl(true);
    }, 15000);
  }

  return (
    <div className="flex items-center justify-center h-screen">
      {showRemoteControl ? (
        <OpenSpaceRemoteControlWindow />
      ) : (
        <Button onClick={startOpenSpace}>Open OpenSpace</Button>
      )}
    </div>
  );
}

function OpenSpaceRemoteControlWindow() {
  return (
    <iframe
      src="http://localhost:8090"
      className="w-full h-full"
      title="OpenSpace Remote Control"
    />
  );
}
