import { Centrifuge } from "centrifuge";
import { useEffect } from "react";

export const useWebSocket = (deps: {
    getUserStaffId: () => Promise<string>
}) => {
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
            alert(data.text)
        });

        notificationSubscription.subscribe();
        centrifuge.connect();

    }

    useEffect(() => {
        connect();
    }, [])

}