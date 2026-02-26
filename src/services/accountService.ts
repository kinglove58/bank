import { AccountRepository } from "../repositories/accountRepository.js";

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

  
}
