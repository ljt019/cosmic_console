import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/tauri";

export function Index() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Button onClick={() => invoke("open_window_on_secondary_monitor")}>
        Click me!
      </Button>
      Open New Window on second monitor
    </div>
  );
}
