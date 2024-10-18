// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{api::process::Command, AppHandle, Manager, Monitor, Window, WindowBuilder, WindowUrl};

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
async fn open_window_on_secondary_monitor(app: AppHandle, path: String) -> Result<(), String> {
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
        WindowUrl::App(format!("index.html#{}", path).into()), // URL or path to your HTML content
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
async fn open_movie_window(app: AppHandle, relative_path: String) -> Result<(), String> {
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

    // URL encode the path to safely include it as a query parameter
    let encoded_path = &relative_path;

    // Create a new fullscreen window on the secondary monitor with the /movie route and path query parameter
    WindowBuilder::new(
        &app,
        "secondary_movie_window", // Unique label for the new window
        WindowUrl::App(format!("index.html#/movie?path={}", encoded_path).into()), // Navigate to /movie with path
    )
    .title("Fullscreen Movie Window") // Optional: Set window title
    .position(position.x as f64, position.y as f64) // Position on the secondary monitor
    .inner_size(size.width as f64, size.height as f64) // Size matching the monitor
    .resizable(false) // Disable window resizing
    .decorations(false) // Hide window decorations (title bar, etc.)
    .build()
    .map_err(|e| format!("Failed to create movie window: {}", e))?;

    println!("Movie window successfully created on the secondary monitor.");

    Ok(())
}

#[tauri::command]
fn get_tauri_asset_path(
    app_handle: tauri::AppHandle,
    relative_path: String,
) -> Result<String, String> {
    // Get the resource directory
    let resource_path =
        tauri::api::path::resource_dir(&app_handle.package_info(), &app_handle.env())
            .ok_or_else(|| "Failed to get resource directory".to_string())?;

    // Construct the full path to the asset
    let asset_path = resource_path.join("assets").join(relative_path);

    Ok(asset_path.to_string_lossy().to_string())
}

#[tauri::command]
fn start_stellarium() -> Result<(), String> {
    println!("Starting Stellarium...");

    Command::new("resources/Stellarium/stellarium-x86_64-pc-windows-msvc.exe")
        .spawn()
        .expect("Failed to start Stellarium");

    Ok(())
}

#[tauri::command]
fn start_open_space() -> Result<(), String> {
    println!("Starting OpenSpace...");

    Command::new("resources/OpenSpace/bin/OpenSpace.exe")
        .spawn()
        .expect("Failed to start OpenSpace");

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let main_window = app.get_window("main").unwrap();

            // Perform initialization asynchronously
            tauri::async_runtime::spawn(async move {
                // Simulate initialization (replace this with your actual initialization code)
                println!("Initializing...");
                std::thread::sleep(std::time::Duration::from_secs(2)); // Simulate a delay
                println!("Done initializing.");

                // After initialization, load 'index.html' in the main window
                main_window
                    .eval("window.location.replace('index.html');")
                    .unwrap();
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            open_window_on_secondary_monitor,
            get_tauri_asset_path,
            open_movie_window,
            start_stellarium,
            start_open_space,
        ])
        .run(tauri::generate_context!())
        .expect("failed to run app");
}
