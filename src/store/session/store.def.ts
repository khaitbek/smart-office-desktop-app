import type { SanitizedUser } from "@/core/entities/user.entity";

export interface SessionStoreDef {
  accessToken: string | null;
  refreshToken: string | null;
  user: SanitizedUser | null;
}
