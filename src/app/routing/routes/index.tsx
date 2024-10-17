import { createFileRoute, redirect } from "@tanstack/react-router";

// services
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
  const { data } = useWebSocket({
    getUserStaffId: userService.getUserStaffId
  });
  return (
    <div className="p-2">
      <h3>Welcome to Smart Office Desktop app!</h3>
      <p>Test</p>
      {JSON.stringify(data)}
    </div>
  );
}
