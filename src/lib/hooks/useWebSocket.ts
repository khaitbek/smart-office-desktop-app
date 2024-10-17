import { invoke } from '@tauri-apps/api/core';
import { Centrifuge } from "centrifuge";
import { useEffect, useState } from "react";

export const useWebSocket = (deps: {
    getUserStaffId: () => Promise<string>,
    refetchNotifications?: () => void;
}) => {
    const [data, setData] = useState<any>(null);

    const connect = async () => {
        // establish a connection
        const centrifuge = new Centrifuge(import.meta.env.CENTRIFUGE_PATH as string, {
            token: import.meta.env.CENTRIFUGE_TOKEN
        });

        const notificationSubscriptionStaffId = await deps.getUserStaffId();
        const notificationSubscriptionPath = `smart-office-notification_${notificationSubscriptionStaffId}`
        const notificationSubscription = centrifuge.newSubscription(notificationSubscriptionPath);

        notificationSubscription.on("publication", async (ctx) => {
            const data = ctx.data as {
                text: string;
            };
            invoke("notify", {
                message: data.text
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