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
)

type Appointment struct {
	ID             string            `json:"id"`
	Reference      string            `json:"reference"`
	PatientID      string            `json:"patientId"`
	PatientName    string            `json:"patientName"`
	PatientEmail   string            `json:"patientEmail"`
	PatientPhone   string            `json:"patientPhone,omitempty"`
	SpecialistID   string            `json:"specialistId"`
	SpecialistName string            `json:"specialistName"`
	ServiceID      string            `json:"serviceId"`
	ServiceName    string            `json:"serviceName"`
	Department     string            `json:"department"`
	Date           string            `json:"date"`
	TimeSlot       string            `json:"timeSlot"`
	Format         string            `json:"format"` // in_person or video
	Status         AppointmentStatus `json:"status"`
	Price          float64           `json:"price"`
	Currency       string            `json:"currency"`
	Symptoms       string            `json:"symptoms,omitempty"`
	MeetingURL     string            `json:"meetingUrl,omitempty"`
	ZoomMeetingID  string            `json:"zoomMeetingId,omitempty"`
	ZoomPassword   string            `json:"zoomPassword,omitempty"`
	RoomID         string            `json:"roomId,omitempty"`
	CreatedAt      time.Time         `json:"createdAt"`
	UpdatedAt      time.Time         `json:"updatedAt"`
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

type ZoomMeeting struct {
	MeetingID string `json:"meetingId"`
	Topic     string `json:"topic"`
	JoinURL   string `json:"joinUrl"`
	StartURL  string `json:"startUrl"`
	Password  string `json:"password"`
	SDKToken  string `json:"sdkToken"`
}

