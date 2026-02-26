import { AccountRepository } from "../repositories/accountRepository.js";
import { generateAccountNumber } from "../utils/accountUtils.js";

export class AccountService {
  private accountRepository: AccountRepository;

  constructor() {
    this.accountRepository = new AccountRepository();
  }

  async getAccountsForUser(user: { id: number; role: string }) {
    if (user.role === "ADMIN") {
      return await this.accountRepository.findAll();
    }

    //if they are a normal customer
    return await this.accountRepository.findByUserId(user.id);
  }

  async createNewAccount(userId: number, type: "SAVINGS" | "CHECKING") {
    let isUnique = false;
    let newAccountNumber = "";

    //1. keep generating numbers until we find one that nobody has
    while (!isUnique) {
      newAccountNumber = generateAccountNumber();
      const existingAccount =
        await this.accountRepository.findByAccountNumber(newAccountNumber);
      if (!existingAccount) {
        isUnique = true; //found the account number
      }
    }

    return await this.accountRepository.createAccount(
      userId,
      newAccountNumber,
      type,
    );
  }
}
