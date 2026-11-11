package entity

import (
	"time"
)

type UserRole string

const (
	RolePatient   UserRole = "patient"
	RoleDoctor    UserRole = "doctor"
	RoleOrganizer UserRole = "organizer"
)

type User struct {
	ID               string    `json:"id"`
	Email            string    `json:"email"`
	PasswordHash     string    `json:"-"`
	Name             string    `json:"name"`
	Role             UserRole  `json:"role"`
	RoleTitle        string    `json:"roleTitle"`
	Avatar           string    `json:"avatar"`
	Department       string    `json:"department,omitempty"`
	Phone            string    `json:"phone,omitempty"`
	PatientID        string    `json:"patientId,omitempty"`
	StaffID          string    `json:"staffId,omitempty"`
	BloodType        string    `json:"bloodType,omitempty"`
	Allergies        []string  `json:"allergies,omitempty"`
	EmergencyContact string    `json:"emergencyContact,omitempty"`
	ClinicRoom       string    `json:"clinicRoom,omitempty"`
	CreatedAt        time.Time `json:"createdAt"`
	UpdatedAt        time.Time `json:"updatedAt"`
}

type Specialist struct {
	ID             string    `json:"id"`
	Name           string    `json:"name"`
	Title          string    `json:"title"`
	Department     string    `json:"department"`
	Specialty      string    `json:"specialty"`
	Avatar         string    `json:"avatar"`
	Rating         float64   `json:"rating"`
	ReviewsCount   int       `json:"reviewsCount"`
	ExperienceYears int      `json:"experienceYears"`
	Education      string    `json:"education"`
	Bio            string    `json:"bio"`
	Price          float64   `json:"price"`
	Currency       string    `json:"currency"`
	NextAvailable  string    `json:"nextAvailable"`
	IsAvailable    bool      `json:"isAvailable"`
	Languages      []string  `json:"languages"`
	AvailableDays  []string  `json:"availableDays"`
	ClinicRoom     string    `json:"clinicRoom,omitempty"`
	CreatedAt      time.Time `json:"createdAt"`
}

type ClinicalService struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Slug        string   `json:"slug"`
	Department  string   `json:"department"`
	Description string   `json:"description"`
	Price       float64  `json:"price"`
	Currency    string   `json:"currency"`
	DurationMin int      `json:"durationMin"`
	Icon        string   `json:"icon"`
	Features    []string `json:"features"`
	IsPopular   bool     `json:"isPopular"`
}

type AppointmentStatus string

const (
	AppointmentStatusConfirmed      AppointmentStatus = "confirmed"
	AppointmentStatusInConsultation AppointmentStatus = "in_consultation"
	AppointmentStatusCompleted      AppointmentStatus = "completed"
	AppointmentStatusCancelled      AppointmentStatus = "cancelled"
	AppointmentStatusRescheduled    AppointmentStatus = "rescheduled"
)

type Appointment struct {
	ID                 string            `json:"id"`
	Reference          string            `json:"reference"`
	PatientID          string            `json:"patientId"`
	PatientName        string            `json:"patientName"`
	PatientEmail       string            `json:"patientEmail"`
	PatientPhone       string            `json:"patientPhone,omitempty"`
	SpecialistID       string            `json:"specialistId"`
	SpecialistName     string            `json:"specialistName"`
	SpecialistTitle    string            `json:"specialistTitle,omitempty"`
	SpecialistAvatar   string            `json:"specialistAvatar,omitempty"`
	ServiceID          string            `json:"serviceId"`
	ServiceName        string            `json:"serviceName"`
	Department         string            `json:"department"`
	Date               string            `json:"date"`
	TimeSlot           string            `json:"timeSlot"`
	Format             string            `json:"format"` // in_person or video
	Status             AppointmentStatus `json:"status"`
	CancellationReason string            `json:"cancellationReason,omitempty"`
	Price              float64           `json:"price"`
	Currency           string            `json:"currency"`
	Symptoms           string            `json:"symptoms,omitempty"`
	MeetingURL         string            `json:"meetingUrl,omitempty"`
	ZoomMeetingID      string            `json:"zoomMeetingId,omitempty"`
	ZoomPassword       string            `json:"zoomPassword,omitempty"`
	RoomID             string            `json:"roomId,omitempty"`
	CreatedAt          time.Time         `json:"createdAt"`
	UpdatedAt          time.Time         `json:"updatedAt"`
}

