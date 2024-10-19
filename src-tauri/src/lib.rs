mod auth;
use auth::auth::sign_in;
use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    AppHandle,
};
use tauri_plugin_notification::NotificationExt;

#[tauri::command]
fn notify(app: AppHandle, message: &str) -> () {
    print!("called notify with the message: {}", message);
    app.notification()
        .builder()
        .title("Smart Office")
        .body(message.to_string())
        .show()
        .unwrap_or_else(|err| {
            println!(
                "Error when tried to send a notification using the notify command! {:?}",
                err
            );
            panic!(
                "Error when tried to send a notification using the notify command! {:?}",
                err
            );
        });
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
        .plugin(
            tauri_plugin_log::Builder::new()
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::Stdout,
                ))
                .build(),
        )
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_websocket::init())
        .setup(|app| {
            // at least 1 menu item is required
            let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&quit_i])?;
            TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .menu_on_left_click(true)
                .build(app)?;
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![authenticate, notify])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
