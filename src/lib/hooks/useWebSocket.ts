import NotificationService from '@/core/services/notification.service';
import {
    isPermissionGranted,
    onAction,
    requestPermission,
    sendNotification
} from '@tauri-apps/plugin-notification';
import { Centrifuge } from "centrifuge";
import { useEffect, useState } from "react";

export const useWebSocket = (deps: {
    getUserStaffId: () => Promise<string>,
    refetchNotifications?: () => void;
}) => {
    const [data] = useState<any>(null);

    const connect = async () => {
        // establish a connection
        const centrifuge = new Centrifuge(import.meta.env.CENTRIFUGE_PATH as string, {
            token: import.meta.env.CENTRIFUGE_TOKEN
        });

        const notificationSubscriptionStaffId = await deps.getUserStaffId();
        const notificationSubscriptionPath = `smart-office-notification_${notificationSubscriptionStaffId}`
        const notificationSubscription = centrifuge.newSubscription(notificationSubscriptionPath);

        notificationSubscription.on("publication", async () => {
            const notificationService = new NotificationService();
            const notificationsCount = await notificationService.getLatestNotificationsCount();
            const notifications = await notificationService.getLatest();
            let permissionGranted = await isPermissionGranted();
            console.log(notificationsCount) 
            // If not we need to request it
            if (!permissionGranted) {
                const permission = await requestPermission();
                permissionGranted = permission === 'granted';
            }
            notifications?.forEach(notification => {
                if (permissionGranted) {

                    sendNotification({ title: notification.title, body: notification.link, actionTypeId: "new-notification" });
                    onAction((notification) => {
                        console.log(notification)
                    })
                }
            })
            deps.refetchNotifications?.();
        });

        notificationSubscription.subscribe();
        centrifuge.connect();
    }

    useEffect(() => {
        connect();
    }, [])

    return {
        data
    }

}