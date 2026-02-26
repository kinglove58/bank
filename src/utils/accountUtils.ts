export const generateAccountNumber = (): string => {
  let accountNumber = "";
  for (let i = 0; i < 10; i++) {
    accountNumber += Math.floor(Math.random() * 10).toString();
  }

  return accountNumber;
};


