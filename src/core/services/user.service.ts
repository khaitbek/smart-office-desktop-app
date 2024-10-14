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

  checkIfAuthorized(): boolean {
    const sessionService = new SessionService();
    const accessToken = sessionService.getAccessToken();
    return accessToken !== null && accessToken.length !== 0;
  }
}

export default UserService;
