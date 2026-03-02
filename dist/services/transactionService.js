import { AccountRepository } from "../repositories/accountRepository.js";
import { TransactionRepository } from "../repositories/transactionRepository.js";
import { ApiError } from "../utils/ApiError.js";
export class TransactionService {
    transactionRepository;
    accountRepository;
    constructor() {
        this.transactionRepository = new TransactionRepository();
        this.accountRepository = new AccountRepository();
    }
    async makeDeposit(userId, accountNumber, amount, description) {
        //rule 1. no negative deposits
        if (amount <= 0) {
            throw new ApiError(400, "Deposit amount must be greater than zero");
        }
        const account = await this.accountRepository.findByAccountNumber(accountNumber);
        if (!account) {
            throw new ApiError(404, "Account not found");
        }
        //rule 3 the security check
        if (account.userId !== userId) {
            throw new ApiError(403, "You do not have permission to access this account");
        }
        // if all pass
        return await this.transactionRepository.deposit(account.id, amount, description);
    }
    async makeWithdrawal(userId, accountNumber, amount, description) {
        if (amount <= 0) {
            throw new ApiError(400, "Withdrawal amount must be greater than zero");
        }
        //rule 2: The Existence check
        const account = await this.accountRepository.findByAccountNumber(accountNumber);
        if (!account) {
            throw new ApiError(404, "Account not found");
        }
        // rule 3: The security check
        if (account.userId !== userId) {
            throw new ApiError(403, "You don't have permission to withdraw from this account");
        }
        if (account.balance < amount) {
            throw new ApiError(400, "Insufficient funds for this withdrawal");
        }
        return await this.transactionRepository.withdraw(account.id, amount, description);
    }
    async makeTransfer(userId, senderAccountNumber, receiverAccountNumber, amount, description) {
        const finalDescription = description ??
            `Transfer of $${amount} from account ${senderAccountNumber} to account ${receiverAccountNumber}`;
        //1. Basic validation
        if (amount <= 0) {
            throw new ApiError(400, "Transfer amount must be greater than zero");
        }
        //2. prevent transferring to the same account
        if (senderAccountNumber === receiverAccountNumber) {
            throw new ApiError(400, "Sender and receiver accounts must be different");
        }
        // sender account existence and ownership check
        const senderAccount = await this.accountRepository.findByAccountNumber(senderAccountNumber);
        if (!senderAccount) {
            throw new ApiError(404, "Sender account not found");
        }
        if (senderAccount.userId !== userId) {
            throw new ApiError(403, "You don't have permission to transfer from this account");
        }
        const receiverAccount = await this.accountRepository.findByAccountNumber(receiverAccountNumber);
        if (!receiverAccount) {
            throw new ApiError(404, "Receiver account not found");
        }
        return await this.transactionRepository.transfer(senderAccount.id, receiverAccount.id, amount, finalDescription);
    }
}
