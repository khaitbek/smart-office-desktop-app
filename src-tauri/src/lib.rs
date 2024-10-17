mod auth;
use std::{
    io::{read_to_string, Read},
    path,
};

use auth::auth::sign_in;
use tauri::{
    menu::{Menu, MenuItem},
    tray::{self, TrayIconBuilder},
    AppHandle,
};
use tauri_plugin_notification::NotificationExt;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn notify(app: AppHandle, message: &str) -> () {
    app.notification()
        .builder()
        .title("Smart Office")
        .body(message.to_string())
        .show()
        .unwrap();
}

#[tauri::command]
async fn authenticate(username: &str, password: &str) -> Result<String, String> {
    let response = sign_in(username.to_string(), password.to_string()).await;
    match response {
        Ok(response) => Ok(response),
        Err(err) => Err(err.to_string()),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_websocket::init())
        .setup(|app| {
            // at least 1 menu item is required
            let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&quit_i])?;
            let tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .menu_on_left_click(true)
                .build(app)?;
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![authenticate])
        .invoke_handler(tauri::generate_handler![notify])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
