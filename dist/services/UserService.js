import { UserRepository } from "../repositories/userRepository.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
export class UserService {
    userRepository;
    constructor() {
        this.userRepository = new UserRepository();
    }
    async registerUser(userData) {
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
    async loginUser(loginData) {
        //1. Find the user by email
        const user = await this.userRepository.findByEmail(loginData.email);
        if (!user) {
            //security best practice: Never say "Email not found" or "Password incorrect". Always say "Invalid credentials" to prevent user enumeration attacks.
            //always say "Invalid credentials" to prevent user enumeration attacks.
            throw new ApiError(401, "Invalid email or password");
        }
        //2. Compare the plain password with the hashed password in the db
        const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
        if (!isPasswordValid) {
            //security best practice: Never say "Email not found" or "Password incorrect". Always say "Invalid credentials" to prevent user enumeration attacks.
            //always say "Invalid credentials" to prevent user enumeration attacks.
            throw new ApiError(401, "Invalid email or password");
        }
        //3. Generate the VIP wristband
        const token = generateToken(user.id);
        //4. Return the user info AND the token
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        };
    }
}
