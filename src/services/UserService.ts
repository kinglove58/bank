import { UserRepository } from "../repositories/userRepository.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcrypt";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async registerUser(userData: any) {
    //1. business logic/rule: check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ApiError(400, "A user with this email already exist");
    }

    //2. business logic: security hash the password.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    //3. save the clean data to the vault
    return await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
  }
}
