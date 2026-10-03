import { FinancialService } from "@/types/service"

export const CLINICAL_SERVICES: FinancialService[] = [
  {
    id: "srv_cardio_01",
    slug: "cardiology",
    title: "Cardiology & Heart Health",
    shortDescription:
      "Comprehensive cardiovascular assessments, ECG diagnostics, heart failure management, and preventive risk mitigation.",
    fullDescription:
      "Our cardiology practice provides advanced cardiovascular diagnostics, stress testing, blood pressure optimization, and personalized rehabilitation plans led by board-certified heart specialists.",
    category: "wealth" as any,
    durationMinutes: 45,
    feeDisplay: "Insurance Covered / Free Checkup",
    iconName: "Activity",
    popular: true,
    badge: "Specialized Center",
    benefits: [
      "Advanced 12-lead digital ECG and echocardiogram diagnostics",
      "Hypertension and cholesterol management protocols",
      "Coronary artery disease and stroke risk reduction",
      "Immediate prescription dispatch and lifestyle rehabilitation",
    ],
    process: [
      {
        step: "1",
        title: "Triage & Vitals Assessment",
        description: "Blood pressure, oxygen saturation, resting heart rate, and cardiovascular history review.",
      },
      {
        step: "2",
        title: "Physical & Clinical Examination",
        description: "Detailed stethoscope heart-sound analysis and peripheral vascular check.",
      },
      {
        step: "3",
        title: "Diagnostic Imaging / ECG",
        description: "Instant in-clinic electro-cardiac tracing or ultrasound evaluation.",
      },
      {
        step: "4",
        title: "Treatment Plan & Follow-up",
        description: "Written prescription, digital monitoring guidelines, and scheduled follow-up.",
      },
    ],
    requirements: [
      "List of current medications and previous ECG/echo reports if available",
      "Recent blood work (lipid panel, fasting blood glucose)",
      "National ID or health insurance card",
    ],
    faqs: [
      {
        question: "Do I need to fast before my cardiology appointment?",
        answer: "Fasting for 8-12 hours is recommended only if your physician ordered lipid panel or fasting blood sugar tests.",
      },
      {
        question: "Can I choose between an in-clinic visit and telehealth?",
        answer: "Yes. Routine follow-ups and medication adjustments can be done via encrypted Telehealth HD video. Initial diagnostics require an in-person clinic visit.",
      },
    ],
  },
  {
    id: "srv_neuro_02",
    slug: "neurology",
    title: "Neurology & Brain Health",
    shortDescription:
      "Specialized diagnosis and care for migraines, neuropathy, memory disorders, tremors, and nervous system conditions.",
    fullDescription:
      "Our neurology clinic delivers evidence-based diagnostics and compassionate treatment for chronic headaches, seizures, nerve pain, and degenerative neurological disorders using state-of-the-art neuro-imaging.",
    category: "planning" as any,
    durationMinutes: 45,
    feeDisplay: "Consultation & Triage",
    iconName: "TrendingUp",
    popular: true,
    benefits: [
      "In-depth motor, sensory, and cognitive reflex examinations",
      "Migraine and chronic cluster headache intervention programs",
      "Neuropathy, spine nerve compression, and tremor diagnostics",
      "Collaborative physical and occupational therapy referral",
    ],
    process: [
      {
        step: "1",
        title: "Symptom Timeline",
        description: "Mapping onset, triggers, pain severity, and cognitive changes.",
      },
      {
        step: "2",
        title: "Cranial Nerve & Reflex Check",
        description: "Physical testing of vision, balance, coordination, and reflex responses.",
      },
      {
        step: "3",
        title: "Neuro-Diagnostic Workup",
        description: "Order MRI/CT scans or nerve conduction velocity studies if indicated.",
      },
      {
        step: "4",
        title: "Targeted Medical Therapy",
        description: "Neuromodulation prescription, preventative therapy, and lifestyle guidance.",
      },
    ],
    requirements: [
      "Symptom diary documenting headache or seizure frequency",
      "Prior MRI or CT scan discs/reports if previously conducted",
    ],
    faqs: [
      {
        question: "How long does a neurological evaluation take?",
        answer: "A comprehensive initial neurological assessment typically takes 40-50 minutes to thoroughly evaluate reflex, cognitive, and sensory pathways.",
      },
    ],
  },
  {
    id: "srv_pediatrics_03",
    slug: "pediatrics",
    title: "Pediatrics & Child Wellness",
    shortDescription:
      "Compassionate healthcare for infants, children, and adolescents, including developmental milestones and immunizations.",
    fullDescription:
      "Our pediatric center is designed to make children and parents feel safe. From routine growth checkups and vaccinations to acute pediatric illness triage, our pediatricians offer warm, round-the-clock care.",
    category: "tax" as any,
    durationMinutes: 30,
    feeDisplay: "Pediatric Wellness Program",
    iconName: "ShieldCheck",
    popular: true,
    benefits: [
      "Comprehensive growth, nutrition, and milestone development tracking",
      "WHO/CDC-compliant childhood immunization schedules",
      "Acute pediatric fever, asthma, allergy, and infection care",
      "Gentle, stress-free clinical environment tailored for children",
    ],
    process: [
      {
        step: "1",
        title: "Child Vitals & Growth Metrics",
        description: "Height, weight, head circumference, and temperature charting.",
      },
      {
        step: "2",
        title: "Developmental Check",
        description: "Motor skills, vision, hearing, and behavioral milestones check.",
      },
      {
        step: "3",
        title: "Pediatric Examination",
        description: "Ear, throat, chest, and abdominal examination in a calm setting.",
      },
      {
        step: "4",
        title: "Vaccination & Nutrition",
        description: "Scheduled immunizations, dietary guidance, and growth certification.",
      },
    ],
    requirements: [
      "Child's vaccination card and birth record book",
      "List of known food or drug allergies",
    ],
    faqs: [
      {
        question: "Can I get pediatric emergency triage on weekends?",
        answer: "Yes, our pediatric on-call clinic operates 7 days a week with dedicated emergency pediatricians.",
      },
    ],
  },
  {
    id: "srv_ortho_04",
    slug: "orthopedics",
    title: "Orthopedics & Sports Medicine",
    shortDescription:
      "Advanced care for joints, bones, sports injuries, arthritis, back pain, and physical rehabilitation.",
    fullDescription:
      "Led by orthopedic surgeons and sports medicine physicians, our department specializes in non-invasive joint restoration, fracture repair, spine health, and accelerated athletic recovery.",
    category: "business" as any,
    durationMinutes: 40,
    feeDisplay: "Clinical Assessment",
    iconName: "Briefcase",
    benefits: [
      "On-site digital X-ray and ultrasound-guided joint evaluations",
      "Minimally invasive therapy for knees, shoulders, and hips",
      "Spine and posture alignment therapy for chronic back pain",
      "Personalized physical therapy and return-to-sport protocols",
    ],
    process: [
      {
        step: "1",
        title: "Mobility & Range-of-Motion",
        description: "Gait analysis and joint biomechanical assessment.",
      },
      {
        step: "2",
        title: "On-Site Digital X-Ray",
        description: "Instant high-resolution musculoskeletal radiographic evaluation.",
      },
      {
        step: "3",
        title: "Surgeon Consultation",
        description: "Review of structural integrity, cartilage wear, and ligament health.",
      },
      {
        step: "4",
        title: "Recovery Roadmap",
        description: "Bracing, rehabilitation exercises, and non-surgical therapy options.",
      },
    ],
    requirements: [
      "Wear comfortable clothing suitable for joint examination",
      "Bring prior X-rays or orthopedic diagnostic records",
    ],
    faqs: [
      {
        question: "Do you offer non-surgical alternatives for joint pain?",
        answer: "Yes, over 85% of our patients are successfully treated with physical therapy, targeted injections, and lifestyle modification without surgery.",
      },
    ],
  },
  {
    id: "srv_internal_05",
    slug: "internal-medicine",
    title: "General & Internal Medicine",
    shortDescription:
      "Primary care diagnostics, chronic illness management (diabetes, thyroid), and preventative health assessments.",
    fullDescription:
      "Our internal medicine clinic serves as your healthcare home. We specialize in diagnosing complex multi-system symptoms, managing chronic illnesses, and providing preventive medical wellness checks.",
    category: "retirement" as any,
    durationMinutes: 30,
    feeDisplay: "Primary Care Visit",
    iconName: "Receipt",
    popular: true,
    benefits: [
      "Personalized preventive health audits and disease screening",
      "Comprehensive management of diabetes, hypertension, and thyroid disorders",
      "Immediate blood work and lab diagnostic interpretations",
      "Coordinated referrals to hospital sub-specialists when required",
    ],
    process: [
      {
        step: "1",
        title: "Comprehensive Health History",
        description: "Review of family risk factors, medications, and lifestyle patterns.",
      },
      {
        step: "2",
        title: "Full Physical Exam",
        description: "Examination of vital signs, lungs, abdomen, throat, and skin.",
      },
      {
        step: "3",
        title: "Diagnostic Lab Testing",
        description: "On-site blood, urine, or metabolic panel collection.",
      },
      {
        step: "4",
        title: "Care Management Plan",
        description: "Clear medication prescriptions, lifestyle goals, and follow-up timeline.",
      },
    ],
    requirements: [
      "Complete list of all daily prescription medications and supplements",
      "Details of any previous hospitalizations or surgeries",
    ],
    faqs: [
      {
        question: "Can I get my prescription refilled during this consultation?",
        answer: "Yes, our licensed physicians provide digital and physical e-prescriptions valid at all licensed pharmacies.",
      },
    ],
  },
  {
    id: "srv_dermatology_06",
    slug: "dermatology",
    title: "Dermatology & Skin Health",
    shortDescription:
      "Medical dermatology, skin cancer screening, acne & eczema treatment, and clinical dermatological care.",
    fullDescription:
      "Our board-certified dermatologists diagnose and treat a complete spectrum of skin, hair, and nail disorders with dermatoscopy, biopsy diagnostics, and tailored therapeutic skin regimens.",
    category: "insurance" as any,
    durationMinutes: 30,
    feeDisplay: "Skin Clinic Visit",
    iconName: "ShieldAlert",
    benefits: [
      "High-precision digital dermatoscope mole and skin cancer screening",
      "Advanced treatment for severe acne, rosacea, and psoriasis",
      "Patch testing for chronic contact dermatitis and skin allergies",
      "In-clinic minor surgical excisions and cryotherapy",
    ],
    process: [
      {
        step: "1",
        title: "Dermatological Exam",
        description: "Visual inspection and polarized dermatoscope examination.",
      },
      {
        step: "2",
        title: "Targeted Skin Assessment",
        description: "Evaluation of lesions, rashes, pigmentation, or hair follicle health.",
      },
      {
        step: "3",
        title: "Therapeutic Plan",
        description: "Topical prescription formulations and procedural options.",
      },
      {
        step: "4",
        title: "Skin Barrier Care",
        description: "Maintenance guidelines to prevent recurrence and protect skin barrier.",
      },
    ],
    requirements: [
      "Avoid wearing heavy makeup or nail polish on areas to be examined",
      "List of current skincare products and topical creams",
    ],
    faqs: [
      {
        question: "Can I show skin rashes over telehealth video?",
        answer: "Yes, for many rashes and follow-up checks, high-definition telehealth photo/video consultations provide accurate initial guidance.",
      },
    ],
  },
  {
    id: "srv_checkup_07",
    slug: "executive-health-check",
    title: "Comprehensive Health Checkup",
    shortDescription:
      "Full-body health diagnostic package including blood panels, organ function, ECG, ultrasound, and physician debrief.",
    fullDescription:
      "A complete executive health screening designed to detect silent risk factors before symptoms arise. Includes 40+ biometric markers, cardio-pulmonary screening, and a 1-on-1 physician consultation.",
    category: "wealth" as any,
    durationMinutes: 60,
    feeDisplay: "Full Diagnostic Package",
    iconName: "Activity",
    benefits: [
      "40+ diagnostic biomarkers (CBC, lipid, liver, renal, HbA1c, thyroid)",
      "Resting ECG, chest radiography, and abdominal ultrasound",
      "Comprehensive biological risk score and organ health matrix",
      "1-on-1 60-minute physician debrief with written wellness roadmap",
    ],
    process: [
      {
        step: "1",
        title: "Morning Fasting Labs",
        description: "Blood and urine biomarker sample collection in private executive lounge.",
      },
      {
        step: "2",
        title: "Diagnostic Imaging & ECG",
        description: "Rapid cardiovascular and ultrasound scans performed by licensed technicians.",
      },
      {
        step: "3",
        title: "Doctor Review & Debrief",
        description: "In-depth review of every lab result with your assigned attending physician.",
      },
      {
        step: "4",
        title: "Personalized Health Blueprint",
        description: "Full printed and digital diagnostic report with actionable preventative guidance.",
      },
    ],
    requirements: [
      "Fasting for 10-12 hours prior to your morning appointment (water is permitted)",
      "Bring comfortable clothing for physical examination and ECG",
    ],
    faqs: [
      {
        question: "When are the health checkup results available?",
        answer: "Routine blood panels are available within 3 hours. Complete imaging reports and the doctor's final executive blueprint are provided the same day.",
      },
    ],
  },
]

export const FINANCIAL_SERVICES = CLINICAL_SERVICES
