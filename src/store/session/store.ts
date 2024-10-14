import { persist } from "zustand/middleware";
import { createWithEqualityFn as create } from "zustand/traditional";

// types
import type { SessionStoreDef } from "./store.def";

const useSessionStore = create(
  persist<SessionStoreDef>(
    () => ({
      accessToken: null,
      refreshToken: null,
      user: null,
    }),
    {
      name: "session",
    },
  ),
);

export default useSessionStore;
