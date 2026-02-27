import { AccountRepository } from "../repositories/accountRepository.js";
import { TransactionRepository } from "../repositories/transactionRepository.js";
import { ApiError } from "../utils/ApiError.js";

export class TransactionService {
  private transactionRepository: TransactionRepository;
  private accountRepository: AccountRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
    this.accountRepository = new AccountRepository();
  }
  async makeDeposit(
    userId: number,
    accountNumber: string,
    amount: number,
    description?: string,
  ) {
    //rule 1. no negative deposits
    if (amount <= 0) {
      throw new ApiError(400, " Deposit amount must be greater than zero");
    }

    const account =
      await this.accountRepository.findByAccountNumber(accountNumber);
    if (!account) {
      throw new ApiError(404, "Account not found");
    }

    //rule 3 the security check
    if (account.userId !== userId) {
      throw new ApiError(
        403,
        "You do not have permission to access this account",
      );
    }

    // if all pass
    return await this.transactionRepository.deposit(
      account.id,
      amount,
      description,
    );
  }
}
