import UserRepository from "../repositories/user.repository";
import SessionService from "./session.service";

class UserService {
  #repository: UserRepository = new UserRepository();

  async signInUser(payload: { username: string; password: string }) {
    try {
      return await this.#repository.signIn(payload);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getUserStaffId(): Promise<string> {
    const staffId = import.meta.env.STAFF_ID;
    return staffId
  }

  checkIfAuthorized(): boolean {
    const sessionService = new SessionService();
    const accessToken = sessionService.getAccessToken();
    return accessToken !== null && accessToken.length !== 0;
  }
}

export default UserService;
