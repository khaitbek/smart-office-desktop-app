import { createFileRoute, redirect } from "@tanstack/react-router";

// services
import { Button } from "@/app/components/button";
import NotificationService from "@/core/services/notification.service";
import UserService from "@/core/services/user.service";
import { useWebSocket } from "@/lib/hooks/useWebSocket";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ location }) => {
    const userService = new UserService();

    if (!userService.checkIfAuthorized()) {
      throw redirect({
        to: "/sign-in",
        search: {
          redirect: {
            href: location.href
          }
        }
      })
    }
  },
  component: Index,
});

function Index() {
  const userService = new UserService();
  const notificationService = new NotificationService();
  useWebSocket({
    getUserStaffId: userService.getUserStaffId
  });
  return (
    <div className="p-2">
      <h3>Welcome to Smart Office Desktop app!</h3>
      <Button onClick={() => {
        notificationService.display("Hello!", "https://smart-office.uz")
      }}>
        Send a notification
      </Button>
    </div>
  );
}
