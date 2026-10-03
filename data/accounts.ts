import { BankAccount } from "@/types/account"

export const MOCK_ACCOUNTS: BankAccount[] = [
  {
    id: "acc_oper_01",
    name: "Primary Operating Checking",
    accountType: "checking",
    accountNumber: "948271044821",
    routingNumber: "121000358",
    balance: 48924050, // $489,240.50
    availableBalance: 48250000, // $482,500.00
    currency: "USD",
    status: "active",
    cardLast4: "4821",
    institutionName: "JPMorgan Chase Institutional",
    colorTheme: "navy",
  },
  {
    id: "acc_reserve_02",
    name: "Treasury Yield Reserve (HYSA)",
    accountType: "savings",
    accountNumber: "883920199342",
    routingNumber: "021000021",
    balance: 125080000, // $1,250,800.00
    availableBalance: 125080000,
    currency: "USD",
    status: "active",
    interestRate: 0.0495, // 4.95% APY
    institutionName: "Goldman Sachs Bank USA",
    colorTheme: "emerald",
  },
  {
    id: "acc_credit_03",
    name: "Corporate Executive Platinum Card",
    accountType: "credit",
    accountNumber: "4532890123908819",
    routingNumber: "026009593",
    balance: -2845000, // -$28,450.00 (current cycle balance)
    availableBalance: 22155000, // $221,550.00 available credit
    creditLimit: 25000000, // $250,000.00 limit
    currency: "USD",
    status: "active",
    cardLast4: "8819",
    institutionName: "Silicon Valley Bank / First Citizens",
    colorTheme: "slate",
  },
  {
    id: "acc_invest_04",
    name: "Short-Term Liquid T-Bills Account",
    accountType: "investment",
    accountNumber: "771029481105",
    routingNumber: "031000053",
    balance: 78500000, // $785,000.00
    availableBalance: 78500000,
    currency: "USD",
    status: "active",
    interestRate: 0.052, // 5.2% Yield
    institutionName: "Morgan Stanley Wealth Management",
    colorTheme: "indigo",
  },
]
