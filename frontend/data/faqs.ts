export interface FAQItem {
  id: string
  question: string
  answer: string
  category: "booking" | "telehealth" | "clinic" | "records"
}

export const FAQS: FAQItem[] = [
  {
    id: "faq_01",
    question: "How do I schedule an appointment with a doctor?",
    answer:
      "Select your required medical department or symptom, choose your physician, pick a convenient date and time, and confirm your patient details. You will receive an instant SMS and calendar invitation with room and link details.",
    category: "booking",
  },
  {
    id: "faq_02",
    question: "Can I attend via Telehealth video or do I need an in-person hospital visit?",
    answer:
      "Both options are available. For routine consultations, prescription refills, and lab follow-ups, encrypted HD Telehealth is supported. Physical examinations, diagnostic imaging, and ECG require in-person clinic visits.",
    category: "telehealth",
  },
  {
    id: "faq_03",
    question: "Can I reschedule or cancel my doctor consultation?",
    answer:
      "Yes. You can reschedule or cancel directly from your Patient Portal up to 2 hours before your scheduled time slot with zero penalty fees.",
    category: "booking",
  },
  {
    id: "faq_04",
    question: "How do I receive my diagnostic reports and digital prescriptions?",
    answer:
      "All physician notes, lab findings, and certified digital e-prescriptions are automatically uploaded to your secure Patient Portal and can be downloaded as PDF or sent to your pharmacy.",
    category: "records",
  },
  {
    id: "faq_05",
    question: "What should I bring to my clinic appointment?",
    answer:
      "Please bring your photo ID, insurance card, a list of current daily medications, and any prior medical diagnostic records or lab reports relevant to your visit.",
    category: "clinic",
  },
  {
    id: "faq_06",
    question: "Are your physicians board-certified and available for emergency triage?",
    answer:
      "All physicians at MedPulse are board-certified MDs with specialized hospital fellowship training. Our hospital emergency triage team is active 24/7.",
    category: "clinic",
  },
]
