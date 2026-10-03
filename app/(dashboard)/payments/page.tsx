import { AccountService } from "@/features/accounts/services/account.service"
import { PaymentService } from "@/features/payments/services/payment.service"
import { PaymentsView } from "@/features/payments/components/payments-view"

export const metadata = {
  title: "Payments & Transfers | Aegis Financial",
  description: "Execute wire, ACH and instant treasury payments with dual authorization.",
}

export default async function PaymentsPage() {
  const [accounts, recipients] = await Promise.all([
    AccountService.getAll(),
    PaymentService.getRecipients(),
  ])

  return <PaymentsView accounts={accounts} recipients={recipients} />
}
