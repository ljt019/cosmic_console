import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/tauri";

export default function Stellarium() {
  return (
    <div className="flex justify-center items-center h-full">
      <Button onClick={() => invoke("start_stellarium")}>
        Open Stellarium
      </Button>
    </div>
  );
}
