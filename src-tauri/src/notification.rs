pub mod notification {
    use serde::{Deserialize, Serialize};
    use std::error::Error;

    #[derive(Serialize, Deserialize, Debug)]
    struct Notification {
        created_at: String,
        id: String,
        image_url: String,
        link: String,
        staff_id: String,
        title: String,
    }

    #[derive(Serialize, Deserialize, Debug)]
    struct GetLatestResultDto {
        status: u16,
        data: GetLatestResultDtoData,
    }

    #[derive(Serialize, Deserialize, Debug)]
    struct GetCountResultDto {
        status: u16,
        data: GetCountResultDtoData,
    }

    #[derive(Serialize, Deserialize, Debug)]
    struct GetCountResultDtoData {
        notify_count: GetCountResultDtoDataNotifyCount,
    }
    #[derive(Serialize, Deserialize, Debug)]
    struct GetCountResultDtoDataNotifyCount {
        notify_count: i8,
    }

    #[derive(Serialize, Deserialize, Debug)]
    struct GetLatestResultDtoData {
        notify: Vec<Notification>,
    }

    pub async fn get_latest(token: &str) -> Result<String, Box<dyn Error>> {
        let client = reqwest::Client::new();

        let response = client
            .get("https://smart-office.uz/services/platon-core/api/v1/notification?type=2")
            .bearer_auth(token)
            .send()
            .await?;

        match response.error_for_status() {
            Ok(response) => {
                let response_to_json = response.json::<GetLatestResultDto>().await?;
                Ok(serde_json::to_string(&response_to_json)?)
            }
            Err(error) => {
                println!(
                    "Error occured when checked the error_for_status() inside the get_latest function: {:?}",
                    error
                );
                Err("Something went wrong!".into())
            }
        }
    }

    pub async fn get_count(token: &str) -> Result<String, Box<dyn Error>> {
        let client = reqwest::Client::new();

        let response = client
            .get("https://smart-office.uz/services/platon-core/api/v1/notification?type=1")
            .bearer_auth(token)
            .send()
            .await?;

        match response.error_for_status() {
            Ok(response) => {
                let response_to_json = response.json::<GetCountResultDto>().await?;
                Ok(serde_json::to_string(&response_to_json)?)
            }
            Err(error) => {
                println!(
                    "Error occured when checked the error_for_status() inside the get_count function: {:?}",
                    error
                );
                Err("Something went wrong!".into())
            }
        }
    }
}
