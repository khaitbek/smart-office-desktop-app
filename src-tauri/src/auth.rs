pub mod auth {
    use std::error::Error;

    use serde::{Deserialize, Serialize};
    use tauri::http::{HeaderMap, HeaderValue};

    #[derive(Serialize, Deserialize, Debug)]
    struct SignInDto {
        status: String,
        timestamp: i64,
        data: SignInDtoData,
    }

    #[derive(Serialize, Deserialize, Debug)]
    struct SignInDtoData {
        access_token: String,
        refresh_token: String,
        expires_in: i32,
        refresh_expires_in: i32,
        token_type: String,
    }

    #[derive(Serialize, Deserialize, Debug)]
    pub struct SignInResult {
        status_code: Option<u16>,
        access_token: String,
        refresh_token: String,
    }

    pub async fn sign_in(username: String, password: String) -> Result<String, Box<dyn Error>> {
        let client = reqwest::Client::new();
        let params = [("username", username), ("password", password)];

        let mut headers = HeaderMap::new();
        headers.append("device-id", HeaderValue::from_str("Desktop")?);

        let response = client
            .post("https://smart-office.uz/services/platon-auth/api/login")
            .form(&params)
            .headers(headers)
            .send()
            .await?;
        match response.error_for_status() {
            Ok(res) => {
                let response_to_json = res.json::<SignInDto>().await?;
                let out = SignInResult {
                    access_token: response_to_json.data.access_token,
                    refresh_token: response_to_json.data.refresh_token,
                    status_code: None,
                };
                return Ok(serde_json::to_string(&out)?);
            }
            Err(err) => {
                println!(
                    "Error occured when checked the error_for_status(): {:?}",
                    err
                );
                Err("Username or password is incorrect".into())
            }
        }
    }
}
