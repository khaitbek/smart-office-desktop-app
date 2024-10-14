import { invoke } from "@tauri-apps/api/core";

class UserRepository {
  async signIn(payload: {
    username: string,
    password: string
  }) {
    const { password, username } = payload;
    try {
      let response = await invoke("authenticate", {
        username,
        password
      }) as string;
      let out = JSON.parse(response) as {
        access_token: string;
        refresh_token: string;
      };

      return {
        accessToken: out.access_token,
        refreshToken: out.refresh_token
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }
}

export default UserRepository;
