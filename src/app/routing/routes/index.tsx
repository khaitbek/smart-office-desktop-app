import { createFileRoute, redirect } from "@tanstack/react-router";

// services
import UserService from "@/core/services/user.service";

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
  return (
    <div className="p-2">
      <h3>Welcome to Smart Office Desktop app!</h3>
    </div>
  );
}
