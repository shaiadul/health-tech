import { MOCK_RECIPIENTS } from "@/data/analytics"
import { PaymentSubmission, PaymentReceipt, Recipient } from "@/types/payment"
import { TransactionService } from "@/features/transactions/services/transaction.service"
import { AccountService } from "@/features/accounts/services/account.service"

let recipientsStore: Recipient[] = [...MOCK_RECIPIENTS]

export const PaymentService = {
  async getRecipients(): Promise<Recipient[]> {
    return [...recipientsStore]
  },

  async addRecipient(recipient: Omit<Recipient, "id">): Promise<Recipient> {
    const newRec: Recipient = {
      ...recipient,
      id: `rec_${Date.now().toString(36)}`,
    }
    recipientsStore = [newRec, ...recipientsStore]
    return newRec
  },

  async executePayment(
    submission: PaymentSubmission
  ): Promise<{ success: boolean; receipt?: PaymentReceipt; error?: string }> {
    // Simulate real financial network latency (700ms)
    await new Promise((resolve) => setTimeout(resolve, 700))

    const account = await AccountService.getById(submission.fromAccountId)
    if (!account) {
      return { success: false, error: "Selected funding account could not be found." }
    }

    if (account.availableBalance < submission.amount) {
      return {
        success: false,
        error: "Insufficient available funds in the selected account.",
      }
    }

    const txId = `tx_${Date.now().toString(36).toUpperCase()}`
    const refNum = `PAY-${Math.floor(100000 + Math.random() * 900000)}`

    // Record the transaction into transaction store
    await TransactionService.add({
      merchant: submission.recipientName,
      amount: submission.amount,
      type: "expense",
      status: "completed",
      category: submission.category || "Payroll & Income",
      date: new Date().toISOString(),
      accountId: submission.fromAccountId,
      accountName: account.name,
      referenceNumber: refNum,
      description: submission.note || "Automated payment transfer",
      paymentMethod: submission.paymentMethod === "instant" ? "ach" : submission.paymentMethod,
    })

    const receipt: PaymentReceipt = {
      transactionId: txId,
      timestamp: new Date().toISOString(),
      amount: submission.amount,
      fee: submission.paymentMethod === "wire" ? 2500 : 0, // $25 wire fee or $0 standard
      recipientName: submission.recipientName,
      fromAccountName: account.name,
      referenceNumber: refNum,
      status: "completed",
    }

    return { success: true, receipt }
  },
}
