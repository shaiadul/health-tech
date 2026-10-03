import { AccountService } from "@/features/accounts/services/account.service"
import { AccountsView } from "@/features/accounts/components/accounts-view"

export const metadata = {
  title: "Accounts & Vaults | Aegis Financial",
  description: "Manage institutional bank accounts, cash reserves, and corporate lines.",
}

export default async function AccountsPage() {
  const [accounts, totalBalances] = await Promise.all([
    AccountService.getAll(),
    AccountService.getTotalBalances(),
  ])

  return (
    <AccountsView
      initialAccounts={accounts}
      initialBalances={totalBalances}
    />
  )
}
