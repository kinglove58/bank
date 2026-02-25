import { UserRepository } from "./src/repositories/userRepository.js";

const userRepo = new UserRepository();

async function test() {
  console.log("Attempting to create a user...");

  try {
    const email = `test+${Date.now()}@bank.com`;
    const newUser = await userRepo.create({
      email,
      name: "Elijah techking",
      password: "password123",
    });
    console.log("User created successfully:", newUser);
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

test();
