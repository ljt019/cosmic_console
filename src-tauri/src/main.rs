// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{AppHandle, Asset, Manager, Monitor, Window, WindowBuilder, WindowUrl};

fn get_primary_monitor(window: Window) -> Result<Monitor, String> {
    // Retrieve available monitors
    let primary_monitor = window.primary_monitor().expect("No primary monitor found.");

    match primary_monitor {
        Some(primary_monitor) => {
            // Log the primary monitor found
            println!("Primary Monitor: {:?}", primary_monitor);
            Ok(primary_monitor)
        }
        None => {
            println!("Primary monitor not found.");
            Err("Primary monitor not found.".to_string())
        }
    }
}

fn get_secondary_monitor(window: Window, primary_monitor: Monitor) -> Result<Monitor, String> {
    let monitors = window.available_monitors().map_err(|e| e.to_string())?;

    // If monitors != 2 then error
    if monitors.len() != 2 {
        println!("Number of monitors detected: {}", monitors.len());
        return Err("Number of monitors detected is not equal to 2.".to_string());
    }

    // Find the secondary monitor (the monitor that isn't the primary monitor)
    let secondary_monitor = monitors
        .iter()
        .find(|&monitor| monitor.name() != primary_monitor.name());

    match secondary_monitor {
        Some(secondary_monitor) => {
            // Log the secondary monitor found
            println!("Secondary Monitor: {:?}", secondary_monitor);
            Ok(secondary_monitor.clone())
        }
        None => {
            println!("Secondary monitor not found.");
            Err("Secondary monitor not found.".to_string())
        }
    }
}

// Tauri command to open a fullscreen window on the second monitor
#[tauri::command]
async fn open_window_on_secondary_monitor(app: AppHandle) -> Result<(), String> {
    // Retrieve the primary window
    let primary_window = app
        .get_window("main")
        .ok_or("Primary window with label 'main' not found.")?;

    // Get the primary monitor
    let primary_monitor = get_primary_monitor(primary_window.clone())?;

    // Get the secondary monitor
    let secondary_monitor = get_secondary_monitor(primary_window.clone(), primary_monitor)?;

    // Retrieve the position and size of the secondary monitor
    let position = secondary_monitor.position();
    let size = secondary_monitor.size();

    // Create a new fullscreen window on the secondary monitor
    WindowBuilder::new(
        &app,
        "secondary_fullscreen_window", // Unique label for the new window
        WindowUrl::App("index.html#/movie".into()), // URL or path to your HTML content
    )
    .title("Fullscreen Secondary Window") // Optional: Set window title
    .position(position.x as f64, position.y as f64) // Position on the secondary monitor
    .inner_size(size.width as f64, size.height as f64) // Size matching the monitor
    .resizable(false) // Disable window resizing
    .decorations(false) // Hide window decorations (title bar, etc.)
    .build()
    .map_err(|e| format!("Failed to create fullscreen window: {}", e))?;

    println!("Fullscreen window successfully created on the secondary monitor.");

    Ok(())
}

#[tauri::command]
fn get_tauri_asset_path(
    app_handle: tauri::AppHandle,
    relative_path: String,
) -> Result<String, String> {
    // Get the file path using the app's asset_resolver
    let asset_path = app_handle.asset_resolver().get(relative_path);

    match asset_path {
        Some(asset_path) => {
            // Convert the asset path to a string
            let asset_path_str = asset_path.to_string_lossy().into_owned();
            Ok(asset_path_str)
        }
        None => {
            println!("Asset path not found.");
            Err("Asset path not found.".to_string())
        }
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            open_window_on_secondary_monitor,
            get_tauri_asset_path
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
