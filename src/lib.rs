use tauri::command;
use std::process::Command;

#[command]
fn get_bssid() -> Result<String, String> {
    let output = Command::new("/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport")
        .arg("-I")
        .output()
        .map_err(|e| format!("コマンド実行エラー: {}", e))?;

    if !output.status.success() {
        return Err("airportコマンドが失敗しました。".into());
    }

    Ok(String::from_utf8_lossy(&output.stdout).to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_bssid])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