type TransactionStatus string

const (
	TxStatusCompleted TransactionStatus = "completed"
	TxStatusPending   TransactionStatus = "pending"
	TxStatusFailed    TransactionStatus = "failed"
)

type Transaction struct {
	ID            string            `json:"id"`
	Reference     string            `json:"reference"`
	PatientID     string            `json:"patientId"`
	PatientName   string            `json:"patientName"`
	AppointmentID string            `json:"appointmentId,omitempty"`
	Category      string            `json:"category"`
	Department    string            `json:"department"`
	Amount        float64           `json:"amount"`
	Currency      string            `json:"currency"`
	Status        TransactionStatus `json:"status"`
	PaymentMethod string            `json:"paymentMethod"`
	Date          time.Time         `json:"date"`
}

type LeadSubmission struct {
	ID                 string    `json:"id"`
	FullName           string    `json:"fullName"`
	Email              string    `json:"email"`
	Phone              string    `json:"phone,omitempty"`
	ServiceInterest    string    `json:"serviceInterest,omitempty"`
	EstimatedPortfolio string    `json:"estimatedPortfolio,omitempty"`
	CreatedAt          time.Time `json:"createdAt"`
}

type NewsletterSubmission struct {
	ID           string    `json:"id"`
	Email        string    `json:"email"`
	SubscribedAt time.Time `json:"subscribedAt"`
}

type PrescriptionRefill struct {
	ID               string    `json:"id"`
	PatientID        string    `json:"patientId"`
	PatientName      string    `json:"patientName"`
	MedicationID     string    `json:"medicationId"`
	MedicationName   string    `json:"medicationName"`
	Dosage           string    `json:"dosage"`
	RxNumber         string    `json:"rxNumber"`
	PharmacyName     string    `json:"pharmacyName,omitempty"`
	RefillsRemaining int       `json:"refillsRemaining"`
	Status           string    `json:"status"` // pending, approved, rejected
	PrescribedBy     string    `json:"prescribedBy"`
	CreatedAt        time.Time `json:"createdAt"`
}

type SOAPNote struct {
	ID             string    `json:"id"`
	AppointmentID  string    `json:"appointmentId"`
	PatientID      string    `json:"patientId"`
	PatientName    string    `json:"patientName"`
	DoctorID       string    `json:"doctorId"`
	DoctorName     string    `json:"doctorName"`
	Subjective     string    `json:"subjective"`
	Objective      string    `json:"objective"`
	Assessment     string    `json:"assessment"`
	Plan           string    `json:"plan"`
	CreatedAt      time.Time `json:"createdAt"`
}

type BankAccount struct {
	ID               string  `json:"id"`
	Name             string  `json:"name"`
	AccountType      string  `json:"accountType"`
	AccountNumber    string  `json:"accountNumber"`
	RoutingNumber    string  `json:"routingNumber"`
	Balance          float64 `json:"balance"`
	AvailableBalance float64 `json:"availableBalance"`
	Currency         string  `json:"currency"`
	Status           string  `json:"status"`
	CardLast4        string  `json:"cardLast4,omitempty"`
	CreditLimit      float64 `json:"creditLimit,omitempty"`
	InterestRate     float64 `json:"interestRate,omitempty"`
	InstitutionName  string  `json:"institutionName"`
	ColorTheme       string  `json:"colorTheme,omitempty"`
}

type AnalyticsSummary struct {
	TotalIncomeMonth   float64 `json:"totalIncomeMonth"`
	TotalExpenseMonth  float64 `json:"totalExpenseMonth"`
	SavingsRate        float64 `json:"savingsRate"`
	MonthlyGrowthRate  float64 `json:"monthlyGrowthRate"`
	TopExpenseCategory string  `json:"topExpenseCategory"`
	AverageDailySpend  float64 `json:"averageDailySpend"`
	OutpatientVolume   int     `json:"outpatientVolume"`
	AverageWaitMinutes float64 `json:"averageWaitMinutes"`
	TelehealthRatio    float64 `json:"telehealthRatio"`
	SatisfactionRate   float64 `json:"satisfactionRate"`
}

type ZoomMeeting struct {
	MeetingID string `json:"meetingId"`
	Topic     string `json:"topic"`
	JoinURL   string `json:"joinUrl"`
	StartURL  string `json:"startUrl"`
	Password  string `json:"password"`
	SDKToken  string `json:"sdkToken"`
}

