import Crypto from "crypto";

export const generateAccountNumber = (): string => {
  let accountNumber = "";
  for (let i = 0; i < 10; i++) {
    accountNumber += Crypto.randomInt(0, 10).toString();
  }

  return accountNumber;
};
