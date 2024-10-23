import { invoke } from "@tauri-apps/api/core";
import NotificationRepository from "../repositories/notification.repository";

export default class NotificationService {
    #repository: NotificationRepository = new NotificationRepository();
    async getLatest() {
        return await this.#repository.getLatest();
    }

    async getLatestNotificationsCount() {
        return await this.#repository.getLatestNotificationsCount();
    }

    display(message: string, redirect?: string) {
        if (!redirect) {
            invoke("notify", {
                message,
            })
            return
        }
        invoke("notify", {
            message,
            redirect
        })

    }
}