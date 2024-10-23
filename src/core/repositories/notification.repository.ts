import { useSessionStore } from "@/store/session";
import { invoke } from "@tauri-apps/api/core";
import type { Notification } from "../entities/notification.entity";

export default class NotificationRepository {
    async getLatest(): Promise<Notification[]> {
        const { accessToken } = useSessionStore.getState()
        const response = await invoke("get_latest_notifications", {
            token: accessToken
        }) as string;
        const notifications = JSON.parse(response) as {
            data: {
                notify: {
                    created_at: string;
                    id: string;
                    image_url: string;
                    link: string;
                    staff_id: string;
                    title: string;
                    type: string;
                }[]
            }
        };

        console.log({ response, notifications })

        return notifications?.data?.notify?.map(notification => ({
            id: notification.id,
            date: notification.created_at,
            link: notification.link,
            title: notification.title
        }))
    }
    async getLatestNotificationsCount(): Promise<number> {
        const { accessToken } = useSessionStore.getState()
        const response = await invoke("get_latest_notifications_count", {
            token: accessToken
        }) as string;

        const count = JSON.parse(response) as {
            data: {
                notify_count: {
                    notify_count: number;
                }
            }
        }
        console.log(count)
        return count.data.notify_count.notify_count
    }
}